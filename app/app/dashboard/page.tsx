import { Card } from "@/components/ui/card"; // Accessing potential UI component (I will mock it inline if needed or create it)
import { BookOpen, CheckCircle, Clock, AlertCircle } from "lucide-react";

// Mock Data
const stats = [
    { name: "Tapşırıqlar Gözləyir", value: "3", icon: Clock, color: "text-amber-400" },
    { name: "İştirak Faizi", value: "92%", icon: CheckCircle, color: "text-emerald-400" },
    { name: "Tamamlanmış Dərslər", value: "12/24", icon: BookOpen, color: "text-blue-400" },
];

const upcomingDeadlines = [
    { id: 1, title: "API Testləşdirmə Giriş", due: "Sabah, 23:59", status: "Gözləyir" },
    { id: 2, title: "SQL Sorğular - Mürəkkəb", due: "2 gün sonra", status: "Gözləyir" },
];

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Xoş gəldiniz, Tələbə! 👋</h1>
                <p className="text-slate-400 mt-2">Bu gün öyrənmək üçün əla gündür.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((item) => (
                    <div key={item.name} className="glass rounded-xl p-6 shadow-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                                <item.icon className={`h-8 w-8 ${item.color}`} />
                            </div>
                            <div className="ml-5">
                                <p className="text-sm font-medium text-slate-400 truncate">{item.name}</p>
                                <p className="text-3xl font-bold text-white mt-1">{item.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Assignments */}
                <div className="glass rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-amber-400" />
                        Yaxınlaşan Tapşırıqlar
                    </h2>
                    <div className="space-y-4">
                        {upcomingDeadlines.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                <div>
                                    <h3 className="text-white font-medium">{item.title}</h3>
                                    <p className="text-sm text-slate-400 mt-1">Son tarix: <span className="text-amber-300">{item.due}</span></p>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Materials */}
                <div className="glass rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
                        Yeni Materiallar
                    </h2>
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                            <h3 className="text-white font-medium">Postman ilə API Testləri.pdf</h3>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-sm text-slate-400">Dərs 14 • 2 MB</p>
                                <button className="text-xs text-blue-300 hover:text-blue-200 underline">Yüklə</button>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                            <h3 className="text-white font-medium">JMeter Performance Testing.pptx</h3>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-sm text-slate-400">Dərs 15 • 5 MB</p>
                                <button className="text-xs text-blue-300 hover:text-blue-200 underline">Yüklə</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
