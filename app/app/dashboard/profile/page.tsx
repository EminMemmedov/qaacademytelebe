
import { User, Mail, Shield, Book } from "lucide-react";

export default function ProfilePage() {
    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Profil</h1>
                <p className="text-slate-400">Şəxsi məlumatlar və tənzimləmələr</p>
            </div>

            <div className="glass p-8 rounded-xl flex items-center space-x-6 border-emerald-500/30 bg-emerald-900/10">
                <div className="h-24 w-24 rounded-full bg-emerald-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-emerald-900/50">
                    T
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Tələbə Adı</h2>
                    <p className="text-emerald-400 font-medium">Full Stack QA Engineer</p>
                </div>
            </div>

            <div className="glass rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Məlumatlar</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500 uppercase tracking-widest flex items-center">
                            <Mail className="w-3 h-3 mr-1" /> Email
                        </label>
                        <p className="text-white font-medium">student@qa.academy</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500 uppercase tracking-widest flex items-center">
                            <Shield className="w-3 h-3 mr-1" /> Rol
                        </label>
                        <p className="text-white font-medium">Tələbə (Student)</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500 uppercase tracking-widest flex items-center">
                            <Book className="w-3 h-3 mr-1" /> Qrup
                        </label>
                        <p className="text-white font-medium">QA Manual - Cohort 24</p>
                    </div>
                </div>
            </div>

            <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2 mb-4">Təhlükəsizlik</h3>
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors">
                    Şifrəni Dəyiş
                </button>
            </div>
        </div>
    );
}
