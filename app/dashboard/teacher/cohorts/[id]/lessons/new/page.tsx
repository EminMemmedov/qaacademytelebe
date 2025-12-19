import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft, Save, Calendar, BookOpen } from "lucide-react";
import Link from "next/link";

export default async function NewLessonPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: cohortId } = await params;
    const supabase = await createClient();

    // 1. Auth Check (Teacher/Admin)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    // 2. Fetch Cohort Name (for context)
    const { data: cohort } = await supabase.from("cohorts").select("name").eq("id", cohortId).single();

    // 3. Server Action
    async function createLesson(formData: FormData) {
        "use server";
        const title = formData.get("title") as string;
        const date = formData.get("date") as string;

        console.log("Attempting to create lesson:", { title, date, cohortId, userId: user?.id });

        const supabase = await createClient();

        // Auto-calculate order index (simple count + 1)
        const { count } = await supabase
            .from("lessons")
            .select("*", { count: 'exact', head: true })
            .eq("cohort_id", cohortId);

        const newOrder = (count || 0) + 1;

        const { data, error } = await supabase.from("lessons").insert({
            cohort_id: cohortId,
            title,
            date: date ? new Date(date).toISOString() : null,
            order_index: newOrder,
            content: "" // Initialize empty content
        }).select();

        if (error) {
            console.error("FATAL DB ERROR creating lesson:", error);
            throw new Error(`Failed to create lesson: ${error.message} (Code: ${error.code})`);
        }

        console.log("Lesson created successfully:", data);
        redirect(`/dashboard/teacher/cohorts/${cohortId}/lessons`);
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link href={`/dashboard/teacher/cohorts/${cohortId}/lessons`} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Yeni Dərs Yarat</h1>
                    <p className="text-slate-400">Qrup: {cohort?.name}</p>
                </div>
            </div>

            <div className="glass rounded-xl p-8 border border-white/5">
                <form action={createLesson} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center">
                                <BookOpen className="w-4 h-4 mr-2 text-emerald-400" />
                                Dərs Mövzusu (Başlıq)
                            </label>
                            <input
                                name="title"
                                placeholder="Məs: Giriş, HTML Strukturu, API Testing..."
                                required
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-600"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                                Tarix (Planlaşdırılan)
                            </label>
                            <input
                                type="datetime-local"
                                name="date"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none [&::-webkit-calendar-picker-indicator]:invert"
                            />
                            <p className="text-xs text-slate-500">Boş saxlanılarsa, "Tarix təyin edilməyib" kimi görünəcək.</p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800 flex justify-end gap-3">
                        <Link href={`/dashboard/teacher/cohorts/${cohortId}/lessons`} className="px-6 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                            Ləğv et
                        </Link>
                        <button type="submit" className="flex items-center px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-emerald-900/20">
                            <Save className="w-4 h-4 mr-2" />
                            Yarat
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
