// src/pages/admin/UsersPage.tsx
// import AdminLayout from "@/layouts/AdminLayout";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
} from 'lucide-react';

const UsersPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [users, setUsers] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [analytics, setAnalytics] = useState({});
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Mock data - replace with actual API calls
    useEffect(() => {
        // Simulate API calls
        setUsers([
            { id: 1, name: 'John Doe', email: 'john@email.com', status: 'active', joinDate: '2024-01-15', recipesCount: 12 },
            { id: 2, name: 'Jane Smith', email: 'jane@email.com', status: 'active', joinDate: '2024-02-20', recipesCount: 8 },
            { id: 3, name: 'Mike Johnson', email: 'mike@email.com', status: 'banned', joinDate: '2024-01-10', recipesCount: 3 }
        ]);

        setRecipes([
            { id: 1, title: 'Pasta Carbonara', author: 'John Doe', status: 'pending', category: 'Italian', views: 245, rating: 4.5, tags: ['quick', 'italian'] },
            { id: 2, title: 'Vegan Buddha Bowl', author: 'Jane Smith', status: 'approved', category: 'Healthy', views: 189, rating: 4.8, tags: ['vegan', 'healthy'] },
            { id: 3, title: 'Chocolate Cake', author: 'Mike Johnson', status: 'rejected', category: 'Dessert', views: 156, rating: 4.2, tags: ['dessert', 'sweet'] }
        ]);

        setAnalytics({
            totalUsers: 1250,
            totalRecipes: 3450,
            pendingRecipes: 23,
            totalViews: 125000,
            topRecipes: [
                { title: 'Classic Margherita Pizza', views: 2340, rating: 4.9 },
                { title: 'Chicken Tikka Masala', views: 1890, rating: 4.7 },
                { title: 'Caesar Salad', views: 1650, rating: 4.6 }
            ],
            activeUsers: 892
        });

        setCategories([
            { id: 1, name: 'Italian', recipesCount: 145, type: 'cuisine' },
            { id: 2, name: 'Healthy', recipesCount: 203, type: 'diet' },
            { id: 3, name: 'Quick (< 30 min)', recipesCount: 189, type: 'time' },
            { id: 4, name: 'Dessert', recipesCount: 134, type: 'meal' }
        ]);
    }, []);


    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const [usersRes, recipesRes, analyticsRes, categoriesRes] = await Promise.all([
    //                 axios.get('/api/users'),
    //                 axios.get('/api/recipes'),
    //                 axios.get('/api/analytics'),
    //                 axios.get('/api/categories'),
    //             ]);

    //             setUsers(usersRes.data);
    //             setRecipes(recipesRes.data);
    //             setAnalytics(analyticsRes.data);
    //             setCategories(categoriesRes.data);
    //         } catch (error) {
    //             console.error('Error fetching dashboard data:', error);
    //             // Optionally: set error state here
    //         }
    //     };

    //     fetchData();
    // }, []);

    const handleUserAction = (userId, action) => {
        // API call to your Laravel backend
        console.log(`${action} user ${userId}`);
        // Update local state
        setUsers(users.map(user =>
            user.id === userId ? { ...user, status: action === 'ban' ? 'banned' : 'active' } : user
        ));
    };



    return (
        <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Manage Users</h2>
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                            <Filter className="h-4 w-4" />
                            <span>Filter</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Join Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipes</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-medium text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{user.joinDate}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{user.recipesCount}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleUserAction(user.id, 'view')}
                                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleUserAction(user.id, user.status === 'active' ? 'ban' : 'activate')}
                                            className={`p-1 rounded ${user.status === 'active' ? 'text-red-600 hover:bg-red-100' : 'text-green-600 hover:bg-green-100'}`}
                                        >
                                            <Ban className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UsersPage;


