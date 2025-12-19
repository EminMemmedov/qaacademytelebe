import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />

            <div className="glass w-full max-w-md p-8 rounded-2xl border border-white/10 relative z-10 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">QA Academy</h1>
                    <p className="text-slate-400">Tələbə Portalına Giriş</p>
                </div>

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="student@example.com"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Şifrə</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
                        />
                    </div>

                    <div className="flex justify-end">
                        <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300">Şifrəni unutmusunuz?</a>
                    </div>

                    <Link href="/dashboard" className="w-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-emerald-900/20">
                        Daxil Ol <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </form>

                <p className="text-center text-xs text-slate-500 mt-6">
                    Hesabınız yoxdur? <span className="text-slate-400">Administratorla əlaqə saxlayın.</span>
                </p>
            </div>
        </div>
    );
}
