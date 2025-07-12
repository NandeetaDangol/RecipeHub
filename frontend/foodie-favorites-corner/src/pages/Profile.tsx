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
  Eye,
} from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-r from-sky-50 to-slate-100 py-10">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* ---------- COMBINED CARD ---------- */}
        <Card className="rounded-2xl shadow-md">
          {/* --- PROFILE HEADER --- */}
          <CardHeader className="flex flex-col items-center text-center pb-0">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.name
              )}&background=random`}
              alt="avatar"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md mb-4"
            />
            <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
          </CardHeader>

          {/* --- PROFILE DETAILS --- */}
          <CardContent className="space-y-6 py-6">
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
          </CardContent>

          {/* --- DIVIDER --- */}
          <hr className="border-t border-gray-200" />

          {/* --- RECENTLY VIEWED HEADER --- */}
          <CardHeader className="flex items-center gap-2 pt-6 pb-0">
            <Eye className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Recently Viewed Recipes</CardTitle>
          </CardHeader>

          {/* --- RECENTLY VIEWED LIST --- */}
          <CardContent className="pb-8 pt-4">
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                You haven’t viewed any recipes yet.
              </p>
            ) : (
              <ul className="divide-y">
                {history.map((r) => (
                  <li
                    key={r.id}
                    className="py-3 flex justify-between items-center"
                  >
                    <Link
                      to={`/viewrecipe/${r.id}`}
                      className="font-medium hover:underline"
                    >
                      {r.name}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.pivot.viewed_at).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
