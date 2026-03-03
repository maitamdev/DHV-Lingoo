// Custom hook for managing daily flashcard state
'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getDailySeed, seededRandom, pickRandomItems, getTodayDateString, getCardRarity } from '@/lib/flashcard-seed';
import { CARDS_PER_DAY, XP_PER_CARD } from '@/lib/flashcard-config';

interface CardData {
  id: string;
  word: string;
  meaning: string;
  phonetic: string | null;
  example: string | null;
  rarity: string;
}

export function useFlashcards() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>(Array(CARDS_PER_DAY).fill(false));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const today = getTodayDateString();

  const loadCards = useCallback(async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError('Please log in'); setLoading(false); return; }

      const saved = localStorage.getItem(`fc_${user.id}_${today}`);
      if (saved) setRevealed(JSON.parse(saved));

      const { data: words } = await supabase.from('lesson_vocabularies').select('id, word, meaning, phonetic, example');
      if (!words?.length) { setError('No vocabulary'); setLoading(false); return; }

      const rng = seededRandom(getDailySeed(user.id, today));
      const picked = pickRandomItems(words, Math.min(CARDS_PER_DAY, words.length), rng);
      const withRarity = picked.map(w => ({
        ...w,
        phonetic: w.phonetic || null,
        example: w.example || null,
        rarity: getCardRarity(seededRandom(getDailySeed(w.id, today))),
      }));

      setCards(withRarity);
      setLoading(false);
    } catch { setError('Failed to load'); setLoading(false); }
  }, [today]);

  const revealCard = async (index: number) => {
    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) localStorage.setItem(`fc_${user.id}_${today}`, JSON.stringify(newRevealed));
  };

  const openedCount = revealed.filter(Boolean).length;
  const allOpened = openedCount === CARDS_PER_DAY;
  const totalXP = cards.filter((_, i) => revealed[i]).reduce((s, c) => s + (XP_PER_CARD[c.rarity] || 2), 0);

  useEffect(() => { loadCards(); }, [loadCards]);

  return { cards, revealed, loading, error, today, openedCount, allOpened, totalXP, revealCard, loadCards };
}
