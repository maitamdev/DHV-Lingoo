"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Loader2, BookOpen } from "lucide-react";

export default function AdminLessonsPage() {
    const supabase = createClient();
    const [lessons, setLessons] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [courseId, setCourseId] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [topics, setTopics] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    async function fetchInitialData() {
        setLoading(true);
        // Lấy danh sách khóa học (dùng cho Dropdown thả xuống)
        const { data: cData } = await supabase.from("courses").select("id, title").order("created_at", { ascending: false });
        if (cData) {
            setCourses(cData);
            if (cData.length > 0) setCourseId(cData[0].id);
        }

        // Lấy danh sách lesson (Kèm tên khóa học liên kết)
        fetchLessons();
    }

    async function fetchLessons() {
        setLoading(true);
        const { data, error } = await supabase
            .from("lessons")
            .select("*, courses(title)")
            .order("created_at", { ascending: false });
        if (data) setLessons(data);
        setLoading(false);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        // Biến topics text (comma separated) thành mảng
        const topicsArray = topics.split(",").map(t => t.trim()).filter(Boolean);

        const { error } = await supabase.from("lessons").insert([{
            title,
            course_id: courseId,
            description,
            content,
            topics: topicsArray
        }]);

        if (!error) {
            setIsAdding(false);
            setTitle("");
            setDescription("");
            setContent("");
            setTopics("");
            fetchLessons();
        } else {
            alert("Lỗi thêm bài học: " + error.message);
        }
        setIsSubmitting(false);
    }

    async function handleDelete(id: string) {
        if (confirm("Bạn có chắc muốn xóa bài học này?")) {
            const { error } = await supabase.from("lessons").delete().eq("id", id);
            if (!error) fetchLessons();
            else alert("Lỗi xóa: " + error.message);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mx-auto max-w-5xl">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900">Quản lý Bài Học</h1>
                    <p className="text-slate-500 mt-1">Biên soạn nội dung bài giảng chi tiết.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition"
                >
                    {isAdding ? "Hủy" : <><Plus className="w-5 h-5" /> Thêm Bài học</>}
                </button>
            </div>

            <div className="max-w-5xl mx-auto">
                {isAdding && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
                        <h2 className="text-xl font-bold mb-4">Thêm Bài học mới</h2>
                        {courses.length === 0 ? (
                            <div className="p-4 bg-orange-50 text-orange-800 rounded-lg">
                                Bạn phải tạo Khóa học trước khi có thể thêm Bài học. Vui lòng sang tab <strong>Khóa học</strong>.
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Tên Bài học *</label>
                                        <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded-lg p-2" placeholder="Ví dụ: Bài 1 - Bảng chữ cái" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Thuộc Khóa học *</label>
                                        <select required value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full border rounded-lg p-2 bg-white">
                                            {courses.map(c => (
                                                <option key={c.id} value={c.id}>{c.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Mô tả ngắn</label>
                                    <input value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded-lg p-2" placeholder="Tóm tắt bài học..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Chủ đề (Cách nhau bằng dấu phẩy)</label>
                                    <input value={topics} onChange={e => setTopics(e.target.value)} className="w-full border rounded-lg p-2" placeholder="Ngữ pháp, Từ vựng..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Nội dung chi tiết (Có thể lưu Format Text)</label>
                                    <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full border rounded-lg p-2 h-40" placeholder="Viết nội dung bài giảng ở đây..." />
                                </div>

                                <button type="submit" disabled={isSubmitting} className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50">
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Lưu Bài Học"}
                                </button>
                            </form>
                        )}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
                ) : lessons.length === 0 ? (
                    <div className="text-center p-12 bg-white rounded-xl border border-slate-200">
                        <p className="text-slate-500">Chưa có bài học nào.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 font-medium text-slate-600">Bài học</th>
                                    <th className="p-4 font-medium text-slate-600">Khóa học</th>
                                    <th className="p-4 font-medium text-slate-600 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lessons.map(lesson => (
                                    <tr key={lesson.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                        <td className="p-4">
                                            <p className="font-bold text-slate-900">{lesson.title}</p>
                                            <p className="text-sm text-slate-500">{lesson.topics?.join(", ")}</p>
                                        </td>
                                        <td className="p-4 text-slate-600 flex items-center gap-2 mt-2">
                                            <BookOpen className="w-4 h-4 text-slate-400" />
                                            {lesson.courses?.title || "Không rõ"}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button onClick={() => handleDelete(lesson.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
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
