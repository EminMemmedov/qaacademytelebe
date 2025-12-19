import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export default async function TeacherGradebookIndexPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");


    // 2. Fetch All Cohorts (Matching TeacherCohortsPage logic)
    const { data: cohorts } = await supabase
        .from("cohorts")
        .select(`*, course:courses(title)`)
        .order("start_date", { ascending: false });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Jurnal Seçimi</h1>
                <p className="text-slate-400">Hansı qrupun jurnalını açmaq istəyirsiniz?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cohorts?.map(cohort => (
                    <Link
                        key={cohort.id}
                        href={`/dashboard/teacher/cohorts/${cohort.id}/gradebook`}
                        className="glass p-6 rounded-xl hover:bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="p-3 bg-slate-800 rounded-lg text-emerald-500 group-hover:text-emerald-400 group-hover:bg-slate-700 transition-colors">
                                <BookOpen className="w-8 h-8" />
                            </div>
                            <span className={`text-xs px-2 py-1 rounded font-medium border ${cohort.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                                {cohort.status === 'active' ? 'Aktiv' : 'Bitmiş'}
                            </span>
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{cohort.name}</h3>
                            {/* @ts-ignore */}
                            <p className="text-sm text-slate-400 mb-4">{cohort.course?.title || "Kurs təyin edilməyib"}</p>

                            <div className="flex items-center text-sm text-emerald-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                Jurnalı Aç
                                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                ))}

                {(!cohorts || cohorts.length === 0) && (
                    <div className="col-span-full text-center py-12 text-slate-500 glass rounded-xl">
                        Heç bir qrup tapılmadı.
                    </div>
                )}
            </div>
        </div>
    );
}
