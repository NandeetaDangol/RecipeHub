<?php

namespace App\Services;

use App\Models\Recipe;
use Illuminate\Support\Str;

class RecipeSimilarityService
{
    public function getSimilarRecipes($recipeId, $limit = 4)
    {
        $target = Recipe::findOrFail($recipeId);
        $targetFeatures = $this->extractCombinedFeatures($target);

        $allRecipes = Recipe::where('id', '!=', $recipeId)->get();
        $vocab = $this->buildVocabulary($target, $allRecipes);

        $targetVector = $this->vectorize($targetFeatures, $vocab);

        $scored = [];

        foreach ($allRecipes as $recipe) {
            $features = $this->extractCombinedFeatures($recipe);
            $vector = $this->vectorize($features, $vocab);
            $similarity = $this->cosineSimilarity($targetVector, $vector);
            $scored[] = [
                'recipe' => $recipe,
                'similarity_score' => round($similarity, 3)
            ];
        }

        usort($scored, fn($a, $b) => $b['similarity_score'] <=> $a['similarity_score']);

        $ranked = [];
        foreach (array_slice($scored, 0, $limit) as $i => $item) {
            $r = $item['recipe'];
            $ranked[] = [
                'id' => $r->id,
                'name' => $r->name,
                'description' => $r->description,
                'preparation_time' => $r->preparation_time,
                'cooking_time' => $r->cooking_time,
                'ingredients' => $r->ingredients,
                'instructions' => $r->instructions,
                'images' => $r->images,
                'similarity_score' => $item['similarity_score'],
                'rank' => $i + 1,
            ];
        }

        return $ranked;
    }

    private function extractCombinedFeatures(Recipe $recipe): array
    {
        $ingredients = json_decode($recipe->ingredients ?? '[]', true);
        $ingredients = array_map(fn($i) => Str::lower(trim($i)), $ingredients);

        $nameWords = explode(' ', Str::lower($recipe->name ?? ''));
        $nameWords = array_map('trim', $nameWords);

        return array_filter(array_merge($ingredients, $nameWords));
    }

    private function buildVocabulary(Recipe $target, $others): array
    {
        $all = $this->extractCombinedFeatures($target);
        foreach ($others as $r) {
            $all = array_merge($all, $this->extractCombinedFeatures($r));
        }

        return array_values(array_unique($all));
    }

    private function vectorize(array $features, array $vocab): array
    {
        return array_map(fn($term) => in_array($term, $features) ? 1 : 0, $vocab);
    }

    private function cosineSimilarity(array $a, array $b): float
    {
        $dot = 0;
        $magA = 0;
        $magB = 0;

        for ($i = 0; $i < count($a); $i++) {
            $dot += $a[$i] * $b[$i];
            $magA += $a[$i] ** 2;
            $magB += $b[$i] ** 2;
        }

        $denominator = sqrt($magA) * sqrt($magB);
        return $denominator === 0 ? 0 : $dot / $denominator;
    }
}
