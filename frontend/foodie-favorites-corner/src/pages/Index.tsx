import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

const categories = ["All", "Italian", "Indian", "Mexican", "Chinese", "Dessert"];

const Index = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [testMessage, setTestMessage] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch test message
  useEffect(() => {
    axios.get(`${API_BASE_URL}/test`)
      .then(response => {
        setTestMessage(response.data.data);
      })
      .catch(error => {
        console.error("Error fetching test data:", error);
      });
  }, []);

  // Fetch recipes from API
  useEffect(() => {
    axios.get(`${API_BASE_URL}/recipes`)
      .then(response => {
        setRecipes(response.data); // response should include category as object
      })
      .catch(error => {
        console.error("Error fetching recipes:", error);
      });
  }, []);

  const filteredRecipes = recipes
    .filter(recipe => recipe.is_approved === 1)
    .filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        recipe.category?.name === selectedCategory;

      return matchesSearch && matchesCategory;
    });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Discover Amazing Recipes</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Find and create delicious recipes from around the world. Join our community of food lovers!
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex">
              <Input
                type="text"
                placeholder="Search for recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-r-none text-black"
              />
              <Button className="rounded-l-none bg-white text-orange-500 hover:bg-gray-100">
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Recipes */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">
            {selectedCategory === "All" ? "Recipes" : `${selectedCategory} Recipes`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={recipe.image_url}
                    alt={recipe.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-2">{recipe.name}</CardTitle>
                    <Badge variant="secondary">{recipe.category?.name || "Unknown"}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {recipe.description}
                  </p>
                  <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
                    <span>⏱ {recipe.cooking_time || "N/A"} mins</span>
                    <span>🍳 {recipe.difficulty || "Easy"}</span>
                  </div>
                  <Button asChild className="w-full">
                    <Link to={`/viewrecipe/${recipe.id}`}>View Recipe</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-muted rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Share Your Culinary Creations</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join our community of passionate cooks and share your favorite recipes with food lovers around the world.
          </p>
          <Button asChild size="lg">
            <Link to="/register">Get Started Today</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;

