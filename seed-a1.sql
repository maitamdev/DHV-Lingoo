-- =============================================
-- 1. TẠO BẢNG (Chạy đầu tiên để tránh lỗi)
-- =============================================

-- Table: Courses
create table if not exists public.courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  level text check (level in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  thumbnail_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Table: Lessons
create table if not exists public.lessons (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade,
  title text not null,
  description text,
  content text, -- Can be markdown, HTML, or JSON
  topics text[] default '{}',
  order_index integer default 0,
  xp_reward integer default 50,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: Courses
alter table public.courses enable row level security;
create policy "Anyone can view courses" on public.courses for select using (true);
create policy "Admins can manage courses" on public.courses for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- RLS: Lessons
alter table public.lessons enable row level security;
create policy "Anyone can view lessons" on public.lessons for select using (true);
create policy "Admins can manage lessons" on public.lessons for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- =============================================
-- 2. CHÈN DỮ LIỆU BÀI HỌC VỠ LÒNG (A1)
-- =============================================

-- Thêm Khóa học Tiếng Anh Vỡ Lòng (A1)
INSERT INTO public.courses (id, title, description, level)
VALUES (
  '11111111-1111-1111-1111-111111111111', 
  'Tiếng Anh Vỡ Lòng (A1)', 
  'Khóa học nền móng nhất cho người mới bắt đầu. Gồm 5 bài học thiết yếu về Bảng chữ cái, Chào hỏi và Từ vựng cốt lõi.', 
  'A1'
)
ON CONFLICT (id) DO NOTHING;

-- 2. Thêm 5 Bài học siêu chất lượng thuộc khóa A1
INSERT INTO public.lessons (course_id, title, description, topics, order_index, content)
VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Bài 1: Bảng chữ cái & Đánh vần tên',
  'Nhập môn Tiếng Anh: Cách đọc 26 chữ cái và đánh vần tên bạn.',
  '{"Bảng chữ cái", "Đánh vần", "Từ vựng"}',
  1,
  '<div class="space-y-6"><div class="aspect-video w-full rounded-xl overflow-hidden shadow-md"><iframe width="100%" height="100%" src="https://www.youtube.com/embed/HQjN62B6X8s" title="The Alphabet Song" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><div class="bg-indigo-50 p-6 rounded-xl border border-indigo-100"><h3 class="text-xl font-bold text-indigo-900 mb-4">📖 Lý thuyết: Đánh vần (Spelling)</h3><p class="text-slate-700 mb-4">Người nước ngoài rất thường hỏi cách đánh vần tên của bạn để viết cho đúng. Câu hỏi phổ biến nhất là:</p><div class="bg-white p-4 rounded-lg border border-indigo-200"><p class="font-medium text-lg text-slate-900">"How do you spell your name?"</p><p class="text-slate-500 italic mt-1">(Bạn đánh vần tên bạn như thế nào?)</p></div></div><div><h3 class="text-xl font-bold text-slate-900 mb-4">💬 Thực hành Hội thoại</h3><div class="space-y-3"><div class="flex gap-4"><span class="font-bold text-indigo-600 w-8">A:</span><p class="text-slate-700">Hello, I''m Sarah. What is your name?</p></div><div class="flex gap-4"><span class="font-bold text-emerald-600 w-8">B:</span><p class="text-slate-700">My name is Tuan.</p></div><div class="flex gap-4"><span class="font-bold text-indigo-600 w-8">A:</span><p class="text-slate-700">How do you spell your name?</p></div><div class="flex gap-4"><span class="font-bold text-emerald-600 w-8">B:</span><p class="text-slate-700">T - U - A - N.</p></div></div></div></div>'
),
(
  '11111111-1111-1111-1111-111111111111',
  'Bài 2: Giao tiếp cơ bản (Hello, How are you?)',
  'Các mẫu câu cơ bản nhất để chào hỏi và hỏi thăm sức khỏe.',
  '{"Giao tiếp", "Chào hỏi"}',
  2,
  '<div class="space-y-6"><div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl"><h3 class="text-2xl font-bold text-blue-900 mb-6">🤝 Các lời chào phổ biến</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="bg-white p-4 rounded-lg shadow-sm"><p class="font-bold text-lg text-slate-900">Trang trọng (Formal)</p><ul class="mt-2 space-y-2 text-slate-700"><li>• Good morning (Chào buổi sáng)</li><li>• Good afternoon (Chào buổi chiều)</li><li>• Good evening (Chào buổi tối)</li></ul></div><div class="bg-white p-4 rounded-lg shadow-sm"><p class="font-bold text-lg text-slate-900">Thân mật (Informal)</p><ul class="mt-2 space-y-2 text-slate-700"><li>• Hello / Hi (Xin chào)</li><li>• Hey! (Này!)</li><li>• What''s up? (Có gì mới không?)</li></ul></div></div></div><div><h3 class="text-xl font-bold text-slate-900 mb-4">💬 Hội thoại: Hỏi thăm sức khỏe</h3><div class="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3"><p><strong>Tom:</strong> Good morning, Sarah. How are you today?</p><p><strong>Sarah:</strong> I''m fine, thank you. And you?</p><p><strong>Tom:</strong> I''m great! Thanks for asking.</p></div></div></div>'
),
(
  '11111111-1111-1111-1111-111111111111',
  'Bài 3: Động từ TO BE (Am/Is/Are)',
  'Động từ quan trọng nhất trong tiếng Anh. Cách sử dụng Khẳng định, Phủ định và Nghi vấn.',
  '{"Ngữ pháp", "Động từ Khuyết thiếu"}',
  3,
  '<div class="space-y-6"><div class="bg-emerald-50 p-6 rounded-xl border border-emerald-100"><h3 class="text-2xl font-bold text-emerald-900 mb-4">📖 Quy tắc Động từ TO BE</h3><p class="text-slate-700 mb-4">TO BE có nghĩa là <strong>"thì, là, ở"</strong>. Tùy thuộc vào Chủ ngữ mà TO BE biến đổi thành 3 dạng:</p><div class="overflow-x-auto"><table class="w-full text-left bg-white rounded-lg shadow-sm"><thead class="bg-slate-100"><tr><th class="p-3 font-semibold">Chủ ngữ (Subject)</th><th class="p-3 font-semibold">Động từ TO BE</th><th class="p-3 font-semibold">Ví dụ (Example)</th></tr></thead><tbody class="divide-y divide-slate-100"><tr><td class="p-3 font-medium text-indigo-600">I</td><td class="p-3 font-bold">am</td><td class="p-3">I am a student. (Tôi là học sinh)</td></tr><tr><td class="p-3 font-medium text-emerald-600">He / She / It</td><td class="p-3 font-bold">is</td><td class="p-3">She is a doctor. (Cô ấy là bác sĩ)</td></tr><tr><td class="p-3 font-medium text-orange-600">You / We / They</td><td class="p-3 font-bold">are</td><td class="p-3">They are my friends. (Họ là bạn tôi)</td></tr></tbody></table></div></div><div><h3 class="text-xl font-bold text-slate-900 mb-4">📝 Dạng Phủ định (Thêm NOT)</h3><ul class="space-y-2 list-disc list-inside text-slate-700"><li>I am <strong class="text-red-500">not</strong> (I''m not)</li><li>He is <strong class="text-red-500">not</strong> (He isn''t)</li><li>You are <strong class="text-red-500">not</strong> (You aren''t)</li></ul></div></div>'
),
(
  '11111111-1111-1111-1111-111111111111',
  'Bài 4: Giới thiệu bản thân cơ bản',
  'Ghép từ vựng và câu để tự giới thiệu về Tên, Tuổi, Quê quán và Giấc mơ.',
  '{"Giao tiếp", "Kỹ năng nói"}',
  4,
  '<div class="space-y-6"><div class="bg-purple-50 p-6 rounded-xl border border-purple-100"><h3 class="text-2xl font-bold text-purple-900 mb-4">🎤 Công thức giới thiệu 1 phút</h3><p class="text-slate-700 mb-4">Chỉ cần điền tên và thông tin của bạn vào các chỗ trống sau đây:</p><div class="bg-white p-5 rounded-lg border-l-4 border-purple-500 shadow-sm space-y-3 font-medium text-slate-800 text-lg"><p>1. Hello, my name is <strong>[Tên của bạn]</strong>.</p><p>2. I am <strong>[Tuổi]</strong> years old.</p><p>3. I am from <strong>[Quốc gia/Thành phố]</strong>.</p><p>4. I am a <strong>[Nghề nghiệp]</strong>.</p><p>5. Nice to meet you!</p></div></div><div><h3 class="text-xl font-bold text-slate-900 mb-4">🎧 Nghe ví dụ tực tế</h3><div class="bg-slate-50 p-4 rounded-lg border border-slate-200"><p class="italic text-slate-700">"Hello, my name is David. I am 25 years old. I am from London, UK. I am an engineer. Nice to meet you!"</p></div></div></div>'
),
(
  '11111111-1111-1111-1111-111111111111',
  'Bài 5: Số đếm vỡ lòng (1 đến 100)',
  'Sử dụng số để hỏi và nói Tuổi, Số điện thoại và Giá tiền.',
  '{"Từ vựng", "Số đếm"}',
  5,
  '<div class="space-y-6"><div class="aspect-video w-full rounded-xl overflow-hidden shadow-md"><iframe width="100%" height="100%" src="https://www.youtube.com/embed/e0dJWfQHF8Y" title="Numbers Song" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="bg-indigo-50 p-6 rounded-xl"><h3 class="text-xl font-bold text-indigo-900 mb-4">Cách đọc Số Điện Thoại</h3><p class="text-slate-700 mb-2">Đọc <strong>từng số một</strong> (không đọc gộp 2 số hàng chục).</p><p class="text-slate-700 mb-2">Số 0 đọc là <strong>"Oh"</strong> (như chữ O) hoặc <strong>"Zero"</strong>.</p><div class="bg-white p-3 rounded mt-3"><p class="font-bold text-indigo-600">098-123-456</p><p class="text-slate-600 text-sm">Oh-nine-eight, one-two-three, four-five-six.</p></div></div><div class="bg-emerald-50 p-6 rounded-xl"><h3 class="text-xl font-bold text-emerald-900 mb-4">Hỏi số điện thoại</h3><div class="bg-white p-3 rounded mb-3"><p class="font-bold text-slate-900">What is your phone number?</p><p class="text-slate-600 text-sm italic">Số điện thoại của bạn là gì?</p></div><p class="text-slate-700 font-medium mt-4">👉 Trả lời: It is...</p></div></div></div>'
);
