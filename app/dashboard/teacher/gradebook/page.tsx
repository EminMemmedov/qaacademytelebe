import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export default async function TeacherGradebookIndexPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");


    // Fetch Cohorts
    const { data: teacherProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

    // Assuming teacher sees all cohorts or assigned ones. For now show all active cohorts.
    const { data: cohorts } = await supabase
        .from("cohorts")
        .select("id, name, status")
        .eq("status", "active")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-white">Jurnal - Qrup Seçimi</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cohorts?.map(cohort => (
                    <Link
                        key={cohort.id}
                        href={`/dashboard/teacher/cohorts/${cohort.id}/gradebook`}
                        className="glass p-6 rounded-xl hover:bg-white/5 transition-all group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <BookOpen className="w-8 h-8 text-emerald-500 group-hover:scale-110 transition-transform" />
                            <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Aktiv</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{cohort.name}</h3>
                        <p className="text-sm text-slate-400">Tələbə qiymətləri və Davamiyyət</p>
                    </Link>
                ))}

                {cohorts?.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-500">
                        Aktiv qrup tapılmadı.
                    </div>
                )}
            </div>
        </div>
    );
}
