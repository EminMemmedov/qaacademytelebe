import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { PlayCircle, Calendar, BookOpen } from "lucide-react";
import { redirect } from "next/navigation";

export default async function LessonsPage() {
    const supabase = await createClient();

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    // 2. Get Profile & Cohort ID
    const { data: profile } = await supabase
        .from("profiles")
        .select("cohort_id")
        .eq("id", user.id)
        .single();

    if (!profile?.cohort_id) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold text-white">Qrup təyin edilməyib</h1>
                <p className="text-slate-400 mt-2">Dərsləri görmək üçün administrator qrupa əlavə etməlidir.</p>
            </div>
        );
    }

    // 3. Fetch Lessons for the Cohort
    const { data: lessons, error } = await supabase
        .from("lessons")
        .select(`
            id,
            title,
            description,
            date,
            duration_minutes,
            video_url
        `)
        .eq("cohort_id", profile.cohort_id)
        .order("date", { ascending: false }); // Newest first

    if (error) {
        console.error("Error fetching lessons:", error);
        return <div>Xəta baş verdi: Dərslər yüklənə bilmədi.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dərslər</h1>
                    <p className="text-slate-400">Keçirilmiş və gələcək dərslərin siyahısı</p>
                </div>
            </div>

            {lessons && lessons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lessons.map((lesson) => (
                        <div key={lesson.id} className="glass rounded-xl overflow-hidden group hover:border-emerald-500/50 transition-colors flex flex-col h-full">
                            {/* Thumbnail Placeholder */}
                            <div className="h-40 bg-slate-800 flex items-center justify-center relative shrink-0">
                                {lesson.video_url ? (
                                    <PlayCircle className="w-12 h-12 text-emerald-500 group-hover:text-emerald-400 transition-colors" />
                                ) : (
                                    <BookOpen className="w-12 h-12 text-slate-600 group-hover:text-slate-500 transition-colors" />
                                )}

                                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 rounded text-xs text-white">
                                    {lesson.duration_minutes} dəq
                                </div>
                            </div>

                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex items-center space-x-2 mb-2 text-xs text-slate-400">
                                    <Calendar className="w-3 h-3" />
                                    <span>{new Date(lesson.date).toLocaleDateString('az-AZ')}</span>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">{lesson.title}</h3>
                                <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-1">{lesson.description || "Təsvir yoxdur."}</p>

                                <Link
                                    href={`/dashboard/lessons/${lesson.id}`}
                                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors mt-auto"
                                >
                                    Dərsə Bax
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 rounded-xl border border-white/5 bg-white/5">
                    <p className="text-slate-400">Hələ ki, dərs siyahısı boşdur.</p>
                </div>
            )}
        </div>
    );
}
