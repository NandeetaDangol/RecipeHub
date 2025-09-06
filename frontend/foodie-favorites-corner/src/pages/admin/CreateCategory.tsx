// src/pages/admin/CreateCategory.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const categoryTypes = ["Cuisine", "Food", "Drink", "Dessert", "Other"]; // predefined types

const CreateCategory = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");   // for error messages
    const [success, setSuccess] = useState(""); // for success message

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!name || !type) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);

        try {
            await axios.post("/api/categories", { name, type });
            setSuccess("Category created successfully!");
            setName("");
            setType("");
            // Optional: navigate("/admin/categories"); // redirect if you want
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-md mx-auto mt-8">
            <CardHeader>
                <CardTitle>Create New Category</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-600">{error}</p>}
                    {success && <p className="text-green-600">{success}</p>}

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
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category type" />
                            </SelectTrigger>
                            <SelectContent>
                                {categoryTypes.map((t) => (
                                    <SelectItem key={t} value={t}>
                                        {t}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => navigate("/admin/categories")}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Category"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CreateCategory;
