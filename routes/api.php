<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RecipeController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\RecipeHistoryController;
use App\Models\RecipeHistory;
use App\Http\Controllers\Api\BookmarkController;
use App\Models\Bookmark;
use App\Http\Controllers\Api\CommentController;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Tags;
use App\Http\Controllers\RecipeTagsController;
use App\Http\Controllers\RecipeLikeController;
use App\Http\Controllers\DashboardController;

// Login route
Route::get('/test', function () {
    return response()->json([
        'data' => 'test successful',
    ], 200);
});Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// Protected route - get authenticated user details
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/recipes', function () {
    return response()->json([
        'message' => 'Recipe test successful',
    ], 200);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/recipes', [RecipeController::class, 'store']);
    Route::put('/recipes/{id}', [RecipeController::class, 'update']);
    Route::delete('/recipes/{id}', [RecipeController::class, 'destroy']);
});
Route::get('/recipes', [RecipeController::class, 'index']);
Route::get('/recipes/{id}', [RecipeController::class, 'show']);
Route::get('/recipes/search', [RecipeController::class, 'search']);
Route::get('/recipedetails/{id}', [RecipeController::class, 'show']);


Route::apiResource('categories', CategoryController::class);
// Custom route to get recipes by category ID
Route::get('/categories/{id}/recipes', [CategoryController::class, 'recipes']);


Route::get('/recipe-histories', function () {
    return response()->json([
        'message' => 'RecipeHistory API connection successful',
        'data' =>RecipeHistory::with(['user', 'recipe'])->take(5)->get(),
    ], 200);
});

Route::middleware('auth:sanctum')->get('/me/history', [RecipeController::class, 'history']);


// Route::get('/recipe-histories', [RecipeHistoryController::class, 'index']);
// Route::get('/recipe-histories/{id}', [RecipeHistoryController::class, 'show']);
// Route::post('/recipe-histories', [RecipeHistoryController::class, 'store']);
// Route::put('/recipe-histories/{id}', [RecipeHistoryController::class, 'update']);
// Route::delete('/recipe-histories/{id}', [RecipeHistoryController::class, 'destroy']);

Route::get('/bookmarks', function () {
    return response()->json([
        'message' => 'Bookmark API connection successful',
        'data' => Bookmark::with(['user', 'recipe'])->take(5)->get(),
    ], 200);
});

Route::get('/comments', function () {
    return response()->json([
        'message' => 'Comment API connection successful',
        'data' => Comment::with(['user', 'recipe'])->get()
    ]);
});
Route::post('/comments', function (Request $request) {
    $validated = $request->validate([
        'user_id' => 'required|exists:users,id',
        'recipe_id' => 'required|exists:recipes,id',
        'text' => 'required|string',
        'date' => 'nullable|date',
        'is_approved' => 'boolean'
    ]);

    $comment = Comment::create($validated);

    return response()->json([
        'message' => 'Comment created successfully',
        'data' => $comment
    ], 201);
});

Route::get('/tags', function () {
    return response()->json([
        'message' => 'Tag API connection successful',
        'data' => Tags::all()
    ]);
});
Route::post('/tags', function (Request $request) {
    $validated = $request->validate([
        'tag_name' => 'required|string|unique:tags,tag_name',
        'tag_id' => 'required|string|unique:tags,tag_id',
    ]);

    $tag = Tags::create($validated);

    return response()->json([
        'message' => 'Tag created successfully',
        'data' => $tag
    ], 201);
});

Route::get('/recipe-tags', [RecipeTagsController::class, 'index']);
Route::post('/recipe-tags', [RecipeTagsController::class, 'store']);
Route::delete('/recipe-tags/{id}', [RecipeTagsController::class, 'destroy']);

Route::get('/recipe-likes', [RecipeLikeController::class, 'index']);
Route::post('/recipe-likes', [RecipeLikeController::class, 'store']);
Route::delete('/recipe-likes/{id}', [RecipeLikeController::class, 'destroy']);

Route::middleware('auth:sanctum')->get('/dashboard', [DashboardController::class, 'index']);
