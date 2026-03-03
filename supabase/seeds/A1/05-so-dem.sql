-- =============================================
-- Bài 5: Số đếm vỡ lòng (1 đến 100)
-- Khóa: A1 | XP: 50 | Chủ đề: Từ vựng, Số đếm
-- =============================================

INSERT INTO public.lessons (id, course_id, title, description, topics, order_index, xp_reward)
VALUES (
  'a1b2c3d4-0005-0005-0005-a1b2c3d40005',
  '11111111-1111-1111-1111-111111111111',
  'Bài 5: Số đếm vỡ lòng (1 đến 100)',
  'Sử dụng số để hỏi và nói Tuổi, Số điện thoại và Giá tiền.',
  '{"Từ vựng", "Số đếm"}',
  5, 50
);

INSERT INTO public.lesson_videos (lesson_id, url, title, order_index)
VALUES ('a1b2c3d4-0005-0005-0005-a1b2c3d40005', 'https://www.youtube.com/embed/e0dJWfQHF8Y', 'Numbers 1-100 Song', 1);

INSERT INTO public.lesson_vocabularies (lesson_id, word, phonetic, meaning, example)
VALUES 
('a1b2c3d4-0005-0005-0005-a1b2c3d40005', 'One', '/wʌn/', 'Một', 'I have one book.'),
('a1b2c3d4-0005-0005-0005-a1b2c3d40005', 'Zero', '/ˈzɪərəʊ/', 'Không', 'Zero calories.'),
('a1b2c3d4-0005-0005-0005-a1b2c3d40005', 'Hundred', '/ˈhʌndrəd/', 'Một trăm', 'One hundred students.');

INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, order_index)
VALUES (
  'a1b2c3d4-0005-0005-0005-a1b2c3d40005',
  'Số 0 trong tiếng Anh đọc là gì?',
  '["One", "Oh / Zero", "None"]'::jsonb,
  'Oh / Zero',
  1
);
