import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";  // add useNavigate
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import RecipeLikeButton from "@/components/RecipeLikeButton";

const RecipeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();  // initialize navigate
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [recipe, setRecipe] = useState(null);
  const [similarRecipes, setSimilarRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/recipedetails/${id}`);
        setRecipe(res.data.recipe);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipe:", error);
        setLoading(false);
      }
    };

    const fetchSimilar = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/recipedetails/${id}/similar`);
        setSimilarRecipes(res.data.similar_recipes);
      } catch (error) {
        console.error("Error fetching similar recipes:", error);
      }
    };

    fetchRecipe();
    fetchSimilar();
  }, [id]);

  if (loading) return <p className="text-center py-8">Loading...</p>;
  if (!recipe) return <p className="text-center py-8">Recipe not found</p>;

  return (
    <div className="container mx-auto px-4 py-10 flex gap-6">
      {/* Left: Main Recipe (2/3) */}
      <div className="w-2/3">
        <Card>
          <div className="aspect-video overflow-hidden">
            <img
              src={'http://localhost:8000/api/image/' + recipe.images}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
          </div>
          <CardHeader>
            <CardTitle className="text-3xl">{recipe.name}</CardTitle>
            <p className="text-muted-foreground mt-2">{recipe.description}</p>
            <div className="flex gap-3 mt-3 flex-wrap">
              <Badge>{recipe.category?.name || "Unknown Category"}</Badge>
              <Badge variant="secondary">{recipe.preparation_time} mins prep</Badge>
              <Badge variant="secondary">{recipe.cooking_time} mins cook</Badge>
            </div>
            <div className="mt-4">
              <RecipeLikeButton recipeId={recipe.id} user={user} />
            </div>
          </CardHeader>

          <CardContent>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Ingredients</h3>
              <ul className="list-disc list-inside space-y-1">
                {recipe.ingredients?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Instructions</h3>
              <ol className="list-decimal list-inside space-y-2">
                {recipe.instructions?.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
            <Button asChild size="lg">
              <Link to="/my-recipes">
                {/* <Plus className="h-1 w-3 mr-1" /> */}
                Back
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>


      {/* Right: Similar Recipes (1/3) */}
      <div className="w-1/3 space-y-4">
        <h2 className="text-xl font-bold mb-2">Similar Recipes</h2>
        {similarRecipes.map((item) => (
          <Card
            key={item.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/viewrecipe/${item.id}`)} // navigate on click
          >
            <div className="flex items-center gap-4 p-3">
              <img
                src={'http://localhost:8000/api/image/' + item.images}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
};

export default RecipeView;
