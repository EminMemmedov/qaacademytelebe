import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FileText, CheckCircle, Clock, AlertTriangle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const statusMap: Record<string, { label: string; color: string; icon: any }> = {
    new: { label: "Yeni", color: "text-blue-400 bg-blue-500/10 border-blue-500/20", icon: Clock },
    submitted: { label: "Göndərildi", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", icon: FileText },
    approved: { label: "Qəbul edildi", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle },
    changes_requested: { label: "Düzəliş lazımdır", color: "text-red-400 bg-red-500/10 border-red-500/20", icon: AlertTriangle },
};

export default async function AssignmentsPage() {
    const supabase = await createClient();

    // 1. Get Current User
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    // 2. Fetch User's Cohort
    const { data: profile } = await supabase
        .from("profiles")
        .select("cohort_id")
        .eq("id", user.id)
        .single();

    if (!profile?.cohort_id) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <div className="p-4 rounded-full bg-slate-800 text-slate-400">
                    <FileText className="w-8 h-8" />
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-white mb-2">Qrup təyin edilməyib</h2>
                    <p className="text-slate-400 max-w-md">
                        Tapşırıqları görmək üçün administrator tərəfindən qrupa əlavə olunmalısınız.
                    </p>
                </div>
            </div>
        );
    }

    // 3. Fetch Assignments via Lessons
    // We want all assignments linked to lessons of this cohort
    // PLUS the student's submission status for each (Left Join equivalent)
    // Supabase JS doesn't do deep nested joins with filtering easily in one go.
    // Let's do 2 queries for simplicity (MVP).

    // A. Get all assignments for this cohort's lessons
    const { data: assignments } = await supabase
        .from("assignments")
        .select(`
            id,
            title,
            due_date,
            description,
            lesson:lessons!inner(
                id,
                title,
                cohort_id
            )
        `)
        .eq("lesson.cohort_id", profile.cohort_id)
        .order("due_date", { ascending: true });

    // B. Get student's submissions
    const { data: submissions } = await supabase
        .from("submissions")
        .select("*")
        .eq("student_id", user.id);

    // Merge data
    const assignmentsWithStatus = assignments?.map(assignment => {
        const submission = submissions?.find(s => s.assignment_id === assignment.id);
        return {
            ...assignment,
            status: submission?.status || "new",
            grade: submission?.grade,
            submission_id: submission?.id
        };
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Tapşırıqlarım</h1>
                <p className="text-slate-400">Bütün ev tapşırıqlarının statusu</p>
            </div>

            <div className="glass rounded-xl overflow-hidden border border-white/5">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-900/50 text-slate-200 font-medium uppercase text-xs">
                        <tr>
                            <th className="p-4">Tapşırıq</th>
                            <th className="p-4">Dərs</th>
                            <th className="p-4">Son Tarix</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Qiymət</th>
                            <th className="p-4 text-right">Əməliyyat</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {assignmentsWithStatus && assignmentsWithStatus.length > 0 ? (
                            assignmentsWithStatus.map((item) => {
                                const statusInfo = statusMap[item.status] || statusMap.new;
                                const StatusIcon = statusInfo.icon;
                                // @ts-ignore
                                const lessonTitle = item.lesson?.title;
                                // @ts-ignore
                                const lessonId = item.lesson?.id;

                                return (
                                    <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4 font-medium text-white group-hover:text-emerald-400 transition-colors">
                                            {item.title}
                                        </td>
                                        <td className="p-4">{lessonTitle}</td>
                                        <td className="p-4 font-mono text-xs">
                                            {new Date(item.due_date).toLocaleDateString('az-AZ')}
                                        </td>
                                        <td className="p-4">
                                            <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", statusInfo.color)}>
                                                <StatusIcon className="w-3 h-3 mr-1" />
                                                {statusInfo.label}
                                            </span>
                                        </td>
                                        <td className="p-4 font-bold text-white">
                                            {item.grade ? (
                                                <span className={item.grade >= 80 ? 'text-emerald-400' : item.grade >= 50 ? 'text-amber-400' : 'text-red-400'}>
                                                    {item.grade}/100
                                                </span>
                                            ) : (
                                                <span className="text-slate-600">-</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link
                                                href={`/dashboard/lessons/${lessonId}`}
                                                className="inline-flex items-center text-emerald-400 hover:text-emerald-300 font-medium text-xs hover:underline"
                                            >
                                                Keçid
                                                <ArrowRight className="w-3 h-3 ml-1" />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })) : (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-500">
                                    Hələ ki, tapşırıq yoxdur.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
