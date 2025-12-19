import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Download, FileText, ExternalLink, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

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
                due_date,
                status
            )
        `)
        .eq("id", lessonId)
        .single();

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
                            {lesson.description || "Təsvir yoxdur."}
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

                {/* Assignments Sidebar */}
                <div className="lg:col-span-1">
                    <div className="glass rounded-xl p-6 sticky top-6">
                        <h3 className="tex-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Ev Tapşırığı</h3>

                        {lesson.assignments && lesson.assignments.length > 0 ? (
                            lesson.assignments.map((assignment: any) => (
                                <div key={assignment.id} className="mb-6 last:mb-0">
                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-3">
                                        <h4 className="font-medium text-amber-400 mb-1">{assignment.title}</h4>
                                        <p className="text-xs text-amber-200/70">
                                            Son tarix: {new Date(assignment.due_date).toLocaleDateString('az-AZ')}
                                        </p>
                                    </div>
                                    <p className="text-sm text-slate-300 mb-4 whitespace-pre-wrap">
                                        {assignment.description}
                                    </p>
                                    <Link href={`/dashboard/assignments`} className="block w-full text-center py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-emerald-900/20">
                                        Tapşırığa Keç
                                    </Link>
                                </div>
                            ))
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
