<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;

class CommentController extends Controller
{
    // List all comments (optionally filter by recipe)
    public function index(Request $request)
    {
        if ($request->has('recipe_id')) {
            return Comment::with('user')->where('recipe_id', $request->recipe_id)->latest()->get();
        }

        return Comment::with('user')->latest()->get();
    }

    // Store a new comment
    public function store(Request $request)
    {
        $validated = $request->validate([
            'recipe_id' => 'required|exists:recipes,id',
            'text' => 'required|string|max:1000',
        ]);

        $comment = $request->user()->comments()->create([
            'recipe_id' => $validated['recipe_id'],
            'text' => $validated['text'],
            'date' => now(),
            'is_approved' => false, // admin approval if needed
        ]);

        return response()->json(['message' => 'Comment submitted for approval', 'data' => $comment], 201);
    }

    // Approve or update comment (admin only)
    public function update(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);

        $validated = $request->validate([
            'text' => 'sometimes|required|string',
            'is_approved' => 'sometimes|boolean',
        ]);

        $comment->update($validated);

        return response()->json(['message' => 'Comment updated', 'data' => $comment]);
    }

    // Delete comment
    public function destroy(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);

        // Only allow owner or admin to delete
        if ($comment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted']);
    }
    // Show a single comment
    public function show($id)
    {
        $comment = Comment::with('user')->findOrFail($id);
        return response()->json($comment);
    }
}