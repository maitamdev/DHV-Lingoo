-- =============================================
-- Bài 2: Giao tiếp cơ bản (Hello, How are you?)
-- Khóa: A1 | XP: 50 | Chủ đề: Giao tiếp, Chào hỏi
-- =============================================

INSERT INTO public.lessons (id, course_id, title, description, topics, order_index, xp_reward)
VALUES (
  'a1b2c3d4-0002-0002-0002-a1b2c3d40002',
  '11111111-1111-1111-1111-111111111111',
  'Bài 2: Giao tiếp cơ bản (Hello, How are you?)',
  'Các mẫu câu cơ bản nhất để chào hỏi và hỏi thăm sức khỏe.',
  '{"Giao tiếp", "Chào hỏi"}',
  2, 50
);

INSERT INTO public.lesson_vocabularies (lesson_id, word, phonetic, meaning, example)
VALUES 
('a1b2c3d4-0002-0002-0002-a1b2c3d40002', 'Hello', '/həˈləʊ/', 'Xin chào', 'Hello, how are you?'),
('a1b2c3d4-0002-0002-0002-a1b2c3d40002', 'Morning', '/ˈmɔː.nɪŋ/', 'Buổi sáng', 'Good morning!');

INSERT INTO public.lesson_dialogues (lesson_id, title, content, order_index)
VALUES (
  'a1b2c3d4-0002-0002-0002-a1b2c3d40002', 
  'Hỏi thăm sức khỏe buổi sáng',
  '[
    {"character": "Tom", "text": "Good morning, Sarah. How are you today?"},
    {"character": "Sarah", "text": "I am fine, thank you. And you?"},
    {"character": "Tom", "text": "I am great! Thanks for asking."}
  ]'::jsonb,
  1
);

INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, order_index)
VALUES (
  'a1b2c3d4-0002-0002-0002-a1b2c3d40002',
  'Câu nào dùng để chào buổi sáng trang trọng?',
  '["What is up?", "Hey!", "Good morning"]'::jsonb,
  'Good morning',
  1
);
