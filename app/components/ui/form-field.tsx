"use client";

import { HTMLAttributes, forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Input, InputProps } from "./input";

export interface FormFieldProps extends Omit<InputProps, "name"> {
    name: string;
    label?: string;
    error?: string;
    helperText?: string;
    registration?: Partial<UseFormRegisterReturn>;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
    (
        {
            name,
            label,
            error,
            helperText,
            registration,
            className,
            ...props
        },
        ref
    ) => {
        return (
            <Input
                ref={ref}
                label={label}
                error={error}
                helperText={helperText}
                {...registration}
                {...props}
            />
        );
    }
);

FormField.displayName = "FormField";

// Textarea variant
export interface TextareaProps extends HTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    rows?: number;
    required?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            className,
            label,
            error,
            helperText,
            rows = 4,
            required,
            ...props
        },
        ref
    ) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="block text-sm font-medium text-slate-300">
                        {label}
                        {required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                )}

                <textarea
                    ref={ref}
                    rows={rows}
                    required={required}
                    className={cn(
                        "w-full bg-slate-900/50 border rounded-lg px-4 py-3 text-white text-sm",
                        "placeholder:text-slate-500",
                        "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "transition-all duration-200 resize-none",
                        error ? "border-red-500 focus:ring-red-500" : "border-slate-700",
                        className
                    )}
                    {...props}
                />

                {(error || helperText) && (
                    <p className={cn(
                        "text-xs",
                        error ? "text-red-400" : "text-slate-500"
                    )}>
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

Textarea.displayName = "Textarea";

export { FormField, Textarea };
