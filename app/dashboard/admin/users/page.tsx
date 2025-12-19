import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { User, Shield, Users, Search } from "lucide-react";

export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q } = await searchParams;
    const supabase = await createClient();

    // 1. Check Admin Access
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    const { data: currentUserProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (currentUserProfile?.role !== "admin") {
        return <div className="text-white p-8">Access Denied.</div>;
    }

    // 2. Fetch Users (Profiles) + Cohort info
    let query = supabase
        .from("profiles")
        .select(`
            *,
            cohort:cohorts(name)
        `)
        .order("created_at", { ascending: false });

    if (q) {
        query = query.ilike("email", `%${q}%`);
    }

    const { data: profiles, error } = await query;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">İstifadəçilər</h1>
                    <p className="text-slate-400">Sistemdəki bütün istifadəçilərin idarə edilməsi</p>
                </div>

                {/* Search Bar - Simple Form */}
                <form className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        name="q"
                        defaultValue={q}
                        placeholder="Email və ya ad ilə axtar..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </form>
            </div>

            <div className="glass rounded-xl overflow-hidden border border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 bg-black/20">
                                <th className="p-4 text-sm font-medium text-slate-400">İstifadəçi</th>
                                <th className="p-4 text-sm font-medium text-slate-400">Rol</th>
                                <th className="p-4 text-sm font-medium text-slate-400">Qrup</th>
                                <th className="p-4 text-sm font-medium text-slate-400">Status</th>
                                <th className="p-4 text-sm font-medium text-slate-400 text-right">Əməliyyatlar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {profiles?.map((profile) => (
                                <tr key={profile.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold mr-3 uppercase">
                                                {profile.full_name?.[0] || profile.email?.[0]}
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{profile.full_name || "Adsız"}</div>
                                                <div className="text-xs text-slate-500">{profile.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${profile.role === 'admin'
                                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                            : profile.role === 'teacher'
                                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                : 'bg-slate-800 text-slate-300 border-slate-700'
                                            }`}>
                                            {profile.role === 'admin' ? <Shield className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                                            <span className="capitalize">{profile.role}</span>
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {/* @ts-ignore */}
                                        {profile.cohort ? (
                                            <span className="inline-flex items-center text-sm text-emerald-400">
                                                <Users className="w-3 h-3 mr-1.5" />
                                                {/* @ts-ignore */}
                                                {profile.cohort.name}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-slate-600 italic">Təyin edilməyib</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
                                        <span className="text-sm text-slate-300">Aktiv</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <a href={`/dashboard/admin/users/${profile.id}`} className="text-sm font-medium text-emerald-400 hover:text-emerald-300">
                                            Düzəliş et
                                        </a>
                                    </td>
                                </tr>
                            ))}

                            {(!profiles || profiles.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        İstifadəçi tapılmadı.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
