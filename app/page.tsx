import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden text-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black -z-10" />

      <div className="max-w-2xl space-y-8 animate-in fade-in zoom-in duration-700">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
          QA Academy
        </h1>
        <p className="text-xl text-slate-400">
          Gələcəyin QA Mühəndisləri üçün Tədris Portalı
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/login"
            className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-slate-200 transition-colors flex items-center"
          >
            Giriş <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-3 bg-slate-800 text-white rounded-full font-bold hover:bg-slate-700 transition-colors border border-slate-700"
          >
            Demo Panel
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 text-slate-600 text-sm">
        &copy; 2024 QA Academy Portal MVP. Bütün hüquqlar qorunur.
      </div>
    </div>
  );
}
