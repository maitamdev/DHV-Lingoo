# Database Schema

## profiles
id, full_name, email, avatar_url, level, xp, streak

## courses
id, title, description, level

## lessons
id, course_id, title, content

## lesson_vocabularies
id, lesson_id, word, meaning, phonetic, example

## lesson_progress
id, user_id, lesson_id, completed, xp_earned
