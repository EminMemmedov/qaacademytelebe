"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BottomNavItem {
    name: string;
    href: string;
    icon: LucideIcon;
    badge?: number;
}

export interface BottomNavProps {
    items: BottomNavItem[];
}

export function BottomNav({ items }: BottomNavProps) {
    const pathname = usePathname();

    return (
        <nav className="lg:hidden fixed bottom-0 inset-x-0 glass border-t border-white/10 z-40 safe-area-bottom">
            <div className="flex justify-around items-center px-2 py-2">
                {items.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex flex-col items-center justify-center min-w-[64px] py-2 px-3 rounded-lg transition-colors",
                                isActive
                                    ? "text-emerald-400"
                                    : "text-slate-400 hover:text-slate-200"
                            )}
                        >
                            {/* Active Indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="bottomNavActiveIndicator"
                                    className="absolute inset-0 bg-emerald-500/10 rounded-lg border border-emerald-500/20"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            {/* Icon */}
                            <div className="relative">
                                <Icon className={cn(
                                    "w-6 h-6 relative z-10",
                                    isActive && "drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                                )} />

                                {/* Badge */}
                                {item.badge && item.badge > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {item.badge > 9 ? "9+" : item.badge}
                                    </span>
                                )}
                            </div>

                            {/* Label */}
                            <span className={cn(
                                "text-[10px] font-medium mt-1 relative z-10",
                                isActive && "font-semibold"
                            )}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
