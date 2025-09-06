import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface Category {
    id: number;
    name: string;
    type: string;
    created_at: string;
    updated_at: string;
}

const CategoryPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCategories = async () => {
        try {
            const res = await axios.get("/api/categories");
            setCategories(res.data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            await axios.delete(`/api/categories/${id}`);
            // Remove deleted category from state
            setCategories(categories.filter((cat) => cat.id !== id));
        } catch (error) {
            console.error("Failed to delete category", error);
            alert("Failed to delete category. Please try again.");
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Manage Categories</CardTitle>
                <Button
                    variant="default"
                    className="flex items-center gap-2"
                    onClick={() => navigate("/admin/categories/create")}
                >
                    <Plus className="w-4 h-4" />
                    Add Category
                </Button>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto text-left border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 border">ID</th>
                                    <th className="px-4 py-2 border">Name</th>
                                    <th className="px-4 py-2 border">Type</th>
                                    <th className="px-4 py-2 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border">{category.id}</td>
                                        <td className="px-4 py-2 border">{category.name}</td>
                                        <td className="px-4 py-2 border">{category.type}</td>
                                        <td className="px-4 py-2 border space-x-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => navigate(`/admin/categories/edit/${category.id}`)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(category.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default CategoryPage;
