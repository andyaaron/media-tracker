<?php

use App\Http\Controllers\MovieController;

// Public route for searching movies
Route::get('/search/movies', [MovieController::class, 'search']);

// Protected routes for managing a user's list
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/my-list', [MovieController::class, 'index']);
    Route::get('/my-list', [MovieController::class, 'store']);
    Route::get('/my-list/{id}', [MovieController::class, 'update']);
    Route::get('/my-list/{id}', [MovieController::class, 'destroy']);
});
