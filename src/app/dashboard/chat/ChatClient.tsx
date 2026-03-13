// AI Chat Client — full-page Lingoo chat interface
'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Sparkles, BookOpen, MessageCircle, Lightbulb } from 'lucide-react';
import './chat.css';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const QUICK_PROMPTS = [
  { icon: '📖', text: 'Dạy tôi 5 từ vựng mới hôm nay' },
  { icon: '🗣️', text: 'Cách phát âm "through" và "though"' },
  { icon: '📝', text: 'Giải thích ngữ pháp Present Perfect' },
  { icon: '💬', text: 'Hội thoại mẫu đặt đồ ăn nhà hàng' },
  { icon: '🔤', text: 'Phân biệt "affect" và "effect"' },
  { icon: '✈️', text: 'Từ vựng hay dùng khi đi du lịch' },
];

export default function ChatClient() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Xin chào! Mình là Lingoo 🦊 — trợ lý AI dạy tiếng Anh của bạn.\n\nMình có thể giúp bạn:\n• 📖 Học từ vựng mới\n• 🗣️ Luyện phát âm\n• 📝 Giải thích ngữ pháp\n• 💬 Tạo hội thoại mẫu\n\nHỏi mình bất cứ điều gì nhé!', timestamp: Date.now() },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(text?: string) {
    const msg = (text || input).trim();
    if (!msg || isLoading) return;
    setInput('');

    const userMsg: ChatMessage = { role: 'user', content: msg, timestamp: Date.now() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setIsLoading(true);

    try {
      const res = await fetch('/api/fox-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: newMsgs.slice(-10) }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply || data.error || 'Lingoo không hiểu. Thử lại nhé! 🦊',
        timestamp: Date.now(),
      }]);
      setProvider(data.provider || '');
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Oops! Lingoo bị lỗi rồi 🦊💤 Thử lại nhé!',
        timestamp: Date.now(),
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function clearChat() {
    setMessages([{
      role: 'assistant',
      content: 'Đã xóa lịch sử chat! Hỏi mình bất cứ điều gì nhé 🦊',
      timestamp: Date.now(),
    }]);
  }

  const msgCount = messages.filter(m => m.role === 'user').length;

  return (
    <div className="chat-page">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-avatar">🦊</div>
          <div>
            <h1 className="chat-title">Lingoo AI</h1>
            <p className="chat-status">
              <span className="chat-status-dot" />
              {isLoading ? 'Đang suy nghĩ...' : 'Online — Powered by Llama 3.3'}
            </p>
          </div>
        </div>
        <div className="chat-header-right">
          <span className="chat-msg-count"><MessageCircle className="w-3.5 h-3.5" /> {msgCount}</span>
          <button className="chat-clear-btn" onClick={clearChat} title="Xóa lịch sử">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-msg ${msg.role}`}>
            {msg.role === 'assistant' && <div className="chat-msg-avatar">🦊</div>}
            <div className={`chat-msg-bubble ${msg.role}`}>
              <div className="chat-msg-content">{msg.content}</div>
              <span className="chat-msg-time">
                {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="chat-msg assistant">
            <div className="chat-msg-avatar">🦊</div>
            <div className="chat-msg-bubble assistant">
              <div className="chat-typing">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 2 && (
        <div className="chat-quick-prompts">
          <div className="chat-quick-label"><Lightbulb className="w-3.5 h-3.5" /> Gợi ý nhanh</div>
          <div className="chat-quick-grid">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button key={i} className="chat-quick-btn" onClick={() => handleSend(prompt.text)}>
                <span>{prompt.icon}</span> {prompt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Hỏi Lingoo bất cứ điều gì..."
            className="chat-input"
            disabled={isLoading}
          />
          <button
            className="chat-send-btn"
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="chat-footer-info">
          <span><Sparkles className="w-3 h-3" /> Groq Llama 3.3</span>
          {provider && <span>via {provider}</span>}
          <span><BookOpen className="w-3 h-3" /> IPA chuẩn quốc tế</span>
        </div>
      </div>
    </div>
  );
}
// 6 quick prompts for common questions
// Message history with timestamps
// Typing indicator with 3 bouncing dots
// Clear chat resets conversation
// Auto-scroll to latest message
// Provider display shows Groq or HF
