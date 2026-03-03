// Client-side flashcard page with state management
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getDailySeed, seededRandom, pickRandomItems, getTodayDateString, getCardRarity } from '@/lib/flashcard-seed';
import { CARDS_PER_DAY, BAG_COLORS, XP_PER_CARD } from '@/lib/flashcard-config';
import { MysteryBag, FlashcardItem, DailyProgress, ConfettiEffect, CompletionCard, DailyHeader, FlashcardSkeleton } from '@/components/flashcard';
import './flashcards.css';

interface CardData {
  id: string;
  word: string;
  meaning: string;
  phonetic: string | null;
  example: string | null;
  rarity: string;
}

export default function FlashcardClient() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false, false, false]);
  const [newlyRevealed, setNewlyRevealed] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [today] = useState(getTodayDateString());

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
        }));

        if (!cancelled) {
          setCards(cardsWithRarity);
          setRevealed(savedRevealed);
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
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>😢</div>
        <h2 style={{ fontWeight: 800 }}>{error}</h2>
        <button onClick={() => window.location.reload()} style={{ marginTop: 16, padding: '8px 24px', background: '#6366f1', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
          Try again
        </button>
      </div>
    );
  }

  const totalXP = cards.filter((_, i) => revealed[i]).reduce((sum, c) => sum + (XP_PER_CARD[c.rarity] || 2), 0);
  const rarityCounts = cards.filter((_, i) => revealed[i]).reduce((acc, c) => {
    acc[c.rarity] = (acc[c.rarity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 50%, #f8fafc 100%)' }}>
      {showConfetti && <ConfettiEffect />}

      <DailyHeader date={today} />
      <DailyProgress opened={openedCount} />

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
    </div>
  );
}


