-- =============================================
-- BÀI 1: Bảng chữ cái & Đánh vần tên (CHI TIẾT ĐẦY ĐỦ)
-- 7 phần: Video → Summary → Listening → Speaking → Practice → Quiz → Homework
-- Khóa: A1 | XP: 100 | Chủ đề: Bảng chữ cái, Đánh vần
-- =============================================

-- Xóa data cũ bài 1
DELETE FROM public.lesson_exercises WHERE lesson_id = 'a1b2c3d4-0001-0001-0001-a1b2c3d40001';
DELETE FROM public.lesson_sections WHERE lesson_id = 'a1b2c3d4-0001-0001-0001-a1b2c3d40001';
DELETE FROM public.lesson_quizzes WHERE lesson_id = 'a1b2c3d4-0001-0001-0001-a1b2c3d40001';
DELETE FROM public.lesson_dialogues WHERE lesson_id = 'a1b2c3d4-0001-0001-0001-a1b2c3d40001';
DELETE FROM public.lesson_vocabularies WHERE lesson_id = 'a1b2c3d4-0001-0001-0001-a1b2c3d40001';
DELETE FROM public.lesson_videos WHERE lesson_id = 'a1b2c3d4-0001-0001-0001-a1b2c3d40001';
DELETE FROM public.lessons WHERE id = 'a1b2c3d4-0001-0001-0001-a1b2c3d40001';

-- =============================================
-- LESSON
-- =============================================
INSERT INTO public.lessons (id, course_id, title, description, topics, order_index, xp_reward)
VALUES (
  'a1b2c3d4-0001-0001-0001-a1b2c3d40001',
  '11111111-1111-1111-1111-111111111111',
  'Bài 1: Bảng chữ cái & Đánh vần tên',
  'Nhập môn Tiếng Anh: Học thuộc 26 chữ cái, phân biệt phát âm dễ nhầm, và tự tin đánh vần tên mình bằng tiếng Anh.',
  '{"Bảng chữ cái","Đánh vần","Phát âm"}',
  1, 100
);

