"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
    ...props
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "flex flex-col items-center justify-center py-12 px-4 text-center",
                className
            )}
            {...props}
        >
            {Icon && (
                <div className="mb-4 p-4 rounded-full bg-slate-800/50 border border-white/5">
                    <Icon className="w-8 h-8 text-slate-400" />
                </div>
            )}

            <h3 className="heading-4 mb-2">{title}</h3>

            {description && (
                <p className="body text-slate-400 max-w-md mb-6">
                    {description}
                </p>
            )}

            {action && (
                <Button onClick={action.onClick} variant="primary">
                    {action.label}
                </Button>
            )}
        </motion.div>
    );
}
