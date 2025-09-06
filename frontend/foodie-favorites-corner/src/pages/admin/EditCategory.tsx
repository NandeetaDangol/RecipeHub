import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const categoryTypes = ["Cuisine", "Food", "Drink", "Dessert", "Other"];

const EditCategory = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch category details
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await axios.get(`/api/categories/${id}`);
                setName(res.data.name);
                setType(res.data.type);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch category");
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !type) {
            setError("Please fill in all fields");
            return;
        }

        try {
            await axios.put(`/api/categories/${id}`, { name, type });
            navigate("/admin/categories"); // redirect to category list
        } catch (err) {
            console.error(err);
            setError("Failed to update category");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <Card className="max-w-md mx-auto mt-8">
            <CardHeader>
                <CardTitle>Edit Category</CardTitle>
            </CardHeader>
            <CardContent>
                {error && <p className="text-red-600 mb-2">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Category Name</label>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter category name"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Category Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full border px-2 py-1 rounded"
                        >
                            <option value="">Select Type</option>
                            {categoryTypes.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => navigate("/admin/categories")}>
                            Cancel
                        </Button>
                        <Button type="submit">Update Category</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default EditCategory;
