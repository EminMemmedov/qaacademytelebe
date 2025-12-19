import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { User, Mail, Shield, Book, Key_Round } from "lucide-react";

export default async function ProfilePage() {
    const supabase = await createClient();

    // 1. Get Current User
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    // 2. Fetch Profile Info
    const { data: profile } = await supabase
        .from("profiles")
        .select(`
            *,
            cohort:cohorts(name, course:courses(title))
        `)
        .eq("id", user.id)
        .single();

    // Server Actions
    async function updateProfile(formData: FormData) {
        "use server";
        const fullName = formData.get("full_name") as string;
        // const password = formData.get("password") as string; // Changing password requires Auth API

        const supabase = await createClient();
        await supabase
            .from("profiles")
            .update({ full_name: fullName })
            .eq("id", user?.id);

        // Handling password change is more complex (needs separate auth.updateUser call), skipping for minimal MVP for now OR implemented via client side.
        // Let's stick to name update here.
        redirect("/dashboard/profile");
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Profil</h1>
                <p className="text-slate-400">Şəxsi məlumatlar və tənzimləmələr</p>
            </div>

            <div className="glass p-8 rounded-xl flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 border-emerald-500/30 bg-emerald-900/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="h-24 w-24 rounded-full bg-emerald-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-emerald-900/50 z-10 uppercase shrink-0">
                    {profile?.full_name?.[0] || user.email?.[0]}
                </div>
                <div className="text-center md:text-left z-10">
                    <h2 className="text-2xl font-bold text-white">{profile?.full_name || "Adsız İstifadəçi"}</h2>
                    <p className="text-emerald-400 font-medium capitalize">{profile?.role}</p>
                    <p className="text-slate-400 text-sm mt-1">{user.email}</p>
                </div>
            </div>

            <div className="glass rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Məlumatlar</h3>

                <form action={updateProfile} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm text-slate-400">Ad Soyad</label>
                        <input
                            name="full_name"
                            defaultValue={profile?.full_name || ""}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-1">
                            <label className="text-xs text-slate-500 uppercase tracking-widest flex items-center">
                                <Mail className="w-3 h-3 mr-1" /> Email
                            </label>
                            <p className="text-white font-medium break-all">{user.email}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-slate-500 uppercase tracking-widest flex items-center">
                                <Shield className="w-3 h-3 mr-1" /> Rol
                            </label>
                            <p className="text-white font-medium capitalize">{profile?.role}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-slate-500 uppercase tracking-widest flex items-center">
                                <Book className="w-3 h-3 mr-1" /> Qrup
                            </label>
                            {/* @ts-ignore */}
                            <p className="text-white font-medium">{profile?.cohort?.name || "Təyin edilməyib"}</p>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors">
                            Yadda Saxla
                        </button>
                    </div>
                </form>
            </div>

            <div className="glass rounded-xl p-6 opacity-75">
                <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2 mb-4">Təhlükəsizlik</h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white font-medium flex items-center"><Key_Round className="w-4 h-4 mr-2" /> Şifrə</p>
                        <p className="text-xs text-slate-500">Şifrəni dəyişmək üçün email təsdiqi tələb oluna bilər.</p>
                    </div>

                    <button disabled className="px-4 py-2 bg-slate-800 text-slate-500 rounded-lg text-sm font-medium cursor-not-allowed">
                        Dəyiş (Tezliklə)
                    </button>
                </div>
            </div>
        </div>
    );
}
