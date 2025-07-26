<?php

namespace App\Helpers;

use App\Models\User;
use App\Models\Recipe;

class Recommender
{
    public static function getUserRecipeMatrix()
    {
        $users = User::with('likedRecipes')->get();
        $recipes = Recipe::all();

        $matrix = [];

        foreach ($users as $user) {
            foreach ($recipes as $recipe) {
                $matrix[$user->id][$recipe->id] = $user->likedRecipes->contains($recipe->id) ? 1 : 0;
            }
        }

        return $matrix;
    }

    public static function cosineSimilarity($vecA, $vecB)
    {
        $dotProduct = 0;
        $normA = 0;
        $normB = 0;

        foreach ($vecA as $i => $a) {
            $dotProduct += $a * $vecB[$i];
            $normA += $a * $a;
            $normB += $vecB[$i] * $vecB[$i];
        }

        return $normA && $normB ? $dotProduct / (sqrt($normA) * sqrt($normB)) : 0;
    }

    public static function getNearestNeighbors($userId, $matrix, $k = 3)
    {
        $target = $matrix[$userId];
        $similarities = [];

        foreach ($matrix as $otherId => $vector) {
            if ($otherId == $userId) continue;

            $similarities[$otherId] = self::cosineSimilarity($target, $vector);
        }

        arsort($similarities);
        return array_slice($similarities, 0, $k, true);
    }

    public static function recommendRecipes($userId, $k = 3)
    {
        $matrix = self::getUserRecipeMatrix();
        if (!isset($matrix[$userId])) return [];

        $neighbors = self::getNearestNeighbors($userId, $matrix, $k);
        $userLikes = $matrix[$userId];

        $recommendations = [];

        foreach ($neighbors as $neighborId => $score) {
            foreach ($matrix[$neighborId] as $recipeId => $liked) {
                if ($liked && !$userLikes[$recipeId]) {
                    $recommendations[$recipeId] = ($recommendations[$recipeId] ?? 0) + $score;
                }
            }
        }

        arsort($recommendations);
        return array_keys($recommendations);
    }
}
