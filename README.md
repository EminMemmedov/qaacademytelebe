# QA Academy Portal

Bu layihə QA Academy tələbələri üçün hazırlanmış vahid təhsil portalıdır. Layihə Next.js, TypeScript və Supabase texnologiyaları əsasında qurulub.

## 🚀 Başlamaq üçün

### Tələblər
- Node.js 18+
- npm

### Quraşdırma

1. Repozitoriyanı klonlayın:
```bash
git clone <repo-url>
cd qaacademytelebe
```

2. Asılılıqları yükləyin:
```bash
cd app
npm install
```

3. Mühit dəyişənlərini (`.env.local`) yaradın:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Layihəni işə salın:
```bash
npm run dev
```

Bravzerdə `http://localhost:3000` ünvanını açın.

## 📂 Struktur

- `/docs`: Layihə sənədləri (PRD, Arxitektura).
- `/supabase`: Verilənlər bazası sxemləri (schema.sql, seed.sql).
- `/app`: Next.js tətbiqi mənbə kodu.

## 🛠 Texnologiyalar

- **Frontend**: Next.js 14, Tailwind CSS, Lucide React
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Deploy**: Vercel

## 📝 Qeydlər

Bu portal yalnız QA Academy tələbələri və müəllimləri üçün nəzərdə tutulub.
Bütün istifadəçi interfeysi **Azərbaycan dilindədir**.
