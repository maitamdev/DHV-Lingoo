"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

export default function AdminCoursesPage() {
    const supabase = createClient();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [level, setLevel] = useState("A1");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    async function fetchCourses() {
        setLoading(true);
        const { data, error } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
        if (data) setCourses(data);
        setLoading(false);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        const { error } = await supabase.from("courses").insert([{ title, description, level }]);
        if (!error) {
            setIsAdding(false);
            setTitle("");
            setDescription("");
            setLevel("A1");
            fetchCourses();
        } else {
            alert("Lỗi thêm khóa học: " + error.message);
        }
        setIsSubmitting(false);
    }

    async function handleDelete(id: string) {
        if (confirm("Bạn có chắc muốn xóa khóa học này? LƯU Ý: Tất cả bài học trong khóa này cũng sẽ bị xóa!")) {
            const { error } = await supabase.from("courses").delete().eq("id", id);
            if (!error) fetchCourses();
            else alert("Lỗi xóa: " + error.message);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mx-auto max-w-5xl">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900">Quản lý Khóa Học</h1>
                    <p className="text-slate-500 mt-1">Thêm mới và chỉnh sửa các môn học lớn.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
                >
                    {isAdding ? "Hủy" : <><Plus className="w-5 h-5" /> Thêm Khóa học</>}
                </button>
            </div>

            <div className="max-w-5xl mx-auto">
                {isAdding && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
                        <h2 className="text-xl font-bold mb-4">Thêm Khóa học mới</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Tên Khóa học</label>
                                <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded-lg p-2" placeholder="Ví dụ: Tiếng Anh Giao Tiếp Cơ Bản" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Mô tả</label>
                                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded-lg p-2" placeholder="Mô tả ngắn về khóa học..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Cấp độ (Level)</label>
                                <select value={level} onChange={e => setLevel(e.target.value)} className="w-full border rounded-lg p-2">
                                    <option value="A1">A1 - Vỡ lòng</option>
                                    <option value="A2">A2 - Sơ cấp</option>
                                    <option value="B1">B1 - Trung cấp</option>
                                    <option value="B2">B2 - Trung cấp cao</option>
                                    <option value="C1">C1 - Cao cấp</option>
                                    <option value="C2">C2 - Thành thạo</option>
                                </select>
                            </div>
                            <button type="submit" disabled={isSubmitting} className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50">
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Lưu Thay Đổi"}
                            </button>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
                ) : courses.length === 0 ? (
                    <div className="text-center p-12 bg-white rounded-xl border border-slate-200">
                        <p className="text-slate-500">Chưa có khóa học nào.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 font-medium text-slate-600">Khóa học</th>
                                    <th className="p-4 font-medium text-slate-600">Level</th>
                                    <th className="p-4 font-medium text-slate-600 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map(course => (
                                    <tr key={course.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                        <td className="p-4">
                                            <p className="font-bold text-slate-900">{course.title}</p>
                                            <p className="text-sm text-slate-500 line-clamp-1">{course.description}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                {course.level}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button onClick={() => handleDelete(course.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
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
