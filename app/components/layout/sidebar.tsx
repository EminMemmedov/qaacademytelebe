"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BookOpen, FileText, CheckCircle, User, Users, GraduationCap, Settings, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

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
        <div className="flex h-full w-64 flex-col bg-[#09090b] border-r border-white/10 relative z-50">
            {/* Logo Area */}
            <div className="flex h-24 items-center justify-center border-b border-white/10">
                <div className="relative w-36 h-14 opacity-100 cursor-pointer">
                    <Image
                        src="/logo.png"
                        alt="QA Academy"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 px-4 py-8 overflow-y-auto custom-scrollbar">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group relative flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                                isActive
                                    ? "bg-white/10 text-white shadow-[0_1px_10px_rgba(0,0,0,0.5)]"
                                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                            )}
                        >
                            {/* Active Indicator (Left Bar) */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-emerald-500"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            <item.icon
                                className={cn(
                                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200",
                                    isActive ? "text-emerald-500" : "text-slate-500 group-hover:text-slate-300"
                                )}
                            />
                            <span className="truncate">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-white/10 bg-[#0c0c0e]">
                <div className="flex items-center space-x-3 mb-4 p-2">
                    <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold border-2 border-[#121214]">
                        {fullName.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-white truncate">{fullName}</p>
                        <p className="text-xs text-slate-500 tracking-wide uppercase font-medium">{role === 'teacher' ? 'Müəllim' : role === 'admin' ? 'Admin' : 'Tələbə'}</p>
                    </div>
                </div>
                <button
                    onClick={handleSignOut}
                    className="flex w-full items-center justify-center rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 px-3 py-2 text-sm text-slate-400 hover:text-red-400 transition-all duration-300"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Çıxış
                </button>
            </div>
        </div>
    );
}
