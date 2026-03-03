-- =============================================
-- Bài 3: Động từ TO BE (Am/Is/Are)
-- Khóa: A1 | XP: 50 | Chủ đề: Ngữ pháp, TO BE
-- =============================================

INSERT INTO public.lessons (id, course_id, title, description, topics, order_index, xp_reward)
VALUES (
  'a1b2c3d4-0003-0003-0003-a1b2c3d40003',
  '11111111-1111-1111-1111-111111111111',
  'Bài 3: Động từ TO BE (Am/Is/Are)',
  'Động từ quan trọng nhất trong tiếng Anh. Cách sử dụng Khẳng định, Phủ định và Nghi vấn.',
  '{"Ngữ pháp", "TO BE"}',
  3, 50
);

INSERT INTO public.lesson_vocabularies (lesson_id, word, phonetic, meaning, example)
VALUES 
('a1b2c3d4-0003-0003-0003-a1b2c3d40003', 'Am', '/æm/', 'Là/Thì (dùng với I)', 'I am a student.'),
('a1b2c3d4-0003-0003-0003-a1b2c3d40003', 'Is', '/ɪz/', 'Là/Thì (dùng với He/She/It)', 'She is a doctor.'),
('a1b2c3d4-0003-0003-0003-a1b2c3d40003', 'Are', '/ɑːr/', 'Là/Thì (dùng với You/We/They)', 'They are my friends.');

INSERT INTO public.lesson_dialogues (lesson_id, title, content, order_index)
VALUES (
  'a1b2c3d4-0003-0003-0003-a1b2c3d40003', 
  'Giới thiệu nghề nghiệp',
  '[
    {"character": "Lan", "text": "What do you do? Are you a student?"},
    {"character": "Nam", "text": "Yes, I am a student. And she is my teacher."},
    {"character": "Lan", "text": "Oh, nice! We are classmates then!"}
  ]'::jsonb,
  1
);

INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, order_index)
VALUES 
(
  'a1b2c3d4-0003-0003-0003-a1b2c3d40003',
  'Điền từ đúng: "She ___ a doctor."',
  '["am", "is", "are"]'::jsonb,
  'is', 1
),
(
  'a1b2c3d4-0003-0003-0003-a1b2c3d40003',
  'Điền từ đúng: "They ___ my friends."',
  '["am", "is", "are"]'::jsonb,
  'are', 2
);
