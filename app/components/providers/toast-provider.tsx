"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                // Default options
                duration: 4000,
                style: {
                    background: '#1e293b', // slate-800
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                },
                // Success
                success: {
                    iconTheme: {
                        primary: '#10b981', // emerald-500
                        secondary: '#fff',
                    },
                    style: {
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                    },
                },
                // Error
                error: {
                    iconTheme: {
                        primary: '#ef4444', // red-500
                        secondary: '#fff',
                    },
                    style: {
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                    },
                },
                // Loading
                loading: {
                    iconTheme: {
                        primary: '#3b82f6', // blue-500
                        secondary: '#fff',
                    },
                },
            }}
        />
    );
}
