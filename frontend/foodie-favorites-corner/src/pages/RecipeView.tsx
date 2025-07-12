import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RecipeView = () => {
  const { id } = useParams();
  console.log("Recipe ID:", id);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/recipedetails/${id}`)
      .then(response => {
        setRecipe(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching recipe:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center py-8">Loading...</p>;
  if (!recipe) return <p className="text-center py-8">Recipe not found</p>;

  return (
    <div className="container mx-auto px-4 py-10">
      <Card>
        <div className="aspect-video overflow-hidden">
          <img
            src={recipe.image_url}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
        </div>
        <CardHeader>
          <CardTitle className="text-3xl">{recipe.name}</CardTitle>
          <p className="text-muted-foreground mt-2">{recipe.description}</p>
          <div className="flex gap-3 mt-3">
            <Badge>{recipe.category?.name || "Unknown Category"}</Badge>
            <Badge variant="secondary">{recipe.preparation_time} prep</Badge>
            <Badge variant="secondary">{recipe.cooking_time} cook</Badge>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default RecipeView;
