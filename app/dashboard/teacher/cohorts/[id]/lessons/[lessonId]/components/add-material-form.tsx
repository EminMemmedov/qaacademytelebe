"use client";

import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
// We pass the server action as a prop or import it if possible (but imports from server file to client file are restricted).
// Better pattern: Define action in a separate 'actions.ts' file. 
// OR: Just keep it simple and use useFormStatus if we had it, but for now standard form submit is fine.

export function AddMaterialForm({ lessonId, cohortId, action }: { lessonId: string, cohortId: string, action: any }) {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        try {
            // We call the action directly. Note: action is already bound or we pass args here if we change signature.
            // Actually, best practice with Server Actions + Client Components is passing valid closure BUT since we moved to actions.ts
            // we should probably import the action in the Parent and pass it down, OR import in Client Component?
            // Next.js allows importing Server Actions into Client Components. 
            // Let's assume 'action' prop is the bound version or wrapper.
            // BUT wait, in the previous step I defined action as (formData, lessonId, cohortId).
            // Passing it via props is cleaner if we bind it in the parent.

            const result = await action(formData);
            if (result && !result.success) {
                alert(result.message);
            } else {
                alert("Material uğurla yükləndi! ✅");
                // Optional: Reset file input by clearing the form
                const form = document.getElementById("upload-form") as HTMLFormElement;
                if (form) form.reset();
            }
        } catch (e) {
            console.error(e);
            alert("Xəta baş verdi.");
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
