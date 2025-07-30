// src/pages/EditRecipe.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash } from "lucide-react";

const API_BASE_URL = "http://localhost:8000/api"; // your backend API

const EditRecipe = () => {
  const { id } = useParams();
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
    images: null,       // for new file
    image_url: "",     // old image path
  });

  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/recipedetails/${id}`);
        const recipe = res.data;

        setFormData((prev) => ({
          ...prev,
          name: recipe.name || "",
          description: recipe.description || "",
          category: recipe.category || "",
          difficulty: recipe.difficulty || "Easy",
          preparation_time: recipe.preparation_time || "",
          cooking_time: recipe.cooking_time || "",
          servings: recipe.servings || "",
          image_url: recipe.images || "", // backend returns stored path
        }));

        setIngredients(
          typeof recipe.ingredients === "string"
            ? JSON.parse(recipe.ingredients)
            : recipe.ingredients || [""]
        );

        setInstructions(
          typeof recipe.instructions === "string"
            ? JSON.parse(recipe.instructions)
            : recipe.instructions || [""]
        );
      } catch (error) {
        console.error("Failed to fetch recipe:", error);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, images: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addIngredient = () => setIngredients([...ingredients, ""]);
  const removeIngredient = (index) =>
    setIngredients(ingredients.filter((_, i) => i !== index));
  const updateIngredient = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addInstruction = () => setInstructions([...instructions, ""]);
  const removeInstruction = (index) =>
    setInstructions(instructions.filter((_, i) => i !== index));
  const updateInstruction = (index, value) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to update a recipe.");
      setIsLoading(false);
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("category_id", formData.category);
    form.append("difficulty", formData.difficulty);
    form.append("preparation_time", formData.preparation_time);
    form.append("cooking_time", formData.cooking_time);
    form.append("servings", formData.servings);

    ingredients.forEach((item, idx) => {
      if (item.trim()) form.append(`ingredients[${idx}]`, item);
    });
    instructions.forEach((step, idx) => {
      if (step.trim()) form.append(`instructions[${idx}]`, step);
    });

    if (formData.images) {
      form.append("images", formData.images); // new uploaded file
    }

    try {
      await axios.post(`${API_BASE_URL}/recipes/${id}?_method=PUT`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Recipe updated successfully!");
      navigate(`/viewrecipe/${id}`);
    } catch (error) {
      console.error("Failed to update recipe:", error);
      alert("Error updating recipe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit Recipe</h1>
          <p className="text-muted-foreground mt-2">Update your recipe details</p>
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
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="images">Recipe Image</Label>
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {/* Preview new image if uploaded */}
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="New Preview"
                        className="mt-4 h-40 w-full object-cover rounded-md"
                      />
                    )}
                    {/* Show current image if exists */}
                    {!imagePreview && formData.image_url && (
                      <img
                        src={`${API_BASE_URL}/storage/${formData.image_url}`}
                        alt="Current"
                        className="mt-4 h-40 w-full object-cover rounded-md"
                        onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Ingredients */}
              <Card>
                <CardHeader><CardTitle>Ingredients</CardTitle></CardHeader>
                <CardContent className="space-y-3">
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
                    <Plus className="h-4 w-4 mr-2" /> Add Ingredient
                  </Button>
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card>
                <CardHeader><CardTitle>Instructions</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {instructions.map((instruction, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-2">
                        {index + 1}
                      </span>
                      <Textarea
                        value={instruction}
                        onChange={(e) => updateInstruction(index, e.target.value)}
                        className="flex-1 min-h-[60px]"
                        placeholder={`Step ${index + 1}`}
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
                    <Plus className="h-4 w-4 mr-2" /> Add Instruction
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Recipe Details</CardTitle></CardHeader>
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
                      <option value="Italian">Italian</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Mexican">Mexican</option>
                      <option value="Nepali">Nepali</option>
                      <option value="Indian">Indian</option>
                      <option value="American">American</option>
                      <option value="Dessert">Dessert</option>
                      <option value="Salad">Salad</option>
                      <option value="Soup">Soup</option>
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
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Updating Recipe..." : "Update Recipe"}
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

export default EditRecipe;
