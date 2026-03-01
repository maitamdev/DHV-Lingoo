"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, User } from "lucide-react";

export default function AdminUsersPage() {
    const supabase = createClient();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        setLoading(true);
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false });
        if (data) setUsers(data);
        setLoading(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mx-auto max-w-5xl">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900">Quản lý Người Dùng</h1>
                    <p className="text-slate-500 mt-1">Danh sách học viên trên hệ thống.</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto">
                {loading ? (
                    <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
                ) : users.length === 0 ? (
                    <div className="text-center p-12 bg-white rounded-xl border border-slate-200">
                        <p className="text-slate-500">Chưa có người dùng nào.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 font-medium text-slate-600">Học viên</th>
                                    <th className="p-4 font-medium text-slate-600">Trình độ</th>
                                    <th className="p-4 font-medium text-slate-600">Vai trò</th>
                                    <th className="p-4 font-medium text-slate-600">Ngày gia nhập</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                                    {user.avatar_url ? (
                                                        <img src={user.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                                                    ) : (
                                                        <User className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{user.full_name}</p>
                                                    <p className="text-sm text-slate-500">ID: {user.id.substring(0, 8)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {user.level || "Chưa làm test"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {user.role === 'admin' ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                    Admin
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                                    Học viên
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-slate-500">
                                            {new Date(user.created_at).toLocaleDateString("vi-VN")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
