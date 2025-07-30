import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Eye } from 'lucide-react';

const RecipePage = () => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const res = await axios.get('/api/recipes');
                setRecipes(res.data); // Make sure this matches your API response structure
            } catch (error) {
                console.error('Failed to fetch recipes:', error);
            }
        };

        fetchRecipes();
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">All Recipes</h2>
            <div className="overflow-x-auto">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Name</th>
                            <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">User</th>
                            <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Category</th>
                            <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Prep Time</th>
                            <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Cook Time</th>
                            <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Servings</th>
                            <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Views</th>
                            <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {recipes.map((recipe) => (
                            <tr key={recipe.id}>
                                <td className="px-4 py-2 font-medium text-gray-900">{recipe.name}</td>
                                <td className="px-4 py-2 text-sm text-gray-500">{recipe.user?.name || '—'}</td>
                                <td className="px-4 py-2 text-sm text-gray-500">{recipe.category?.name || '—'}</td>
                                <td className="px-4 py-2 text-sm text-gray-500">{recipe.preparation_time || '—'}</td>
                                <td className="px-4 py-2 text-sm text-gray-500">{recipe.cooking_time || '—'}</td>
                                <td className="px-4 py-2 text-sm text-gray-500">{recipe.servings || '—'}</td>
                                <td className="px-4 py-2 text-sm text-gray-500">{recipe.view_count}</td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => console.log(`Viewing recipe ${recipe.id}`)}
                                        className="text-blue-600 hover:bg-blue-100 p-1 rounded"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecipePage;
