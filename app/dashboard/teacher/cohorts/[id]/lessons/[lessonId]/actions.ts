"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addMaterialAction(formData: FormData, lessonId: string, cohortId: string) {
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;
    // const file = formData.get("file") as File; // Removed

    if (!title || !url) {
        return { success: false, message: "Başlıq və Link mütləqdir." };
    }

    try {
        const supabase = await createClient();

        // Direct DB Insert (Link)
        const { error: dbError } = await supabase.from("materials").insert({
            lesson_id: lessonId,
            title,
            file_url: url,
            type: "link"
        });

        if (dbError) {
            console.error("DB Insert Error:", dbError);
            return { success: false, message: "Məlumat bazasına yazılmadı." };
        }

        revalidatePath(`/dashboard/teacher/cohorts/${cohortId}/lessons/${lessonId}`);
        return { success: true };

    } catch (e: any) {
        console.error("Unexpected Server Error:", e);
        return { success: false, message: e.message || "Naməlum xəta baş verdi." };
    }
}
