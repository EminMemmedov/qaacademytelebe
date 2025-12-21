"use client";

import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "success" | "warning" | "error" | "info" | "secondary";
    size?: "sm" | "md" | "lg";
    dot?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = "default", size = "md", dot = false, children, ...props }, ref) => {
        const baseStyles = "inline-flex items-center font-medium rounded-full border transition-colors";

        const variants = {
            default: "bg-slate-800 text-slate-300 border-slate-700",
            success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
            warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
            error: "bg-red-500/10 text-red-400 border-red-500/20",
            info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            secondary: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        };

        const sizes = {
            sm: "px-2 py-0.5 text-xs",
            md: "px-2.5 py-1 text-xs",
            lg: "px-3 py-1.5 text-sm",
        };

        const dotColors = {
            default: "bg-slate-400",
            success: "bg-emerald-400",
            warning: "bg-amber-400",
            error: "bg-red-400",
            info: "bg-blue-400",
            secondary: "bg-purple-400",
        };

        return (
            <span
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            >
                {dot && (
                    <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", dotColors[variant])} />
                )}
                {children}
            </span>
        );
    }
);

Badge.displayName = "Badge";

export { Badge };
