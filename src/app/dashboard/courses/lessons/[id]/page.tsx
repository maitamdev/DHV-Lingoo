"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Volume2, CheckCircle, Star, RotateCcw, Play, BookOpen, Headphones, Mic, PenTool, ClipboardCheck, Home } from "lucide-react";

interface Vocabulary { id: string; word: string; phonetic: string; meaning: string; example: string; }
interface DialogueLine { character: string; text: string; }
interface Dialogue { id: string; title: string; content: DialogueLine[]; }
interface Quiz { id: string; question: string; options: string[]; correct_answer: string; }
interface Video { id: string; url: string; title: string; }
interface Exercise { id: string; type: string; title: string; instruction: string; content: any; }
interface Section { id: string; type: string; title: string; content: any; }

const TABS = [
    { id: "video", icon: Play, label: "Video" },
    { id: "summary", icon: BookOpen, label: "Kiến thức" },
    { id: "vocab", icon: BookOpen, label: "Từ vựng" },
    { id: "dialogue", icon: Volume2, label: "Hội thoại" },
    { id: "listening", icon: Headphones, label: "Listening" },
    { id: "speaking", icon: Mic, label: "Speaking" },
    { id: "practice", icon: PenTool, label: "Practice" },
    { id: "quiz", icon: ClipboardCheck, label: "Quiz" },
    { id: "homework", icon: Home, label: "Homework" },
];

