<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MovieController extends Controller
{
    private $app_url;
    private $base_url;
    private $api_token;
    private $api_key;

    public function __construct() {
        $this->app_url = env('APP_URL');
        $this->base_url = env('TMDB_BASE_URL');
        $this->api_token = env('TMDB_API_TOKEN');
        $this->api_key = env('TMDB_API_KEY');
    }

    // generate a session ID for TMDB
    public function authorize(Request $request) {
        $query = $request->query();

        $response = Http::withToken($this->api_token)
            ->get("$this->base_url/authentication/token/new");

        Log::debug("Token: $response");

        if ($response["success"] === true) {
            $request_token = $response["request_token"];

            $redirect_to_url = route('tmdb.callback');

            $redirect_url = "https://www.themoviedb.org/authenticate/$request_token?redirect_to=" . urlencode($redirect_to_url);
            return redirect($redirect_url);
        }

        return response()->json(['error' => 'Failed to get request token.'], 500);
    }

    // callback method after authorizing user, set session ID
    public function callback(Request $request) {
        $request_token = $request->query('request_token');

        if ($request_token) {
            $response = Http::withToken($this->api_token)
                ->post("$this->base_url/authentication/session/new", [
                    'request_token' => $request_token,
                ]);

            if ($response["success"] === true) {
                // @TODO: Move this logic to our User model.
                // we should be able to then call auth()->user()->linkTmdbAccount($sessionId)
                $session_id = $response["session_id"];

                $user = auth()->user();
                Log::debug("user: $user");
                if ($user) {
                    $user->tmdb_session_id = $session_id;
                    $user->save();

                    // get account details
                    $this->account_details($user, $session_id);
                }

                return redirect('/dashboard')->with('status', 'TMDB account linked successfully');
            }
        }
    }

    // with a user session id, we can get user details like username, account id, etc.
    public function account_details($user, $session_id) {
        Log::debug("user: $user");
        Log::debug("user session id: $session_id");

        $response = Http::withToken($this->api_token)
            ->get("$this->base_url/account?session_id=$session_id");

        if ($response->successful() && $response["id"]) {
            Log::debug("account details: $response");
            $user->tmdb_account_id = $response["id"];
            $user->tmdb_username = $response["username"];
            $user->save();
        }
    }

    // handle the GET /search/movies request
    public function search(Request $request) {
        Log::debug("Initiating search!");
        // get query param from request
        $query = $request->query('query');
        $account_id = $request->query('account_id');

        // check if param is missinng
        if (!$query) {
            return response()->json(['error' => 'Query parameters missing'], 400);
        }

        // initial response
        $search_response = Http::withToken($this->api_token)
            ->get("$this->base_url/search/multi", [
            'query'     => $query,
        ]);
        if (!$search_response->successful()) {
            return response()->json([
                'status_code'       => $search_response['status_code'],
                'status_message'    => $search_response["status_message"],
                'error'             => 'Failed to retrieve movies from TMDb'
            ], $search_response->status());
        }

        $search_results = $search_response->json('results');

        // we need to manipulate the response to check if the user has favourited the movie
        $favourites = $this->getFavouritesForAccount($account_id);
        $favourite_ids = collect($favourites)->pluck('id');

        // loop thorugh search results, add `is_favourited` key
        $modified_results = $this->appendFavouriteStatus($search_results, $favourite_ids);

        Log::debug("modified results:", $modified_results);

        return response()->json([
            'results' => $modified_results
        ]);
    }

    // read from the database GET /my-list
    public function index(Request $request) {
        Log::debug("Getting index");
        $query = $request->query('query');
        $account_id = $request->query('account_id');

        if (!$query) {
            return response()->json(['error' => 'Query parameters missing'], 400);
        }

        $response = Http::withToken($this->api_token)
            ->get("$this->base_url/account/$account_id/lists", [
                'page' => 1,
            ]);

        if ($response->successful()) {
            return $response->json();
        } else {
            return response()->json([
                'status_code'       => $response['status_code'],
                'status_message'    => $response["status_message"],
                'error'             => 'Failed to retrieve list from TMDb'
            ]);
        }
    }

    // add a movie as a favourite
    public function favourite(Request $request) {
        $account_id = $request->query('account_id');

        // Make sure the account_id is present
        if (!$account_id) {
            return response()->json([
                'status_code' => 400,
                'status_message' => 'Bad Request',
                'error' => 'Account ID is missing!'
            ], 400);
        }

        $response = Http::withToken($this->api_token)
            ->post("$this->base_url/account/$account_id/favorite", [
                'media_id' => $request->input('media_id'),
                'media_type' => $request->input('media_type'),
                'favorite' => $request->input('favorite'),
                'account_id' => $account_id
            ]);

        if ($response->successful()) {
            return $response->json();
        } else {
            return response()->json([
                'status_code'   => $response['status_code'],
                'status_message'    => $response["status_message"],
                'error'           => 'Failed to favorite selected media!'
            ], $response->status());
        }
    }

    public function favourite_movies(Request $request) {
        $account_id = $request->query('account_id');

        $response = Http::withToken($this->api_token)
            ->get("$this->base_url/account/$account_id/favorite/movies");

        if ($response->successful()) {
            $favourite_movies = $response->json('results');

            $favourite_ids = collect($favourite_movies)->pluck('id');

            // append `is_favourited` key
            $modified_favourites = $this->appendFavouriteStatus($favourite_movies, $favourite_ids);
            Log::debug("modified favs: ", $modified_favourites);
            return response()->json([
                'results' => $modified_favourites,
            ]);
        } else {
            return response()->json([
                'status_code'       => $response['status_code'],
                'status_message'    => $response["status_message"],
                'error'             => 'Failed to get favorite movies!'
            ]);
        }
    }

    // get list of movie genres
    public function genres(Request $request) {
        $response = Http::withToken($this->api_token)
            ->get("$this->base_url/genre/movie/list?language=en");

        if ($response->successful()) {
            return $response->json();
        } else {
            return response()->json([
                'status_code'       => $response['status_code'],
                'status_message'    => $response["status_message"],
                'error'             => 'Failed to get genres list!'
            ]);
        }
    }

    // post data
    public function store() {

    }

    // updat erecords
    public function update() {

    }

    // delete records
    public function destroy() {

    }

    // raw data response for favorite movies (used with search method)
    private function getFavouritesForAccount($account_id) {
        $response = Http::withToken($this->api_token)
            ->get("$this->base_url/account/$account_id/favorite/movies");

        if ($response->successful()) {
            return $response->json('results');
        } else {
            log::error("Failed to retrieve favorites for account ID: $account_id",  ['response' => $response->json()]);
            return [];
        }
    }

    private function appendFavouriteStatus(array $media, Collection $favouriteIds): array {
        return collect($media)->map(function ($item) use ($favouriteIds) {
            $item['is_favourited'] = $favouriteIds->contains($item['id']);
            return $item;
        })->all();
    }
}
