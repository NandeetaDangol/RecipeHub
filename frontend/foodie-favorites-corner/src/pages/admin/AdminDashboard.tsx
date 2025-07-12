import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    approvedRecipes: 0,
    pendingRecipes: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, recipesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/admin/users`),
          axios.get(`${API_BASE_URL}/admin/recipes`)
        ]);

        const recipes = recipesRes.data;
        const approved = recipes.filter((r: any) => r.is_approved === 1).length;
        const pending = recipes.filter((r: any) => r.is_approved === 0).length;

        setStats({
          totalUsers: usersRes.data.length,
          totalRecipes: recipes.length,
          approvedRecipes: approved,
          pendingRecipes: pending
        });
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {loading ? (
          <p>Loading statistics...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <Card>
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Recipes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalRecipes}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Approved Recipes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{stats.approvedRecipes}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Recipes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{stats.pendingRecipes}</div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">View, update or delete users.</p>
              <Button asChild>
                <Link to="/admin/users">Manage Users</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recipe Moderation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">Approve or reject recipe submissions.</p>
              <Button asChild variant="outline">
                <Link to="/admin/recipes">Moderate Recipes</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
