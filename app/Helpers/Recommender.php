<?php

namespace App\Helpers;

use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Recipe;
use App\Models\RecipeLike;

class Recommender
{
    /**
     * Recommend recipes using KNN algorithm based on user likes
     * 
     * @param int $userId
     * @param int $k Number of nearest neighbors (default: 5)
     * @param int $limit Number of recommendations to return (default: 10)
     * @return array Array of recommended recipe IDs
     */
    public static function recommendRecipes($userId, $k = 5, $limit = 10)
    {
        // Step 1: Get user-recipe matrix (users who liked recipes)
        $userRecipeMatrix = self::getUserRecipeMatrix();

        // Step 2: Find similar users using KNN
        $similarUsers = self::findSimilarUsers($userId, $userRecipeMatrix, $k);

        // Step 3: Generate recommendations based on similar users' likes
        $recommendations = self::generateRecommendations($userId, $similarUsers, $limit);

        return $recommendations;
    }

    /**
     * Create user-recipe matrix based on likes (only counting "liked" state)
     * Returns array: [user_id => [recipe_id => 1, ...], ...]
     */
    private static function getUserRecipeMatrix()
    {
        // Get all likes with state = 'liked'
        $likes = RecipeLike::where('state', 'liked')
            ->select('user_id', 'recipe_id')
            ->get();

        $matrix = [];

        foreach ($likes as $like) {
            $matrix[$like->user_id][$like->recipe_id] = 1;
        }

        return $matrix;
    }

    /**
     * Find K nearest neighbors using cosine similarity
     */
    private static function findSimilarUsers($userId, $userRecipeMatrix, $k)
    {
        if (!isset($userRecipeMatrix[$userId])) {
            return []; // User has no likes yet
        }

        $currentUserLikes = $userRecipeMatrix[$userId];
        $similarities = [];

        foreach ($userRecipeMatrix as $otherUserId => $otherUserLikes) {
            if ($otherUserId == $userId) {
                continue; // Skip self
            }

            $similarity = self::cosineSimilarity($currentUserLikes, $otherUserLikes);

            if ($similarity > 0) { // Only consider users with positive similarity
                $similarities[$otherUserId] = $similarity;
            }
        }

        // Sort by similarity (descending) and take top K
        arsort($similarities);
        return array_slice($similarities, 0, $k, true);
    }

    /**
     * Calculate cosine similarity between two users' like vectors
     */
    private static function cosineSimilarity($userA, $userB)
    {
        $commonRecipes = array_intersect_key($userA, $userB);

        if (empty($commonRecipes)) {
            return 0; // No common recipes
        }

        $dotProduct = count($commonRecipes); // Since values are always 1
        $normA = sqrt(count($userA));
        $normB = sqrt(count($userB));

        if ($normA == 0 || $normB == 0) {
            return 0;
        }

        return $dotProduct / ($normA * $normB);
    }

    /**
     * Generate recipe recommendations based on similar users' likes
     */
    private static function generateRecommendations($userId, $similarUsers, $limit)
    {
        // Get recipes current user already liked or disliked
        $userInteractedRecipes = RecipeLike::where('user_id', $userId)
            ->pluck('recipe_id')
            ->toArray();

        $recommendationScores = [];

        foreach ($similarUsers as $similarUserId => $similarity) {
            // Get recipes liked by similar user
            $similarUserLikes = RecipeLike::where('user_id', $similarUserId)
                ->where('state', 'liked')
                ->pluck('recipe_id')
                ->toArray();

            foreach ($similarUserLikes as $recipeId) {
                // Don't recommend recipes user already interacted with
                if (in_array($recipeId, $userInteractedRecipes)) {
                    continue;
                }

                // Weight the recommendation by similarity score
                if (!isset($recommendationScores[$recipeId])) {
                    $recommendationScores[$recipeId] = 0;
                }
                $recommendationScores[$recipeId] += $similarity;
            }
        }

        // Sort by score (descending) and return top recommendations
        arsort($recommendationScores);
        $recommendedIds = array_keys(array_slice($recommendationScores, 0, $limit));

        // If we don't have enough recommendations, add popular recipes
        if (count($recommendedIds) < $limit) {
            $popularRecipes = self::getPopularRecipes($userInteractedRecipes, $limit - count($recommendedIds));
            $recommendedIds = array_merge($recommendedIds, $popularRecipes);
        }

        return array_unique($recommendedIds);
    }

    /**
     * Get popular recipes as fallback recommendations
     */
    private static function getPopularRecipes($excludeRecipeIds, $limit)
    {
        $query = Recipe::leftJoin('recipe_likes', function ($join) {
            $join->on('recipes.id', '=', 'recipe_likes.recipe_id')
                ->where('recipe_likes.state', '=', 'liked');
        })
            ->select('recipes.id', DB::raw('COUNT(recipe_likes.id) as like_count'))
            ->groupBy('recipes.id')
            ->orderBy('like_count', 'desc')
            ->limit($limit);

        if (!empty($excludeRecipeIds)) {
            $query->whereNotIn('recipes.id', $excludeRecipeIds);
        }

        return $query->pluck('id')->toArray();
    }

    /**
     * Get user's like statistics
     */
    public static function getUserLikeStats($userId)
    {
        return [
            'total_likes' => RecipeLike::where('user_id', $userId)->where('state', 'liked')->count(),
            'total_dislikes' => RecipeLike::where('user_id', $userId)->where('state', 'disliked')->count(),
            'total_interactions' => RecipeLike::where('user_id', $userId)->count(),
        ];
    }

    /**
     * Alternative recommendation method using Jaccard similarity
     * (You can use this instead of cosine similarity if preferred)
     */
    private static function jaccardSimilarity($userA, $userB)
    {
        $intersection = count(array_intersect_key($userA, $userB));
        $union = count(array_unique(array_merge(array_keys($userA), array_keys($userB))));

        return $union > 0 ? $intersection / $union : 0;
    }
}
