import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Pencil, Trash } from "lucide-react";
import axios from "axios";

const MyRecipes = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/recipes`)
      .then(res => {
        setRecipes(res.data); // update if structure is like res.data.data
      })
      .catch(err => {
        console.error("Error loading recipes:", err);
      });
  }, []);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

const handleDeleteRecipe = async (id) => {
  if (!window.confirm("Are you sure you want to delete this recipe?")) return;

  try {
    await axios.delete(`${API_BASE_URL}/recipes/${id}`, {
      headers: {
        // If you're using auth
        // Authorization: `Bearer ${token}`
      }
    });

    // Remove deleted recipe from UI
    setRecipes(prev => prev.filter(recipe => recipe.id !== id));

    alert("Recipe deleted successfully!");
  } catch (error) {
    console.error("Failed to delete recipe:", error);
    alert("Failed to delete recipe.");
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
          <div>
            <h1 className="text-3xl font-bold">My Recipes</h1>
            <p className="text-muted-foreground mt-2">Manage your recipe collection</p>
          </div>
          <Button asChild size="lg">
            <Link to="/create-recipe">
              <Plus className="h-5 w-5 mr-2" />
              Create New Recipe
            </Link>
          </Button>
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
                {recipes.filter(r => r.is_approved === 1).length}
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
                    src={recipe.image_url}
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
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{recipe.rating || 4.5}</span>
                        <span className="text-sm text-muted-foreground">({recipe.reviews || 0})</span>
                      </div>
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
