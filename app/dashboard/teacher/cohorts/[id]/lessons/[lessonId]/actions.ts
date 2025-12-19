"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addMaterialAction(formData: FormData, lessonId: string, cohortId: string) {
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;

    if (!title || !url) {
        return { success: false, message: "Başlıq və Link mütləqdir." };
    }

    try {
        const supabase = await createClient();

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

export async function updateVideoAction(lessonId: string, videoUrl: string, cohortId: string) {
    try {
        const supabase = await createClient();
        const { error } = await supabase.from("lessons").update({ video_url: videoUrl }).eq("id", lessonId);

        if (error) throw error;

        revalidatePath(`/dashboard/teacher/cohorts/${cohortId}/lessons/${lessonId}`);
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}

export async function markAttendanceAction(lessonId: string, studentId: string, status: string, cohortId: string) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Check for existing
        const { data: existing } = await supabase
            .from("attendance_records")
            .select("id")
            .eq("lesson_id", lessonId)
            .eq("student_id", studentId)
            .single();

        if (existing) {
            const { error } = await supabase.from("attendance_records").update({ status }).eq("id", existing.id);
            if (error) throw error;
        } else {
            const { error } = await supabase.from("attendance_records").insert({
                lesson_id: lessonId,
                student_id: studentId,
                status,
                created_by: user?.id
            });
            if (error) throw error;
        }

        revalidatePath(`/dashboard/teacher/cohorts/${cohortId}/lessons/${lessonId}`);
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}
