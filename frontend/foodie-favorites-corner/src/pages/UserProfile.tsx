import { useEffect, useState } from "react";
import axios from "axios";

const UserProfile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:8000/api/user", {
            withCredentials: true,
        })
            .then(res => setUser(res.data))
            .catch(err => console.error(err));
    }, []);

    if (!user) return <p>Loading profile...</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-2">User Profile</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
        </div>
    );
};

export default UserProfile;