export default function LessonViewerPage() {
    const params = useParams();
    const router = useRouter();
    const supabase = createClient();

    const [lesson, setLesson] = useState<any>(null);
    const [videos, setVideos] = useState<Video[]>([]);
    const [vocabs, setVocabs] = useState<Vocabulary[]>([]);
    const [dialogues, setDialogues] = useState<Dialogue[]>([]);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("video");

    // Quiz state
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (params.id) fetchLessonData(params.id as string);
    }, [params.id]);

    async function fetchLessonData(id: string) {
        setLoading(true);
        const [lessonRes, videosRes, vocabsRes, dialoguesRes, quizzesRes, exercisesRes, sectionsRes] = await Promise.all([
            supabase.from("lessons").select("*, courses(title, level)").eq("id", id).single(),
            supabase.from("lesson_videos").select("*").eq("lesson_id", id).order("order_index"),
            supabase.from("lesson_vocabularies").select("*").eq("lesson_id", id),
            supabase.from("lesson_dialogues").select("*").eq("lesson_id", id).order("order_index"),
            supabase.from("lesson_quizzes").select("*").eq("lesson_id", id).order("order_index"),
            supabase.from("lesson_exercises").select("*").eq("lesson_id", id).order("order_index"),
            supabase.from("lesson_sections").select("*").eq("lesson_id", id).order("order_index"),
        ]);

        if (lessonRes.data) setLesson(lessonRes.data);
        if (videosRes.data) setVideos(videosRes.data);
        if (vocabsRes.data) setVocabs(vocabsRes.data);
        if (dialoguesRes.data) setDialogues(dialoguesRes.data);
        if (quizzesRes.data) setQuizzes(quizzesRes.data);
        if (exercisesRes.data) setExercises(exercisesRes.data);
        if (sectionsRes.data) setSections(sectionsRes.data);
        setLoading(false);
    }

    const summaries = sections.filter(s => s.type === "summary");
    const homeworks = sections.filter(s => s.type === "homework");
    const listeningExercises = exercises.filter(e => e.type === "listening");
    const speakingExercises = exercises.filter(e => e.type === "speaking");
    const practiceExercises = exercises.filter(e => e.type === "practice");

    // Filter tabs to only show those with data
    const availableTabs = TABS.filter(tab => {
        if (tab.id === "video") return videos.length > 0;
        if (tab.id === "summary") return summaries.length > 0;
        if (tab.id === "vocab") return vocabs.length > 0;
        if (tab.id === "dialogue") return dialogues.length > 0;
        if (tab.id === "listening") return listeningExercises.length > 0;
        if (tab.id === "speaking") return speakingExercises.length > 0;
        if (tab.id === "practice") return practiceExercises.length > 0;
        if (tab.id === "quiz") return quizzes.length > 0;
        if (tab.id === "homework") return homeworks.length > 0;
        return false;
    });

    function handleAnswer(quizId: string, answer: string) {
        if (!quizSubmitted) setSelectedAnswers(prev => ({ ...prev, [quizId]: answer }));
    }
    function handleSubmitQuiz() {
        let correct = 0;
        quizzes.forEach(q => { if (selectedAnswers[q.id] === q.correct_answer) correct++; });
        setScore(correct);
        setQuizSubmitted(true);
    }
    function handleResetQuiz() { setSelectedAnswers({}); setQuizSubmitted(false); setScore(0); }

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Đang tải bài học...</p>
            </div>
        </div>
    );

    if (!lesson) return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-500">Không tìm thấy bài học.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sticky Top Bar */}
            <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto flex items-center gap-4 py-3">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 transition">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-indigo-600">{lesson.courses?.level} • {lesson.courses?.title}</p>
                        <h1 className="text-sm font-bold text-gray-900 truncate">{lesson.title}</h1>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1.5 text-sm font-bold flex-shrink-0">
                        <Star className="w-4 h-4 fill-amber-400" /> +{lesson.xp_reward} XP
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="max-w-4xl mx-auto -mb-px overflow-x-auto scrollbar-hide">
                    <div className="flex gap-0 min-w-max">
                        {availableTabs.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${isActive
                                            ? "border-indigo-600 text-indigo-600"
                                            : "border-transparent text-gray-400 hover:text-gray-600"
                                        }`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </header>

            {/* Content Area */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

                {/* ===== VIDEO ===== */}
                {activeTab === "video" && (
                    <div className="space-y-6">
                        <SectionTitle emoji="🎬" title="Video bài học" subtitle="Xem video để làm quen với nội dung bài học" />
                        {videos.map(video => (
                            <div key={video.id}>
                                <div className="aspect-video overflow-hidden shadow-lg border border-gray-200 bg-black">
                                    <iframe src={video.url} title={video.title} className="w-full h-full" allowFullScreen />
                                </div>
                                <p className="text-sm text-gray-500 mt-2 font-medium">{video.title}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* ===== SUMMARY ===== */}
                {activeTab === "summary" && (
                    <div className="space-y-6">
                        <SectionTitle emoji="📚" title="Tóm tắt kiến thức" subtitle="Những điều cần nhớ trong bài học này" />
                        {summaries.map(section => (
                            <div key={section.id} className="bg-white border border-gray-200 overflow-hidden">
                                <div className="px-6 py-4 bg-indigo-50 border-b border-indigo-100">
                                    <h3 className="font-bold text-indigo-900">{section.title}</h3>
                                    <p className="text-sm text-indigo-600 mt-1">{section.content?.description}</p>
                                </div>
                                <div className="p-6">
                                    {/* Alphabet table */}
                                    {section.content?.alphabet && (
                                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                                            {section.content.alphabet.map((item: any) => (
                                                <div key={item.letter} className={`text-center p-3 border transition hover:shadow-md hover:-translate-y-0.5 ${["A", "E", "I", "O", "U"].includes(item.letter) ? "bg-amber-50 border-amber-200" : "bg-white border-gray-200"
                                                    }`}>
                                                    <span className="text-2xl font-bold text-gray-900">{item.letter}</span>
                                                    <p className="text-[10px] text-gray-400 font-mono mt-1">{item.phonetic}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {/* Confusing pairs */}
                                    {section.content?.confusing_pairs && (
                                        <div className="space-y-3 mt-2">
                                            {section.content.confusing_pairs.map((pair: any, i: number) => (
                                                <div key={i} className="flex items-start gap-3 bg-red-50 border border-red-100 p-4">
                                                    <span className="text-red-500 font-bold text-lg flex-shrink-0">⚠️</span>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm">{pair.pair}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5">💡 {pair.tip}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ===== VOCABULARY ===== */}
                {activeTab === "vocab" && (
                    <div className="space-y-4">
                        <SectionTitle emoji="📖" title="Từ vựng trọng tâm" subtitle={`${vocabs.length} từ cần nhớ trong bài học này`} />
                        <div className="grid gap-3 sm:grid-cols-2">
                            {vocabs.map(vocab => (
                                <div key={vocab.id} className="bg-white border border-gray-200 p-4 hover:border-indigo-300 hover:shadow-md transition-all group">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-lg font-bold text-indigo-600">{vocab.word}</span>
                                        <button className="p-1.5 text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 transition">
                                            <Volume2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-400 font-mono mb-1">{vocab.phonetic}</p>
                                    <p className="text-sm font-medium text-gray-800">{vocab.meaning}</p>
                                    {vocab.example && (
                                        <p className="text-xs text-gray-400 italic mt-2 pt-2 border-t border-gray-50">"{vocab.example}"</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ===== DIALOGUE ===== */}
                {activeTab === "dialogue" && (
                    <div className="space-y-6">
                        <SectionTitle emoji="💬" title="Hội thoại mẫu" subtitle="Đọc và luyện theo hội thoại thực tế" />
                        {dialogues.map(dialogue => (
                            <div key={dialogue.id} className="bg-white border border-gray-200 overflow-hidden">
                                <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                                    <p className="font-bold text-sm text-gray-700">{dialogue.title}</p>
                                </div>
                                <div className="p-5 space-y-3">
                                    {(dialogue.content as DialogueLine[]).map((line, i) => {
                                        const colors = [
                                            { bg: "bg-indigo-500", bubble: "bg-indigo-50", text: "text-indigo-700" },
                                            { bg: "bg-emerald-500", bubble: "bg-emerald-50", text: "text-emerald-700" },
                                            { bg: "bg-violet-500", bubble: "bg-violet-50", text: "text-violet-700" },
                                            { bg: "bg-amber-500", bubble: "bg-amber-50", text: "text-amber-700" },
                                        ];
                                        const color = colors[i % colors.length];
                                        return (
                                            <div key={i} className="flex items-start gap-3">
                                                <div className={`w-8 h-8 ${color.bg} text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                                                    {line.character?.[0]}
                                                </div>
                                                <div>
                                                    <p className={`text-xs font-bold ${color.text} mb-0.5`}>{line.character}</p>
                                                    <div className={`${color.bubble} px-4 py-2.5 text-sm text-gray-800 inline-block`}>
                                                        {line.text}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ===== LISTENING ===== */}
                {activeTab === "listening" && (
                    <div className="space-y-6">
                        <SectionTitle emoji="🎧" title="Luyện nghe" subtitle="Rèn luyện kỹ năng nghe phát âm" />
                        {listeningExercises.map(ex => (
                            <div key={ex.id} className="bg-white border border-gray-200 overflow-hidden">
                                <div className="px-5 py-4 bg-cyan-50 border-b border-cyan-100">
                                    <h4 className="font-bold text-cyan-900">{ex.title}</h4>
                                    <p className="text-sm text-cyan-600 mt-1">{ex.instruction}</p>
                                </div>
                                <div className="p-5 space-y-3">
                                    {ex.content?.exercises?.map((item: any, i: number) => (
                                        <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100">
                                            <div className="w-10 h-10 bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold flex-shrink-0">
                                                {i + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-mono text-gray-500 mb-2">
                                                    🔊 {item.audio_hint || item.spelled_letters?.join(" - ")}
                                                </p>
                                                {item.options && (
                                                    <div className="flex gap-2 flex-wrap">
                                                        {item.options.map((opt: string, oi: number) => (
                                                            <button key={oi} className="px-4 py-2 border border-gray-200 bg-white text-sm font-medium hover:border-cyan-400 hover:bg-cyan-50 transition">
                                                                {opt}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                                {item.answer && !item.options && (
                                                    <input type="text" placeholder="Gõ đáp án..." className="w-full px-4 py-2 border border-gray-200 text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-50 outline-none" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ===== SPEAKING ===== */}
                {activeTab === "speaking" && (
                    <div className="space-y-6">
                        <SectionTitle emoji="🎤" title="Luyện nói" subtitle="Ghi âm và luyện phát âm của bạn" />
                        {speakingExercises.map(ex => (
                            <div key={ex.id} className="bg-white border border-gray-200 overflow-hidden">
                                <div className="px-5 py-4 bg-violet-50 border-b border-violet-100">
                                    <h4 className="font-bold text-violet-900">{ex.title}</h4>
                                    <p className="text-sm text-violet-600 mt-1">{ex.instruction}</p>
                                </div>
                                <div className="p-5 space-y-4">
                                    {ex.content?.prompts?.map((prompt: any, i: number) => (
                                        <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100">
                                            <button className="w-14 h-14 bg-violet-100 hover:bg-violet-600 hover:text-white text-violet-600 flex items-center justify-center transition-all flex-shrink-0 group">
                                                <Mic className="w-6 h-6" />
                                            </button>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{prompt.task}</p>
                                                {prompt.example && (
                                                    <p className="text-xs text-gray-400 mt-1">Ví dụ: {prompt.example}</p>
                                                )}
                                                {prompt.phonetic && (
                                                    <p className="text-xs text-violet-500 font-mono mt-1">{prompt.phonetic}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ===== PRACTICE ===== */}
                {activeTab === "practice" && (
                    <div className="space-y-6">
                        <SectionTitle emoji="✏️" title="Bài tập thực hành" subtitle="Luyện tập để ghi nhớ lâu hơn" />
                        {practiceExercises.map(ex => (
                            <div key={ex.id} className="bg-white border border-gray-200 overflow-hidden">
                                <div className="px-5 py-4 bg-emerald-50 border-b border-emerald-100">
                                    <h4 className="font-bold text-emerald-900">{ex.title}</h4>
                                    <p className="text-sm text-emerald-600 mt-1">{ex.instruction}</p>
                                </div>
                                <div className="p-5">
                                    {/* Matching */}
                                    {ex.content?.type === "matching" && (
                                        <div className="grid grid-cols-2 gap-3">
                                            {ex.content.pairs?.map((pair: any, i: number) => (
                                                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100">
                                                    <span className="w-10 h-10 bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">{pair.left}</span>
                                                    <span className="text-gray-300">→</span>
                                                    <span className="w-10 h-10 bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg border border-dashed border-blue-200">{pair.right}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {/* Fill Blank */}
                                    {ex.content?.type === "fill_blank" && (
                                        <div className="space-y-3">
                                            {ex.content.exercises?.map((item: any, i: number) => (
                                                <div key={i} className="flex items-center gap-2 p-4 bg-gray-50 border border-gray-100 text-center">
                                                    {item.sequence.map((ch: string, ci: number) => (
                                                        <span key={ci} className={`w-10 h-10 flex items-center justify-center font-bold text-lg ${ch === "___" ? "bg-amber-100 border-2 border-dashed border-amber-300 text-amber-600" : "bg-white border border-gray-200 text-gray-800"
                                                            }`}>
                                                            {ch === "___" ? "?" : ch}
                                                        </span>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {/* Unscramble */}
                                    {ex.content?.type === "unscramble" && (
                                        <div className="space-y-4">
                                            {ex.content.exercises?.map((item: any, i: number) => (
                                                <div key={i} className="p-4 bg-gray-50 border border-gray-100">
                                                    <p className="text-xs text-gray-400 mb-3">Sắp xếp lại:</p>
                                                    <div className="flex gap-2 flex-wrap">
                                                        {item.scrambled.map((ch: string, ci: number) => (
                                                            <button key={ci} className="w-12 h-12 bg-orange-100 border border-orange-200 text-orange-700 font-bold text-lg hover:bg-orange-200 transition cursor-grab">
                                                                {ch}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ===== QUIZ ===== */}
                {activeTab === "quiz" && (
                    <div className="space-y-4">
                        <SectionTitle emoji="📝" title="Kiểm tra — Mini Quiz" subtitle={`Trả lời đúng ${Math.ceil(quizzes.length * 0.7)}/${quizzes.length} câu để mở bài tiếp theo`} />
                        {quizzes.map((quiz, qi) => {
                            const selected = selectedAnswers[quiz.id];
                            const isCorrect = selected === quiz.correct_answer;
                            return (
                                <div key={quiz.id} className={`bg-white border p-5 transition ${quizSubmitted ? (isCorrect ? "border-emerald-400 bg-emerald-50/30" : "border-red-300 bg-red-50/30") : "border-gray-200"}`}>
                                    <p className="font-bold text-gray-900 mb-4 text-sm">
                                        <span className="inline-flex items-center justify-center w-7 h-7 bg-indigo-100 text-indigo-700 text-xs font-bold mr-2">{qi + 1}</span>
                                        {quiz.question}
                                    </p>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {(quiz.options as string[]).map((opt, oi) => {
                                            const isSelected = selected === opt;
                                            const isCorrectOpt = opt === quiz.correct_answer;
                                            let cls = "w-full text-left px-4 py-3 border text-sm font-medium transition";
                                            if (quizSubmitted) {
                                                if (isCorrectOpt) cls += " bg-emerald-50 border-emerald-400 text-emerald-800";
                                                else if (isSelected && !isCorrectOpt) cls += " bg-red-50 border-red-400 text-red-800";
                                                else cls += " border-gray-200 text-gray-400";
                                            } else {
                                                cls += isSelected ? " bg-indigo-600 border-indigo-600 text-white" : " border-gray-200 text-gray-700 hover:border-indigo-400 hover:bg-indigo-50";
                                            }
                                            return (
                                                <button key={oi} className={cls} onClick={() => handleAnswer(quiz.id, opt)}>
                                                    <span className="font-bold mr-2">{String.fromCharCode(65 + oi)}.</span>{opt}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}

                        {!quizSubmitted ? (
                            <button
                                onClick={handleSubmitQuiz}
                                disabled={Object.keys(selectedAnswers).length < quizzes.length}
                                className="w-full py-3.5 bg-indigo-600 text-white font-bold disabled:opacity-40 hover:bg-indigo-700 transition mt-4"
                            >
                                Nộp bài ({Object.keys(selectedAnswers).length}/{quizzes.length})
                            </button>
                        ) : (
                            <div className="bg-white border border-gray-200 p-6 text-center mt-4">
                                <p className="text-3xl font-bold mb-1">
                                    {score === quizzes.length ? "🎉 Xuất sắc!" : score >= quizzes.length * 0.7 ? "✅ Đạt!" : "❌ Chưa đạt"}
                                </p>
                                <p className="text-gray-500 mb-4">{score}/{quizzes.length} câu đúng ({Math.round(score / quizzes.length * 100)}%)</p>
                                <button onClick={handleResetQuiz} className="flex items-center gap-2 mx-auto text-sm text-indigo-600 hover:underline">
                                    <RotateCcw className="w-4 h-4" /> Làm lại
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* ===== HOMEWORK ===== */}
                {activeTab === "homework" && (
                    <div className="space-y-6">
                        <SectionTitle emoji="🏠" title="Bài tập về nhà" subtitle="Luyện tập thêm tại nhà để nhớ lâu hơn" />
                        {homeworks.map(hw => (
                            <div key={hw.id} className="bg-white border border-gray-200 overflow-hidden">
                                <div className="px-5 py-4 bg-orange-50 border-b border-orange-100">
                                    <h4 className="font-bold text-orange-900">{hw.title}</h4>
                                </div>
                                <div className="p-5 space-y-3">
                                    {hw.content?.tasks?.map((task: any, i: number) => (
                                        <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 border border-gray-100">
                                            <span className="text-2xl flex-shrink-0">{task.icon}</span>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-800">{task.task}</p>
                                                <p className="text-xs text-gray-400 mt-1">⏱ {task.time}</p>
                                            </div>
                                            <input type="checkbox" className="w-5 h-5 accent-emerald-500 mt-1 flex-shrink-0" />
                                        </div>
                                    ))}
                                    {hw.content?.bonus && (
                                        <div className="bg-amber-50 border border-amber-200 p-4 mt-3">
                                            <p className="text-sm text-amber-800">{hw.content.bonus}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Complete Button */}
                <div className="pt-8 pb-4">
                    <button className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-lg shadow-lg shadow-indigo-500/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                        <CheckCircle className="w-6 h-6" />
                        Hoàn Thành & Nhận {lesson.xp_reward} XP
                    </button>
                </div>
            </div>
        </div>
    );
}

function SectionTitle({ emoji, title, subtitle }: { emoji: string; title: string; subtitle: string }) {
    return (
        <div className="mb-6">
            <h2 className="text-2xl font-heading font-bold text-gray-900 flex items-center gap-2">
                <span>{emoji}</span> {title}
            </h2>
            <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
        </div>
    );
}
