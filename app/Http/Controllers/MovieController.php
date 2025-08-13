<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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

    public function callback(Request $request) {
        $request_token = $request->query('request_token');

        if ($request_token) {
            $response = Http::withToken($this->api_token)
                ->post("$this->base_url/authentication/session/new", [
                    'request_token' => $request_token,
                ]);

            if ($response["success"] === true) {
                $session_id = $response["session_id"];

                $user = auth()->user();
                Log::debug("user: $user");
                if ($user) {
                    $user->tmdb_session_id = $session_id;
                    $user->save();
                }

                return redirect('/dashboard')->with('status', 'TMDB account linked successfully');
            }
        }
    }

    // handle the GET /search/movies request
    public function search(Request $request) {
        Log::debug("Initiating search!");
        // get query param from request
        $query = $request->query('query');

        // check if param is missinng
        if (!$query) {
            return response()->json(['error' => 'Query parameters missing'], 400);
        }

        $response = Http::withToken($this->api_token)
            ->get("$this->base_url/search/movie", [
            'query'     => $query,
        ]);

        // check for success
        if ($response->successful()) {
            return $response->json();
        } else {
            // log error
            return response()->json([
                'status_code'       => $response['status_code'],
                'status_message'    => $response["status_message"],
                'error'             => 'Failed to retrieve movies from TMDb'
            ], $response->status());
        }
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

    }

    // Get the public details of a TMDB account
    public function userDetails(Request $request) {

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
}
