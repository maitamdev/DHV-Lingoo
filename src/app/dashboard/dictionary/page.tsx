"use client";

import { useState, useRef } from "react";
import { Languages, Search, ArrowRightLeft, Volume2, Loader2, BookOpen, Copy, Check, Sparkles } from "lucide-react";

interface DictMeaning {
    partOfSpeech: string;
    definitions: { meaning: string; example?: string; exampleVi?: string }[];
}

interface DictResult {
    word: string;
    phonetic: string;
    meanings: DictMeaning[];
    synonyms?: string[];
    antonyms?: string[];
    tips?: string;
}

export default function DictionaryPage() {
    const [mode, setMode] = useState<"translate" | "dictionary">("translate");
    const [direction, setDirection] = useState<"en-vi" | "vi-en">("en-vi");
    const [input, setInput] = useState("");
    const [result, setResult] = useState<string | DictResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isRawDict, setIsRawDict] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    async function handleSubmit() {
        if (!input.trim() || loading) return;
        setLoading(true);
        setResult(null);
        setIsRawDict(false);

        try {
            const res = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: input.trim(), mode, direction }),
            });

            const data = await res.json();
            if (data.error) {
                setResult(data.error);
                setIsRawDict(false);
            } else if (data.mode === "dictionary" && !data.raw) {
                setResult(data.result as DictResult);
                setIsRawDict(false);
            } else {
                setResult(data.result);
                setIsRawDict(data.raw || false);
            }
        } catch {
            setResult("Lỗi kết nối, vui lòng thử lại!");
        }
        setLoading(false);
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    }

    function speak(text: string, lang: string = "en-US") {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.85;
        speechSynthesis.speak(utterance);
    }

    function copyResult() {
        const text = typeof result === "string" ? result : result ? JSON.stringify(result, null, 2) : "";
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function swapDirection() {
        setDirection(d => d === "en-vi" ? "vi-en" : "en-vi");
        setResult(null);
    }

    function lookupWord(word: string) {
        setInput(word);
        setMode("dictionary");
        setTimeout(() => {
            handleSubmitDirect(word, "dictionary");
        }, 100);
    }

    async function handleSubmitDirect(text: string, m: string) {
        setLoading(true);
        setResult(null);
        setIsRawDict(false);
        try {
            const res = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, mode: m, direction }),
            });
            const data = await res.json();
            if (data.mode === "dictionary" && !data.raw) {
                setResult(data.result as DictResult);
            } else {
                setResult(data.result);
                setIsRawDict(data.raw || false);
            }
        } catch {
            setResult("Lỗi kết nối!");
        }
        setLoading(false);
    }

    return (
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Languages className="w-6 h-6 text-blue-500" />
                    Dịch & Tra từ
                </h1>
                <p className="text-gray-500 mt-1">Dịch văn bản và tra cứu từ vựng chi tiết với AI</p>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => { setMode("translate"); setResult(null); }}
                    className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold transition-all ${mode === "translate"
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
                        }`}
                >
                    <ArrowRightLeft className="w-4 h-4" />
                    Dịch văn bản
                </button>
                <button
                    onClick={() => { setMode("dictionary"); setResult(null); }}
                    className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold transition-all ${mode === "dictionary"
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-violet-300"
                        }`}
                >
                    <BookOpen className="w-4 h-4" />
                    Tra từ điển
                </button>
            </div>

            {/* Input Section */}
            <div className="bg-white border border-gray-200 overflow-hidden mb-6">
                {/* Language Direction (Translate mode only) */}
                {mode === "translate" && (
                    <div className="flex items-center justify-center gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
                        <span className={`text-sm font-bold ${direction === "en-vi" ? "text-blue-600" : "text-gray-600"}`}>
                            {direction === "en-vi" ? "🇬🇧 English" : "🇻🇳 Tiếng Việt"}
                        </span>
                        <button
                            onClick={swapDirection}
                            className="w-8 h-8 bg-white border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition"
                        >
                            <ArrowRightLeft className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                        <span className={`text-sm font-bold ${direction === "en-vi" ? "text-gray-600" : "text-blue-600"}`}>
                            {direction === "en-vi" ? "🇻🇳 Tiếng Việt" : "🇬🇧 English"}
                        </span>
                    </div>
                )}

                <div className="p-4">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={mode === "translate"
                            ? "Nhập văn bản cần dịch..."
                            : "Nhập từ cần tra (VD: accomplish, ubiquitous, nghĩa của 'resilient'...)"
                        }
                        className="w-full h-32 resize-none text-sm outline-none placeholder:text-gray-400"
                    />
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            {input && (
                                <button
                                    onClick={() => speak(input, direction === "en-vi" ? "en-US" : "vi-VN")}
                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-500 transition"
                                    title="Phát âm"
                                >
                                    <Volume2 className="w-4 h-4" />
                                </button>
                            )}
                            <span className="text-xs text-gray-400">{input.length} ký tự</span>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={!input.trim() || loading}
                            className={`flex items-center gap-2 px-5 py-2 text-sm font-bold text-white transition-all ${loading
                                ? "bg-gray-400 cursor-wait"
                                : mode === "translate"
                                    ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25"
                                    : "bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-500/25"
                                }`}
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Đang xử lý...</>
                            ) : mode === "translate" ? (
                                <><ArrowRightLeft className="w-4 h-4" /> Dịch</>
                            ) : (
                                <><Search className="w-4 h-4" /> Tra từ</>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Result Section */}
            {result && (
                <div className="bg-white border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                    {/* Translate Result */}
                    {mode === "translate" && typeof result === "string" && (
                        <div>
                            <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm font-bold text-gray-900">Kết quả dịch</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => speak(result, direction === "en-vi" ? "vi-VN" : "en-US")} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-500 transition" title="Phát âm">
                                        <Volume2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={copyResult} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-500 transition" title="Sao chép">
                                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{result}</p>
                            </div>
                        </div>
                    )}

                    {/* Dictionary Result - Structured */}
                    {mode === "dictionary" && result && typeof result === "object" && !isRawDict && (
                        <div>
                            <div className="px-6 py-4 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-2xl font-black text-gray-900">{(result as DictResult).word}</h2>
                                            <button
                                                onClick={() => speak((result as DictResult).word)}
                                                className="w-8 h-8 bg-violet-100 flex items-center justify-center hover:bg-violet-200 transition rounded-full"
                                            >
                                                <Volume2 className="w-4 h-4 text-violet-600" />
                                            </button>
                                        </div>
                                        {(result as DictResult).phonetic && (
                                            <p className="text-sm text-violet-600 font-mono mt-0.5">{(result as DictResult).phonetic}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-5">
                                {(result as DictResult).meanings?.map((meaning, i) => (
                                    <div key={i}>
                                        <span className="inline-block px-2.5 py-0.5 bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-wider mb-2">
                                            {meaning.partOfSpeech}
                                        </span>
                                        <div className="space-y-3">
                                            {meaning.definitions?.map((def, j) => (
                                                <div key={j} className="pl-4 border-l-2 border-violet-200">
                                                    <p className="text-sm text-gray-900 font-medium">{j + 1}. {def.meaning}</p>
                                                    {def.example && (
                                                        <p className="text-xs text-gray-500 mt-1 italic">
                                                            &quot;{def.example}&quot;
                                                            {def.exampleVi && <span className="not-italic text-gray-400"> → {def.exampleVi}</span>}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {/* Synonyms & Antonyms */}
                                {((result as DictResult).synonyms?.length ?? 0) > 0 && (
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Từ đồng nghĩa</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(result as DictResult).synonyms!.map((s, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => lookupWord(s)}
                                                    className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {((result as DictResult).antonyms?.length ?? 0) > 0 && (
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Từ trái nghĩa</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(result as DictResult).antonyms!.map((s, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => lookupWord(s)}
                                                    className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-medium border border-red-200 hover:bg-red-100 transition cursor-pointer"
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tips */}
                                {(result as DictResult).tips && (
                                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200">
                                        <p className="text-xs font-bold text-amber-700 mb-1">💡 Mẹo ghi nhớ</p>
                                        <p className="text-xs text-amber-800">{(result as DictResult).tips}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Dictionary Result - Raw text fallback */}
                    {mode === "dictionary" && typeof result === "string" && (
                        <div className="p-6">
                            <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{result}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Quick suggestions */}
            {!result && !loading && (
                <div className="bg-white border border-gray-200 p-5">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                        {mode === "translate" ? "Thử dịch" : "Thử tra từ"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {mode === "translate" ? (
                            <>
                                {["How are you today?", "I love learning English", "The weather is beautiful", "Tôi muốn đặt phòng khách sạn"].map(s => (
                                    <button key={s} onClick={() => { setInput(s); }} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200 hover:bg-blue-100 transition">
                                        {s}
                                    </button>
                                ))}
                            </>
                        ) : (
                            <>
                                {["accomplish", "resilient", "ubiquitous", "serendipity", "ephemeral", "pragmatic"].map(s => (
                                    <button key={s} onClick={() => { setInput(s); }} className="px-3 py-1.5 bg-violet-50 text-violet-700 text-xs font-medium border border-violet-200 hover:bg-violet-100 transition">
                                        {s}
                                    </button>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
