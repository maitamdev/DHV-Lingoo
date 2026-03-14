\"use client\";

import { useState, useMemo } from \"react\";
import { BookOpen, Search, Volume2, Star, Filter, Plus, Bookmark, Brain, Sparkles } from \"lucide-react\";
import \"./vocabulary.css\";

interface Word {
  id: string;
  word: string;
  phonetic: string | null;
  meaning: string;
  example: string | null;
  lesson_id: string;
}

interface Props {
  words: Word[];
  userLevel: string;
  userId: string;
}

type MasteryLevel = \"all\" | \"new\" | \"learning\" | \"mastered\";

export default function VocabularyClient({ words, userLevel, userId }: Props) {
  const [search, setSearch] = useState(\"\");
  const [mastery, setMastery] = useState<MasteryLevel>(\"all\");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let result = words;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (w) => w.word.toLowerCase().includes(q) || w.meaning.toLowerCase().includes(q)
      );
    }
    return result;
  }, [words, search, mastery]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const speak = (text: string) => {
    if (typeof window !== \"undefined\" && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = \"en-US\";
      u.rate = 0.8;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className=\"p-4 lg:p-6 max-w-3xl mx-auto\">
      <div className=\"vn-header\">
        <div className=\"relative z-10\">
          <div className=\"flex items-center gap-3 mb-2\">
            <BookOpen className=\"w-6 h-6\" />
            <h1 className=\"text-2xl font-bold\">So tay tu vung</h1>
          </div>
          <p className=\"text-sm opacity-80\">Quan ly va on luyen tu vung ca nhan</p>
        </div>
      </div>

      <div className=\"vn-stats-row mt-5\">
        <div className=\"vn-stat-box\">
          <div className=\"vn-stat-value\">{words.length}</div>
          <div className=\"vn-stat-label\">Tong tu vung</div>
        </div>
        <div className=\"vn-stat-box\">
          <div className=\"vn-stat-value\">{favorites.size}</div>
          <div className=\"vn-stat-label\">Yeu thich</div>
        </div>
        <div className=\"vn-stat-box\">
          <div className=\"vn-stat-value\">{userLevel}</div>
          <div className=\"vn-stat-label\">Cap do</div>
        </div>
      </div>

      <div className=\"vn-search\">
        <div className=\"relative flex-1\">
          <Search className=\"w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400\" />
          <input
            type=\"text\"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder=\"Tim tu vung...\"
            className=\"vn-search-input pl-10\"
          />
        </div>
      </div>

      <div className=\"space-y-3\">
        {filtered.length === 0 ? (
          <div className=\"text-center py-12 text-gray-400\">
            <Sparkles className=\"w-10 h-10 mx-auto mb-3 opacity-30\" />
            <p className=\"text-sm\">Khong tim thay tu vung nao</p>
          </div>
        ) : (
          filtered.slice(0, 50).map((w) => (
            <div key={w.id} className=\"vn-word-card\">
              <div className=\"vn-word-icon\" style={{ background: \"#f3e8ff\" }}>
                <Brain className=\"w-5 h-5 text-purple-500\" />
              </div>
              <div className=\"flex-1 min-w-0\">
                <div className=\"flex items-center gap-2\">
                  <span className=\"vn-word-text\">{w.word}</span>
                  {w.phonetic && <span className=\"vn-word-phonetic\">{w.phonetic}</span>}
                </div>
                <div className=\"vn-word-meaning\">{w.meaning}</div>
                {w.example && (
                  <div className=\"vn-word-meta truncate\">{w.example}</div>
                )}
              </div>
              <div className=\"vn-word-actions\">
                <button className=\"vn-action-btn\" onClick={() => speak(w.word)} title=\"Phat am\">
                  <Volume2 className=\"w-3.5 h-3.5\" />
                </button>
                <button
                  className=\"vn-action-btn\"
                  onClick={() => toggleFavorite(w.id)}
                  title=\"Yeu thich\"
                  style={favorites.has(w.id) ? { color: \"#f59e0b\", borderColor: \"#f59e0b\" } : {}}
                >
                  <Star className=\"w-3.5 h-3.5\" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {filtered.length > 50 && (
        <p className=\"text-center text-xs text-gray-400 mt-4\">
          Hien thi 50/{filtered.length} tu vung. Dung tim kiem de loc.
        </p>
      )}
    </div>
  );
}