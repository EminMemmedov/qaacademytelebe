import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft, User, Calendar, BookOpen } from "lucide-react";
import Link from "next/link";

export default async function CohortDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: cohortId } = await params;
    const supabase = await createClient();

    // 1. Check Admin Access
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    // 2. Fetch Cohort Data
    const { data: cohort } = await supabase
        .from("cohorts")
        .select(`
            *,
            course:courses(*)
        `)
        .eq("id", cohortId)
        .single();

    if (!cohort) return <div>Qrup tapılmadı</div>;

    // 3. Fetch Students in this Cohort
    const { data: students } = await supabase
        .from("profiles")
        .select("*")
        .eq("cohort_id", cohortId)
        .eq("role", "student");

    // 4. Fetch Lessons
    const { data: lessons } = await supabase
        .from("lessons")
        .select("*")
        .eq("cohort_id", cohortId)
        .order("date", { ascending: true });


    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-4">
                <Link href="/dashboard/admin/cohorts" className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">{cohort.name}</h1>
                    {/* @ts-ignore */}
                    <p className="text-slate-400">Kurs: {cohort.course?.title}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Students List */}
                <div className="glass rounded-xl p-6 border border-white/5">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <User className="w-5 h-5 mr-2 text-blue-400" />
                            Tələbələr ({students?.length || 0})
                        </h2>
                        <Link href="/dashboard/admin/users" className="text-xs text-blue-400 hover:text-blue-300">
                            + Əlavə et
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {students && students.length > 0 ? (
                            students.map(student => (
                                <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold mr-3">
                                            {student.email?.[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{student.full_name || "Adsız"}</p>
                                            <p className="text-xs text-slate-500">{student.email}</p>
                                        </div>
                                    </div>
                                    <Link href={`/dashboard/admin/users/${student.id}`} className="text-xs text-emerald-400 hover:underline">
                                        Düzəliş
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500 text-sm">Bu qrupda tələbə yoxdur.</p>
                        )}
                    </div>
                </div>

                {/* Lessons List */}
                <div className="glass rounded-xl p-6 border border-white/5">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <BookOpen className="w-5 h-5 mr-2 text-emerald-400" />
                            Dərs Proqramı ({lessons?.length || 0})
                        </h2>
                        <button className="text-xs text-emerald-400 hover:text-emerald-300">
                            + Yeni Dərs
                        </button>
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {lessons && lessons.length > 0 ? (
                            lessons.map((lesson, index) => (
                                <div key={lesson.id} className="p-3 rounded-lg bg-white/5 border border-white/5">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-sm font-medium text-white">Dərs {index + 1}: {lesson.title}</h4>
                                        <span className="text-xs text-slate-500">{new Date(lesson.date).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{lesson.description}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500 text-sm">Dərs planı boşdur.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
