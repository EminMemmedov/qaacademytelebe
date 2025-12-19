import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default async function NewCohortPage() {
    const supabase = await createClient();

    // 1. Check Admin Access
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") return <div>Access Denied</div>;

    // 2. Fetch Courses (to link cohort to a course)
    const { data: courses } = await supabase.from("courses").select("id, title");

    // 3. Server Action
    async function createCohort(formData: FormData) {
        "use server";

        const name = formData.get("name") as string;
        const courseId = formData.get("course_id") as string;
        const startDate = formData.get("start_date") as string;
        const endDate = formData.get("end_date") as string;

        const supabase = await createClient();

        const { error } = await supabase
            .from("cohorts")
            .insert({
                name,
                course_id: courseId,
                start_date: startDate,
                end_date: endDate,
            });

        if (error) {
            console.error("Error creating cohort:", error);
            // Handle error...
        }

        redirect("/dashboard/admin/cohorts");
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/dashboard/admin/cohorts" className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-white">Yeni Qrup Yarat</h1>
            </div>

            <div className="glass rounded-xl p-8 border border-white/5">
                <form action={createCohort} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Qrup Adı</label>
                        <input
                            name="name"
                            placeholder="Məs: QA-Group-25"
                            required
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Kurs Seçin</label>
                        <select
                            name="course_id"
                            required
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                        >
                            <option value="">Seçin...</option>
                            {courses?.map(course => (
                                <option key={course.id} value={course.id}>{course.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Başlanğıc Tarixi</label>
                            <input
                                type="date"
                                name="start_date"
                                required
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Bitmə Tarixi</label>
                            <input
                                type="date"
                                name="end_date"
                                required
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800 flex justify-end gap-3">
                        <Link href="/dashboard/admin/cohorts" className="px-6 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
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
