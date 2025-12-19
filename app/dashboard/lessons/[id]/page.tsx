import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Download, FileText, ExternalLink, Link as LinkIcon, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

interface Params {
    params: {
        id: string;
    }
}

export default async function LessonDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: lessonId } = await params;
    const supabase = await createClient();

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    // 2. Fetch Lesson Details (Real Data)
    const { data: lesson, error } = await supabase
        .from("lessons")
        .select(`
            *,
            materials(*),
            assignments(
                id,
                title,
                description,
                due_date
            )
        `)
        .eq("id", lessonId)
        .single();

    // 3. Check Submission Status (Create Map)
    // We need to know if the student already submitted ANY of these assignments
    let submissions: any[] = [];
    if (lesson?.assignments?.length > 0) {
        const assignmentIds = lesson.assignments.map((a: any) => a.id);
        const { data: subs } = await supabase
            .from("submissions")
            .select("*")
            .in("assignment_id", assignmentIds)
            .eq("student_id", user.id);
        submissions = subs || [];
    }

    if (error || !lesson) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h1 className="text-2xl font-bold text-white mb-2">Dərs tapılmadı</h1>
                <Link href="/dashboard/lessons" className="text-emerald-400 hover:text-emerald-300">Siyahıya qayıt</Link>
            </div>
        );
    }

    // Helper to extract video ID from YouTube URL (Simple implementation)
    const getYoutubeEmbedUrl = (url: string | null) => {
        if (!url) return null;
        if (url.includes("embed")) return url; // Already embed
        const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/);
        return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : url;
    };

    const embedUrl = getYoutubeEmbedUrl(lesson.video_url);

    // --- SUBMIT ACTION ---
    async function submitAssignment(formData: FormData) {
        "use server";
        const assignmentId = formData.get("assignment_id") as string;
        const link = formData.get("link") as string;
        const comment = formData.get("comment") as string;

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return; // Should not happen

        await supabase.from("submissions").insert({
            assignment_id: assignmentId,
            student_id: user.id,
            submission_link: link,
            comments: comment,
            status: "submitted",
            submitted_at: new Date().toISOString()
        });

        revalidatePath(`/dashboard/lessons/${lessonId}`);
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <Link href="/dashboard/lessons" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Dərslərə qayıt
            </Link>

            {/* Video Player */}
            {embedUrl ? (
                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-800 relative">
                    <iframe
                        className="w-full h-full"
                        src={embedUrl}
                        title={lesson.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            ) : (
                <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800">
                    <p className="text-slate-500">Video mövcud deyil</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{lesson.title}</h1>
                        <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">
                            {lesson.content || lesson.full_content || "Təsvir yoxdur."}
                        </p>
                    </div>

                    {/* Materials Section */}
                    <div className="glass rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-emerald-400" />
                            Materiallar
                        </h2>
                        {lesson.materials && lesson.materials.length > 0 ? (
                            <div className="space-y-3">
                                {lesson.materials.map((material: any) => (
                                    <a
                                        key={material.id}
                                        href={material.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex w-full items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-slate-800 group"
                                    >
                                        <div className="flex items-center">
                                            <div className="p-2 bg-blue-500/20 rounded text-blue-500 mr-3">
                                                {material.type === 'link' ? 'LINK' : 'FILE'}
                                            </div>
                                            <span className="text-slate-200 group-hover:text-white">{material.title}</span>
                                        </div>
                                        {material.type === 'link' ? (
                                            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white" />
                                        ) : (
                                            <Download className="w-4 h-4 text-slate-500 group-hover:text-white" />
                                        )}

                                    </a>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm">Bu dərs üçün material yoxdur.</p>
                        )}
                    </div>
                </div>

                {/* Assignments Sidebar with Submission Form */}
                <div className="lg:col-span-1">
                    <div className="glass rounded-xl p-6 sticky top-6 space-y-8">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Ev Tapşırığı</h3>

                        {lesson.assignments && lesson.assignments.length > 0 ? (
                            // @ts-ignore
                            lesson.assignments.map((assignment: any) => {
                                const submission = submissions.find(s => s.assignment_id === assignment.id);
                                const isSubmitted = !!submission;

                                return (
                                    <div key={assignment.id} className="space-y-4 pt-4 first:pt-0 border-t border-slate-800 first:border-0">
                                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                                            <h4 className="font-medium text-amber-400 mb-1">{assignment.title}</h4>
                                            {assignment.due_date && (
                                                <p className="text-xs text-amber-200/70 flex items-center mt-1">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    Son tarix: {new Date(assignment.due_date).toLocaleDateString('az-AZ')}
                                                </p>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-300 whitespace-pre-wrap">
                                            {assignment.description}
                                        </p>

                                        {isSubmitted ? (
                                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex items-start space-x-3">
                                                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-emerald-400">Tapşırıq göndərilib</p>
                                                    <p className="text-xs text-emerald-200/70 mt-1">
                                                        Tarix: {new Date(submission.submitted_at).toLocaleDateString('az-AZ')}
                                                    </p>
                                                    {submission.grade && (
                                                        <p className="text-sm font-bold text-white mt-2">
                                                            Qiymət: {submission.grade}/100
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <form action={submitAssignment} className="space-y-3">
                                                <input type="hidden" name="assignment_id" value={assignment.id} />
                                                <input
                                                    name="link"
                                                    required
                                                    placeholder="Link (GitHub, Google Docs...)"
                                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                                />
                                                <textarea
                                                    name="comment"
                                                    rows={2}
                                                    placeholder="Şərhiniz (opsional)"
                                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                                />
                                                <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors text-sm shadow-lg shadow-emerald-900/20">
                                                    Göndər
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-slate-500 text-sm">Bu dərs üçün tapşırıq yoxdur.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
