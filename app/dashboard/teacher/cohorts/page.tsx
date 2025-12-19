import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Users, BookOpen } from "lucide-react";
import Link from "next/link";

export default async function TeacherCohortsPage() {
    const supabase = await createClient();

    // 1. Check Teacher Access (or Admin)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    // Allow admin to see teacher view too for testing
    if (profile?.role !== "teacher" && profile?.role !== "admin") {
        return <div className="text-white p-8">Sizin bu səhifəyə icazəniz yoxdur.</div>;
    }

    // 2. Fetch All Cohorts (MVP: Teacher sees all active cohorts)
    const { data: cohorts } = await supabase
        .from("cohorts")
        .select(`
            *,
            course:courses(title)
        `)
        .order("start_date", { ascending: false });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Qruplarım</h1>
                <p className="text-slate-400">Tədris etdiyiniz qrupların siyahısı</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cohorts?.map((cohort) => (
                    <div key={cohort.id} className="glass rounded-xl p-5 border border-white/5 hover:border-emerald-500/30 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 group-hover:text-blue-300 transition-colors">
                                <Users className="w-6 h-6" />
                            </div>
                            <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Aktiv
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1">{cohort.name}</h3>
                        {/* @ts-ignore */}
                        <p className="text-sm text-slate-400 mb-4">{cohort.course?.title}</p>

                        <div className="grid grid-cols-3 gap-2 mt-4">
                            <Link
                                href={`/dashboard/teacher/cohorts/${cohort.id}/lessons`}
                                className="flex items-center justify-center px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
                            >
                                <BookOpen className="w-3 h-3 mr-1" />
                                Dərslər
                            </Link>
                            <Link
                                href={`/dashboard/teacher/cohorts/${cohort.id}/gradebook`}
                                className="flex items-center justify-center px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
                            >
                                <Users className="w-3 h-3 mr-1" />
                                Jurnal
                            </Link>
                            <Link
                                href={`/dashboard/teacher/cohorts/${cohort.id}/assignments`}
                                className="flex items-center justify-center px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors"
                            >
                                Tapşırıqlar
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
