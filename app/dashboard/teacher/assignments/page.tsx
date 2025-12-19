import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function TeacherAllAssignmentsPage() {
    const supabase = await createClient();

    // 1. Check Access
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "teacher" && profile?.role !== "admin") return <div>Access Denied</div>;

    // 2. Fetch Assignments (All, or ideally filtered by cohorts teacher manages)
    // Since we don't have direct teacher-cohort link yet, show ALL assignments.
    const { data: assignments } = await supabase
        .from("assignments")
        .select(`
            *,
            lesson:lessons(
                title,
                cohort:cohorts(name)
            )
        `)
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Bütün Tapşırıqlar</h1>
                    <p className="text-slate-400">Sistemdəki bütün tapşırıqların siyahısı</p>
                </div>
            </div>

            <div className="grid gap-4">
                {assignments?.map((assignment) => (
                    <div key={assignment.id} className="glass p-5 rounded-xl border border-white/5 flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                        <div className="flex items-start space-x-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">{assignment.title}</h3>
                                {/* @ts-ignore */}
                                <p className="text-sm text-slate-400">
                                    {/* @ts-ignore */}
                                    Qrup: {assignment.lesson?.cohort?.name} • Dərs: {assignment.lesson?.title}
                                </p>
                            </div>
                        </div>
                        {/* @ts-ignore */}
                        <Link href={`/dashboard/teacher/cohorts/${assignment.lesson?.cohort_id || ''}/assignments`} className="p-2 text-slate-400 hover:text-white transition-colors">
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                ))}
                {(!assignments || assignments.length === 0) && (
                    <div className="text-center py-12 glass rounded-xl border border-white/5">
                        <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white">Tapşırıq yoxdur</h3>
                        <p className="text-slate-400 mt-2 max-w-sm mx-auto">
                            Zəhmət olmasa, əvvəlcə "Qruplarım" bölməsindən bir qrup seçin və yeni tapşırıq yaradın.
                        </p>
                        <Link href="/dashboard/teacher/cohorts" className="mt-4 inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium">Qruplara Keç</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
