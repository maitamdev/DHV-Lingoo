// Client-side flashcard page — reads AI-generated daily cards
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getDailySeed, seededRandom, pickRandomItems, getTodayDateString, getCardRarity } from '@/lib/flashcard-seed';
import { CARDS_PER_DAY, BAG_COLORS, XP_PER_CARD } from '@/lib/flashcard-config';
import { getDifficultyColor, getDifficultyLabel, getCategoryIcon } from '@/lib/flashcard-ai';
import { MysteryBag, FlashcardItem, DailyProgress, ConfettiEffect, CompletionCard, DailyHeader, FlashcardSkeleton } from '@/components/flashcard';
import './flashcards.css';

interface CardData {
  id: string;
  word: string;
  meaning: string;
  phonetic: string | null;
  example: string | null;
  rarity: string;
  category?: string;
  difficulty?: string;
  isAI?: boolean;
}

export default function FlashcardClient() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false, false, false]);
  const [newlyRevealed, setNewlyRevealed] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [today] = useState(getTodayDateString());
  const [aiGenerated, setAiGenerated] = useState(false);
  const [topic, setTopic] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    async function loadCards() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { if (!cancelled) { setError('Please log in'); setLoading(false); } return; }

        const storageKey = `flashcards_${user.id}_${today}`;
        const saved = localStorage.getItem(storageKey);
        const savedRevealed = saved ? JSON.parse(saved) as boolean[] : [false, false, false, false, false];

        // Try to load AI-generated flashcards first
        const { data: dailyData } = await supabase
          .from('daily_flashcards')
          .select('*')
          .eq('date', today)
          .single();

        if (dailyData && dailyData.cards && Array.isArray(dailyData.cards) && dailyData.cards.length > 0) {
          // Use AI-generated cards
          const aiCards: CardData[] = (dailyData.cards as Array<Record<string, string>>).map((card, index) => ({
            id: `ai-${today}-${index}`,
            word: card.word || '',
            meaning: card.meaning || '',
            phonetic: card.phonetic || null,
            example: card.example || null,
            category: card.category || '',
            difficulty: card.difficulty || 'medium',
            rarity: getCardRarity(seededRandom(getDailySeed(`ai-${index}`, today))),
            isAI: true,
          }));

          if (!cancelled) {
            setCards(aiCards);
            setRevealed(savedRevealed);
            setAiGenerated(true);
            setTopic(dailyData.topic || '');
            setLoading(false);
          }
          return;
        }

        // Fallback: use old seeded random from lesson_vocabularies
        const { data: allWords } = await supabase
          .from('lesson_vocabularies')
          .select('id, word, meaning, phonetic, example');

        if (!allWords || allWords.length === 0) {
          if (!cancelled) { setError('No vocabulary available'); setLoading(false); }
          return;
        }

        const seed = getDailySeed(user.id, today);
        const rng = seededRandom(seed);
        const picked = pickRandomItems(allWords, Math.min(CARDS_PER_DAY, allWords.length), rng);

        const cardsWithRarity = picked.map(w => ({
          ...w,
          phonetic: w.phonetic || null,
          example: w.example || null,
          rarity: getCardRarity(seededRandom(getDailySeed(w.id, today))),
          isAI: false,
        }));

        if (!cancelled) {
          setCards(cardsWithRarity);
          setRevealed(savedRevealed);
          setAiGenerated(false);
          setLoading(false);
        }
      } catch {
        if (!cancelled) { setError('Failed to load flashcards'); setLoading(false); }
      }
    }
    loadCards();
    return () => { cancelled = true; };
  }, [today]);

  const handleOpenBag = async (index: number) => {
    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);
    setNewlyRevealed(index);

    // Save to localStorage
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      localStorage.setItem(`flashcards_${user.id}_${today}`, JSON.stringify(newRevealed));

      // Award XP
      const card = cards[index];
      if (card) {
        const xp = XP_PER_CARD[card.rarity] || 2;
        try { await supabase.rpc('increment_xp', { user_id: user.id, amount: xp }); } catch {}
      }
    }

    // Check if all revealed
    if (newRevealed.every(Boolean)) {
      setTimeout(() => setShowConfetti(true), 500);
      setTimeout(() => setShowConfetti(false), 4000);
    }

    setTimeout(() => setNewlyRevealed(null), 1000);
  };

  const openedCount = revealed.filter(Boolean).length;
  const allOpened = openedCount === CARDS_PER_DAY;

  if (loading) return <FlashcardSkeleton />;

  if (error) {
    return (
      <div className="cyber-flashcard-page">
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontWeight: 800, color: 'var(--fc-accent)', fontFamily: 'var(--fc-font-mono)', letterSpacing: '2px' }}>{error.toUpperCase()}</h2>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 16,
              padding: '8px 24px',
              background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'var(--fc-font-mono)',
              fontSize: 11,
              letterSpacing: '2px',
            }}
          >
            RETRY
          </button>
        </div>
      </div>
    );
  }

  const totalXP = cards.filter((_, i) => revealed[i]).reduce((sum, c) => sum + (XP_PER_CARD[c.rarity] || 2), 0);
  const rarityCounts = cards.filter((_, i) => revealed[i]).reduce((acc, c) => {
    acc[c.rarity] = (acc[c.rarity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="cyber-flashcard-page">
      {showConfetti && <ConfettiEffect />}

      <DailyHeader date={today} />

      {/* AI Generated Badge */}
      {aiGenerated && (
        <div className="ai-generated-badge">
          <div className="ai-badge-inner">
            <span className="ai-badge-icon">🤖</span>
            <span className="ai-badge-text">AI GENERATED</span>
            {topic && (
              <>
                <span className="ai-badge-separator">—</span>
                <span className="ai-badge-topic">
                  {getCategoryIcon(topic)} {topic}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      <DailyProgress opened={openedCount} />

      {/* Difficulty Legend for AI cards */}
      {aiGenerated && cards.some(c => c.difficulty) && (
        <div className="difficulty-legend">
          {['easy', 'medium', 'hard'].map(diff => (
            <span key={diff} className="difficulty-tag" style={{ color: getDifficultyColor(diff) }}>
              ● {getDifficultyLabel(diff)}
            </span>
          ))}
        </div>
      )}

      <div className="mystery-bag-grid">
        {cards.map((card, i) => (
          revealed[i] ? (
            <FlashcardItem
              key={card.id}
              word={card.word}
              meaning={card.meaning}
              phonetic={card.phonetic}
              example={card.example}
              rarity={card.rarity}
              isNew={newlyRevealed === i}
              index={i}
            />
          ) : (
            <MysteryBag
              key={`bag-${i}`}
              index={i}
              gradient={BAG_COLORS[i % BAG_COLORS.length]}
              onOpen={() => handleOpenBag(i)}
              isOpened={revealed[i]}
            />
          )
        ))}
      </div>

      {allOpened && <CompletionCard totalXP={totalXP} rarities={rarityCounts} />}

      {/* Log Console */}
      <div className="cyber-console">
        <div className="cyber-console-inner">
          <div className="cyber-console-title">LOG_CONSOLE:</div>
          <div className="cyber-console-line">
            {aiGenerated
              ? 'ai_vocabulary_engine initialized ✓'
              : 'initializing lexi_scan_module_v.4.0.1...'}
          </div>
          <div className="cyber-console-line">
            {aiGenerated
              ? `daily_topic: "${topic}" loaded from neural_ai_core`
              : 'connection established with neural_thesaurus...'}
          </div>
          <div className="cyber-console-line">
            {allOpened
              ? 'all modules decrypted successfully ✓'
              : 'awaiting user authentication...'}
          </div>
          {aiGenerated && (
            <div className="cyber-console-line" style={{ color: 'var(--fc-accent)' }}>
              source: ai_generated — powered by groq_llama_3.3
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// FlashcardClient v2 AI-first
// Reads daily_flashcards first
// AI badge shows for AI cards
// Topic shows daily theme
// Difficulty legend easy/med/hard
// Console shows AI source
// LocalStorage persists state
// XP uses rarity multiplier
// Confetti on all 5 revealed
// See flashcards.css
