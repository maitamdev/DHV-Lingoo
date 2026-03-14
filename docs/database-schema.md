# Database Schema

## Tables
1. profiles - User information and stats
2. courses - Course definitions
3. lessons - Individual lessons
4. lesson_vocabularies - Vocabulary items
5. lesson_progress - User lesson progress
6. user_achievements - Unlocked achievements
7. chat_messages - AI chat history
8. daily_flashcards - Daily flashcard records

## Security
- Row Level Security (RLS) on all tables
- Users can only access their own data
- Admin role can access all data
