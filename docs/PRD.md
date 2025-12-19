# QA Academy Tələbə Portalı - Product Requirements Document (PRD)

## 1. Məqsəd (Цель)
Создать централизованный веб-портал для студентов QA Academy, который обеспечит доступ к учебным материалам, видеозаписям уроков, домашним заданиям и статистике посещаемости. Платформа должна поддерживать роли Студента, Преподавателя и Администратора, обеспечивая безопасность данных и удобство использования на азербайджанском языке.

## 2. İstifadəçi Rolları (Роли пользователей)

### Tələbə (Student)
- **Giriş**: E-poçt və şifrə ilə daxil olur.
- **Panel**: Görür: yaxınlaşan tapşırıqlar (dedlaynlar), yeni materiallar, iştirak faizi.
- **Dərslər (Lessons)**: Keçilmiş və cari dərslərin siyahısı. Hər dərsdə: mövzu, materiallar (PDF/Link), video qeydi, ev tapşırığı.
- **Tapşırıqlar (Assignments)**: Tapşırıq yükləmə, statusu izləmə (Yeni, Göndərildi, Qəbul edildi, Düzəliş lazımdır), müəllim rəyini oxuma.
- **İştirak (Attendance)**: Dərsə davamiyyət tarixçəsi (Gəldi/Gəlmədi/Gecikdi/Üzrlü).

### Müəllim (Teacher)
- **İdarəetmə**: Kurslar, qruplar və dərslər yaratma/redaktə etmə.
- **Materiallar**: Dərs materialları və video linkləri yükləmə.
- **Yoxlama**: Tələbə tapşırıqlarını yoxlama, qiymət və rəy (komment) yazma, statusu dəyişmə.
- **Davamiyyət**: Qrup üzrə və ya fərdi tələbə üçün iştirakı qeyd etmə (Gecikmə dəqiqəsi daxil).

### Admin
- **Tam nəzarət**: Tələbələri, müəllimləri və kursları idarə etmək. Sistem audit loqlarını izləmək.

## 3. Funksionallıq və UI (Функциональность)

> **Vacib**: Bütün interfeys elementləri Azərbaycan dilində olacaq.

### Əsas Səhifələr:
1.  **Giriş (Login)**: Təhlükəsiz giriş səhifəsi.
2.  **Panel (Dashboard)**: Ümumi icmal.
    *   *Yaxınlaşan tapşırıqlar* (Tezliklə bitəcək)
    *   *Son dərslər*
3.  **Dərslər (Lessons)**:
    *   Siyahı görünüşü.
    *   Dərs detalları: Video pleyer (və ya link), Material yükləmə düymələri.
4.  **Tapşırıqlarım (My Assignments)**:
    *   Status filtri: *Hamısı, Aktiv, Qiymətləndirilmiş*.
    *   Tapşırıq təslimi forması (Github linki və ya mətn).
5.  **İştirak (Attendance)**:
    *   Təqvim və ya siyahı görünüşü.
    *   Statistika: *Ümumi iştirak faizi*.

## 4. Texniki Tələblər (Технические требования)
- **Frontend**: Next.js 14+ (App Router), Tailwind CSS, TypeScript, Lucide React (ikonlar).
- **Backend/DB**: Supabase (PostgreSQL, Auth, RLS).
- **Video**: Google Drive/YouTube linkləri (embed).
- **Təhlükəsizlik**:
    - Row Level Security (RLS) policies.
    - Server-side validation.
    - IDOR protection (UUID istifadəsi).

## 5. Verilənlər Bazası (Database Plan)
- **users**: (id, email, full_name, role, avatar_url)
- **courses**: (id, title, description)
- **groups**: (id, name, course_id)
- **lessons**: (id, group_id, title, video_url, date)
- **materials**: (id, lesson_id, title, file_url)
- **assignments**: (id, lesson_id, title, description, due_date)
- **submissions**: (id, assignment_id, student_id, content, status, feedback)
- **attendance**: (id, lesson_id, student_id, status, late_minutes, note)

## 6. İnkişaf Planı (Roadmap)
1.  Verilənlər bazasının qurulması (Supabase).
2.  Layihə strukturu və UI komponentləri (Tailwind).
3.  Autentifikasiya (Login).
4.  Tələbə Paneli və Dərslər.
5.  Müəllim Paneli (CRUD əməliyyatları).
6.  Test və Deploy (Vercel).
