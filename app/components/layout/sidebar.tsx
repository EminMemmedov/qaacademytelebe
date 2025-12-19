"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BookOpen, FileText, CheckCircle, User, Users, GraduationCap, Settings, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Define menu items for each role
const navigationByRole = {
    student: [
        { name: "Panel", href: "/dashboard", icon: LayoutDashboard },
        { name: "Dərslər", href: "/dashboard/lessons", icon: BookOpen },
        { name: "Tapşırıqlar", href: "/dashboard/assignments", icon: FileText },
        { name: "İştirak", href: "/dashboard/attendance", icon: CheckCircle },
        { name: "Profil", href: "/dashboard/profile", icon: User },
    ],
    teacher: [
        { name: "Panel", href: "/dashboard", icon: LayoutDashboard },
        { name: "Qruplarım", href: "/dashboard/teacher/cohorts", icon: Users },
        { name: "Jurnal", href: "/dashboard/teacher/gradebook", icon: BookOpen },
        { name: "Tapşırıqlar", href: "/dashboard/teacher/assignments", icon: FileText },
        { name: "Profil", href: "/dashboard/profile", icon: User },
    ],
    admin: [
        { name: "Panel", href: "/dashboard", icon: LayoutDashboard },
        { name: "İstifadəçilər", href: "/dashboard/admin/users", icon: Users },
        { name: "Qruplar", href: "/dashboard/admin/cohorts", icon: GraduationCap },
        { name: "Dərslər", href: "/dashboard/admin/lessons", icon: BookOpen },
        { name: "Tənzimləmələr", href: "/dashboard/admin/settings", icon: Settings },
        { name: "Profil", href: "/dashboard/profile", icon: User },
    ]
};

interface SidebarProps {
    role: "student" | "teacher" | "admin";
    fullName: string;
}

export function Sidebar({ role = "student", fullName }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const navigation = navigationByRole[role] || navigationByRole.student;

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/auth/login");
        router.refresh();
    };

    return (
        <div className="flex h-full w-64 flex-col bg-slate-900 text-white border-r border-slate-800">
            <div className="flex h-20 items-center justify-center border-b border-slate-800 bg-white">
                <div className="relative w-32 h-12">
                    <Image
                        src="/logo.png"
                        alt="QA Academy"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-emerald-600 text-white"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "mr-3 h-5 w-5 flex-shrink-0",
                                    isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                                )}
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t border-slate-800 p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <div className="h-9 w-9 rounded-full bg-emerald-500 flex items-center justify-center text-sm font-bold uppercase text-white shadow-lg shadow-emerald-900/20">
                            {fullName.charAt(0)}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-white max-w-[100px] truncate" title={fullName}>{fullName}</p>
                            <p className="text-xs text-slate-400 capitalize">{role === 'teacher' ? 'Müəllim' : role === 'admin' ? 'Administrator' : 'Tələbə'}</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleSignOut}
                    className="flex w-full items-center justify-center rounded-md bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Çıxış
                </button>
            </div>
        </div>
    );
}
