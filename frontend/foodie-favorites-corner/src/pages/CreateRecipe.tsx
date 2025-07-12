import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash } from "lucide-react";

const CreateRecipe = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    difficulty: "Easy",
    preparation_time: "",
    cooking_time: "",
    servings: "",
    ingredients: "",
    image: "",
    submission_date: "",
    view_count: "",
  });
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);
  const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/categories")
      .then(response => setCategories(response.data))
      .catch(error => console.error("Failed to load categories", error));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to create a recipe.");
      setIsLoading(false);
      return;
    }

    const recipeData = {
      name: formData.name,
      description: formData.description,
      category_id: parseInt(formData.category),
      preparation_time: formData.preparation_time ? parseInt(formData.preparation_time) : null,
      cooking_time: formData.cooking_time ? parseInt(formData.cooking_time) : null,
      servings: formData.servings ? parseInt(formData.servings) : null,
      ingredients: ingredients.filter(i => i.trim() !== ""),
      instructions: instructions.filter(i => i.trim() !== ""),
      image_url: formData.image,
      submission_date: new Date().toISOString(),
      is_approved: false,
      tags: [],
      view_count: 0
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/recipes", recipeData, {
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      alert("Recipe created successfully!");
      navigate("/my-recipes");
    } catch (error: any) {
      console.error(error);
      const message =
        error?.response?.data?.message ||
        Object.values(error?.response?.data?.errors || {}).flat().join(" ") ||
        "Something went wrong!";
      alert("Failed to create recipe: " + message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create New Recipe</h1>
          <p className="text-muted-foreground mt-2">Share your delicious creation with the community</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Recipe Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter recipe name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your recipe..."
                      className="min-h-[100px]"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="preparation_time">Preparation Time (minutes)</Label>
                    <Input
                      id="preparation_time"
                      name="preparation_time"
                      type="number"
                      value={formData.preparation_time}
                      onChange={handleInputChange}
                      placeholder="e.g., 15"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cooking_time">Cooking Time (minutes)</Label>
                    <Input
                      id="cooking_time"
                      name="cooking_time"
                      type="number"
                      value={formData.cooking_time}
                      onChange={handleInputChange}
                      placeholder="e.g., 30"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      name="image"
                      type="url"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ingredients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={ingredient}
                          onChange={(e) => updateIngredient(index, e.target.value)}
                          placeholder={`Ingredient ${index + 1}`}
                          className="flex-1"
                        />
                        {ingredients.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeIngredient(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addIngredient}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Ingredient
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {instructions.map((instruction, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-2 flex-shrink-0">
                          {index + 1}
                        </span>
                        <Textarea
                          value={instruction}
                          onChange={(e) => updateInstruction(index, e.target.value)}
                          placeholder={`Step ${index + 1}`}
                          className="flex-1 min-h-[60px]"
                        />
                        {instructions.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeInstruction(index)}
                            className="mt-2"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addInstruction}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Instruction
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recipe Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md"
                      required
                    >
                      <option value="">Select category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
              ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <select
                      id="difficulty"
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="servings">Servings</Label>
                    <Input
                      id="servings"
                      name="servings"
                      type="number"
                      value={formData.servings}
                      onChange={handleInputChange}
                      placeholder="e.g., 4"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Creating Recipe..." : "Create Recipe"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mt-3"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipe;
