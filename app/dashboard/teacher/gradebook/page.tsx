import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export default async function TeacherGradebookIndexPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="p-6 bg-slate-800/50 rounded-full">
                <BookOpen className="w-12 h-12 text-emerald-400" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">Jurnal</h1>
                <p className="text-slate-400 max-w-md mx-auto">
                    Jurnalı açmaq üçün zəhmət olmasa "Qruplarım" bölməsindən bir qrup seçin.
                </p>
            </div>
            <Link
                href="/dashboard/teacher/cohorts"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
            >
                Qruplarım Siyahısına Keç
            </Link>
        </div>
    );
}
