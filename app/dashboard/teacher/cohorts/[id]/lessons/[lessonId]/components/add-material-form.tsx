"use client";

import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
// We pass the server action as a prop or import it if possible (but imports from server file to client file are restricted).
// Better pattern: Define action in a separate 'actions.ts' file. 
// OR: Just keep it simple and use useFormStatus if we had it, but for now standard form submit is fine.

export function AddMaterialForm({ action }: { action: (formData: FormData) => Promise<void> }) {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        try {
            await action(formData);
            // Reset form? Hard with native action unless we use useRef for form.
            // For now, let rsc revalidate handle it.
        } catch (e) {
            console.error(e);
            alert("Xəta baş verdi. Fayl ölçüsünü yoxlayın.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4 pt-4 border-t border-slate-800">
            <div>
                <label className="text-xs text-slate-400 mb-1 block">Materialın Adı (Məs: Lecture 1 Slides)</label>
                <input name="title" required className="w-full bg-slate-900/50 border border-slate-700 rounded px-2 py-2 text-white text-sm focus:border-emerald-500 outline-none" />
            </div>

            <div>
                <label className="text-xs text-slate-400 mb-1 block">Fayl Seçin (PDF, PPTX, DOCX)</label>
                <input
                    type="file"
                    name="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                    required
                    className="w-full text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20"
                />
            </div>

            <button
                disabled={loading}
                className="w-full py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 hover:text-emerald-300 border border-emerald-600/50 rounded text-sm font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                {loading ? "Yüklənir..." : "Yüklə"}
            </button>
        </form>
    );
}
