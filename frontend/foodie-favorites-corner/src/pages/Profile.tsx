import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Loader2,
  Mail,
  Calendar,
  UserCircle,
  BookOpen,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const API = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [userRes, histRes] = await Promise.all([
          axios.get(`${API}/user`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API}/me/history`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUser(userRes.data);
        setHistory(histRes.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [API, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
        <span className="ml-2 text-gray-500 text-sm">Loading profile…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* ---------- BANNER ---------- */}
        <div className="relative h-40 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-t-2xl shadow-md">
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.name
              )}&background=random`}
              alt="avatar"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
          </div>
        </div>

        {/* ---------- PROFILE CARD ---------- */}
        <Card className="mt-16 rounded-2xl shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
            <p className="text-muted-foreground mt-1">Welcome to your profile</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* DETAILS */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <UserCircle className="text-blue-600" />
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-blue-600" />
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="text-blue-600" />
                <span className="font-medium">
                  Joined on {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-xl shadow-sm hover:shadow-md transition">
                <BookOpen className="mx-auto text-blue-600 mb-2" />
                <p className="text-lg font-bold">{user.recipes_count || 0}</p>
                <p className="text-sm text-muted-foreground">My Recipes</p>
              </div>
              <div className="p-4 bg-pink-50 rounded-xl shadow-sm hover:shadow-md transition">
                <Heart className="mx-auto text-pink-600 mb-2" />
                <p className="text-lg font-bold">{user.likes_count || 0}</p>
                <p className="text-sm text-muted-foreground">Liked Recipes</p>
              </div>
            </div>

            {/* ACTION */}
            <div className="flex justify-center pt-4">
              <Button asChild size="lg" variant="outline">
                <Link to="/my-recipes">Back to My Recipes</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
