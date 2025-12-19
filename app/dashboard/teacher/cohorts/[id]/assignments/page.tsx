import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft, Plus, FileText, Calendar } from "lucide-react";
import Link from "next/link";

export default async function TeacherAssignmentsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: cohortId } = await params;
    const supabase = await createClient();

    // 1. Check Access
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    // 2. Fetch Assignments linked to lessons of this cohort
    // (Assignments are linked to lessons, so we need to join)
    const { data: assignments } = await supabase
        .from("assignments")
        .select(`
            *,
            lesson:lessons!inner(title, cohort_id)
        `)
        .eq("lesson.cohort_id", cohortId)
        .order("due_date", { ascending: true });

    // 3. Fetch Cohort Name
    const { data: cohort } = await supabase
        .from("cohorts")
        .select("name")
        .eq("id", cohortId)
        .single();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard/teacher/cohorts" className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Tapşırıqlar: {cohort?.name}</h1>
                        <p className="text-slate-400">Bu qrup üçün tapşırıqların idarə edilməsi</p>
                    </div>
                </div>
                <Link
                    href={`/dashboard/teacher/cohorts/${cohortId}/assignments/new`}
                    className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Tapşırıq
                </Link>
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
                                <p className="text-sm text-slate-400">Dərs: {assignment.lesson?.title}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center text-sm text-slate-400 mb-1 justify-end">
                                <Calendar className="w-4 h-4 mr-1" />
                                {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : "Tarixsiz"}
                            </div>
                            <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300">
                                Status: Aktiv
                            </span>
                        </div>
                    </div>
                ))}

                {(!assignments || assignments.length === 0) && (
                    <div className="text-center py-12 glass rounded-xl border border-white/5">
                        <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white">Tapşırıq yoxdur</h3>
                        <p className="text-slate-400 mt-2 max-w-sm mx-auto">
                            Bu qrup üçün hələ heç bir tapşırıq yaradılmayıb. "Yeni Tapşırıq" düyməsini istifadə edin.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
