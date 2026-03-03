# Daily Flashcards - Mystery Bag Feature

## Overview
Each user receives 5 unique vocabulary flashcards per day, presented as mystery bags.

## How It Works
1. Cards are deterministically chosen using seeded random (userId + date)
2. Same user gets same cards each day (consistent)
3. Different users get different cards
4. Cards have rarities: Common (45%), Uncommon (25%), Rare (15%), Epic (10%), Legendary (5%)

## XP Rewards
- Common: 2 XP
- Uncommon: 3 XP
- Rare: 5 XP
- Epic: 8 XP
- Legendary: 15 XP

## Technical
- Seeded PRNG ensures consistency without database storage
- Progress saved in localStorage
- 3D card flip with CSS transforms
- Particle burst on bag opening
- Confetti celebration on completion
