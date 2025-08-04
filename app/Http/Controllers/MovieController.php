<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
class MovieController extends Controller
{
    private $base_url;
    private $api_token;
    private $api_key;

    public function __construct() {
        $this->base_url = env('TMDB_BASE_URL');
        $this->api_token = env('TMDB_API_TOKEN');
        $this->api_key = env('TMDB_API_KEY');
    }
    // handle the GET /search/movies request
    public function search(Request $request) {
        // get query param from request
        $query = $request->query('query');

        // check if param is missinng
        if (!$query) {
            return response()->json(['error' => 'Query parameters missing'], 400);
        }

        $response = Http::get("$this->base_url/search/movie", [
            'api_key'   => $this->api_key,
            'query'     => $query,
        ]);

        // check for success
        if ($response->successful()) {
            return $response->json();
        } else {
            // log error
            return response()->json(['error' => 'Failed to retrieve movies from TMDb'], $response->status());
        }
    }

    // read from the database GET /my-list
    public function index() {

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
