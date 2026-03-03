-- =============================================
-- RESET & RE-SEED: Xóa cũ, chạy lại toàn bộ A1
-- Chạy file này trong Supabase SQL Editor
-- =============================================

-- BƯỚC 1: Xóa data cũ (theo đúng thứ tự FK)
DELETE FROM public.lesson_quizzes WHERE lesson_id IN (
  SELECT id FROM public.lessons WHERE course_id = '11111111-1111-1111-1111-111111111111'
);
DELETE FROM public.lesson_dialogues WHERE lesson_id IN (
  SELECT id FROM public.lessons WHERE course_id = '11111111-1111-1111-1111-111111111111'
);
DELETE FROM public.lesson_vocabularies WHERE lesson_id IN (
  SELECT id FROM public.lessons WHERE course_id = '11111111-1111-1111-1111-111111111111'
);
DELETE FROM public.lesson_videos WHERE lesson_id IN (
  SELECT id FROM public.lessons WHERE course_id = '11111111-1111-1111-1111-111111111111'
);
DELETE FROM public.lessons WHERE course_id = '11111111-1111-1111-1111-111111111111';
DELETE FROM public.courses WHERE id = '11111111-1111-1111-1111-111111111111';

-- =============================================
-- BƯỚC 2: Tạo lại Khóa học A1
-- =============================================
INSERT INTO public.courses (id, title, description, level)
VALUES (
  '11111111-1111-1111-1111-111111111111', 
  'Tiếng Anh Vỡ Lòng (A1)', 
  'Khóa học nền móng nhất cho người mới bắt đầu. Gồm 5 bài học thiết yếu về Bảng chữ cái, Chào hỏi và Từ vựng cốt lõi.', 
  'A1'
);

-- =============================================
-- BÀI 1: Bảng chữ cái & Đánh vần tên
-- =============================================
INSERT INTO public.lessons (id, course_id, title, description, topics, order_index, xp_reward)
VALUES (
  'a1b2c3d4-0001-0001-0001-a1b2c3d40001',
  '11111111-1111-1111-1111-111111111111',
  'Bài 1: Bảng chữ cái & Đánh vần tên',
  'Nhập môn Tiếng Anh: Cách đọc 26 chữ cái và đánh vần tên bạn.',
  '{"Bảng chữ cái", "Đánh vần"}',
  1, 50
);
INSERT INTO public.lesson_videos (lesson_id, url, title, order_index)
VALUES ('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 'https://www.youtube.com/embed/75p-N9YKqNo', 'The Alphabet Song', 1);
INSERT INTO public.lesson_vocabularies (lesson_id, word, phonetic, meaning, example) VALUES 
('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 'Name', '/neɪm/', 'Tên', 'My name is Tuan.'),
('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 'Spell', '/spel/', 'Đánh vần', 'How do you spell your name?');
INSERT INTO public.lesson_dialogues (lesson_id, title, content, order_index)
VALUES ('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 'Hỏi cách đánh vần tên',
  '[{"character":"Sarah","text":"Hello, I am Sarah. What is your name?"},{"character":"Tuan","text":"My name is Tuan."},{"character":"Sarah","text":"How do you spell your name?"},{"character":"Tuan","text":"T - U - A - N."}]'::jsonb, 1);
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, order_index)
VALUES ('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 'Để hỏi ai đó đánh vần tên, bạn dùng câu nào?',
  '["What is your name?","How do you spell your name?","How are you?"]'::jsonb, 'How do you spell your name?', 1);

-- =============================================
-- BÀI 2: Giao tiếp cơ bản
-- =============================================
INSERT INTO public.lessons (id, course_id, title, description, topics, order_index, xp_reward)
VALUES ('a1b2c3d4-0002-0002-0002-a1b2c3d40002', '11111111-1111-1111-1111-111111111111',
  'Bài 2: Giao tiếp cơ bản (Hello, How are you?)',
  'Các mẫu câu cơ bản nhất để chào hỏi và hỏi thăm sức khỏe.',
  '{"Giao tiếp","Chào hỏi"}', 2, 50);
INSERT INTO public.lesson_vocabularies (lesson_id, word, phonetic, meaning, example) VALUES 
('a1b2c3d4-0002-0002-0002-a1b2c3d40002', 'Hello', '/həˈləʊ/', 'Xin chào', 'Hello, how are you?'),
('a1b2c3d4-0002-0002-0002-a1b2c3d40002', 'Morning', '/ˈmɔː.nɪŋ/', 'Buổi sáng', 'Good morning!');
INSERT INTO public.lesson_dialogues (lesson_id, title, content, order_index)
VALUES ('a1b2c3d4-0002-0002-0002-a1b2c3d40002', 'Hỏi thăm sức khỏe buổi sáng',
  '[{"character":"Tom","text":"Good morning, Sarah. How are you today?"},{"character":"Sarah","text":"I am fine, thank you. And you?"},{"character":"Tom","text":"I am great! Thanks for asking."}]'::jsonb, 1);
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, order_index)
VALUES ('a1b2c3d4-0002-0002-0002-a1b2c3d40002', 'Câu nào dùng để chào buổi sáng trang trọng?',
  '["What is up?","Hey!","Good morning"]'::jsonb, 'Good morning', 1);

-- =============================================
-- BÀI 3: Động từ TO BE
-- =============================================
INSERT INTO public.lessons (id, course_id, title, description, topics, order_index, xp_reward)
VALUES ('a1b2c3d4-0003-0003-0003-a1b2c3d40003', '11111111-1111-1111-1111-111111111111',
  'Bài 3: Động từ TO BE (Am/Is/Are)',
  'Động từ quan trọng nhất trong tiếng Anh. Cách dùng Khẳng định, Phủ định và Nghi vấn.',
  '{"Ngữ pháp","TO BE"}', 3, 50);
INSERT INTO public.lesson_vocabularies (lesson_id, word, phonetic, meaning, example) VALUES 
('a1b2c3d4-0003-0003-0003-a1b2c3d40003', 'Am', '/æm/', 'Là/Thì (dùng với I)', 'I am a student.'),
('a1b2c3d4-0003-0003-0003-a1b2c3d40003', 'Is', '/ɪz/', 'Là/Thì (dùng với He/She/It)', 'She is a doctor.'),
('a1b2c3d4-0003-0003-0003-a1b2c3d40003', 'Are', '/ɑːr/', 'Là/Thì (dùng với You/We/They)', 'They are my friends.');
INSERT INTO public.lesson_dialogues (lesson_id, title, content, order_index)
VALUES ('a1b2c3d4-0003-0003-0003-a1b2c3d40003', 'Giới thiệu nghề nghiệp',
  '[{"character":"Lan","text":"What do you do? Are you a student?"},{"character":"Nam","text":"Yes, I am a student. And she is my teacher."},{"character":"Lan","text":"Oh, nice! We are classmates then!"}]'::jsonb, 1);
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, order_index) VALUES 
('a1b2c3d4-0003-0003-0003-a1b2c3d40003', 'Điền từ đúng: "She ___ a doctor."', '["am","is","are"]'::jsonb, 'is', 1),
('a1b2c3d4-0003-0003-0003-a1b2c3d40003', 'Điền từ đúng: "They ___ my friends."', '["am","is","are"]'::jsonb, 'are', 2);

