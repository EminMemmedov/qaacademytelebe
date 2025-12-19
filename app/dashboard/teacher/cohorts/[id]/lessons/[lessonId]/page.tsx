import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft, Video, FileText, Check, X, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

import { AddMaterialForm } from "./components/add-material-form";
import { addMaterialAction } from "./actions";

export default async function ManageLessonPage({ params }: { params: Promise<{ id: string, lessonId: string }> }) {
    const { id: cohortId, lessonId } = await params;
    const supabase = await createClient();

    // 1. Auth & Access
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    // 2. Fetch Lesson
    const { data: lesson } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", lessonId)
        .single();

    // 3. Fetch Materials
    const { data: materials } = await supabase
        .from("materials")
        .select("*")
        .eq("lesson_id", lessonId)
        .order("created_at");

    // 4. Fetch Students of this Cohort
    const { data: students } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("cohort_id", cohortId)
        .eq("role", "student")
        .order("full_name");

    // 5. Fetch Attendance for this Lesson
    const { data: attendance } = await supabase
        .from("attendance_records")
        .select("*")
        .eq("lesson_id", lessonId);

    // --- ACTIONS ---

    async function updateVideo(formData: FormData) {
        "use server";
        const videoUrl = formData.get("video_url") as string;
        const supabase = await createClient();
        await supabase.from("lessons").update({ video_url: videoUrl }).eq("id", lessonId);
        revalidatePath(`/dashboard/teacher/cohorts/${cohortId}/lessons/${lessonId}`);
    }

    async function wrappedAddMaterial(formData: FormData) {
        "use server";
        return await addMaterialAction(formData, lessonId, cohortId);
    }

    async function deleteMaterial(materialId: string) { // Can't easily invoke direct arg func from form without hidden input or bind
        "use server";
        // This is tricky with pure server actions inside component without bind.
        // We will handle it differently or skip delete for MVP for simplicity.
        // Or standard form with hidden input.
        const supabase = await createClient();
        await supabase.from("materials").delete().eq("id", materialId);
        revalidatePath(`/dashboard/teacher/cohorts/${cohortId}/lessons/${lessonId}`);
    }

    async function markAttendance(formData: FormData) {
        "use server";
        const studentId = formData.get("student_id") as string;
        const status = formData.get("status") as string; // 'present' or 'absent'

        const supabase = await createClient();

        // Check if record exists
        const { data: existing } = await supabase
            .from("attendance_records")
            .select("id")
            .eq("lesson_id", lessonId)
            .eq("student_id", studentId)
            .single();

        if (existing) {
            await supabase.from("attendance_records").update({ status }).eq("id", existing.id);
        } else {
            await supabase.from("attendance_records").insert({
                lesson_id: lessonId,
                student_id: studentId,
                status,
                created_by: user?.id
            });
        }
        revalidatePath(`/dashboard/teacher/cohorts/${cohortId}/lessons/${lessonId}`);
    }


    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
                <Link href={`/dashboard/teacher/cohorts/${cohortId}/lessons`} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Dərs İdarəetməsi</h1>
                    <p className="text-slate-400">{lesson?.title}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1. Video Recording */}
                <div className="glass rounded-xl p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                        <Video className="w-5 h-5 mr-2 text-blue-400" />
                        Dərs Yazısı (Video)
                    </h3>
                    <form action={updateVideo} className="space-y-3">
                        <input
                            name="video_url"
                            defaultValue={lesson?.video_url || ""}
                            placeholder="https://youtube.com/..."
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
                        />
                        <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors">
                            Yadda Saxla
                        </button>
                    </form>
                </div>

                {/* 2. Materials */}
                <div className="glass rounded-xl p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-amber-400" />
                        Materiallar (Slayd, PDF)
                    </h3>

                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {materials?.map(m => (
                            <div key={m.id} className="flex justify-between items-center bg-slate-900/30 p-2 rounded border border-slate-800/50">
                                <a href={m.file_url} target="_blank" className="text-sm text-blue-400 hover:underline truncate max-w-[200px]">{m.title}</a>
                                <form action={async () => {
                                    "use server";
                                    const supabase = await createClient();
                                    await supabase.from("materials").delete().eq("id", m.id);
                                    revalidatePath(`/dashboard/teacher/cohorts/${cohortId}/lessons/${lessonId}`);
                                }}>
                                    <button className="text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                                </form>
                            </div>
                        ))}
                        {(!materials || materials.length === 0) && <p className="text-xs text-slate-500 italic">Material yoxdur.</p>}
                    </div>

                    <AddMaterialForm lessonId={lessonId} cohortId={cohortId} action={wrappedAddMaterial} />
                </div>
            </div>

            {/* 3. Attendance */}
            <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-between">
                    <span>İştirak (Davamiyyət)</span>
                    <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2 py-1 rounded">
                        Tələbələr: {students?.length || 0}
                    </span>
                </h3>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-xs text-slate-500 uppercase border-b border-slate-800">
                            <tr>
                                <th className="p-3">Tələbə</th>
                                <th className="p-3 text-center">Status</th>
                                <th className="p-3 text-right">Əməliyyat</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {students?.map(student => {
                                const record = attendance?.find(r => r.student_id === student.id);
                                const isPresent = record?.status === 'present';
                                const isAbsent = record?.status === 'absent';

                                return (
                                    <tr key={student.id} className="hover:bg-white/5">
                                        <td className="p-3 font-medium text-white">{student.full_name}</td>
                                        <td className="p-3 text-center">
                                            {isPresent && <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded">İştirak edir</span>}
                                            {isAbsent && <span className="text-red-400 text-xs font-bold bg-red-500/10 px-2 py-1 rounded">Qayib</span>}
                                            {!record && <span className="text-slate-500 text-xs">-</span>}
                                        </td>
                                        <td className="p-3 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <form action={markAttendance}>
                                                    <input type="hidden" name="student_id" value={student.id} />
                                                    <input type="hidden" name="status" value="present" />
                                                    <button className={`p-1.5 rounded transition-colors ${isPresent ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-emerald-400'}`} title="Var">
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                </form>
                                                <form action={markAttendance}>
                                                    <input type="hidden" name="student_id" value={student.id} />
                                                    <input type="hidden" name="status" value="absent" />
                                                    <button className={`p-1.5 rounded transition-colors ${isAbsent ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-red-400'}`} title="Yoxdur">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
