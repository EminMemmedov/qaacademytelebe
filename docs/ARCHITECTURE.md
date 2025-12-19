# Sistem Arxitekturası (System Architecture)

## 1. Yüksək Səviyyəli Dizaqn (High-Level Design)

Sistem **Client-Server** arxitekturasına əsaslanır, lakin **Serverless** texnologiyalarından (Next.js Server Actions + Supabase) istifadə edərək miqyaslana bilən və qənaətcildir.

```mermaid
graph TD
    User[İstifadəçi (Tələbə/Müəllim)] -->|HTTPS| CDN[Vercel Edge Network]
    CDN -->|SSR/Static| NextJS[Next.js App (Frontend + API Routes)]
    NextJS -->|Auth & Data| Supabase[Supabase (PostgreSQL + Auth)]
    Supabase -->|Store| DB[(Database)]
    Supabase -->|Auth| Auth[(GoTrue Auth)]
```

## 2. Texnologiya Steki (Tech Stack)

| Komponent | Texnologiya | Seçim Səbəbi |
|-----------|-------------|--------------|
| **Frontend** | **Next.js 14 (App Router)** | SEO, Performans, Server Components. |
| **Dillər** | **TypeScript** | Tip təhlükəsizliyi (Type safety). |
| **Stillər** | **Tailwind CSS** | Sürətli UI, modern dizayn, responsive. |
| **Auth** | **Supabase Auth** | Hazır həll, təhlükəsiz, RLS ilə inteqrasiya. |
| **Database** | **PostgreSQL (Supabase)** | Güclü relasiyalı baza, JSON dəstəyi. |
| **State** | **React Server Components** | Client-side state (Zustand/Context) minimal istifadə. |
| **Deploy** | **Vercel** | Next.js üçün ən yaxşı pulsuz hosting. |

## 3. Təhlükəsizlik Arxitekturası (Security)

### 3.1. Autentifikasiya və Avtorizasiya
- **Supabase Auth**: Email/Password girişi.
- **RBAC (Role-Based Access Control)**: Rol modeli `profiles` cədvəlində saxlanılır.
- **Middleware**: Next.js middleware ilə səhifə girişlərinin qorunması (məs: `/teacher` marşrutuna yalnız müəllimlər girə bilər).

### 3.2. Verilənlərin Qorunması (RLS - Row Level Security)
Verilənlər bazası səviyyəsində hər sorğu yoxlanılır:
- `students` yalnız öz qiymətlərini və aid olduğu qrupun dərslərini görə bilər.
- `teachers` yalnız öz tədris etdiyi qrupları görə və redaktə edə bilər.
- `admin` hər şeyi görə bilər.

### 3.3. API Təhlükəsizliyi
- **Server Actions**: Birbaşa API endpointləri əvəzinə Server Actions istifadə olunaraq təhlükəsizlik artırılır.
- **Input Validation**: Zod kitabxanası ilə bütün daxil olan məlumatlar yoxlanılır.

## 4. Verilənlər Modeli (Schema Design)

Əsas cədvəl əlaqələri:
- `Course` -> `Cohort` (Qrup) -> `User` (Student/Teacher)
- `Cohort` -> `Lesson` -> `Material` / `Assignment`
- `Assignment` -> `Submission` (Tələbə tapşırığı)

## 5. UI/UX Prinsipləri (Azərbaycan Dilində)
- **Minimalizm**: Təmiz və aydın interfeys.
- **Feedback**: İstifadəçiyə hər hərəkət haqqında məlumat (məs: "Yüklənir...", "Uğurla yadda saxlanıldı").
- **Mobil Adaptasiya**: Tam responsive dizayn.
