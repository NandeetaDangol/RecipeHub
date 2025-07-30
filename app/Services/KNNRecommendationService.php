<?php

namespace App\Services;

use App\Models\Recipe;
use App\Models\RecipeLike;
use Illuminate\Support\Facades\Cache;

class KNNRecommendationService
{
    /**
     * Get recommended recipes for a user based on KNN.
     *
     * @param int $userId
     * @param int $limit
     * @return \Illuminate\Support\Collection
     */
    public function getRecommendations(int $userId, int $limit = 10)
    {
        // Cache results for 1 hour
        return Cache::remember("recommendations_user_{$userId}", 3600, function () use ($userId, $limit) {

            // Step 1: Get recipes liked by the user
            $userLiked = RecipeLike::where('user_id', $userId)
                ->where('state', 'liked')
                ->pluck('recipe_id')
                ->toArray();

            if (empty($userLiked)) {
                // No likes → return popular recipes instead (fallback)
                return Recipe::orderByDesc('view_count')
                    ->take($limit)
                    ->get();
            }

            // Step 2: Get only users who liked the same recipes
            $otherUsersLikes = RecipeLike::select('user_id', 'recipe_id')
                ->whereIn('recipe_id', $userLiked)
                ->where('user_id', '!=', $userId)
                ->where('state', 'liked')
                ->get()
                ->groupBy('user_id');

            // Step 3: Build user-item matrix only for relevant users
            $matrix = [];
            foreach ($otherUsersLikes as $uid => $likes) {
                foreach ($likes as $like) {
                    $matrix[$uid][$like->recipe_id] = 1;
                }
            }

            $currentUserMatrix = array_fill_keys($userLiked, 1);

            // Step 4: Compute similarity (Jaccard)
            $similarities = [];
            foreach ($matrix as $otherUserId => $items) {
                $intersection = count(array_intersect_key($currentUserMatrix, $items));
                $union = count(array_unique(array_merge(array_keys($currentUserMatrix), array_keys($items))));
                $similarity = $union ? $intersection / $union : 0;

                if ($similarity > 0) {
                    $similarities[$otherUserId] = $similarity;
                }
            }

            // Step 5: Get top 5 similar users
            arsort($similarities);
            $topUsers = array_slice(array_keys($similarities), 0, 5);

            // Step 6: Recommend recipes from similar users not yet liked
            $recommended = [];
            foreach ($topUsers as $similarUserId) {
                foreach ($matrix[$similarUserId] as $recipeId => $val) {
                    if (!in_array($recipeId, $userLiked)) {
                        $recommended[$recipeId] = ($recommended[$recipeId] ?? 0) + $similarities[$similarUserId];
                    }
                }
            }

            // Step 7: Sort recommendations
            arsort($recommended);
            $recommendedRecipeIds = array_slice(array_keys($recommended), 0, $limit);

            return Recipe::whereIn('id', $recommendedRecipeIds)->get();
        });
    }
}
