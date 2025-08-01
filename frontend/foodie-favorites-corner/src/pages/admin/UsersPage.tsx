// src/pages/admin/UsersPage.tsx
import { useEffect, useState } from "react";
import {
    Eye,
    Search,
    Filter,
    Edit,
    Trash2,
    UserPlus,
    MoreVertical,
    Shield,
    ShieldOff,
    Mail,
    Calendar,
    Users,
    ChevronDown,
    X,
} from "lucide-react";

interface User {
    id: number;
    name: string;
    email: string;
    status: string;
    created_at: string;
    recipes_count: number;
}

interface UsersPageProps {
    users: User[];
}

const UsersPage = ({ users }: UsersPageProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    console.log(users);

    useEffect(() => {
        const filtered = users.filter((user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">User Management</h2>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email"
                        className="pl-8 pr-4 py-2 border rounded-md text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 text-left text-sm font-semibold">
                            <th className="px-4 py-2 border-b">Id</th>
                            <th className="px-4 py-2 border-b">Name</th>
                            <th className="px-4 py-2 border-b">Email</th>
                            {/* <th className="px-4 py-2 border-b">Status</th> */}
                            {/* <th className="px-4 py-2 border-b">Recipes</th> */}
                            {/* <th className="px-4 py-2 border-b">Joined</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-4 text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user, index) => (
                                <tr key={user.id} className="text-sm border-t hover:bg-gray-50">
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2 font-medium">{user.name}</td>
                                    <td className="px-4 py-2">{user.email}</td>
                                    {/* <td className="px-4 py-2 capitalize">
                                        {user.status === "active" ? (
                                            <span className="text-green-600 font-semibold">Active</span>
                                        ) : (
                                            <span className="text-red-600 font-semibold">Inactive</span>
                                        )}
                                    </td> */}
                                    {/* <td className="px-4 py-2">{user.recipes_count}</td> */}
                                    {/* <td className="px-4 py-2"> */}
                                    {/* {new Date(user.created_at).toLocaleDateString()} */}
                                    {/* </td> */}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersPage;
