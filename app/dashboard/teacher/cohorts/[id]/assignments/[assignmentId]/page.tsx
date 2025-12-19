import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft, ExternalLink, check } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function AssignmentGradingPage({ params }: { params: Promise<{ id: string, assignmentId: string }> }) {
    const { id: cohortId, assignmentId } = await params;
    const supabase = await createClient();

    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    // 2. Fetch Assignment Details
    const { data: assignment } = await supabase
        .from("assignments")
        .select("*")
        .eq("id", assignmentId)
        .single();

    // 3. Fetch Students of this Cohort
    const { data: students } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("cohort_id", cohortId)
        .eq("role", "student")
        .order("full_name");

    // 4. Fetch Submissions
    const { data: submissions } = await supabase
        .from("submissions")
        .select("*")
        .eq("assignment_id", assignmentId);

    // --- GRADING ACTION ---
    async function gradeSubmission(formData: FormData) {
        "use server";
        const studentId = formData.get("student_id") as string;
        const grade = formData.get("grade") as string;
        // Check if submission exists, if not create empty one with grade? 
        // Better logic: Grade is usually on submission.
        // If student hasn't submitted, we can still grade (e.g. 0).

        const supabase = await createClient();

        // Check for existing
        const { data: existing } = await supabase
            .from("submissions")
            .select("id")
            .eq("assignment_id", assignmentId)
            .eq("student_id", studentId)
            .single();

        if (existing) {
            await supabase.from("submissions").update({
                grade: parseInt(grade),
                status: grade ? 'graded' : 'submitted'
            }).eq("id", existing.id);
        } else {
            // Force create submission (e.g. teacher grading offline work)
            await supabase.from("submissions").insert({
                assignment_id: assignmentId,
                student_id: studentId,
                grade: parseInt(grade),
                status: 'graded',
                submitted_at: new Date().toISOString() // Marked as submitted now
            });
        }
        revalidatePath(`/dashboard/teacher/cohorts/${cohortId}/assignments/${assignmentId}`);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Link href={`/dashboard/teacher/cohorts/${cohortId}/assignments`} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Qiymətləndirmə</h1>
                    <p className="text-slate-400">{assignment?.title}</p>
                </div>
            </div>

            <div className="glass rounded-xl overflow-hidden border border-white/5">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs">
                        <tr>
                            <th className="p-4">Tələbə</th>
                            <th className="p-4">Link / Şərh</th>
                            <th className="p-4">Tarix</th>
                            <th className="p-4 text-center">Qiymət (0-100)</th>
                            <th className="p-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {students?.map(student => {
                            const submission = submissions?.find(s => s.student_id === student.id);

                            return (
                                <tr key={student.id} className="hover:bg-white/5">
                                    <td className="p-4">
                                        <div className="font-medium text-white">{student.full_name}</div>
                                        <div className="text-xs text-slate-500">{student.email}</div>
                                    </td>
                                    <td className="p-4">
                                        {submission ? (
                                            <div className="space-y-1">
                                                {submission.submission_link && (
                                                    <a href={submission.submission_link} target="_blank" className="flex items-center text-blue-400 hover:underline">
                                                        <ExternalLink className="w-3 h-3 mr-1" /> Keçid
                                                    </a>
                                                )}
                                                {submission.comments && (
                                                    <p className="text-slate-400 text-xs italic max-w-[200px] truncate">"{submission.comments}"</p>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-slate-600 italic">Göndərilməyib</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-slate-400 text-xs font-mono">
                                        {submission?.submitted_at ? new Date(submission.submitted_at).toLocaleDateString('az-AZ') : '-'}
                                    </td>
                                    <td className="p-4">
                                        <form action={gradeSubmission} className="flex justify-center">
                                            <input type="hidden" name="student_id" value={student.id} />
                                            <input
                                                name="grade"
                                                type="number"
                                                min="0"
                                                max="100"
                                                defaultValue={submission?.grade || ""}
                                                className="w-16 bg-slate-900 border border-slate-700 rounded text-center text-white py-1 focus:ring-1 focus:ring-emerald-500"
                                            />
                                            <button className="ml-2 hidden group-hover:block" type="submit">save</button>  {/* Hidden save button implies enter to save or we can modify UI */}
                                        </form>
                                    </td>
                                    <td className="p-4 text-right">
                                        {submission?.grade ? (
                                            <span className="text-emerald-400 text-xs font-bold border border-emerald-500/30 px-2 py-1 rounded bg-emerald-500/10">Qiymətləndirilib</span>
                                        ) : submission ? (
                                            <span className="text-amber-400 text-xs font-bold border border-amber-500/30 px-2 py-1 rounded bg-amber-500/10">Gözləyir</span>
                                        ) : (
                                            <span className="text-slate-600 text-xs">-</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
