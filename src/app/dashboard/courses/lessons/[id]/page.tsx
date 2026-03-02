"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Volume2, CheckCircle, Star, RotateCcw, Play, BookOpen, Headphones, Mic, PenTool, ClipboardCheck, Home } from "lucide-react";
import { useCallback } from "react";

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
    const [playingLetter, setPlayingLetter] = useState<string | null>(null);
    const [lessonCompleted, setLessonCompleted] = useState(false);
    const [completing, setCompleting] = useState(false);

    const speakText = useCallback((text: string, lang: string = "en-US") => {
        if (typeof window === "undefined" || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.8;
        utterance.pitch = 1;
        // Try to find an English voice
        const voices = window.speechSynthesis.getVoices();
        const enVoice = voices.find(v => v.lang.startsWith("en"));
        if (enVoice) utterance.voice = enVoice;
        setPlayingLetter(text);
        utterance.onend = () => setPlayingLetter(null);
        window.speechSynthesis.speak(utterance);
    }, []);

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

        // Check existing completion progress
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: progress } = await supabase
                .from("lesson_progress")
                .select("completed")
                .eq("user_id", user.id)
                .eq("lesson_id", id)
                .single();
            if (progress?.completed) setLessonCompleted(true);
        }

        setLoading(false);
    }

    async function completeLesson() {
        if (!lesson || completing || lessonCompleted) return;
        setCompleting(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setCompleting(false); return; }

        const xpReward = lesson.xp_reward || 10;
        const quizScore = quizzes.length > 0 ? Math.round((score / quizzes.length) * 100) : 100;

        // Upsert lesson progress
        await supabase.from("lesson_progress").upsert({
            user_id: user.id,
            lesson_id: lesson.id,
            course_id: lesson.course_id,
            completed: true,
            score: quizScore,
            xp_earned: xpReward,
            completed_at: new Date().toISOString(),
        }, { onConflict: "user_id,lesson_id" });

        // Update profile XP and streak
        const { data: profile } = await supabase
            .from("profiles")
            .select("xp, streak, longest_streak, last_active_date")
            .eq("id", user.id)
            .single();

        if (profile) {
            const today = new Date().toISOString().split("T")[0];
            const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
            const lastActive = profile.last_active_date;

            let newStreak = profile.streak || 0;
            if (lastActive === yesterday) {
                newStreak += 1;
            } else if (lastActive !== today) {
                newStreak = 1;
            }

            await supabase.from("profiles").update({
                xp: (profile.xp || 0) + xpReward,
                streak: newStreak,
                longest_streak: Math.max(profile.longest_streak || 0, newStreak),
                last_active_date: today,
            }).eq("id", user.id);
        }

        setLessonCompleted(true);
        setCompleting(false);
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
                                    {/* Alphabet table - Click to hear pronunciation */}
                                    {section.content?.alphabet && (
                                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                                            {section.content.alphabet.map((item: any) => {
                                                const isVowel = ["A", "E", "I", "O", "U"].includes(item.letter);
                                                const isPlaying = playingLetter === item.letter;
                                                return (
                                                    <button
                                                        key={item.letter}
                                                        onClick={() => speakText(item.letter)}
                                                        className={`text-center p-3 border transition-all cursor-pointer group relative ${isPlaying
                                                            ? "bg-indigo-100 border-indigo-400 scale-110 shadow-lg shadow-indigo-200"
                                                            : isVowel
                                                                ? "bg-amber-50 border-amber-200 hover:bg-amber-100 hover:shadow-md hover:-translate-y-0.5"
                                                                : "bg-white border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5"
                                                            }`}
                                                    >
                                                        <span className={`text-2xl font-bold transition ${isPlaying ? "text-indigo-600" : "text-gray-900"}`}>{item.letter}</span>
                                                        <p className="text-[10px] text-gray-400 font-mono mt-1">{item.phonetic}</p>
                                                        <Volume2 className={`w-3 h-3 mx-auto mt-1 transition ${isPlaying ? "text-indigo-500 animate-pulse" : "text-gray-300 group-hover:text-indigo-400"}`} />
                                                    </button>
                                                );
                                            })}
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
                                        <button onClick={() => speakText(vocab.word)} className="p-1.5 text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 transition">
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
                                    {ex.content?.type === "matching" && <MatchingGame pairs={ex.content.pairs} />}
                                    {ex.content?.type === "fill_blank" && <FillBlankGame exercises={ex.content.exercises} />}
                                    {ex.content?.type === "unscramble" && <UnscrambleGame exercises={ex.content.exercises} />}
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
                    <button
                        onClick={completeLesson}
                        disabled={lessonCompleted || completing}
                        className={`w-full py-4 font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all ${lessonCompleted
                            ? "bg-emerald-500 text-white shadow-emerald-500/30 cursor-default"
                            : completing
                                ? "bg-gray-400 text-white cursor-wait"
                                : "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-indigo-500/30 hover:-translate-y-1"
                            }`}
                    >
                        {lessonCompleted ? (
                            <>
                                <CheckCircle className="w-6 h-6" />
                                Đã hoàn thành ✓
                            </>
                        ) : completing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-6 h-6" />
                                Hoàn Thành & Nhận {lesson.xp_reward} XP
                            </>
                        )}
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

// ===== INTERACTIVE GAME: Matching =====
function MatchingGame({ pairs }: { pairs: any[] }) {
    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [matched, setMatched] = useState<Record<string, string>>({});
    const [wrong, setWrong] = useState<string | null>(null);
    const shuffledRight = useState(() => [...pairs].sort(() => Math.random() - 0.5).map(p => p.right))[0];
    const allMatched = Object.keys(matched).length === pairs.length;

    function handleLeftClick(letter: string) {
        if (matched[letter]) return;
        setSelectedLeft(letter);
        setWrong(null);
    }
    function handleRightClick(letter: string) {
        if (!selectedLeft || Object.values(matched).includes(letter)) return;
        const pair = pairs.find(p => p.left === selectedLeft);
        if (pair && pair.right === letter) {
            setMatched(prev => ({ ...prev, [selectedLeft]: letter }));
            setSelectedLeft(null);
        } else {
            setWrong(letter);
            setTimeout(() => setWrong(null), 600);
        }
    }

    return (
        <div>
            <div className="flex gap-8 justify-center">
                {/* Left column */}
                <div className="space-y-3">
                    <p className="text-xs text-gray-400 font-bold text-center mb-2">CHỮ HOA</p>
                    {pairs.map((pair: any) => (
                        <button key={pair.left} onClick={() => handleLeftClick(pair.left)}
                            className={`w-14 h-14 flex items-center justify-center font-bold text-xl transition-all ${matched[pair.left] ? "bg-emerald-100 border-emerald-400 text-emerald-700"
                                : selectedLeft === pair.left ? "bg-indigo-100 border-indigo-500 text-indigo-700 scale-110 shadow-lg"
                                    : "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                                } border-2`}>
                            {pair.left} {matched[pair.left] ? "✓" : ""}
                        </button>
                    ))}
                </div>
                {/* Right column */}
                <div className="space-y-3">
                    <p className="text-xs text-gray-400 font-bold text-center mb-2">chữ thường</p>
                    {shuffledRight.map((letter: string) => {
                        const isUsed = Object.values(matched).includes(letter);
                        return (
                            <button key={letter} onClick={() => handleRightClick(letter)}
                                className={`w-14 h-14 flex items-center justify-center font-bold text-xl transition-all border-2 ${isUsed ? "bg-emerald-100 border-emerald-400 text-emerald-700"
                                    : wrong === letter ? "bg-red-100 border-red-400 text-red-700 animate-pulse"
                                        : "bg-gray-50 border-dashed border-gray-300 text-gray-600 hover:bg-indigo-50 hover:border-indigo-300"
                                    }`}>
                                {letter}
                            </button>
                        );
                    })}
                </div>
            </div>
            {allMatched && (
                <div className="mt-4 text-center py-3 bg-emerald-50 border border-emerald-200">
                    <p className="text-emerald-700 font-bold">🎉 Tuyệt vời! Nối đúng tất cả!</p>
                </div>
            )}
        </div>
    );
}

// ===== INTERACTIVE GAME: Fill in the Blank =====
function FillBlankGame({ exercises }: { exercises: any[] }) {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [checked, setChecked] = useState<Record<number, boolean | null>>({});

    function handleInput(index: number, value: string) {
        const letter = value.toUpperCase().slice(-1);
        setAnswers(prev => ({ ...prev, [index]: letter }));
        const correct = exercises[index].answer.toUpperCase();
        if (letter === correct) {
            setChecked(prev => ({ ...prev, [index]: true }));
        } else if (letter.length > 0) {
            setChecked(prev => ({ ...prev, [index]: false }));
            setTimeout(() => setChecked(prev => ({ ...prev, [index]: null })), 800);
        }
    }

    return (
        <div className="space-y-4">
            {exercises.map((item: any, i: number) => (
                <div key={i} className={`flex items-center gap-2 p-4 border transition-all ${checked[i] === true ? "bg-emerald-50 border-emerald-300" : checked[i] === false ? "bg-red-50 border-red-300" : "bg-gray-50 border-gray-100"
                    }`}>
                    <span className="w-7 h-7 bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                    <div className="flex items-center gap-1.5">
                        {item.sequence.map((ch: string, ci: number) => (
                            ch === "___" ? (
                                <input
                                    key={ci}
                                    type="text"
                                    maxLength={1}
                                    value={answers[i] || ""}
                                    onChange={e => handleInput(i, e.target.value)}
                                    disabled={checked[i] === true}
                                    className={`w-12 h-12 text-center font-bold text-xl border-2 outline-none transition uppercase ${checked[i] === true ? "bg-emerald-100 border-emerald-400 text-emerald-700"
                                        : checked[i] === false ? "bg-red-100 border-red-400 text-red-700 animate-pulse"
                                            : "bg-white border-amber-300 text-amber-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                        }`}
                                />
                            ) : (
                                <span key={ci} className="w-12 h-12 bg-white border border-gray-200 flex items-center justify-center font-bold text-xl text-gray-800">
                                    {ch}
                                </span>
                            )
                        ))}
                    </div>
                    {checked[i] === true && <span className="ml-2 text-emerald-500 font-bold">✓</span>}
                    {checked[i] === false && <span className="ml-2 text-red-500 font-bold">✗</span>}
                </div>
            ))}
            {Object.values(checked).filter(v => v === true).length === exercises.length && (
                <div className="text-center py-3 bg-emerald-50 border border-emerald-200">
                    <p className="text-emerald-700 font-bold">🎉 Hoàn thành tất cả!</p>
                </div>
            )}
        </div>
    );
}

// ===== INTERACTIVE GAME: Unscramble =====
function UnscrambleGame({ exercises }: { exercises: any[] }) {
    const [gameState, setGameState] = useState<Record<number, { built: string[]; remaining: number[] }>>({});
    const [results, setResults] = useState<Record<number, boolean | null>>({});

    function initGame(index: number, scrambled: string[]) {
        if (!gameState[index]) {
            setGameState(prev => ({ ...prev, [index]: { built: [], remaining: scrambled.map((_: any, i: number) => i) } }));
        }
    }

    function handleLetterClick(exIndex: number, letterIndex: number, scrambled: string[], answer: string) {
        const state = gameState[exIndex] || { built: [], remaining: scrambled.map((_: any, i: number) => i) };
        const newBuilt = [...state.built, scrambled[letterIndex]];
        const newRemaining = state.remaining.filter((i: number) => i !== letterIndex);
        setGameState(prev => ({ ...prev, [exIndex]: { built: newBuilt, remaining: newRemaining } }));

        if (newBuilt.length === scrambled.length) {
            const result = newBuilt.join("") === answer;
            setResults(prev => ({ ...prev, [exIndex]: result }));
        }
    }

    function handleReset(exIndex: number) {
        setGameState(prev => {
            const updated = { ...prev };
            delete updated[exIndex];
            return updated;
        });
        setResults(prev => {
            const updated = { ...prev };
            delete updated[exIndex];
            return updated;
        });
    }

    return (
        <div className="space-y-5">
            {exercises.map((item: any, i: number) => {
                if (!gameState[i]) initGame(i, item.scrambled);
                const state = gameState[i] || { built: [], remaining: item.scrambled.map((_: any, idx: number) => idx) };

                return (
                    <div key={i} className={`p-5 border transition-all ${results[i] === true ? "bg-emerald-50 border-emerald-300" : results[i] === false ? "bg-red-50 border-red-300" : "bg-gray-50 border-gray-100"
                        }`}>
                        {/* Built word display */}
                        <div className="flex items-center gap-1.5 mb-4">
                            <p className="text-xs text-gray-400 mr-2">Đáp án:</p>
                            {item.scrambled.map((_: any, si: number) => (
                                <span key={si} className={`w-12 h-12 flex items-center justify-center font-bold text-xl border-2 transition ${state.built[si]
                                    ? results[i] === true ? "bg-emerald-100 border-emerald-400 text-emerald-700" : results[i] === false ? "bg-red-100 border-red-400 text-red-700" : "bg-indigo-50 border-indigo-300 text-indigo-700"
                                    : "bg-white border-dashed border-gray-300 text-gray-300"
                                    }`}>
                                    {state.built[si] || "_"}
                                </span>
                            ))}
                            {results[i] === true && <span className="ml-2 text-lg">🎉</span>}
                            {results[i] === false && (
                                <button onClick={() => handleReset(i)} className="ml-2 text-xs text-red-500 hover:underline flex items-center gap-1">
                                    <RotateCcw className="w-3 h-3" /> Thử lại
                                </button>
                            )}
                        </div>

                        {/* Scrambled letters to pick from */}
                        {results[i] !== true && (
                            <div className="flex gap-2 flex-wrap">
                                {item.scrambled.map((ch: string, ci: number) => {
                                    const isUsed = !state.remaining.includes(ci);
                                    return (
                                        <button
                                            key={ci}
                                            onClick={() => !isUsed && handleLetterClick(i, ci, item.scrambled, item.answer)}
                                            disabled={isUsed || results[i] === false}
                                            className={`w-12 h-12 font-bold text-lg transition-all border-2 ${isUsed ? "bg-gray-100 border-gray-200 text-gray-300 cursor-default"
                                                : "bg-orange-100 border-orange-300 text-orange-700 hover:bg-orange-200 hover:scale-105 cursor-pointer"
                                                }`}
                                        >
                                            {ch}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
