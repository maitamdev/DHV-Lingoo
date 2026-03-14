\"use client\";

import { useState, useCallback } from \"react\";
import { RotateCcw, Volume2, Brain, ChevronRight, ThumbsDown, Minus, ThumbsUp, Trophy } from \"lucide-react\";
import \"./review.css\";

interface Word {
  id: string;
  word: string;
  phonetic: string | null;
  meaning: string;
  example: string | null;
}

interface Props {
  words: Word[];
}

type Difficulty = \"hard\" | \"medium\" | \"easy\";

interface ReviewResult {
  wordId: string;
  difficulty: Difficulty;
}

export default function ReviewClient({ words }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState<ReviewResult[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const reviewWords = words.slice(0, 20);
  const currentWord = reviewWords[currentIndex];
  const progress = Math.round(((currentIndex) / reviewWords.length) * 100);

  const speak = useCallback((text: string) => {
    if (typeof window !== \"undefined\" && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = \"en-US\";
      u.rate = 0.8;
      window.speechSynthesis.speak(u);
    }
  }, []);

  const handleRating = (difficulty: Difficulty) => {
    setResults((prev) => [...prev, { wordId: currentWord.id, difficulty }]);
    setIsFlipped(false);
    if (currentIndex + 1 >= reviewWords.length) {
      setIsComplete(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setResults([]);
    setIsComplete(false);
  };

  if (reviewWords.length === 0) {
    return (
      <div className=\"p-6 text-center text-gray-400\">
        <Brain className=\"w-12 h-12 mx-auto mb-3 opacity-30\" />
        <p>Chua co tu vung de on tap</p>
      </div>
    );
  }

  if (isComplete) {
    const easy = results.filter((r) => r.difficulty === \"easy\").length;
    const medium = results.filter((r) => r.difficulty === \"medium\").length;
    const hard = results.filter((r) => r.difficulty === \"hard\").length;
    const score = Math.round(((easy * 3 + medium * 2 + hard) / (reviewWords.length * 3)) * 100);

    return (
      <div className=\"p-4 lg:p-6 max-w-md mx-auto\">
        <div className=\"rv-summary\">
          <Trophy className=\"w-12 h-12 text-amber-500 mx-auto mb-3\" />
          <h2 className=\"text-xl font-bold text-gray-900 mb-1\">Hoan thanh on tap!</h2>
          <p className=\"text-sm text-gray-500 mb-4\">Ban da on {reviewWords.length} tu vung</p>
          <div className=\"text-4xl font-black text-emerald-600 mb-4\">{score}%</div>
          <div className=\"flex justify-center gap-6 text-sm mb-6\">
            <div><span className=\"text-green-600 font-bold\">{easy}</span> de</div>
            <div><span className=\"text-amber-600 font-bold\">{medium}</span> vua</div>
            <div><span className=\"text-red-600 font-bold\">{hard}</span> kho</div>
          </div>
          <button onClick={restart} className=\"w-full py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition flex items-center justify-center gap-2\">
            <RotateCcw className=\"w-4 h-4\" /> On tap lai
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=\"p-4 lg:p-6 max-w-lg mx-auto\">
      <div className=\"rv-header mb-6\">
        <div className=\"relative z-10\">
          <div className=\"flex items-center gap-2 mb-1\">
            <Brain className=\"w-5 h-5\" />
            <h1 className=\"text-lg font-bold\">On tap tu vung</h1>
          </div>
          <p className=\"text-xs opacity-80\">Lap lai cach quang - Spaced Repetition</p>
          <div className=\"flex items-center gap-2 mt-3 text-sm\">
            <span>{currentIndex + 1}/{reviewWords.length}</span>
          </div>
          <div className=\"mt-2 h-2 bg-white/20 rounded-full overflow-hidden\">
            <div className=\"h-full bg-white rounded-full transition-all\" style={{ width: progress + \"%\" }} />
          </div>
        </div>
      </div>

      <div className=\"rv-card-container\" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={\"rv-card-inner\" + (isFlipped ? \" flipped\" : \"\")}>
          <div className=\"rv-card-face\">
            <div className=\"rv-card-word\">{currentWord.word}</div>
            {currentWord.phonetic && <div className=\"rv-card-phonetic\">{currentWord.phonetic}</div>}
            <button
              className=\"mt-4 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition\"
              onClick={(e) => { e.stopPropagation(); speak(currentWord.word); }}
            >
              <Volume2 className=\"w-4 h-4 text-gray-600\" />
            </button>
            <p className=\"text-xs text-gray-400 mt-3\">Nhan de xem nghia</p>
          </div>
          <div className=\"rv-card-face rv-card-back\">
            <div className=\"rv-card-meaning\">{currentWord.meaning}</div>
            {currentWord.example && <div className=\"rv-card-example\">{currentWord.example}</div>}
          </div>
        </div>
      </div>

      {isFlipped && (
        <div className=\"rv-rating-btns\">
          <button className=\"rv-rating-btn hard\" onClick={() => handleRating(\"hard\")}>
            <ThumbsDown className=\"w-4 h-4\" /> Kho
          </button>
          <button className=\"rv-rating-btn medium\" onClick={() => handleRating(\"medium\")}>
            <Minus className=\"w-4 h-4\" /> Vua
          </button>
          <button className=\"rv-rating-btn easy\" onClick={() => handleRating(\"easy\")}>
            <ThumbsUp className=\"w-4 h-4\" /> De
          </button>
        </div>
      )}

      {!isFlipped && currentIndex > 0 && (
        <p className=\"text-center text-xs text-gray-400 mt-4\">
          Nhan vao the de lat xem nghia, sau do danh gia do kho
        </p>
      )}
    </div>
  );
}