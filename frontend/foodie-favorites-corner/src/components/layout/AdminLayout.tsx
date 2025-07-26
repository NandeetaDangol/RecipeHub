// src/layouts/AdminLayout.tsx
import { ReactNode } from "react";
import AdminSidebar from "@/components/AdminSidebar";

const AdminLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            <main className="flex-1 bg-gray-50 p-6">{children}</main>
        </div>
    );
};

export default AdminLayout;
