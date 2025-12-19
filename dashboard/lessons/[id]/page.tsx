
import { ArrowLeft, Download, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function LessonDetailPage({ params }: { params: { id: string } }) {
    // In real app, fetch lesson by params.id
    const lessonId = params.id;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <Link href="/dashboard/lessons" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Dərslərə qayıt
            </Link>

            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-800 relative">
                <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=XXX"
                    title="Lesson Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Dərs {lessonId}: QA Giriş</h1>
                        <p className="text-slate-400 leading-relaxed">
                            Bu dərsdə biz proqram təminatının testlənməsinin əsas prinsiplərini,
                            Qalibiyyət Strategiyalarını və bug reportların düzgün yazılmasını öyrənəcəyik.
                        </p>
                    </div>

                    <div className="glass rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-emerald-400" />
                            Materiallar
                        </h2>
                        <div className="space-y-3">
                            <button className="flex w-full items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-slate-800 group">
                                <div className="flex items-center">
                                    <div className="p-2 bg-red-500/20 rounded text-red-500 mr-3">
                                        PDF
                                    </div>
                                    <span className="text-slate-200 group-hover:text-white">Dərs Slaydları.pdf</span>
                                </div>
                                <Download className="w-4 h-4 text-slate-500 group-hover:text-white" />
                            </button>
                            <button className="flex w-full items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-slate-800 group">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-500/20 rounded text-blue-500 mr-3">
                                        LINK
                                    </div>
                                    <span className="text-slate-200 group-hover:text-white">Faydalı Məqalə (Medium)</span>
                                </div>
                                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="glass rounded-xl p-6 sticky top-6">
                        <h3 className="tex-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Ev Tapşırığı</h3>

                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-4">
                            <h4 className="font-medium text-amber-400 mb-1">Status: Yeni</h4>
                            <p className="text-xs text-amber-200/70">Son tarix: 12 Fevral, 23:59</p>
                        </div>

                        <p className="text-sm text-slate-300 mb-4">
                            Zəhmət olmasa aşağıdakı sualları cavablandırın və PDF formatında yükləyin.
                        </p>

                        <ul className="list-disc list-inside text-sm text-slate-400 mb-6 space-y-1">
                            <li>Test Plan nədir?</li>
                            <li>Bug Report strukturu</li>
                        </ul>

                        <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-emerald-900/20">
                            Tapşırığı Göndər
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
