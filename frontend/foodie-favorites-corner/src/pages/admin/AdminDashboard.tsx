// src/components/AdminDashboard.tsx
import { useEffect, useState } from "react";
import UsersPage from '@/pages/admin/UsersPage';
import RecipePage from '@/pages/admin/RecipePage';
import CategoryPage from '@/pages/admin/CategoryPage';

import {
  Users, ChefHat, BarChart3, Heart, FolderOpen, Settings,
  Eye, TrendingUp, Star, UserCheck
} from "lucide-react";

import axios from "axios";

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
    totalCategories: 0
  });

  const renderRecipes = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Recipes</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">ID</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Image</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Views</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recipes.map(recipe => (
              <tr key={recipe.id}>
                <td className="px-4 py-2 text-sm text-gray-700">{recipe.id}</td>
                <td className="px-4 py-2">
                  <img
                    src={`${API_BASE_URL}/storage/${recipe.images}`}
                    alt={recipe.name}
                    className="h-12 w-12 rounded object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/default-recipe.jpg';
                    }}
                  />
                </td>
                <td className="px-4 py-2 text-sm font-medium text-gray-900">{recipe.name}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{recipe.views}</td>
                <td className="px-4 py-2 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${recipe.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {recipe.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm">
                  <button className="text-blue-600 hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersApiUrl = `${API_BASE_URL}/admin/users`;
        const recipesApiUrl = `${API_BASE_URL}/admin/recipes`;
        const categoriesApiUrl = `${API_BASE_URL}/admin/categories`;

        console.log("Users API URL:", usersApiUrl);

        // Fetch only users to confirm users are loading
        const [usersRes, recipesRes, categoriesRes] = await Promise.all([
          axios.get(usersApiUrl),
          axios.get(recipesApiUrl),
          axios.get(categoriesApiUrl)

        ]);
        const usersData = usersRes.data.data ?? usersRes.data ?? [];
        const recipesData = recipesRes.data.data ?? recipesRes.data ?? [];
        const categoriesData = categoriesRes.data.data ?? categoriesRes.data ?? [];

        setUsers(usersData);
        setRecipes(recipesData);
        setCategories(categoriesData);


        // For now, set empty arrays for others
        // setRecipes([]);
        // setCategories([]);

        setAnalytics({
          totalUsers: usersData.length,
          totalRecipes: recipesData.length,
          pendingRecipes: recipesData.filter(r => !r.is_approved).length,
          totalViews: recipesData.reduce((acc, r) => acc + (r.view_count || 0), 0),
          totalCategories: categoriesData.length
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
      {count ? <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{count}</span> : null}
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
            {/* Placeholder for top recipes */}
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
              {/* Placeholder for active users */}
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
      case 'users': return <UsersPage users={users} />;
      case 'recipes': return renderRecipes();
      case 'analytics': return renderDashboard();
      case 'likes': return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold">Manage Recipe Likes.</h2>
          <p className="text-gray-600 mt-2">Feature coming soon...</p>
        </div>
      );
      case 'categories': return <CategoryPage />;
      // case 'categories': return <CategoryPage categories={categories} />;
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
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
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-4 rounded-lg shadow-sm">
          <TabButton id="dashboard" label="Dashboard" icon={BarChart3} />
          <TabButton id="users" label="Users" icon={Users} />
          <TabButton id="recipes" label="Recipes" icon={ChefHat} count={analytics.pendingRecipes} />
          <TabButton id="categories" label="Categories" icon={FolderOpen} />
          <TabButton id="analytics" label="Analytics" icon={BarChart3} />
          <TabButton id="likes" label="Recipe Likes" icon={Heart} />
        </div>

        <main>
          {loading ? <p>Loading dashboard data...</p> : renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
