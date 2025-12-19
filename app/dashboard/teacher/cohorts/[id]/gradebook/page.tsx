import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft, Check, X, Clock } from "lucide-react";
import Link from "next/link";

export default async function GradebookPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: cohortId } = await params;
    const supabase = await createClient();

    // 1. Check Access
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "teacher" && profile?.role !== "admin") return <div>Access Denied</div>;

    // 2. Fetch Cohort Info
    const { data: cohort } = await supabase.from("cohorts").select("name").eq("id", cohortId).single();

    // 3. Fetch Students
    const { data: students } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("cohort_id", cohortId)
        .eq("role", "student")
        .order("full_name");

    // 4. Fetch Lessons
    const { data: lessons } = await supabase
        .from("lessons")
        .select("id, title, date")
        .eq("cohort_id", cohortId)
        .order("date", { ascending: true });

    // 5. Fetch Attendance Records for this cohort
    // In a real app, this query might be heavy, need optimization. For MVP is okay.
    const { data: attendance } = await supabase
        .from("attendance_records")
        .select("*")
        .in("lesson_id", lessons?.map(l => l.id) || []);

    // Helper to find status
    const getStatus = (studentId: string, lessonId: string) => {
        const record = attendance?.find(r => r.student_id === studentId && r.lesson_id === lessonId);
        return record?.status; // 'present', 'absent', 'late', 'excused'
    };

    return (
        <div className="space-y-6 overflow-x-hidden">
            <div className="flex items-center space-x-4">
                <Link href="/dashboard/teacher/cohorts" className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Jurnal: {cohort?.name}</h1>
                    <p className="text-slate-400">Davamiyyət və Qiymətləndirmə</p>
                </div>
            </div>

            <div className="glass rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-800">
                                <th className="p-4 text-left font-medium text-slate-300 min-w-[200px] sticky left-0 bg-[#0c0c0c] z-10 border-r border-slate-800">Tələbə</th>
                                {lessons?.map((lesson, index) => (
                                    <th key={lesson.id} className="p-2 text-center border-r border-slate-800/50 min-w-[100px]">
                                        <div className="text-xs text-slate-400 mb-1">{new Date(lesson.date).toLocaleDateString('az-AZ', { day: '2-digit', month: '2-digit' })}</div>
                                        <div className="text-xs text-white font-medium truncat w-24 mx-auto" title={lesson.title}>Dərs {index + 1}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {students?.map((student) => (
                                <tr key={student.id} className="hover:bg-white/5">
                                    <td className="p-4 border-r border-slate-800 sticky left-0 bg-[#0a0a0a] z-10 font-medium text-slate-200">
                                        {student.full_name || "Adsız"}
                                    </td>
                                    {lessons?.map((lesson) => {
                                        const status = getStatus(student.id, lesson.id);
                                        return (
                                            <td key={lesson.id} className="p-2 text-center border-r border-slate-800/50">
                                                {status === 'present' && <span className="inline-block w-6 h-6 bg-emerald-500/20 text-emerald-500 rounded flex items-center justify-center mx-auto"><Check className="w-4 h-4" /></span>}
                                                {status === 'absent' && <span className="inline-block w-6 h-6 bg-red-500/20 text-red-500 rounded flex items-center justify-center mx-auto"><X className="w-4 h-4" /></span>}
                                                {status === 'late' && <span className="inline-block w-6 h-6 bg-amber-500/20 text-amber-500 rounded flex items-center justify-center mx-auto"><Clock className="w-4 h-4" /></span>}
                                                {!status && <span className="text-slate-600">-</span>}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                            {(!students || students.length === 0) && (
                                <tr>
                                    <td colSpan={(lessons?.length || 0) + 1} className="p-8 text-center text-slate-500">
                                        Tələbə tapılmadı.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="text-center text-xs text-slate-500 mt-4">
                * Bu cədvəl yalnız baxış üçündür. Qiymətləndirmə üçün dərs səhifəsinə daxil olun. (MVP)
            </div>
        </div>
    );
}
