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
        <div className="flex h-full w-64 flex-col glass backdrop-blur-2xl border-r border-white/5 relative z-50">
            {/* Logo Area */}
            <div className="flex h-24 items-center justify-center border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                <div className="relative w-36 h-14 opacity-90 hover:opacity-100 transition-opacity cursor-pointer">
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
            <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto custom-scrollbar">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 overflow-hidden"
                        >
                            {/* Active Background Animation */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-emerald-400/10 border border-emerald-500/20 rounded-xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            {/* Hover Glow */}
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />

                            <item.icon
                                className={cn(
                                    "mr-3 h-5 w-5 flex-shrink-0 relative z-10 transition-colors duration-300",
                                    isActive ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "text-slate-400 group-hover:text-slate-200"
                                )}
                            />
                            <span className={cn(
                                "relative z-10 transition-colors duration-300",
                                isActive ? "text-white font-semibold" : "text-slate-400 group-hover:text-slate-200"
                            )}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile */}
            <div className="p-4 bg-gradient-to-t from-black/40 to-transparent border-t border-white/5">
                <div className="flex items-center space-x-3 mb-4 p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">
                        {fullName.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-white truncate">{fullName}</p>
                        <p className="text-xs text-slate-400 tracking-wide uppercase">{role === 'teacher' ? 'Müəllim' : role === 'admin' ? 'Admin' : 'Tələbə'}</p>
                    </div>
                </div>
                <button
                    onClick={handleSignOut}
                    className="flex w-full items-center justify-center rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 px-3 py-2 text-sm text-slate-400 hover:text-red-400 transition-all duration-300 group"
                >
                    <LogOut className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    Çıxış
                </button>
            </div>
        </div>
    );
}
