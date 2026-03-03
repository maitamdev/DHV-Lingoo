-- =============================================
-- Bài 4: Giới thiệu bản thân cơ bản
-- Khóa: A1 | XP: 50 | Chủ đề: Giao tiếp, Kỹ năng nói
-- =============================================

INSERT INTO public.lessons (id, course_id, title, description, topics, order_index, xp_reward)
VALUES (
  'a1b2c3d4-0004-0004-0004-a1b2c3d40004',
  '11111111-1111-1111-1111-111111111111',
  'Bài 4: Giới thiệu bản thân cơ bản',
  'Ghép từ vựng và câu để tự giới thiệu Tên, Tuổi, Quê quán.',
  '{"Giao tiếp", "Kỹ năng nói"}',
  4, 50
);

INSERT INTO public.lesson_vocabularies (lesson_id, word, phonetic, meaning, example)
VALUES 
('a1b2c3d4-0004-0004-0004-a1b2c3d40004', 'From', '/frɒm/', 'Từ / Đến từ', 'I am from Vietnam.'),
('a1b2c3d4-0004-0004-0004-a1b2c3d40004', 'Years old', '/jɪərz əʊld/', 'Tuổi', 'I am 20 years old.');

INSERT INTO public.lesson_dialogues (lesson_id, title, content, order_index)
VALUES (
  'a1b2c3d4-0004-0004-0004-a1b2c3d40004', 
  'Giới thiệu bản thân lần đầu gặp',
  '[
    {"character": "David", "text": "Hello! My name is David. I am 25 years old."},
    {"character": "Linh", "text": "Nice to meet you, David! I am Linh. I am from Vietnam."},
    {"character": "David", "text": "I am from London, UK. Nice to meet you too!"}
  ]'::jsonb,
  1
);

INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, order_index)
VALUES (
  'a1b2c3d4-0004-0004-0004-a1b2c3d40004',
  'Câu nào đúng để nói bạn đến từ Việt Nam?',
  '["I from Vietnam.", "I am from Vietnam.", "I is from Vietnam."]'::jsonb,
  'I am from Vietnam.',
  1
);
