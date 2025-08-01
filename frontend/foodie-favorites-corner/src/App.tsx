import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import DashboardPage from "@/pages/admin/DashboardPage";
// import UsersPage from "@/pages/admin/UsersPage";
// import CategoriesPage from "@/pages/admin/CategoriesPage";
// import TopRatedRecipesPage from "@/pages/admin/TopRatedRecipes";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";


import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyRecipes from "./pages/MyRecipes";
import RecipeView from "./pages/RecipeView";
import CreateRecipe from "./pages/CreateRecipe";
import EditRecipe from "./pages/EditRecipe";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import UserProfile from "@/pages/UserProfile";
import UsersPage from './pages/admin/UsersPage';
import RecipePage from "./pages/admin/RecipePage";
import CategoryPage from "./pages/admin/CategoryPage";


import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/viewrecipe/:id" element={<RecipeView />} />
              <Route path="/create-recipe" element={<CreateRecipe />} />
              <Route path="/edit-recipe/:id" element={<EditRecipe />} />
              <Route path="/my-recipes" element={<MyRecipes />} />
              <Route path="/profile" element={<Profile />} />
              {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
              <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/recipes" element={<RecipePage />} />
              <Route path="/admin/categories" element={<CategoryPage />} />
              {/* <Route path="/admin/categories" element={<CategoriesPage />} /> */}
              {/* <Route path="/admin/top-rated-recipes" element={<TopRatedRecipesPage />} /> */}


              {/* <Route path="/admin/dashboard" element={<DashboardPage />} /> */}
              {/* <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/categories" element={<CategoriesPage />} />
              <Route path="/admin/top-rated-recipes" element={<TopRatedRecipesPage />} /> */}
              <Route path="*" element={<NotFound />} />
            </Routes>

          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
