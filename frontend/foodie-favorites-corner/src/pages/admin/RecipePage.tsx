import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Eye, Pencil, Trash2 } from 'lucide-react';

interface Recipe {
    id: number;
    name: string;
    view_count: number;
    images?: string | null;
}

const RecipePage = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const res = await axios.get('/admin/recipes'); // Adjust URL if needed
                setRecipes(res.data);
            } catch (error) {
                console.error('Failed to fetch recipes:', error);
            }
        };

        fetchRecipes();
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Manage Recipes</h2>
            <div className="overflow-x-auto">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs text-black-700 uppercase">ID</th>
                            <th className="px-4 py-2 text-left text-xs text-black-700 uppercase">Image</th>
                            <th className="px-4 py-2 text-left text-xs text-black-700 uppercase">Name</th>
                            <th className="px-4 py-2 text-left text-xs text-black-700 uppercase">Views</th>
                            <th className="px-4 py-2 text-left text-xs text-black-700 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {recipes.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-gray-500">
                                    No recipes found.
                                </td>
                            </tr>
                        ) : (
                            recipes.map((recipe) => (
                                <tr key={recipe.id}>
                                    <td className="px-4 py-2 text-sm text-gray-700">{recipe.id}</td>
                                    <td className="px-4 py-2">
                                        {recipe.images ? (
                                            <img
                                                src={`http://localhost:8000/storage/recipes/${recipe.images}`}
                                                alt={recipe.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 font-medium text-gray-900">{recipe.name}</td>
                                    <td className="px-4 py-2 text-sm text-gray-500">{recipe.view_count}</td>
                                    <td className="px-4 py-2 flex space-x-2">
                                        {/* View Button */}
                                        <button
                                            onClick={() => console.log(`Viewing recipe ${recipe.id}`)}
                                            className="text-blue-600 hover:bg-blue-100 p-1 rounded flex items-center space-x-1"
                                            title="View"
                                        >
                                            <Eye className="h-4 w-4" />
                                            <span>View</span>
                                        </button>
                                        {/* Edit Button */}
                                        <button
                                            onClick={() => console.log(`Editing recipe ${recipe.id}`)}
                                            className="text-green-600 hover:bg-green-100 p-1 rounded"
                                            title="Edit"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        {/* Delete Button */}
                                        <button
                                            onClick={() => console.log(`Deleting recipe ${recipe.id}`)}
                                            className="text-red-600 hover:bg-red-100 p-1 rounded"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecipePage;
