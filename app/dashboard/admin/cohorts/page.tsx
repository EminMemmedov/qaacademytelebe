import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Users, Calendar, GraduationCap } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AdminCohortsPage() {
    const supabase = await createClient();

    // 1. Check Admin Role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        return <div className="text-white p-8">Sizin bu səhifəyə icazəniz yoxdur.</div>;
    }

    // 2. Fetch Cohorts with Counts
    const { data: cohorts, error } = await supabase
        .from("cohorts")
        .select(`
            *,
            course:courses(title)
        `)
        .order("start_date", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Qruplar</h1>
                    <p className="text-slate-400">Bütün tədris qruplarının siyahısı</p>
                </div>
                <Link
                    href="/dashboard/admin/cohorts/new"
                    className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-5 h-5 mr-1" />
                    Yeni Qrup
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cohorts && cohorts.map((cohort) => (
                    <div key={cohort.id} className="glass rounded-xl p-5 border border-white/5 hover:border-emerald-500/30 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:text-emerald-300 transition-colors">
                                <Users className="w-6 h-6" />
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium border ${new Date(cohort.end_date) < new Date()
                                    ? 'bg-slate-800 text-slate-400 border-slate-700'
                                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                }`}>
                                {new Date(cohort.end_date) < new Date() ? 'Bitib' : 'Aktiv'}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1">{cohort.name}</h3>
                        {/* @ts-ignore */}
                        <p className="text-sm text-slate-400 mb-4">{cohort.course?.title}</p>

                        <div className="space-y-2 text-sm text-slate-400 border-t border-slate-800 pt-4">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>Start: {new Date(cohort.start_date).toLocaleDateString('az-AZ')}</span>
                            </div>
                            <div className="flex items-center">
                                <GraduationCap className="w-4 h-4 mr-2" />
                                <span>End: {new Date(cohort.end_date).toLocaleDateString('az-AZ')}</span>
                            </div>
                        </div>

                        <Link
                            href={`/dashboard/admin/cohorts/${cohort.id}`}
                            className="block w-full text-center mt-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            İdarə et
                        </Link>
                    </div>
                ))}

                {(!cohorts || cohorts.length === 0) && (
                    <div className="col-span-full py-12 text-center border border-dashed border-slate-800 rounded-xl">
                        <p className="text-slate-500">Heç bir qrup tapılmadı.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
