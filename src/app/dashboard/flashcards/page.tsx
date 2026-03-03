// Daily Flashcards - Mystery Bag Feature
// Each user gets 5 unique flashcards per day based on seeded random

import type { Metadata } from 'next';
import FlashcardClient from './FlashcardClient';

export const metadata: Metadata = {
  title: 'Daily Flashcards | DHV-Lingoo',
  description: 'Open 5 mystery bags each day to discover new vocabulary',
  openGraph: {
    title: 'Daily Flashcards | DHV-Lingoo',
    description: 'Open 5 mystery bags to learn new vocabulary every day',
  },
};

export default function FlashcardsPage() {
  return <FlashcardClient />;
}

