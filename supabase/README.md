# 📁 Cấu Trúc Thư Mục SQL — DHV-Lingoo

> ⚠️ **QUAN TRỌNG:** Toàn bộ thư mục này đã được ẩn bởi `.gitignore`. KHÔNG được push lên GitHub.

## Cách tổ chức

```
supabase/
├── schema/                      ← Cấu trúc bảng (chạy 1 lần khi setup)
│   ├── 01-profiles.sql          ← Bảng profiles, triggers
│   ├── 02-courses-lessons.sql   ← Bảng courses, lessons + RLS
│   └── 03-lesson-content.sql    ← Bảng videos, vocabularies, dialogues, quizzes + RLS
│
├── migrations/                  ← Các lần thay đổi cấu trúc DB
│   └── migrate-lessons.sql      ← Migration chuyển sang relational
│
├── seeds/                       ← Dữ liệu mẫu (chạy SAU schema)
│   ├── A1/                      ← Khóa học Tiếng Anh Vỡ Lòng
│   │   ├── 00-course.sql        ← Tạo khóa học A1
│   │   ├── 01-bang-chu-cai.sql  ← Bài 1: Bảng chữ cái
│   │   ├── 02-giao-tiep-co-ban.sql ← Bài 2: Giao tiếp cơ bản
│   │   ├── 03-dong-tu-to-be.sql ← Bài 3: Động từ TO BE
│   │   ├── 04-gioi-thieu-ban-than.sql ← Bài 4: Giới thiệu bản thân
│   │   └── 05-so-dem.sql        ← Bài 5: Số đếm
│   │
│   ├── A2/                      ← (Sẽ thêm sau)
│   ├── B1/                      ← (Sẽ thêm sau)
│   └── ...
│
└── README.md                    ← File này
```

## Cách chạy

### Lần đầu (Setup từ đầu)
```sql
-- Chạy theo thứ tự trong Supabase SQL Editor:
1. schema/01-profiles.sql
2. schema/02-courses-lessons.sql
3. schema/03-lesson-content.sql
4. seeds/A1/00-course.sql
5. seeds/A1/01-bang-chu-cai.sql
6. seeds/A1/02-giao-tiep-co-ban.sql
...
```

### Thêm khóa học mới
1. Tạo thư mục `seeds/A2/`
2. Tạo file `00-course.sql` với INSERT khóa học
3. Tạo từng file `01-xxx.sql`, `02-xxx.sql` cho mỗi bài học

### Thêm bài học mới vào khóa A1
1. Tạo file `06-ten-bai-hoc.sql` trong `seeds/A1/`
2. Copy format từ bài học khác, đổi UUID và nội dung
