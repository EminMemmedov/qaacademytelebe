"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type,
            label,
            error,
            helperText,
            leftIcon,
            rightIcon,
            disabled,
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === "password";
        const inputType = isPassword && showPassword ? "text" : type;

        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="block text-sm font-medium text-slate-300">
                        {label}
                        {props.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        type={inputType}
                        className={cn(
                            "w-full bg-slate-900/50 border rounded-lg px-4 py-3 text-white text-sm",
                            "placeholder:text-slate-500",
                            "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            "transition-all duration-200",
                            error ? "border-red-500 focus:ring-red-500" : "border-slate-700",
                            leftIcon && "pl-10",
                            (rightIcon || isPassword) && "pr-10",
                            className
                        )}
                        ref={ref}
                        disabled={disabled}
                        {...props}
                    />

                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    )}

                    {!isPassword && rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {rightIcon}
                        </div>
                    )}
                </div>

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

Input.displayName = "Input";

export { Input };
