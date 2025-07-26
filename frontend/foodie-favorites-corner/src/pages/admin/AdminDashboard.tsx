// src/components/AdminDashboard.tsx
import { useEffect, useState } from "react";
import {
  Users,
  ChefHat,
  BarChart3,
  Heart,
  FolderOpen,
  Settings,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Star,
  Bookmark,
  UserCheck
} from "lucide-react";

import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UsersPage from "./UsersPage";

const AdminDashboard = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    pendingRecipes: 0,
    totalViews: 0,
    topRecipes: [],
    activeUsers: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, recipesRes, categoriesRes, topRatedRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/admin/users`),
          axios.get(`${API_BASE_URL}/admin/recipes`),
          axios.get(`${API_BASE_URL}/admin/categories`),
          axios.get(`${API_BASE_URL}/admin/top-rated-recipes`)
        ]);

        setUsers(usersRes.data);
        setRecipes(recipesRes.data);
        setCategories(categoriesRes.data);

        setAnalytics({
          totalUsers: usersRes.data.length,
          totalRecipes: recipesRes.data.length,
          pendingRecipes: recipesRes.data.filter(r => r.status === 'pending').length,
          totalViews: recipesRes.data.reduce((sum, r) => sum + (r.views || 0), 0),
          topRecipes: topRatedRes.data,
          activeUsers: usersRes.data.filter(u => u.status === 'active').length
        });
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <Icon className={`h-8 w-8 text-${color}-500`} />
      </div>
    </div>
  );

  const TabButton = ({ id, label, icon: Icon, count }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === id
        ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
        : 'text-gray-600 hover:bg-gray-100'
        }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
      {count && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{count}</span>}
    </button>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={analytics.totalUsers.toLocaleString()} icon={Users} />
        <StatCard title="Total Recipes" value={analytics.totalRecipes.toLocaleString()} icon={ChefHat} />
        <StatCard title="Pending Reviews" value={analytics.pendingRecipes} icon={Settings} color="yellow" />
        <StatCard title="Total Views" value={analytics.totalViews.toLocaleString()} icon={Eye} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Top Performing Recipes
          </h3>
          <div className="space-y-3">
            {analytics.topRecipes?.map((recipe, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{recipe.title}</p>
                  <p className="text-sm text-gray-600">{recipe.views} views</p>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{recipe.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <UserCheck className="h-5 w-5 mr-2" />
            User Activity
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Users</span>
              <span className="font-semibold text-green-600">{analytics.activeUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">New This Month</span>
              <span className="font-semibold text-blue-600">127</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Recipes This Week</span>
              <span className="font-semibold text-purple-600">43</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'users': return <UsersPage/>;
      case 'recipes': return <div>Recipe management will go here...</div>;
      case 'analytics': return renderDashboard();
      case 'likes': return <div className="bg-white rounded-lg shadow-md p-6"><h2 className="text-xl font-semibold">Manage Recipe Likes</h2><p className="text-gray-600 mt-2">Feature coming soon...</p></div>;
      case 'categories': return <div>Categories management will go here...</div>;
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <ChefHat className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Recipe Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, Admin</span>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-4 rounded-lg shadow-sm">
          <TabButton id="dashboard" label="Dashboard" icon={BarChart3} />
          <TabButton id="users" label="Users" icon={Users} />
          <TabButton id="recipes" label="Recipes" icon={ChefHat} count={analytics.pendingRecipes} />
          <TabButton id="analytics" label="Analytics" icon={BarChart3} />
          <TabButton id="likes" label="Recipe Likes" icon={Heart} />
          <TabButton id="categories" label="Categories" icon={FolderOpen} />
        </div>

        {/* Main Content */}
        <main>
          {loading ? <p>Loading dashboard data...</p> : renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
