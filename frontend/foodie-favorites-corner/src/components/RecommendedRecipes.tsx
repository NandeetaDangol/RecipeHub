// src/components/RecommendedRecipes.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Clock, Users, ChefHat } from "lucide-react";

const RecommendedRecipes = ({ user }) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
    const [recommendedRecipes, setRecommendedRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getAuthHeaders = () => {
        const token = user?.token || localStorage.getItem("token");
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    const getRecommendations = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/api/recommended-recipes`, getAuthHeaders());

            if (res.data.data) {
                setRecommendedRecipes(res.data.data);
            } else {
                setRecommendedRecipes([]);
            }
            setError(null);
        } catch (err) {
            console.error("Recommendation error", err);
            setError(err.response?.data?.message || "Failed to load recommendations");
        } finally {
            setLoading(false);
        }
    };

    const toggleLike = async (recipeId) => {
        if (!user) {
            alert("Please log in to like recipes.");
            return;
        }

        try {
            const currentRecipe = recommendedRecipes.find(r => r.id === recipeId);
            const currentState = currentRecipe?.user_state;
            const newState = currentState === "liked" ? "disliked" : "liked";

            const response = await axios.post(
                `${API_BASE_URL}/api/recipe-likes`,
                {
                    recipe_id: recipeId,
                    state: newState,
                },
                getAuthHeaders()
            );

            setRecommendedRecipes(prev =>
                prev.map(recipe => {
                    if (recipe.id === recipeId) {
                        const updatedLikesCount = newState === "liked"
                            ? recipe.likes_count + (currentState === "liked" ? 0 : 1)
                            : recipe.likes_count - (currentState === "liked" ? 1 : 0);

                        return {
                            ...recipe,
                            user_state: response.data.data.state,
                            is_liked: response.data.data.state === "liked",
                            likes_count: Math.max(0, updatedLikesCount)
                        };
                    }
                    return recipe;
                })
            );

        } catch (err) {
            console.error("Like error", err);
            alert("Failed to update like status. Please try again.");
        }
    };

    useEffect(() => {
        if (user) {
            getRecommendations();
        }
    }, [user]);

    if (!user) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Please log in to see recommendations</p>
                <p className="text-sm text-gray-500">
                    Get personalized recipe recommendations based on your likes!
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Loading recommendations...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={getRecommendations}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Recommended for You</h2>
                <button
                    onClick={getRecommendations}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                    Refresh
                </button>
            </div>

            {recommendedRecipes.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No recommendations available yet</p>
                    <p className="text-sm text-gray-500">
                        Start liking some recipes to get personalized recommendations!
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {recommendedRecipes.map((recipe) => (
                        <Card key={recipe.id} className="shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
                            {recipe.image && (
                                <div className="relative h-48 bg-gray-200">
                                    <img
                                        src={recipe.image}
                                        alt={recipe.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}

                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg line-clamp-2">{recipe.title}</CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                <p className="text-gray-600 text-sm line-clamp-3">{recipe.description}</p>

                                <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                                    {recipe.prep_time && (
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            <span>{recipe.prep_time} min</span>
                                        </div>
                                    )}

                                    {recipe.servings && (
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            <span>{recipe.servings} servings</span>
                                        </div>
                                    )}

                                    {recipe.difficulty && (
                                        <div className="flex items-center gap-1">
                                            <ChefHat className="h-4 w-4" />
                                            <span className="capitalize">{recipe.difficulty}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t">
                                    <button
                                        onClick={() => toggleLike(recipe.id)}
                                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${recipe.is_liked
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                                            }`}
                                    >
                                        <Heart
                                            className={`h-4 w-4 ${recipe.is_liked ? 'fill-current' : ''
                                                }`}
                                        />
                                        <span>{recipe.likes_count || 0}</span>
                                    </button>

                                    <button
                                        className="px-4 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-colors"
                                        onClick={() => {
                                            window.location.href = `/recipes/${recipe.id}`;
                                        }}
                                    >
                                        View Recipe
                                    </button>
                                </div>

                                {recipe.user_state && (
                                    <div className="text-xs text-gray-400">
                                        Status: {recipe.user_state}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecommendedRecipes;
