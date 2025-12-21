"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = "primary",
            size = "md",
            isLoading = false,
            leftIcon,
            rightIcon,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

        const variants = {
            primary: "bg-emerald-600 text-white hover:bg-emerald-500 focus-visible:ring-emerald-500 shadow-lg shadow-emerald-900/20",
            secondary: "bg-slate-700 text-white hover:bg-slate-600 focus-visible:ring-slate-500",
            ghost: "bg-transparent text-slate-300 hover:bg-white/5 hover:text-white",
            danger: "bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-500 shadow-lg shadow-red-900/20",
            success: "bg-green-600 text-white hover:bg-green-500 focus-visible:ring-green-500",
        };

        const sizes = {
            sm: "px-3 py-1.5 text-sm min-h-[36px]",
            md: "px-4 py-2 text-sm min-h-[44px]",
            lg: "px-6 py-3 text-base min-h-[52px]",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
                whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
                className={cn(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
                {children}
                {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
            </motion.button>
        );
    }
);

Button.displayName = "Button";

export { Button };
