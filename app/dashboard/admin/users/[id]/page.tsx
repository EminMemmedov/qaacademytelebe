import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft, Save, Trash2, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default async function AdminEditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: userId } = await params;
    const supabase = await createClient();

    // 1. Check Admin Access
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) redirect("/auth/login");

    const { data: adminProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", currentUser.id)
        .single();

    if (adminProfile?.role !== "admin") return <div>Access Denied</div>;

    // 2. Fetch Target User Profile
    const { data: userProfile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (error || !userProfile) return <div>İstifadəçi tapılmadı.</div>;

    // 3. Fetch Cohorts for dropdown
    const { data: cohorts } = await supabase
        .from("cohorts")
        .select("id, name")
        .order("name", { ascending: true });

    // 4. Server Action to Update
    async function updateUser(formData: FormData) {
        "use server";

        const fullName = formData.get("full_name") as string;
        const role = formData.get("role") as string;
        const cohortId = formData.get("cohort_id") as string;

        const supabase = await createClient();

        const updateData: any = {
            full_name: fullName,
            role: role,
            cohort_id: cohortId === "none" ? null : cohortId,
        };

        const { error } = await supabase
            .from("profiles")
            .update(updateData)
            .eq("id", userId);

        if (error) {
            console.error("Error updating user:", error);
            // Handle error in real app
        }

        redirect("/dashboard/admin/users");
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/dashboard/admin/users" className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-white">İstifadəçiyə Düzəliş</h1>
            </div>

            <div className="glass rounded-xl p-8 border border-white/5">
                <form action={updateUser} className="space-y-6">
                    <div className="flex items-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg mb-6">
                        <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center text-xl font-bold text-white uppercase mr-4 shadow-lg shadow-emerald-900/20">
                            {userProfile.email?.[0]}
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Email</p>
                            <p className="text-lg font-medium text-white">{userProfile.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Ad Soyad</label>
                            <input
                                name="full_name"
                                defaultValue={userProfile.full_name || ""}
                                required
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Rol</label>
                            <select
                                name="role"
                                defaultValue={userProfile.role || "student"}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                            >
                                <option value="student">Tələbə (Student)</option>
                                <option value="teacher">Müəllim (Teacher)</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Qrup (Cohort)</label>
                        <select
                            name="cohort_id"
                            defaultValue={userProfile.cohort_id || "none"}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                        >
                            <option value="none">Qrup təyin edilməyib</option>
                            {cohorts?.map((cohort) => (
                                <option key={cohort.id} value={cohort.id}>
                                    {cohort.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-slate-500">Müəllim və ya Admin üçün bu sahə boş qala bilər.</p>
                    </div>

                    <div className="pt-6 border-t border-slate-800 flex justify-end gap-3">
                        <Link href="/dashboard/admin/users" className="px-6 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                            Ləğv et
                        </Link>
                        <button type="submit" className="flex items-center px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-emerald-900/20">
                            <Save className="w-4 h-4 mr-2" />
                            Yadda Saxla
                        </button>
                    </div>
                </form>
            </div>

            <div className="glass rounded-xl p-6 border border-red-500/10 mt-8">
                <h3 className="text-red-400 font-bold flex items-center mb-2">
                    <ShieldAlert className="w-5 h-5 mr-2" />
                    Təhlükəli Zona
                </h3>
                <p className="text-slate-400 text-sm mb-4">İstifadəçini silmək geri qaytarıla bilməyən bir əməliyyatdır. Bütün data silinəcək.</p>
                <button disabled className="px-4 py-2 border border-red-500/30 text-red-500 rounded-lg text-sm opacity-50 cursor-not-allowed">
                    İstifadəçini Sil (Tezliklə)
                </button>
            </div>
        </div>
    );
}
