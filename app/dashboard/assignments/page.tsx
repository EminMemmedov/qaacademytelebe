import { FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const assignments = [
    { id: 1, title: "Funksional Testlər", lesson: "Lesson 3", due: "2024-02-15", status: "submitted", grade: null },
    { id: 2, title: "SQL Basic Queries", lesson: "Lesson 5", due: "2024-02-20", status: "new", grade: null },
    { id: 3, title: "JMeter Load Test", lesson: "Lesson 8", due: "2024-02-10", status: "approved", grade: 95 },
    { id: 4, title: "Selenium Setup", lesson: "Lesson 9", due: "2024-02-12", status: "changes_requested", grade: null },
];

const statusMap: Record<string, { label: string; color: string; icon: any }> = {
    new: { label: "Yeni", color: "text-blue-400 bg-blue-500/10 border-blue-500/20", icon: Clock },
    submitted: { label: "Göndərildi", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", icon: FileText },
    approved: { label: "Qəbul edildi", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle },
    changes_requested: { label: "Düzəliş lazımdır", color: "text-red-400 bg-red-500/10 border-red-500/20", icon: AlertTriangle },
};

export default function AssignmentsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Tapşırıqlarım</h1>
                <p className="text-slate-400">Bütün ev tapşırıqlarının statusu</p>
            </div>

            <div className="glass rounded-xl overflow-hidden border border-slate-800">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-900/50 text-slate-200 font-medium uppercase text-xs">
                        <tr>
                            <th className="p-4">Tapşırıq</th>
                            <th className="p-4">Dərs</th>
                            <th className="p-4">Son Tarix</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Qiymət</th>
                            <th className="p-4 text-right">Əməliyyat</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {assignments.map((item) => {
                            const status = statusMap[item.status];
                            const StatusIcon = status.icon;
                            return (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium text-white">{item.title}</td>
                                    <td className="p-4">{item.lesson}</td>
                                    <td className="p-4">{item.due}</td>
                                    <td className="p-4">
                                        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", status.color)}>
                                            <StatusIcon className="w-3 h-3 mr-1" />
                                            {status.label}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold text-white">
                                        {item.grade ? `${item.grade}/100` : "-"}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-emerald-400 hover:text-emerald-300 font-medium text-xs">
                                            {item.status === 'new' ? 'Yüklə' : 'Bax'}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
