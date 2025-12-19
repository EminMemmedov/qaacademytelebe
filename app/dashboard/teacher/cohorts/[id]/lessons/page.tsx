import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft, Plus, PlayCircle, FileText, Settings } from "lucide-react";
import Link from "next/link";

export default async function TeacherLessonsListPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: cohortId } = await params;
    const supabase = await createClient();

    // 1. Check Access
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    // 2. Fetch Lessons
    const { data: lessons } = await supabase
        .from("lessons")
        .select("*")
        .eq("cohort_id", cohortId)
        .order("order_index", { ascending: true })
        .order("date", { ascending: true });

    // 3. Fetch Cohort Name
    const { data: cohort } = await supabase.from("cohorts").select("name").eq("id", cohortId).single();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard/teacher/cohorts" className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Dərslər: {cohort?.name}</h1>
                        <p className="text-slate-400">Dərs proqramı və materialların idarə edilməsi</p>
                    </div>
                </div>
                {/* Normally admins create lessons, but teachers might need to add one too. Let's redirect to New Lesson (if needed) or keep it simple. */}
            </div>

            <div className="grid gap-4">
                {lessons?.map((lesson, index) => (
                    <div key={lesson.id} className="glass p-5 rounded-xl border border-white/5 flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                        <div className="flex items-center space-x-4">
                            <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-800 rounded-lg text-slate-400 font-bold text-sm">
                                <span>#{index + 1}</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">{lesson.title}</h3>
                                <p className="text-sm text-slate-400 flex items-center">
                                    {lesson.date ? new Date(lesson.date).toLocaleDateString('az-AZ') : "Tarix təyin edilməyib"}
                                    {lesson.video_url && <span className="ml-2 px-2 py-0.5 bg-red-500/10 text-red-400 text-xs rounded-full flex items-center"><PlayCircle className="w-3 h-3 mr-1" /> Yazı var</span>}
                                </p>
                            </div>
                        </div>

                        <Link
                            href={`/dashboard/teacher/cohorts/${cohortId}/lessons/${lesson.id}`}
                            className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors text-sm"
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            İdarə et
                        </Link>
                    </div>
                ))}

                {(!lessons || lessons.length === 0) && (
                    <div className="text-center py-12 glass rounded-xl border border-white/5">
                        <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white">Dərs tapılmadı</h3>
                        <p className="text-slate-400 mt-2 max-w-sm mx-auto">
                            Bu qrup üçün hələ dərs yaradılmayıb. Zəhmət olmasa Administrator ilə əlaqə saxlayın və ya dərs proqramını gözləyin.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
