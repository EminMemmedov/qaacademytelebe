import { Users, AlertCircle, Check, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const attendance = [
    { id: 1, date: "2024-02-01", topic: "Giriş: QA nədir?", status: "present", late_min: 0 },
    { id: 2, date: "2024-02-03", topic: "SDLC Modeli", status: "present", late_min: 5 },
    { id: 3, date: "2024-02-05", topic: "Test Planlama", status: "absent", late_min: 0 },
    { id: 4, date: "2024-02-08", topic: "Jira Workshop", status: "excused", late_min: 0 },
];

const stats = {
    present: 80,
    absent: 10,
    late: 5,
    excused: 5,
};

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    present: { label: "Gəldi", color: "text-emerald-400", icon: Check },
    absent: { label: "Gəlmədi", color: "text-red-400", icon: X },
    late: { label: "Gecikdi", color: "text-amber-400", icon: Clock },
    excused: { label: "Üzrlü", color: "text-blue-400", icon: AlertCircle },
};

export default function AttendancePage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">İştirak Cədvəli</h1>
                <p className="text-slate-400">Dərslərdə davamiyyət göstəriciləri</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass p-4 rounded-xl flex flex-col items-center justify-center border-emerald-500/20">
                    <span className="text-2xl font-bold text-emerald-400">{stats.present}%</span>
                    <span className="text-xs text-slate-400 uppercase tracking-widest mt-1">İştirak</span>
                </div>
                <div className="glass p-4 rounded-xl flex flex-col items-center justify-center border-red-500/20">
                    <span className="text-2xl font-bold text-red-400">{stats.absent}%</span>
                    <span className="text-xs text-slate-400 uppercase tracking-widest mt-1">Qayıb</span>
                </div>
                <div className="glass p-4 rounded-xl flex flex-col items-center justify-center border-amber-500/20">
                    <span className="text-2xl font-bold text-amber-400">{stats.late}%</span>
                    <span className="text-xs text-slate-400 uppercase tracking-widest mt-1">Gecikmə</span>
                </div>
                <div className="glass p-4 rounded-xl flex flex-col items-center justify-center border-blue-500/20">
                    <span className="text-2xl font-bold text-blue-400">{stats.excused}%</span>
                    <span className="text-xs text-slate-400 uppercase tracking-widest mt-1">Üzrlü</span>
                </div>
            </div>

            <div className="glass rounded-xl overflow-hidden border border-slate-800">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-900/50 text-slate-200 font-medium uppercase text-xs">
                        <tr>
                            <th className="p-4">Tarix</th>
                            <th className="p-4">Mövzu</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Qeyd</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {attendance.map((item) => {
                            const conf = statusConfig[item.status];
                            const Icon = conf.icon;
                            return (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-mono text-slate-300">{item.date}</td>
                                    <td className="p-4 font-medium text-white">{item.topic}</td>
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            <Icon className={cn("w-4 h-4 mr-2", conf.color)} />
                                            <span className={conf.color}>{conf.label}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-500">
                                        {item.late_min > 0 && <span className="text-amber-500 text-xs">+{item.late_min} dəq</span>}
                                        {item.status === 'absent' && "-"}
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
