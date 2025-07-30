<?php

namespace App\Http\Controllers;

use App\Models\RecipeLike;
use Exception;
use Illuminate\Http\Request;

class RecipeLikeController extends Controller
{
    // GET: Show all likes/dislikes
    public function index()
    {

        $data = RecipeLike::with(['user', 'recipe'])->get();

        return response()->json([
            'message' => 'Recipe Likes fetched successfully',
            'data' => RecipeLike::with(['user', 'recipe'])->get(),
            'state' => $data->pluck('state')->unique(),
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                // 'user_id' => 'required|exists:users,id',
                'recipe_id' => 'required|exists:recipes,id',
                'state' => 'required',
            ]);

            $user = $request->user(); // get authenticated user

            $like = RecipeLike::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'recipe_id' => $validated['recipe_id'],
                ],
                ['state' => $validated['state']]
            );

            return response()->json([
                'message' => 'Recipe like/dislike saved successfully',
                'data' => $like,
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error saving recipe like/dislike',
                'error' => $e->getMessage(),
            ], 500);
        }
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

    public function show(Request $request, $recipe_id)
    {
        $user = $request->user();

        // Get total likes
        $totalLikes = RecipeLike::where('recipe_id', $recipe_id)
            ->where('state', 'liked')
            ->count();

        // Get user's like/dislike state
        $userState = null;
        if ($user) {
            $userLike = RecipeLike::where('recipe_id', $recipe_id)
                ->where('user_id', $user->id)
                ->first();

            $userState = $userLike->state ?? null;
        }

        return response()->json([
            'message' => 'Recipe like info fetched successfully',
            'data' => [
                'recipe_id' => (int) $recipe_id,
                'total_likes' => $totalLikes,
                'user_state' => $userState,
            ]
        ]);
    }
}
