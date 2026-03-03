"use client";

import { useState, useRef } from "react";
import { Languages, Search, ArrowRightLeft, Volume2, Loader2, BookOpen, Copy, Check, Sparkles, ExternalLink } from "lucide-react";

interface DictDefinition {
    meaning: string;
    example?: string;
}

interface DictMeaning {
    partOfSpeech: string;
    definitions: DictDefinition[];
    synonyms?: string[];
    antonyms?: string[];
}

interface DictResult {
    word: string;
    phonetic: string;
    audio?: string;
    meanings: DictMeaning[];
    synonyms?: string[];
    antonyms?: string[];
    source?: string;
}

export default function DictionaryPage() {
    const [mode, setMode] = useState<"translate" | "dictionary">("dictionary");
    const [direction, setDirection] = useState<"en-vi" | "vi-en">("en-vi");
    const [input, setInput] = useState("");
    const [result, setResult] = useState<string | DictResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isRawDict, setIsRawDict] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

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

    function playAudio(url: string) {
        if (audioRef.current) {
            audioRef.current.src = url;
            audioRef.current.play();
        } else {
            const audio = new Audio(url);
            audioRef.current = audio;
            audio.play();
        }
    }

    function speak(text: string, lang: string = "en-US") {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.85;
        speechSynthesis.speak(utterance);
    }

    function playWord(dictResult: DictResult) {
        if (dictResult.audio) {
            playAudio(dictResult.audio);
        } else {
            speak(dictResult.word);
        }
    }

    function copyResult() {
        const text = typeof result === "string" ? result : result ? (result as DictResult).word : "";
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
        setLoading(true);
        setResult(null);
        setIsRawDict(false);

        fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: word, mode: "dictionary", direction }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.mode === "dictionary" && !data.raw) {
                    setResult(data.result as DictResult);
                } else {
                    setResult(data.result);
                    setIsRawDict(data.raw || false);
                }
            })
            .catch(() => setResult("Lỗi kết nối!"))
            .finally(() => setLoading(false));
    }

    return (
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Languages className="w-6 h-6 text-blue-500" />
                    Dịch & Tra từ
                </h1>
                <p className="text-gray-500 mt-1">Tra cứu từ điển Anh-Anh và dịch văn bản EN ↔ VI</p>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-6">
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

                {/* Dictionary source info */}
                {mode === "dictionary" && (
                    <div className="px-6 py-2 bg-violet-50 border-b border-gray-200">
                        <p className="text-xs text-violet-600 font-medium">📖 Từ điển Anh-Anh + hỗ trợ tra từ tiếng Việt bằng AI</p>
                    </div>
                )}

                <div className="p-4">
                    <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={mode === "dictionary" ? 1 : 4}
                        placeholder={mode === "translate"
                            ? "Nhập văn bản cần dịch..."
                            : "Nhập từ tiếng Anh hoặc tiếng Việt (VD: accomplish, con mèo...)"
                        }
                        className="w-full resize-none text-sm outline-none placeholder:text-gray-400"
                    />
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            {input && (
                                <button
                                    onClick={() => speak(input, direction === "en-vi" || mode === "dictionary" ? "en-US" : "vi-VN")}
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
                                : mode === "dictionary"
                                    ? "bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-500/25"
                                    : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25"
                                }`}
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Đang tra...</>
                            ) : mode === "dictionary" ? (
                                <><Search className="w-4 h-4" /> Tra từ</>
                            ) : (
                                <><ArrowRightLeft className="w-4 h-4" /> Dịch</>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Result Section */}
            {result && (
                <div className="bg-white border border-gray-200 overflow-hidden">
                    {/* Translate Result */}
                    {mode === "translate" && typeof result === "string" && (
                        <div>
                            <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm font-bold text-gray-900">Kết quả dịch</span>
                                    <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">AI</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => speak(result, direction === "en-vi" ? "vi-VN" : "en-US")} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-500 transition">
                                        <Volume2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={copyResult} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-500 transition">
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
                            {/* Word header */}
                            <div className="px-6 py-4 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-2xl font-black text-gray-900">{(result as DictResult).word}</h2>
                                            <button
                                                onClick={() => playWord(result as DictResult)}
                                                className="w-9 h-9 bg-violet-100 flex items-center justify-center hover:bg-violet-200 transition rounded-full"
                                                title="Phát âm"
                                            >
                                                <Volume2 className="w-4 h-4 text-violet-600" />
                                            </button>
                                        </div>
                                        {(result as DictResult).phonetic && (
                                            <p className="text-sm text-violet-600 font-mono mt-0.5">{(result as DictResult).phonetic}</p>
                                        )}
                                    </div>
                                    <button onClick={copyResult} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-violet-500 transition">
                                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Meanings */}
                            <div className="p-6 space-y-5">
                                {(result as DictResult).meanings?.map((meaning, i) => (
                                    <div key={i}>
                                        <span className="inline-block px-2.5 py-0.5 bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-wider mb-3">
                                            {meaning.partOfSpeech}
                                        </span>
                                        <div className="space-y-3">
                                            {meaning.definitions?.map((def, j) => (
                                                <div key={j} className="pl-4 border-l-2 border-violet-200">
                                                    <p className="text-sm text-gray-900">{j + 1}. {def.meaning}</p>
                                                    {def.example && (
                                                        <p className="text-xs text-gray-500 mt-1 italic">&quot;{def.example}&quot;</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        {/* Per-meaning synonyms */}
                                        {(meaning.synonyms?.length ?? 0) > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">syn:</span>
                                                {meaning.synonyms!.map((s, k) => (
                                                    <button key={k} onClick={() => lookupWord(s)} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer">
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Global synonyms */}
                                {((result as DictResult).synonyms?.length ?? 0) > 0 && (
                                    <div className="pt-3 border-t border-gray-100">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Từ đồng nghĩa</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(result as DictResult).synonyms!.map((s, i) => (
                                                <button key={i} onClick={() => lookupWord(s)} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer">
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Global antonyms */}
                                {((result as DictResult).antonyms?.length ?? 0) > 0 && (
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Từ trái nghĩa</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(result as DictResult).antonyms!.map((s, i) => (
                                                <button key={i} onClick={() => lookupWord(s)} className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-medium border border-red-200 hover:bg-red-100 transition cursor-pointer">
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Source */}
                                {(result as DictResult).source && (result as DictResult).source !== "AI" && (
                                    <div className="pt-3 border-t border-gray-100">
                                        <a href={(result as DictResult).source} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-violet-500 flex items-center gap-1">
                                            <ExternalLink className="w-3 h-3" /> Nguồn: Wiktionary
                                        </a>
                                    </div>
                                )}
                                {(result as DictResult).source === "AI" && (
                                    <div className="pt-3 border-t border-gray-100">
                                        <p className="text-xs text-gray-400 flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" /> Kết quả từ AI — có thể không chính xác 100%
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Dictionary - Raw text fallback */}
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
                        {mode === "dictionary" ? "Thử tra từ" : "Thử dịch"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {mode === "dictionary" ? (
                            <>
                                {["accomplish", "resilient", "ubiquitous", "serendipity", "ephemeral", "pragmatic", "algorithm", "sustainable"].map(s => (
                                    <button key={s} onClick={() => lookupWord(s)} className="px-3 py-1.5 bg-violet-50 text-violet-700 text-xs font-medium border border-violet-200 hover:bg-violet-100 transition">
                                        {s}
                                    </button>
                                ))}
                            </>
                        ) : (
                            <>
                                {["How are you today?", "I love learning English", "The weather is beautiful", "Tôi muốn đặt phòng khách sạn"].map(s => (
                                    <button key={s} onClick={() => setInput(s)} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200 hover:bg-blue-100 transition">
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
