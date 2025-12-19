import Link from "next/link";
import { PlayCircle, FileText, Calendar } from "lucide-react";

// Mock Data for MVP demo
const lessons = [
    {
        id: "1",
        title: "Giriş: QA nədir?",
        description: "Proqram təminatının testlənməsi əsasları.",
        date: "2024-02-01",
        duration: "45 dəq",
    },
    {
        id: "2",
        title: "SDLC və STLC Modelləri",
        description: "Software Development Life Cycle modellərinin incələnməsi.",
        date: "2024-02-03",
        duration: "60 dəq",
    },
    {
        id: "3",
        title: "Test Sənədləşməsi",
        description: "Test planı, Test Case və Bug Report yazılması.",
        date: "2024-02-05",
        duration: "55 dəq",
    },
    {
        id: "4",
        title: "Jira ilə İş",
        description: "Jira alətindən istifadə qaydaları.",
        date: "2024-02-08",
        duration: "90 dəq",
    }
];

export default function LessonsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dərslər</h1>
                    <p className="text-slate-400">Keçirilmiş və gələcək dərslərin siyahısı</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessons.map((lesson) => (
                    <div key={lesson.id} className="glass rounded-xl overflow-hidden group hover:border-emerald-500/50 transition-colors">
                        {/* Thumbnail Placeholder */}
                        <div className="h-40 bg-slate-800 flex items-center justify-center relative">
                            <PlayCircle className="w-12 h-12 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 rounded text-xs text-white">
                                {lesson.duration}
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="flex items-center space-x-2 mb-2 text-xs text-slate-400">
                                <Calendar className="w-3 h-3" />
                                <span>{lesson.date}</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">{lesson.title}</h3>
                            <p className="text-sm text-slate-400 mb-4 line-clamp-2">{lesson.description}</p>

                            <Link
                                href={`/dashboard/lessons/${lesson.id}`}
                                className="inline-flex items-center justify-center w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Dərsə Bax
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
