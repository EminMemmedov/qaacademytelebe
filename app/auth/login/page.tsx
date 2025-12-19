import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />

            <div className="glass w-full max-w-md p-8 rounded-2xl border border-white/10 relative z-10 shadow-2xl">
                <div className="text-center mb-8 flex flex-col items-center">
                    <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                        <div className="relative w-20 h-20">
                            <Image
                                src="/logo.png"
                                alt="QA Academy"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Tələbə Portalı</h1>
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
