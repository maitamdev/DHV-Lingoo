-- =============================================
-- Khóa học: Tiếng Anh Vỡ Lòng (A1)
-- Chạy file này TRƯỚC khi chạy các bài học
-- =============================================

DELETE FROM public.courses WHERE id = '11111111-1111-1111-1111-111111111111';

INSERT INTO public.courses (id, title, description, level)
VALUES (
  '11111111-1111-1111-1111-111111111111', 
  'Tiếng Anh Vỡ Lòng (A1)', 
  'Khóa học nền móng nhất cho người mới bắt đầu. Gồm 5 bài học thiết yếu về Bảng chữ cái, Chào hỏi và Từ vựng cốt lõi.', 
  'A1'
);
