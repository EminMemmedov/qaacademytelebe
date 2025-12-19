import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden text-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black -z-10" />

      <div className="max-w-2xl space-y-8 animate-in fade-in zoom-in duration-700 flex flex-col items-center">
        <div className="w-40 h-40 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-emerald-900/20">
          <div className="relative w-32 h-32">
            <Image
              src="/logo.png"
              alt="QA Academy"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
          QA Academy
        </h1>
        <p className="text-xl text-slate-400">
          Gələcəyin QA Mühəndisləri üçün Tədris Portalı
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/login"
            className="px-10 py-4 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-500 transition-colors flex items-center shadow-lg shadow-emerald-900/50"
          >
            Portala Giriş <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 text-slate-600 text-sm">
        &copy; 2024 QA Academy Portal MVP. Bütün hüquqlar qorunur.
      </div>
    </div>
  );
}
