"use client";

import { Check, X, User } from "lucide-react";
import { useState, useOptimistic, startTransition } from "react";
import { markAttendanceAction } from "../actions";

interface Student {
    id: string;
    full_name: string;
}

interface Record {
    student_id: string;
    status: string;
}

interface Props {
    students: Student[];
    initialAttendance: Record[];
    lessonId: string;
    cohortId: string;
}

export function AttendanceTracker({ students, initialAttendance, lessonId, cohortId }: Props) {
    // Optimistic State
    const [optimisticAttendance, setOptimisticAttendance] = useOptimistic(
        initialAttendance,
        (state, newRecord: Record) => {
            // Remove existing record for this student if any
            const filtered = state.filter(r => r.student_id !== newRecord.student_id);
            // Add new one
            return [...filtered, newRecord];
        }
    );

    async function handleMark(studentId: string, status: string) {
        // 1. Optimistic Update
        startTransition(() => {
            setOptimisticAttendance({ student_id: studentId, status });
        });

        // 2. Server Action
        const result = await markAttendanceAction(lessonId, studentId, status, cohortId);
        if (!result.success) {
            console.error(result.message);
            // Ideally rollback, but revalidatePath usually handles sync
            alert("Xəta baş verdi: " + result.message);
        }
    }

    // Stats
    const presentCount = optimisticAttendance.filter(r => r.status === 'present').length;
    const absentCount = optimisticAttendance.filter(r => r.status === 'absent').length;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-400">Ümumi: <b className="text-white">{students.length}</b></span>
                </div>
                <div className="flex space-x-4 text-sm">
                    <span className="text-emerald-400">İştirak: <b>{presentCount}</b></span>
                    <span className="text-red-400">Qayib: <b>{absentCount}</b></span>
                </div>
            </div>

            <div className="overflow-hidden bg-slate-900/40 rounded-xl border border-white/5">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 text-xs text-slate-400 uppercase">
                        <tr>
                            <th className="p-4 font-medium">Tələbə</th>
                            <th className="p-4 font-medium text-center w-32">Status</th>
                            <th className="p-4 font-medium text-right">Qeyd</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {students.map(student => {
                            const record = optimisticAttendance.find(r => r.student_id === student.id);
                            const status = record?.status;

                            return (
                                <tr key={student.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mr-3 border border-slate-700">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{student.full_name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center bg-slate-950/50 rounded-lg p-1 border border-slate-800 w-fit mx-auto">
                                            <button
                                                onClick={() => handleMark(student.id, 'present')}
                                                className={`p-1.5 rounded-md transition-all ${status === 'present' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/50' : 'text-slate-500 hover:text-emerald-400 hover:bg-white/5'}`}
                                                title="İştirak edir"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <div className="w-px bg-slate-800 mx-1"></div>
                                            <button
                                                onClick={() => handleMark(student.id, 'absent')}
                                                className={`p-1.5 rounded-md transition-all ${status === 'absent' ? 'bg-red-500 text-white shadow-lg shadow-red-900/50' : 'text-slate-500 hover:text-red-400 hover:bg-white/5'}`}
                                                title="Qayib"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${status === 'present' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                status === 'absent' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                    'bg-slate-800 text-slate-500'
                                            }`}>
                                            {status === 'present' ? 'Var' : status === 'absent' ? 'Yoxdur' : 'Qeyd olunmayıb'}
                                        </span>
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
