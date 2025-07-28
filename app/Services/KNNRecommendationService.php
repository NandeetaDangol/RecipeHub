<?php

namespace App\Services;

use App\Models\Recipe;
use App\Models\RecipeLike;

class KNNRecommendationService
{
    public function getRecommendations($userId)
    {
        // Step 1: Get user-item matrix
        $likes = RecipeLike::all()->groupBy('user_id');

        $matrix = [];
        foreach ($likes as $uid => $userLikes) {
            foreach ($userLikes as $like) {
                $matrix[$uid][$like->recipe_id] = 1;
            }
        }

        // Step 2: Similarity calculation (Jaccard)
        $similarities = [];
        foreach ($matrix as $otherUserId => $items) {
            if ($otherUserId == $userId) continue;

            $userItems = $matrix[$userId] ?? [];
            $intersection = count(array_intersect_key($userItems, $items));
            $union = count(array_unique(array_merge(array_keys($userItems), array_keys($items))));

            $similarity = $union ? $intersection / $union : 0;
            $similarities[$otherUserId] = $similarity;
        }

        // Step 3: Get top 5 similar users
        arsort($similarities);
        $topUsers = array_slice(array_keys($similarities), 0, 5);

        // Step 4: Recommend recipes liked by similar users that current user hasn't liked
        $userLikedRecipes = array_keys($matrix[$userId] ?? []);
        $recommended = [];

        foreach ($topUsers as $similarUserId) {
            foreach ($matrix[$similarUserId] as $recipeId => $value) {
                if (!in_array($recipeId, $userLikedRecipes)) {
                    $recommended[$recipeId] = ($recommended[$recipeId] ?? 0) + $similarities[$similarUserId];
                }
            }
        }

        // Step 5: Return sorted recipe models
        arsort($recommended);
        $recommendedRecipeIds = array_keys($recommended);

        return Recipe::whereIn('id', $recommendedRecipeIds)->get();
    }
}
