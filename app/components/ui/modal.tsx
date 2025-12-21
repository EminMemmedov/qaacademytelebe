"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { HTMLAttributes, forwardRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    size?: "sm" | "md" | "lg" | "xl" | "full";
    showCloseButton?: boolean;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
    (
        {
            isOpen,
            onClose,
            title,
            description,
            size = "md",
            showCloseButton = true,
            children,
            className,
            ...props
        },
        ref
    ) => {
        // Lock body scroll when modal is open
        useEffect(() => {
            if (isOpen) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "unset";
            }
            return () => {
                document.body.style.overflow = "unset";
            };
        }, [isOpen]);

        // Close on Escape key
        useEffect(() => {
            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === "Escape" && isOpen) {
                    onClose();
                }
            };
            document.addEventListener("keydown", handleEscape);
            return () => document.removeEventListener("keydown", handleEscape);
        }, [isOpen, onClose]);

        const sizes = {
            sm: "max-w-md",
            md: "max-w-lg",
            lg: "max-w-2xl",
            xl: "max-w-4xl",
            full: "max-w-full m-4",
        };

        return (
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />

                        {/* Modal */}
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                            <motion.div
                                ref={ref as any}
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                onClick={(e) => e.stopPropagation()}
                                className={cn(
                                    "w-full glass rounded-2xl border border-white/10 shadow-2xl",
                                    sizes[size],
                                    className
                                )}
                                {...(props as any)}
                            >
                                {/* Header */}
                                {(title || showCloseButton) && (
                                    <div className="flex items-start justify-between p-6 pb-4 border-b border-white/5">
                                        <div className="flex-1">
                                            {title && (
                                                <h2 className="heading-3">{title}</h2>
                                            )}
                                            {description && (
                                                <p className="body text-slate-400 mt-1">
                                                    {description}
                                                </p>
                                            )}
                                        </div>
                                        {showCloseButton && (
                                            <button
                                                onClick={onClose}
                                                className="ml-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                                                aria-label="Close modal"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Content */}
                                <div className="p-6">{children}</div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        );
    }
);

Modal.displayName = "Modal";

const ModalFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5",
                className
            )}
            {...props}
        />
    )
);
ModalFooter.displayName = "ModalFooter";

export { Modal, ModalFooter };
