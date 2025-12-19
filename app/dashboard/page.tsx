import { createClient } from "@/lib/supabase/server";
import { BookOpen, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const supabase = await createClient();

    // 1. Get Authentication
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    // 2. Get Profile & Cohort Info
    const { data: profile } = await supabase
        .from("profiles")
        .select(`
            *,
            cohort:cohorts (
                id,
                name,
                course:courses(title)
            )
        `)
        .eq("id", user.id)
        .single();

    // 3. Variables for stats (default to 0 if no data)
    let pendingAssignmentsCount = 0;
    let attendanceRate = 0;
    let completedLessonsCount = 0;
    let totalLessonsCount = 0;
    let upcomingAssignments: any[] = [];
    let recentLessons: any[] = [];

    // 4. Fetch Data ONLY if user is assigned to a cohort
    if (profile?.cohort_id) {
        const cohortId = profile.cohort_id;

        // A. Fetch Upcoming Assignments
        const { data: assignments } = await supabase
            .from("assignments")
            .select(`
                id,
                title,
                due_date,
                lesson:lessons(title)
            `)
            .eq("cohort_id", cohortId)
            .gte("due_date", new Date().toISOString()) // Future dates
            .order("due_date", { ascending: true })
            .limit(5);

        if (assignments) {
            upcomingAssignments = assignments;
            pendingAssignmentsCount = assignments.length;
        }

        // B. Fetch Attendance Stats
        const { data: attendance } = await supabase
            .from("attendance_records")
            .select("status")
            .eq("student_id", user.id);

        if (attendance && attendance.length > 0) {
            const presentCount = attendance.filter(r => r.status === 'present').length;
            attendanceRate = Math.round((presentCount / attendance.length) * 100);
        }

        // C. Fetch Lessons (Total vs Completed logic - simplified for now)
        // We will just list recent lessons for the cohort
        const { data: lessons } = await supabase
            .from("lessons")
            .select("*")
            .eq("cohort_id", cohortId)
            .order("date", { ascending: false }) // Newest first
            .limit(3);

        if (lessons) {
            recentLessons = lessons;
            // Simplified "Completed" logic: lessons in the past
            // Ideally should check attendance or view history.
            // For MVP: let's assume if it's in the past, it's "done"
        }

        // Estimate total lessons (optional)
        const { count } = await supabase
            .from("lessons")
            .select("*", { count: 'exact', head: true })
            .eq("cohort_id", cohortId);
        totalLessonsCount = count || 0;
        // completed count approx
        completedLessonsCount = totalLessonsCount; // Placeholder logic
    }

    // Stats Array
    const stats = [
        { name: "Gözləyən Tapşırıqlar", value: pendingAssignmentsCount.toString(), icon: Clock, color: "text-amber-400" },
        { name: "İştirak Faizi", value: `${attendanceRate}%`, icon: CheckCircle, color: "text-emerald-400" },
        { name: "Keçirilən Dərslər", value: totalLessonsCount.toString(), icon: BookOpen, color: "text-blue-400" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Xoş gəldiniz, {profile?.full_name?.split(' ')[0] || "Tələbə"}! 👋
                </h1>
                <p className="text-slate-400 mt-2">
                    {profile?.cohort
                        ? `${// @ts-ignore 
                        profile.cohort.name} Qrupu • ${// @ts-ignore 
                        profile.cohort.course?.title || 'Kurs'}`
                        : "Sizə hələ heç bir qrup təyin olunmayıb."}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((item) => (
                    <div key={item.name} className="glass rounded-xl p-6 shadow-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                                <item.icon className={`h-8 w-8 ${item.color}`} />
                            </div>
                            <div className="ml-5">
                                <p className="text-sm font-medium text-slate-400 truncate">{item.name}</p>
                                <p className="text-3xl font-bold text-white mt-1">{item.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Assignments */}
                <div className="glass rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-amber-400" />
                        Yaxınlaşan Tapşırıqlar
                    </h2>
                    <div className="space-y-4">
                        {upcomingAssignments.length > 0 ? (
                            upcomingAssignments.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                    <div>
                                        <h3 className="text-white font-medium">{item.title}</h3>
                                        {/* @ts-ignore */}
                                        <p className="text-xs text-slate-500">{item.lesson?.title}</p>
                                        <p className="text-sm text-slate-400 mt-1">Son tarix: <span className="text-amber-300">{new Date(item.due_date).toLocaleDateString('az-AZ')}</span></p>
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                        Yeni
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500 text-sm">Hələ ki, yeni tapşırıq yoxdur.</p>
                        )}
                    </div>
                </div>

                {/* Recent Lessons */}
                <div className="glass rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
                        Son Dərslər
                    </h2>
                    <div className="space-y-4">
                        {recentLessons.length > 0 ? (
                            recentLessons.map((lesson) => (
                                <Link href={`/dashboard/lessons/${lesson.id}`} key={lesson.id} className="block group">
                                    <div className="p-4 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors border border-white/5">
                                        <h3 className="text-white font-medium group-hover:text-emerald-400 transition-colors">{lesson.title}</h3>
                                        <div className="flex justify-between items-center mt-2">
                                            <p className="text-sm text-slate-400">
                                                {new Date(lesson.date).toLocaleDateString('az-AZ')} • {lesson.duration_minutes} dəq
                                            </p>
                                            <span className="text-xs text-blue-300 underline">Izlə</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-slate-500 text-sm">
                                {profile?.cohort_id ? "Bu qrupda hələ dərs keçirilməyib." : "Qrup təyin edilməyib."}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
