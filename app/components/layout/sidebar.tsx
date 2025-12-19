"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BookOpen, FileText, CheckCircle, User } from "lucide-react";

const navigation = [
    { name: "Panel", href: "/dashboard", icon: LayoutDashboard },
    { name: "Dərslər", href: "/dashboard/lessons", icon: BookOpen },
    { name: "Tapşırıqlar", href: "/dashboard/assignments", icon: FileText },
    { name: "İştirak", href: "/dashboard/attendance", icon: CheckCircle },
    { name: "Profil", href: "/dashboard/profile", icon: User },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col bg-slate-900 text-white">
            <div className="flex h-16 items-center justify-center border-b border-slate-800">
                <h1 className="text-xl font-bold text-emerald-400">QA Academy</h1>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
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
                <div className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-emerald-500 flex items-center justify-center text-sm font-bold">
                        T
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-white">Tələbə Adı</p>
                        <p className="text-xs text-slate-400">Tələbə</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