-- =============================================
-- BÀI 4: Giới thiệu bản thân
-- =============================================
INSERT INTO public.lessons (id, course_id, title, description, topics, order_index, xp_reward)
VALUES ('a1b2c3d4-0004-0004-0004-a1b2c3d40004', '11111111-1111-1111-1111-111111111111',
  'Bài 4: Giới thiệu bản thân cơ bản',
  'Ghép từ vựng và câu để tự giới thiệu Tên, Tuổi, Quê quán.',
  '{"Giao tiếp","Kỹ năng nói"}', 4, 50);
INSERT INTO public.lesson_vocabularies (lesson_id, word, phonetic, meaning, example) VALUES 
('a1b2c3d4-0004-0004-0004-a1b2c3d40004', 'From', '/frɒm/', 'Từ / Đến từ', 'I am from Vietnam.'),
('a1b2c3d4-0004-0004-0004-a1b2c3d40004', 'Years old', '/jɪərz əʊld/', 'Tuổi', 'I am 20 years old.');
INSERT INTO public.lesson_dialogues (lesson_id, title, content, order_index)
VALUES ('a1b2c3d4-0004-0004-0004-a1b2c3d40004', 'Giới thiệu bản thân lần đầu gặp',
  '[{"character":"David","text":"Hello! My name is David. I am 25 years old."},{"character":"Linh","text":"Nice to meet you, David! I am Linh. I am from Vietnam."},{"character":"David","text":"I am from London, UK. Nice to meet you too!"}]'::jsonb, 1);
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, order_index)
VALUES ('a1b2c3d4-0004-0004-0004-a1b2c3d40004', 'Câu nào đúng để nói bạn đến từ Việt Nam?',
  '["I from Vietnam.","I am from Vietnam.","I is from Vietnam."]'::jsonb, 'I am from Vietnam.', 1);

-- =============================================
-- BÀI 5: Số đếm 1-100
-- =============================================
INSERT INTO public.lessons (id, course_id, title, description, topics, order_index, xp_reward)
VALUES ('a1b2c3d4-0005-0005-0005-a1b2c3d40005', '11111111-1111-1111-1111-111111111111',
  'Bài 5: Số đếm vỡ lòng (1 đến 100)',
  'Sử dụng số để hỏi và nói Tuổi, Số điện thoại và Giá tiền.',
  '{"Từ vựng","Số đếm"}', 5, 50);
INSERT INTO public.lesson_videos (lesson_id, url, title, order_index)
VALUES ('a1b2c3d4-0005-0005-0005-a1b2c3d40005', 'https://www.youtube.com/embed/e0dJWfQHF8Y', 'Numbers 1-100 Song', 1);
INSERT INTO public.lesson_vocabularies (lesson_id, word, phonetic, meaning, example) VALUES 
('a1b2c3d4-0005-0005-0005-a1b2c3d40005', 'One', '/wʌn/', 'Một', 'I have one book.'),
('a1b2c3d4-0005-0005-0005-a1b2c3d40005', 'Zero', '/ˈzɪərəʊ/', 'Không', 'Zero calories.'),
('a1b2c3d4-0005-0005-0005-a1b2c3d40005', 'Hundred', '/ˈhʌndrəd/', 'Một trăm', 'One hundred students.');
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, order_index)
VALUES ('a1b2c3d4-0005-0005-0005-a1b2c3d40005', 'Số 0 trong tiếng Anh đọc là gì?',
  '["One","Oh / Zero","None"]'::jsonb, 'Oh / Zero', 1);
