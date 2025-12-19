"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addMaterialAction(formData: FormData, lessonId: string, cohortId: string) {
    const title = formData.get("title") as string;
    const file = formData.get("file") as File;

    if (!title || !file) {
        return { success: false, message: "Məlumatlar natamamdır." };
    }

    try {
        const supabase = await createClient();

        // 1. Upload File
        const fileExt = file.name.split('.').pop();
        // Sanitize filename to avoid issues
        const safeFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `${lessonId}/${safeFileName}`;

        console.log("Uploading file to path:", filePath);

        const { error: uploadError } = await supabase.storage
            .from('materials')
            .upload(filePath, file);

        if (uploadError) {
            console.error("Storage Upload Error:", uploadError);
            return { success: false, message: `Yükləmə xətası: ${uploadError.message}` };
        }

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('materials')
            .getPublicUrl(filePath);

        // 3. Save to DB
        const { error: dbError } = await supabase.from("materials").insert({
            lesson_id: lessonId,
            title,
            file_url: publicUrl,
            type: "file"
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
