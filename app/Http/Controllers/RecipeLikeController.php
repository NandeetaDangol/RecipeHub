<?php

namespace App\Http\Controllers;

use App\Models\RecipeLike;
use Illuminate\Http\Request;

class RecipeLikeController extends Controller
{
    // GET: Show all likes/dislikes
    public function index()
    {
        return response()->json([
            'message' => 'Recipe Likes fetched successfully',
            'data' => RecipeLike::with(['user', 'recipe'])->get(),
        ]);
    }

    // POST: Add or update like/dislike
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'recipe_id' => 'required|exists:recipes,id',
            'state' => 'required|in:like,dislike', // You may also use 1 and 0 if using int
        ]);

        // Update if exists, else create new
        $like = RecipeLike::updateOrCreate(
            [
                'user_id' => $validated['user_id'],
                'recipe_id' => $validated['recipe_id'],
            ],
            ['state' => $validated['state']]
        );

        return response()->json([
            'message' => 'Recipe like/dislike saved successfully',
            'data' => $like,
        ], 201);
    }

    // DELETE: Remove a like/dislike entry
    public function destroy($id)
    {
        $like = RecipeLike::findOrFail($id);
        $like->delete();

        return response()->json([
            'message' => 'Recipe like/dislike deleted successfully',
        ]);
    }
}
