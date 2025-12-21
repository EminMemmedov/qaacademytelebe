"use client";

import { motion } from "framer-motion";
import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
    variant?: "default" | "bordered" | "elevated";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, hover = false, variant = "default", children, ...props }, ref) => {
        const baseStyles = "glass rounded-xl overflow-hidden";

        const variants = {
            default: "border border-white/5",
            bordered: "border-2 border-white/10",
            elevated: "border border-white/5 shadow-xl",
        };

        const Component = hover ? motion.div : "div";
        const motionProps = hover
            ? {
                whileHover: { y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" },
                transition: { type: "spring", stiffness: 300 },
            }
            : {};

        return (
            <Component
                ref={ref as any}
                className={cn(baseStyles, variants[variant], className)}
                {...motionProps}
                {...(props as any)}
            >
                {children}
            </Component>
        );
    }
);

Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("p-6 pb-4", className)}
            {...props}
        />
    )
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3
            ref={ref}
            className={cn("heading-4", className)}
            {...props}
        />
    )
);
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn("body text-slate-400 mt-1", className)}
            {...props}
        />
    )
);
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
    )
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("flex items-center p-6 pt-0", className)}
            {...props}
        />
    )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
