"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Volume2, CheckCircle, BookOpen, MessageSquare, Star, RotateCcw } from "lucide-react";

interface Vocabulary { id: string; word: string; phonetic: string; meaning: string; example: string; }
interface DialogueLine { character: string; text: string; }
interface Dialogue { id: string; title: string; content: DialogueLine[]; }
interface Quiz { id: string; question: string; options: string[]; correct_answer: string; }
interface Video { id: string; url: string; title: string; }

export default function LessonViewerPage() {
    const params = useParams();
    const router = useRouter();
    const supabase = createClient();

    const [lesson, setLesson] = useState<any>(null);
    const [videos, setVideos] = useState<Video[]>([]);
    const [vocabs, setVocabs] = useState<Vocabulary[]>([]);
    const [dialogues, setDialogues] = useState<Dialogue[]>([]);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);

    // Quiz state
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (params.id) fetchLessonData(params.id as string);
    }, [params.id]);

    async function fetchLessonData(id: string) {
        setLoading(true);
        const [lessonRes, videosRes, vocabsRes, dialoguesRes, quizzesRes] = await Promise.all([
            supabase.from("lessons").select("*, courses(title, level)").eq("id", id).single(),
            supabase.from("lesson_videos").select("*").eq("lesson_id", id).order("order_index"),
            supabase.from("lesson_vocabularies").select("*").eq("lesson_id", id),
            supabase.from("lesson_dialogues").select("*").eq("lesson_id", id).order("order_index"),
            supabase.from("lesson_quizzes").select("*").eq("lesson_id", id).order("order_index"),
        ]);

        if (lessonRes.data) setLesson(lessonRes.data);
        if (videosRes.data) setVideos(videosRes.data);
        if (vocabsRes.data) setVocabs(vocabsRes.data);
        if (dialoguesRes.data) setDialogues(dialoguesRes.data);
        if (quizzesRes.data) setQuizzes(quizzesRes.data);
        setLoading(false);
    }

    function handleAnswer(quizId: string, answer: string) {
        if (!quizSubmitted) {
            setSelectedAnswers(prev => ({ ...prev, [quizId]: answer }));
        }
    }

    function handleSubmitQuiz() {
        let correct = 0;
        quizzes.forEach(q => {
            if (selectedAnswers[q.id] === q.correct_answer) correct++;
        });
        setScore(correct);
        setQuizSubmitted(true);
    }

    function handleResetQuiz() {
        setSelectedAnswers({});
        setQuizSubmitted(false);
        setScore(0);
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500">Đang tải bài học...</p>
            </div>
        </div>
    );

    if (!lesson) return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-slate-500">Không tìm thấy bài học.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
            {/* Top Bar */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200 px-6 py-3 flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 transition">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <div className="flex-1">
                    <p className="text-xs font-medium text-indigo-600">{lesson.courses?.title}</p>
                    <h1 className="text-sm font-bold text-slate-900 line-clamp-1">{lesson.title}</h1>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full text-sm font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    +{lesson.xp_reward} XP
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">

                {/* Lesson Title */}
                <div className="text-center pb-4">
                    <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold mb-3">
                        {lesson.courses?.level} • Bài {lesson.order_index}
                    </span>
                    <h2 className="text-3xl font-heading font-bold text-slate-900">{lesson.title}</h2>
                    <p className="text-slate-500 mt-2">{lesson.description}</p>
                </div>

                {/* SECTION 1: Videos */}
                {videos.length > 0 && (
                    <section>
                        <SectionHeader icon="🎬" label="Nghe & Xem" />
                        <div className="space-y-4">
                            {videos.map(video => (
                                <div key={video.id} className="rounded-2xl overflow-hidden shadow-md aspect-video">
                                    <iframe
                                        src={video.url}
                                        title={video.title}
                                        className="w-full h-full"
                                        allowFullScreen
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* SECTION 2: Vocabulary */}
                {vocabs.length > 0 && (
                    <section>
                        <SectionHeader icon="📖" label="Từ Vựng Bài Học" />
                        <div className="grid gap-3">
                            {vocabs.map(vocab => (
                                <div key={vocab.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-4 hover:border-indigo-300 transition shadow-sm">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-xl font-bold text-indigo-600">{vocab.word}</span>
                                            <span className="text-sm text-slate-400 font-mono">{vocab.phonetic}</span>
                                        </div>
                                        <p className="text-slate-700 font-medium">{vocab.meaning}</p>
                                        {vocab.example && (
                                            <p className="text-sm text-slate-500 italic mt-1">"{vocab.example}"</p>
                                        )}
                                    </div>
                                    <button className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition">
                                        <Volume2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* SECTION 3: Dialogues */}
                {dialogues.length > 0 && (
                    <section>
                        <SectionHeader icon="💬" label="Hội Thoại Mẫu" />
                        {dialogues.map(dialogue => (
                            <div key={dialogue.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
                                    <p className="font-bold text-slate-700 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-indigo-500" />
                                        {dialogue.title}
                                    </p>
                                </div>
                                <div className="p-5 space-y-3">
                                    {(dialogue.content as DialogueLine[]).map((line, i) => {
                                        const isLeft = i % 2 === 0;
                                        return (
                                            <div key={i} className={`flex gap-3 ${isLeft ? "" : "flex-row-reverse"}`}>
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                                                    style={{ background: isLeft ? "#e0e7ff" : "#dcfce7", color: isLeft ? "#4f46e5" : "#166534" }}>
                                                    {line.character?.[0]}
                                                </div>
                                                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${isLeft ? "bg-indigo-50 text-slate-800 rounded-tl-none" : "bg-emerald-50 text-slate-800 rounded-tr-none"}`}>
                                                    <p className="font-bold text-xs mb-1" style={{ color: isLeft ? "#4338ca" : "#15803d" }}>{line.character}</p>
                                                    {line.text}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                {/* SECTION 4: Mini Quiz */}
                {quizzes.length > 0 && (
                    <section>
                        <SectionHeader icon="📝" label="Kiểm Tra Nhanh" />
                        <div className="space-y-4">
                            {quizzes.map((quiz, qi) => {
                                const selected = selectedAnswers[quiz.id];
                                const isCorrect = selected === quiz.correct_answer;
                                return (
                                    <div key={quiz.id} className={`bg-white rounded-2xl border shadow-sm p-5 transition ${quizSubmitted ? (isCorrect ? "border-emerald-400" : "border-red-400") : "border-slate-200"}`}>
                                        <p className="font-bold text-slate-900 mb-4">{qi + 1}. {quiz.question}</p>
                                        <div className="space-y-2">
                                            {(quiz.options as string[]).map((opt, oi) => {
                                                const isSelected = selected === opt;
                                                const isCorrectOpt = opt === quiz.correct_answer;
                                                let cls = "w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition";
                                                if (quizSubmitted) {
                                                    if (isCorrectOpt) cls += " bg-emerald-50 border-emerald-400 text-emerald-800";
                                                    else if (isSelected && !isCorrectOpt) cls += " bg-red-50 border-red-400 text-red-800";
                                                    else cls += " border-slate-200 text-slate-500";
                                                } else {
                                                    cls += isSelected ? " bg-indigo-600 border-indigo-600 text-white" : " border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50";
                                                }
                                                return (
                                                    <button key={oi} className={cls} onClick={() => handleAnswer(quiz.id, opt)}>
                                                        {String.fromCharCode(65 + oi)}. {opt}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Quiz Actions */}
                        {!quizSubmitted ? (
                            <button
                                onClick={handleSubmitQuiz}
                                disabled={Object.keys(selectedAnswers).length < quizzes.length}
                                className="mt-4 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold disabled:opacity-50 hover:bg-indigo-700 transition"
                            >
                                Nộp Bài Kiểm Tra
                            </button>
                        ) : (
                            <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-5 text-center">
                                <p className="text-2xl font-heading font-bold text-slate-900 mb-1">
                                    {score === quizzes.length ? "🎉 Xuất sắc!" : score >= quizzes.length / 2 ? "👍 Tốt lắm!" : "💪 Cần ôn thêm!"}
                                </p>
                                <p className="text-slate-500 mb-4">{score}/{quizzes.length} câu đúng</p>
                                <button onClick={handleResetQuiz} className="flex items-center gap-2 mx-auto text-sm text-indigo-600 hover:underline">
                                    <RotateCcw className="w-4 h-4" /> Làm lại
                                </button>
                            </div>
                        )}
                    </section>
                )}

                {/* Complete Button */}
                <div className="pb-6">
                    <button className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                        <CheckCircle className="w-6 h-6" />
                        Hoàn Thành & Nhận {lesson.xp_reward} XP
                    </button>
                </div>
            </div>
        </div>
    );
}

function SectionHeader({ icon, label }: { icon: string; label: string }) {
    return (
        <h3 className="text-xl font-heading font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span>{icon}</span> {label}
        </h3>
    );
}