-- =============================================
-- 1️⃣ VIDEO — Alphabet Song & Phát âm
-- =============================================
INSERT INTO public.lesson_videos (lesson_id, url, title, order_index) VALUES
('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 'https://www.youtube.com/embed/75p-N9YKqNo', 'ABC Song — Học thuộc 26 chữ cái', 1),
('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 'https://www.youtube.com/embed/hq3yfQnllfQ', 'Cách phát âm chuẩn từng chữ cái A-Z', 2);

-- =============================================
-- 2️⃣ TÓM TẮT KIẾN THỨC — Bảng chữ cái + chữ dễ nhầm
-- =============================================
INSERT INTO public.lesson_sections (lesson_id, type, title, content, order_index) VALUES
('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 'summary', 'Bảng 26 chữ cái tiếng Anh', '{
  "description": "Tiếng Anh có 26 chữ cái, gồm 21 phụ âm và 5 nguyên âm (A, E, I, O, U).",
  "alphabet": [
    {"letter": "A", "phonetic": "/eɪ/"},
    {"letter": "B", "phonetic": "/biː/"},
    {"letter": "C", "phonetic": "/siː/"},
    {"letter": "D", "phonetic": "/diː/"},
    {"letter": "E", "phonetic": "/iː/"},
    {"letter": "F", "phonetic": "/ef/"},
    {"letter": "G", "phonetic": "/dʒiː/"},
    {"letter": "H", "phonetic": "/eɪtʃ/"},
    {"letter": "I", "phonetic": "/aɪ/"},
    {"letter": "J", "phonetic": "/dʒeɪ/"},
    {"letter": "K", "phonetic": "/keɪ/"},
    {"letter": "L", "phonetic": "/el/"},
    {"letter": "M", "phonetic": "/em/"},
    {"letter": "N", "phonetic": "/en/"},
    {"letter": "O", "phonetic": "/əʊ/"},
    {"letter": "P", "phonetic": "/piː/"},
    {"letter": "Q", "phonetic": "/kjuː/"},
    {"letter": "R", "phonetic": "/ɑːr/"},
    {"letter": "S", "phonetic": "/es/"},
    {"letter": "T", "phonetic": "/tiː/"},
    {"letter": "U", "phonetic": "/juː/"},
    {"letter": "V", "phonetic": "/viː/"},
    {"letter": "W", "phonetic": "/ˈdʌb.əl.juː/"},
    {"letter": "X", "phonetic": "/eks/"},
    {"letter": "Y", "phonetic": "/waɪ/"},
    {"letter": "Z", "phonetic": "/zed/ hoặc /ziː/"}
  ],
  "vowels": ["A", "E", "I", "O", "U"],
  "consonants": ["B","C","D","F","G","H","J","K","L","M","N","P","Q","R","S","T","V","W","X","Y","Z"]
}'::jsonb, 1),

('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 'summary', '⚠️ Các cặp chữ dễ nhầm lẫn', '{
  "description": "Người Việt thường phát âm nhầm các cặp chữ sau. Hãy chú ý sự khác biệt!",
  "confusing_pairs": [
    {"pair": "B /biː/ vs P /piː/", "tip": "B rung thanh quản, P bật hơi"},
    {"pair": "G /dʒiː/ vs J /dʒeɪ/", "tip": "G kết thúc bằng /iː/, J kết thúc bằng /eɪ/"},
    {"pair": "M /em/ vs N /en/", "tip": "M đóng môi, N đặt lưỡi lên vòm"},
    {"pair": "V /viː/ vs W /ˈdʌb.əl.juː/", "tip": "V cắn môi dưới, W tròn môi"},
    {"pair": "I /aɪ/ vs E /iː/", "tip": "I = ai (ngắn), E = i (dài)"},
    {"pair": "A /eɪ/ vs E /iː/", "tip": "A = ây, E = ii"}
  ]
}'::jsonb, 2);

-- =============================================
-- 3️⃣ TỪ VỰNG TRỌNG TÂM
-- =============================================
INSERT INTO public.lesson_vocabularies (lesson_id, word, phonetic, meaning, example) VALUES
('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 'Alphabet', '/ˈæl.fə.bet/', 'Bảng chữ cái', 'The English alphabet has 26 letters.'),
('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 'Letter', '/ˈlet.ər/', 'Chữ cái', 'A is the first letter.'),
('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 'Vowel', '/vaʊəl/', 'Nguyên âm', 'A, E, I, O, U are vowels.'),
('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 'Consonant', '/ˈkɒn.sə.nənt/', 'Phụ âm', 'B, C, D are consonants.'),
('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 'Name', '/neɪm/', 'Tên', 'My name is Tuan.'),
('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 'Spell', '/spel/', 'Đánh vần', 'How do you spell your name?'),
('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 'Uppercase', '/ˈʌp.ər.keɪs/', 'Chữ hoa', 'A is uppercase.'),
('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 'Lowercase', '/ˈloʊ.ər.keɪs/', 'Chữ thường', 'a is lowercase.');

-- =============================================
-- 4️⃣ HỘI THOẠI MẪU
-- =============================================
INSERT INTO public.lesson_dialogues (lesson_id, title, content, order_index) VALUES
('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 'Hỏi và đánh vần tên tại lớp học',
'[
  {"character": "Teacher", "text": "Good morning, class! Let me call the roll. What is your name?"},
  {"character": "Tuan", "text": "My name is Tuan."},
  {"character": "Teacher", "text": "Can you spell your name for me, please?"},
  {"character": "Tuan", "text": "Sure! T - U - A - N."},
  {"character": "Teacher", "text": "Thank you, Tuan! And you?"},
  {"character": "Linh", "text": "I am Linh. L - I - N - H."},
  {"character": "Teacher", "text": "Great! Welcome to the class!"}
]'::jsonb, 1),

('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 'Đánh vần email tại quầy lễ tân',
'[
  {"character": "Receptionist", "text": "Can I have your email address, please?"},
  {"character": "Minh", "text": "Sure, it is minh@gmail.com."},
  {"character": "Receptionist", "text": "Sorry, can you spell that?"},
  {"character": "Minh", "text": "M - I - N - H, at gmail dot com."},
  {"character": "Receptionist", "text": "M - I - N - H. Got it! Thank you."}
]'::jsonb, 2);

-- =============================================
-- 5️⃣ LISTENING — Bài tập nghe chữ & nghe đánh vần
-- =============================================
INSERT INTO public.lesson_exercises (lesson_id, type, title, instruction, content, order_index) VALUES
('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 'listening', 'Nghe và chọn chữ cái đúng', 
'Nghe phát âm và chọn chữ cái mà bạn nghe được.', '{
  "exercises": [
    {"audio_hint": "/biː/", "options": ["B", "P", "D"], "correct": "B"},
    {"audio_hint": "/dʒiː/", "options": ["J", "G", "Z"], "correct": "G"},
    {"audio_hint": "/ˈdʌb.əl.juː/", "options": ["V", "U", "W"], "correct": "W"},
    {"audio_hint": "/eɪtʃ/", "options": ["H", "A", "I"], "correct": "H"},
    {"audio_hint": "/waɪ/", "options": ["I", "Y", "E"], "correct": "Y"}
  ]
}'::jsonb, 1),

('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 'listening', 'Nghe đánh vần và viết tên', 
'Nghe chuỗi chữ cái được đánh vần và ghép thành tên.', '{
  "exercises": [
    {"spelled_letters": ["T","U","A","N"], "answer": "TUAN"},
    {"spelled_letters": ["L","I","N","H"], "answer": "LINH"},
    {"spelled_letters": ["H","O","A","N","G"], "answer": "HOANG"},
    {"spelled_letters": ["M","A","I"], "answer": "MAI"}
  ]
}'::jsonb, 2);

-- =============================================
-- 6️⃣ SPEAKING — Ghi âm đánh vần tên
-- =============================================
INSERT INTO public.lesson_exercises (lesson_id, type, title, instruction, content, order_index) VALUES
('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 'speaking', 'Đánh vần tên của bạn', 
'Bấm ghi âm và đánh vần tên của bạn thật rõ ràng, từng chữ một.', '{
  "prompts": [
    {"task": "Đánh vần tên (First Name) của bạn", "example": "T - U - A - N"},
    {"task": "Đánh vần họ (Last Name) của bạn", "example": "N - G - U - Y - E - N"},
    {"task": "Đánh vần email của bạn", "example": "T - U - A - N at G - M - A - I - L dot C - O - M"}
  ]
}'::jsonb, 3),

('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 'speaking', 'Đọc to 5 nguyên âm', 
'Bấm ghi âm và đọc to 5 nguyên âm: A, E, I, O, U.', '{
  "prompts": [
    {"task": "Đọc to: A /eɪ/", "phonetic": "/eɪ/"},
    {"task": "Đọc to: E /iː/", "phonetic": "/iː/"},
    {"task": "Đọc to: I /aɪ/", "phonetic": "/aɪ/"},
    {"task": "Đọc to: O /əʊ/", "phonetic": "/əʊ/"},
    {"task": "Đọc to: U /juː/", "phonetic": "/juː/"}
  ]
}'::jsonb, 4);

-- =============================================
-- 7️⃣ PRACTICE — Bài tập drag & match
-- =============================================
INSERT INTO public.lesson_exercises (lesson_id, type, title, instruction, content, order_index) VALUES
('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 'practice', 'Nối chữ hoa và chữ thường', 
'Nối mỗi chữ hoa với chữ thường tương ứng.', '{
  "type": "matching",
  "pairs": [
    {"left": "A", "right": "a"},
    {"left": "B", "right": "b"},
    {"left": "G", "right": "g"},
    {"left": "Q", "right": "q"},
    {"left": "R", "right": "r"},
    {"left": "W", "right": "w"}
  ]
}'::jsonb, 5),

('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 'practice', 'Điền chữ cái còn thiếu', 
'Hoàn thành chuỗi bảng chữ cái bằng cách điền chữ còn thiếu.', '{
  "type": "fill_blank",
  "exercises": [
    {"sequence": ["A", "B", "___", "D", "E"], "answer": "C"},
    {"sequence": ["F", "G", "H", "___", "J"], "answer": "I"},
    {"sequence": ["___", "V", "W", "X", "Y"], "answer": "U"},
    {"sequence": ["L", "M", "___", "O", "P"], "answer": "N"},
    {"sequence": ["R", "___", "T", "U", "V"], "answer": "S"}
  ]
}'::jsonb, 6),

('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 'practice', 'Sắp xếp chữ cái thành tên', 
'Kéo thả các chữ cái xáo trộn để ghép thành tên đúng.', '{
  "type": "unscramble",
  "exercises": [
    {"scrambled": ["N","T","U","A"], "answer": "TUAN"},
    {"scrambled": ["H","N","I","L"], "answer": "LINH"},
    {"scrambled": ["A","O","H","N","G"], "answer": "HOANG"},
    {"scrambled": ["O","H","A"], "answer": "HOA"}
  ]
}'::jsonb, 7);

-- =============================================
-- 8️⃣ MINI QUIZ — Phải đậu mới mở Bài 2
-- =============================================
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, order_index) VALUES
('a1b2c3d4-0001-0001-0001-a1b2c3d40001',
  'Bảng chữ cái tiếng Anh có bao nhiêu chữ cái?',
  '["24","26","28","30"]'::jsonb, '26', 1),

('a1b2c3d4-0001-0001-0001-a1b2c3d40001',
  'Đâu là 5 nguyên âm (vowels) trong tiếng Anh?',
  '["A, B, C, D, E","A, E, I, O, U","B, D, F, G, H","A, E, O, U, Y"]'::jsonb, 'A, E, I, O, U', 2),

('a1b2c3d4-0001-0001-0001-a1b2c3d40001',
  'Để hỏi ai đó đánh vần tên, bạn dùng câu nào?',
  '["What is your name?","How do you spell your name?","How are you?","Where are you from?"]'::jsonb, 'How do you spell your name?', 3),

('a1b2c3d4-0001-0001-0001-a1b2c3d40001',
  'Chữ "W" được phát âm là gì?',
  '["/viː/","/juː/","/ˈdʌb.əl.juː/","/waɪ/"]'::jsonb, '/ˈdʌb.əl.juː/', 4),

('a1b2c3d4-0001-0001-0001-a1b2c3d40001',
  'Tên "LINH" đánh vần đúng là?',
  '["L - I - N - G","L - I - N - H","L - E - N - H","L - I - M - H"]'::jsonb, 'L - I - N - H', 5),

('a1b2c3d4-0001-0001-0001-a1b2c3d40001',
  'Chữ nào KHÔNG phải là nguyên âm?',
  '["A","E","F","O"]'::jsonb, 'F', 6),

('a1b2c3d4-0001-0001-0001-a1b2c3d40001',
  '"Uppercase" nghĩa là gì?',
  '["Chữ thường","Chữ hoa","Chữ viết tay","Chữ in"]'::jsonb, 'Chữ hoa', 7),

('a1b2c3d4-0001-0001-0001-a1b2c3d40001',
  'Cặp nào KHÁC nhau về phát âm?',
  '["B và B","G /dʒiː/ và J /dʒeɪ/","A và A","M và M"]'::jsonb, 'G /dʒiː/ và J /dʒeɪ/', 8);

-- =============================================
-- 9️⃣ HOMEWORK — Gợi ý luyện thêm tại nhà
-- =============================================
INSERT INTO public.lesson_sections (lesson_id, type, title, content, order_index) VALUES
('a1b2c3d4-0001-0001-0001-a1b2c3d40001', 'homework', '📝 Bài tập về nhà', '{
  "description": "Luyện tập thêm tại nhà để nhớ lâu hơn!",
  "tasks": [
    {"icon": "✍️", "task": "Viết 26 chữ cái (hoa + thường) ra giấy 3 lần", "time": "10 phút"},
    {"icon": "🎵", "task": "Nghe và hát theo bài ABC Song ít nhất 2 lần", "time": "5 phút"},
    {"icon": "🗣️", "task": "Đánh vần tên HỌ + TÊN của 3 người thân cho ai đó nghe", "time": "5 phút"},
    {"icon": "📱", "task": "Đánh vần email cá nhân của bạn bằng tiếng Anh", "time": "3 phút"},
    {"icon": "🔍", "task": "Tìm 5 biển hiệu tiếng Anh gần nhà và đọc to từng chữ cái", "time": "10 phút"}
  ],
  "bonus": "💡 Mẹo: Hãy tập đánh vần tên bạn trước gương mỗi sáng để tự tin hơn!"
}'::jsonb, 3);
