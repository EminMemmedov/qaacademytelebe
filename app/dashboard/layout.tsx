import { Sidebar } from "@/components/layout/sidebar";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    // Default to student if no profile found
    const userRole = profile?.role || "student";
    const userName = profile?.full_name || "İstifadəçi";

    return (
        <div className="flex h-screen bg-slate-50">
            <MobileMenu>
                <Sidebar role={userRole} fullName={userName} />
            </MobileMenu>
            <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#0a0a0a] pt-16 lg:pt-8">
                {children}
            </main>
        </div>
    );
}
