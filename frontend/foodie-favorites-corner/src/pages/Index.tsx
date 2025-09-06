import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import axios from "axios";



const Index = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
  const [testMessage, setTestMessage] = useState("");
  const [recipes, setRecipes] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch test message (optional)
  useEffect(() => {
    axios.get(`${API_BASE_URL}/test`)
      .then(res => setTestMessage(res.data.data))
      .catch(err => console.error("Error fetching test data:", err));
  }, []);

  // Fetch categories and recipes in parallel
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, recipeRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/categories`),
          axios.get(`${API_BASE_URL}/recipes`)
        ]);

        setCategories(["All", ...catRes.data.map((c: any) => c.name)]);
        setRecipes(Array.isArray(recipeRes.data) ? recipeRes.data : [recipeRes.data]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Memoized filtering
  const filteredRecipes = useMemo(() => {
    return recipes
      .filter(r => r.is_approved === 1)
      .filter(r => {
        const matchesSearch =
          r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
          selectedCategory === "All" || r.category?.name === selectedCategory;
        return matchesSearch && matchesCategory;
      });
  }, [recipes, searchTerm, selectedCategory]);

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
            <Input
              type="text"
              placeholder="Search for recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-black"
            />
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.length === 0 ? (
              <p>Loading categories...</p>
            ) : (
              categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))
            )}
          </div>
        </div>

        {/* Featured Recipes */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">
            {selectedCategory === "All" ? "Recipes" : `${selectedCategory} Recipes`}
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="bg-gray-200 animate-pulse h-64 rounded-lg" />
              ))}
            </div>
          ) : filteredRecipes.length === 0 ? (
            <p>No recipes found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRecipes.map((recipe) => (
                <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={`http://localhost:8000/api/image/${recipe.images}`}
                      alt={recipe.name}
                      loading="lazy"
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
          )}
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
