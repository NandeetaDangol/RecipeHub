<?php

namespace App\Http\Controllers;

use App\Models\RecipeTags;
use Illuminate\Http\Request;

class RecipeTagsController extends Controller
{
    // GET: List all recipe-tag mappings
    public function index()
    {
        return response()->json([
            'message' => 'RecipeTags fetched successfully',
            'data' => RecipeTags::all()
        ]);
    }

    // POST: Attach a tag to a recipe
    public function store(Request $request)
    {
        $validated = $request->validate([
            'recipe_id' => 'required|exists:recipes,id',
            'tag_id' => 'required|exists:tags,id',
        ]);

        $mapping = RecipeTags::create($validated);

        return response()->json([
            'message' => 'Tag attached to recipe successfully',
            'data' => $mapping
        ], 201);
    }

    // DELETE: Remove a tag from a recipe
    public function destroy($id)
    {
        $mapping = RecipeTags::findOrFail($id);
        $mapping->delete();

        return response()->json([
            'message' => 'RecipeTag mapping deleted successfully',
        ]);
    }
}