"use client";

import { motion } from "framer-motion";
import { BookOpen, CheckCircle, Clock, TrendingUp, Award } from "lucide-react";

interface ProgressDashboardProps {
    stats: {
        completedLessons: number;
        totalLessons: number;
        attendanceRate: number;
        pendingAssignments: number;
        averageGrade?: number;
    };
}

export function ProgressDashboard({ stats }: ProgressDashboardProps) {
    const progressPercentage = stats.totalLessons > 0
        ? Math.round((stats.completedLessons / stats.totalLessons) * 100)
        : 0;

    const cards = [
        {
            title: "Tamamlanmış Dərslər",
            value: `${stats.completedLessons}/${stats.totalLessons}`,
            icon: BookOpen,
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-500/20",
        },
        {
            title: "Davamiyyət",
            value: `${stats.attendanceRate}%`,
            icon: CheckCircle,
            color: "from-emerald-500 to-green-500",
            bgColor: "bg-emerald-500/10",
            borderColor: "border-emerald-500/20",
        },
        {
            title: "Gözləyən Tapşırıqlar",
            value: stats.pendingAssignments,
            icon: Clock,
            color: "from-amber-500 to-orange-500",
            bgColor: "bg-amber-500/10",
            borderColor: "border-amber-500/20",
        },
        ...(stats.averageGrade ? [{
            title: "Orta Qiymət",
            value: stats.averageGrade,
            icon: Award,
            color: "from-purple-500 to-pink-500",
            bgColor: "bg-purple-500/10",
            borderColor: "border-purple-500/20",
        }] : []),
    ];

    return (
        <div className="space-y-6">
            {/* Overall Progress */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-6 rounded-xl border border-white/5"
            >
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-white">Ümumi Tərəqqi</h3>
                        <p className="text-sm text-slate-400">Kurs proqramının tamamlanması</p>
                    </div>
                    <div className="text-3xl font-bold text-emerald-400">{progressPercentage}%</div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
                    />
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`glass p-5 rounded-xl border ${card.borderColor} hover:border-opacity-40 transition-all group`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                                    <Icon className={`w-6 h-6 bg-gradient-to-br ${card.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
                                </div>
                                <TrendingUp className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white mb-1">{card.value}</p>
                                <p className="text-sm text-slate-400">{card.title}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
