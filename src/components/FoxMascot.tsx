// FoxMascot - animated Lingoo fox mascot SVG component
"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, Minimize2 } from "lucide-react";

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

export default function FoxMascot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: "assistant", content: "Xin chào! Mình là Lingoo 🦊 Trợ lý học tiếng Anh của bạn. Hỏi mình bất cứ điều gì nhé!" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isBlinking, setIsBlinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Inject foxFloat keyframe globally
    useEffect(() => {
        const styleId = "fox-mascot-keyframes";
        if (!document.getElementById(styleId)) {
            const style = document.createElement("style");
            style.id = styleId;
            style.textContent = `@keyframes foxFloat { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-4px); } }`;
            document.head.appendChild(style);
        }
    }, []);

    // Blink animation
    useEffect(() => {
        const interval = setInterval(() => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 200);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    // Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function handleSend() {
        if (!input.trim() || isLoading) return;
        const userMsg = input.trim();
        setInput("");
        const newMessages: ChatMessage[] = [...messages, { role: "user", content: userMsg }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const res = await fetch("/api/fox-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg, history: newMessages.slice(-10) }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: "assistant", content: data.reply || data.error || "..." }]);
        } catch {
            setMessages(prev => [...prev, { role: "assistant", content: "Oops! Lingoo bị lỗi rồi 🦊💤 Thử lại nhé!" }]);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed bottom-4 right-4 z-50" style={{ perspective: "600px" }}>
            {/* Chat Panel */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-[360px] h-[480px] bg-white border border-gray-200 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4"
                    style={{
                        borderRadius: "20px 20px 4px 20px",
                        boxShadow: "0 20px 60px rgba(6, 182, 212, 0.15), 0 4px 20px rgba(0,0,0,0.1)"
                    }}
                >
                    {/* Header */}
                    <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100"
                        style={{ background: "linear-gradient(135deg, #06b6d4, #0891b2)" }}
                    >
                        <div className="w-9 h-9 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-lg">
                            🦊
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-bold text-sm">Lingoo — Trợ lý AI</p>
                            <p className="text-cyan-100 text-[11px]">Powered by Llama 3.3</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition">
                            <Minimize2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                {msg.role === "assistant" && (
                                    <span className="text-lg mr-2 flex-shrink-0 mt-1">🦊</span>
                                )}
                                <div className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed ${msg.role === "user"
                                    ? "bg-cyan-600 text-white"
                                    : "bg-white border border-gray-200 text-gray-800"
                                    }`} style={{
                                        borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px"
                                    }}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <span className="text-lg mr-2">🦊</span>
                                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl">
                                    <div className="flex gap-1.5">
                                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-gray-100 bg-white">
                        <div className="flex gap-2">
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleSend()}
                                placeholder="Hỏi Lingoo bất cứ điều gì..."
                                className="flex-1 px-4 py-2.5 bg-gray-100 text-sm outline-none focus:bg-gray-50 focus:ring-2 focus:ring-cyan-200 transition rounded-full"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="w-10 h-10 bg-cyan-600 text-white flex items-center justify-center rounded-full hover:bg-cyan-700 disabled:opacity-40 transition"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Fox Character — Logo Image */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group relative w-16 h-16 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                title="Hỏi Lingoo 🦊"
            >
                {/* Glow ring */}
                <div className="absolute inset-[-4px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        background: "conic-gradient(from 0deg, #06b6d4, #22d3ee, #67e8f9, #06b6d4)",
                        animation: "foxFloat 3s ease-in-out infinite"
                    }}
                />

                {/* Shadow */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-3 bg-cyan-500/20 rounded-full blur-md"
                    style={{ animation: "foxFloat 3s ease-in-out infinite" }}
                />

                {/* Logo Image */}
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-400/50"
                    style={{
                        animation: "foxFloat 3s ease-in-out infinite",
                        boxShadow: "0 0 20px rgba(6,182,212,0.4), 0 4px 12px rgba(0,0,0,0.2)"
                    }}
                >
                    <img
                        src="/images/logo.png"
                        alt="Lingoo AI"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Notification dot */}
                {!isOpen && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-pulse">
                        <span className="text-[9px] text-white font-bold">AI</span>
                    </div>
                )}

                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none shadow-lg">
                    Hỏi Lingoo 🦊
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                </div>
            </button>
        </div>
    );
}
// Achievement notification in chat
