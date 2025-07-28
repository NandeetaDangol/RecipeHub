<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Recipe;
use App\Models\UserRecipeView;

class RecipeController extends Controller
{
    public function index()
    {

        $recipes = Recipe::with('category:id,name')->get();
        return response()->json($recipes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|integer|exists:categories,id',
            'preparation_time' => 'required|integer|min:0',
            'cooking_time' => 'required|integer|min:0',
            'servings' => 'nullable|integer',
            'ingredients' => 'nullable|array',
            'instructions' => 'nullable|array',
            'image_url' => 'nullable|url',
            'submission_date' => 'nullable|date',
            'is_approved' => 'boolean',
            'view_count' => 'integer|min:0',
        ]);

        $recipe = $request->user()->recipes()->create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'category_id' => $validated['category_id'],
            'preparation_time' => $validated['preparation_time'],
            'cooking_time' => $validated['cooking_time'],
            'servings' => $validated['servings'] ?? null,
            'ingredients' => json_encode($validated['ingredients']),
            'instructions' => json_encode($validated['instructions']),
            'image_url' => $validated['image_url'] ?? null,
            'submission_date' => $validated['submission_date'] ?? now(),
            'is_approved' => $validated['is_approved'] ?? false,
            'view_count' => 0,
        ]);

        if ($request->tags) {
            $recipe->tags()->sync($request->tags);
        }

        return response()->json($recipe, 201);
    }

    public function show(Request $request, $id)
    {
        $recipe = Recipe::with('category')->findOrFail($id);
        $recipe->increment('view_count');

        // Record user-specific recipe view
        if ($request->user()) {
            UserRecipeView::updateOrCreate(
                [
                    'user_id' => $request->user()->id,
                    'recipe_id' => $recipe->id,
                ],
                [
                    'viewed_at' => now(),
                ]
            );
        }

        $recipe->ingredients = json_decode($recipe->ingredients, true);
        $recipe->instructions = json_decode($recipe->instructions, true);

        return response()->json($recipe);
    }

    public function history(Request $request)
    {
        $history = $request->user()
            ->viewedRecipes()
            ->with('category:id,name')
            ->orderByPivot('viewed_at', 'desc')
            ->take(10)
            ->get();

        return response()->json($history);
    }

    public function update(Request $request, $id)
    {
        $recipe = Recipe::find($id);
        if (!$recipe) {
            return response()->json(['message' => 'Recipe not found'], 404);
        }

        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'category_id' => 'required|integer|exists:categories,id',
                'preparation_time' => 'required|integer|min:0',
                'cooking_time' => 'required|integer|min:0',
                'servings' => 'nullable|integer',
                'image_url' => 'nullable|url',
                'view_count' => 'nullable|integer',
                'submission_date' => 'nullable|date',
                'ingredients' => 'nullable|array',
                'instructions' => 'nullable|array',
                'is_approved' => 'nullable|boolean',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }

        $recipe->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'category_id' => $validated['category_id'],
            'preparation_time' => $validated['preparation_time'],
            'cooking_time' => $validated['cooking_time'],
            'servings' => $validated['servings'] ?? null,
            'image_url' => $validated['image_url'] ?? $recipe->image_url,
            'view_count' => $validated['view_count'] ?? $recipe->view_count,
            'submission_date' => $validated['submission_date'] ?? $recipe->submission_date,
            'is_approved' => $validated['is_approved'] ?? $recipe->is_approved,
            'ingredients' => json_encode($validated['ingredients'] ?? json_decode($recipe->ingredients, true)),
            'instructions' => json_encode($validated['instructions'] ?? json_decode($recipe->instructions, true)),
        ]);

        return response()->json(['message' => 'Recipe updated successfully', 'recipe' => $recipe]);
    }

    public function destroy($id)
    {
        $recipe = Recipe::find($id);
        if (!$recipe) {
            return response()->json(['message' => 'Recipe not found'], 404);
        }

        $recipe->delete();

        return response()->json(['message' => 'Recipe deleted successfully']);
    }

    public function recommended()
    {
        $user = auth()->user(); // or static for now
        $recipes = Recipe::inRandomOrder()->take(5)->get();
        return response()->json($recipes);
    }


    public function topRated()
    {
        $recipes = Recipe::withCount('likes')
            ->orderByDesc('likes_count')
            ->take(10)
            ->get();

        return response()->json([
            'message' => 'Top rated recipes by likes',
            'data' => $recipes,
        ]);
    }
}
