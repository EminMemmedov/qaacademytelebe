"use client";

import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export function AddMaterialForm({ lessonId, cohortId, action }: { lessonId: string, cohortId: string, action: any }) {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const toastId = toast.loading("Material əlavə olunur...");

        try {
            const result = await action(formData);
            if (result && !result.success) {
                toast.error(result.message || "Xəta baş verdi", { id: toastId });
            } else {
                toast.success("Material uğurla əlavə edildi! ✅", { id: toastId });
                const form = document.getElementById("upload-form") as HTMLFormElement;
                if (form) form.reset();
            }
        } catch (e) {
            console.error(e);
            toast.error("Xəta baş verdi", { id: toastId });
        } finally {
            setLoading(false);
        }
    }

    return (
        <form id="upload-form" action={handleSubmit} className="space-y-4 pt-4 border-t border-slate-800">
            <div>
                <label className="text-xs text-slate-400 mb-1 block">Materialın Adı (Məs: Lecture 1 Slides)</label>
                <input name="title" required className="w-full bg-slate-900/50 border border-slate-700 rounded px-2 py-2 text-white text-sm focus:border-emerald-500 outline-none" />
            </div>

            <div>
                <label className="text-xs text-slate-400 mb-1 block">Link (Google Drive, Dropbox, PDF url)</label>
                <input
                    name="url"
                    placeholder="https://..."
                    required
                    className="w-full bg-slate-900/50 border border-slate-700 rounded px-2 py-2 text-white text-sm focus:border-emerald-500 outline-none"
                />
            </div>

            <button
                disabled={loading}
                className="w-full py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 hover:text-emerald-300 border border-emerald-600/50 rounded text-sm font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                {loading ? "Əlavə olunur..." : "Əlavə Et"}
            </button>
        </form>
    );
}
