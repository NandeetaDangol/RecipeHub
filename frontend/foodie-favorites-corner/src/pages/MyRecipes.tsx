import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash } from "lucide-react";
import axios from "axios";

const MyRecipes = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("API_BASE_URL:", API_BASE_URL); // Check if undefined
    console.log("Token:", token); // Check if token exists

    axios
      .get(`${API_BASE_URL}/recipes`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        console.log("MyRecipes API Response:", res.data); // See what you're getting
        const recipesData = Array.isArray(res.data) ? res.data : res.data.data || [];
        console.log("Processed recipes:", recipesData);
        setRecipes(recipesData);
      })
      .catch((err) => {
        console.error("Error loading recipes:", err);
      });
  }, []);


  const filteredRecipes = recipes.filter(
    (recipe) =>

      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteRecipe = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;

    try {
      const token = localStorage.getItem("token"); // Get token here too
      await axios.delete(`${API_BASE_URL}/recipes/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
      alert("Recipe deleted successfully!");
    } catch (error) {
      console.error("Failed to delete recipe:", error);
      alert("Failed to delete recipe.");
    }
  };

  const handleLike = async (recipeId, currentLiked) => {
    try {
      const token = localStorage.getItem("token"); // or get token from context/auth provider

      const newState = currentLiked ? "disliked" : "liked";

      await axios.post(
        `${API_BASE_URL}/recipe-likes`,
        {
          recipe_id: recipeId,
          state: newState,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === recipeId
            ? {
              ...recipe,
              isLiked: !currentLiked,
              likes_count: (recipe.likes_count || 0) + (currentLiked ? -1 : 1),
            }
            : recipe
        )
      );
    } catch (err) {
      console.error("Failed to update like status:", err);
    }
  };

  const getStatusColor = (isApproved) => {
    return isApproved === 1
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          {/* Left side: title + subtitle */}
          <div>
            <h1 className="text-3xl font-bold">My Recipes</h1>
            <p className="text-muted-foreground mt-2">Manage your recipe collection</p>
          </div>

          {/* Right side: buttons in a row */}
          <div className="flex space-x-3">
            <Button asChild size="lg" variant="outline">
              <Link to="/">
                Back
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline">
              <Link to="/profile">
                <Plus className="h-5 w-5 mr-1" />
                View Profile
              </Link>
            </Button>

            <Button asChild size="lg">
              <Link to="/create-recipe">
                <Plus className="h-5 w-5 mr-2" />
                Create New Recipe
              </Link>
            </Button>
          </div>
        </div>


        {/* Search and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-2">
            <Input
              type="text"
              placeholder="Search your recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">{recipes.length}</div>
              <p className="text-sm text-muted-foreground">Total Recipes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">
                {recipes.filter((r) => r.is_approved === 1).length}
              </div>
              <p className="text-sm text-muted-foreground">Published</p>
            </CardContent>
          </Card>
        </div>

        {/* Recipes Grid */}
        {filteredRecipes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? "No recipes found" : "No recipes yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Create your first recipe to get started"}
              </p>
              {!searchTerm && (
                <Button asChild>
                  <Link to="/create-recipe">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Recipe
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <Card key={recipe.id} className="overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={'http://localhost:8000/api/image/' + recipe.images}
                    alt={recipe.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg line-clamp-2">{recipe.name}</CardTitle>
                    <Badge className={getStatusColor(recipe.is_approved)}>
                      {recipe.is_approved === 1 ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{recipe.category?.name || "Uncategorized"}</span>
                    <span>{new Date(recipe.created_at).toLocaleDateString()}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {recipe.description}
                  </p>

                  {recipe.is_approved === 1 && (
                    <div className="flex items-center justify-between mb-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(recipe.id, !!recipe.isLiked)}
                        className={`flex items-center space-x-1 ${recipe.isLiked
                          ? "text-red-600 hover:text-red-700"
                          : "text-gray-500 hover:text-gray-700"
                          }`}
                        aria-label={recipe.isLiked ? "Unlike recipe" : "Like recipe"}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill={recipe.isLiked ? "currentColor" : "none"}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          className="h-5 w-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 010 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        <span>{recipe.likes_count || 0}</span>
                      </Button>

                      <div className="text-sm text-muted-foreground">
                        {recipe.cooking_time || "N/A"} • {recipe.difficulty || "Easy"}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">

                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link to={`/viewrecipe/${recipe.id}`}>View Recipe</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link to={`/edit-recipe/${recipe.id}`}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteRecipe(recipe.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRecipes;
