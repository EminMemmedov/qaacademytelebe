import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft, Save, Calendar, FileText, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

export default async function NewAssignmentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: cohortId } = await params;
    const supabase = await createClient();

    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    // 2. Fetch Lessons (to link assignment to a lesson)
    const { data: lessons } = await supabase
        .from("lessons")
        .select("id, title")
        .eq("cohort_id", cohortId)
        .order("order_index");

    // 3. Helper for Cohort Name
    const { data: cohort } = await supabase.from("cohorts").select("name").eq("id", cohortId).single();

    // 4. Server Action
    async function createAssignment(formData: FormData) {
        "use server";
        const title = formData.get("title") as string;
        const lessonId = formData.get("lesson_id") as string;
        const description = formData.get("description") as string;
        const dueDate = formData.get("due_date") as string;

        const supabase = await createClient();

        const { error } = await supabase.from("assignments").insert({
            lesson_id: lessonId,
            title,
            description,
            due_date: dueDate ? new Date(dueDate).toISOString() : null
        });

        if (error) {
            console.error("Assignment creation failed:", error);
            throw new Error(error.message);
        }

        redirect(`/dashboard/teacher/cohorts/${cohortId}/assignments`);
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link href={`/dashboard/teacher/cohorts/${cohortId}/assignments`} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Yeni Tapşırıq</h1>
                    <p className="text-slate-400">Qrup: {cohort?.name}</p>
                </div>
            </div>

            <div className="glass rounded-xl p-8 border border-white/5">
                <form action={createAssignment} className="space-y-6">

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Tapşırıq Başlığı</label>
                        <input
                            name="title"
                            placeholder="Məs: Bug Report Yazılması"
                            required
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Əlaqəli Dərs</label>
                        <select
                            name="lesson_id"
                            required
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                        >
                            <option value="">Dərsi seçin...</option>
                            {lessons?.map(l => (
                                <option key={l.id} value={l.id}>{l.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Təsvir / Şərtlər</label>
                        <textarea
                            name="description"
                            rows={4}
                            placeholder="Tələbələr nə etməlidir?"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Son Tarix (Deadline)</label>
                        <input
                            type="datetime-local"
                            name="due_date"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none [&::-webkit-calendar-picker-indicator]:invert"
                        />
                    </div>

                    <div className="pt-6 border-t border-slate-800 flex justify-end gap-3">
                        <Link href={`/dashboard/teacher/cohorts/${cohortId}/assignments`} className="px-6 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                            Ləğv et
                        </Link>
                        <button type="submit" className="flex items-center px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-emerald-900/20">
                            <Save className="w-4 h-4 mr-2" />
                            Yadda Saxla
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
