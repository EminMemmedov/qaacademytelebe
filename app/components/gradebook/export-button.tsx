"use client";

import { Download } from "lucide-react";
import * as XLSX from 'xlsx';
import toast from "react-hot-toast";

interface ExportGradebookProps {
    cohortName: string;
    data: Array<{
        studentName: string;
        attendance: number;
        assignments: number;
        averageGrade?: number;
    }>;
}

export function ExportGradebookButton({ cohortName, data }: ExportGradebookProps) {
    const handleExport = () => {
        try {
            // Prepare data for Excel
            const excelData = data.map((student, index) => ({
                '№': index + 1,
                'Tələbənin Adı': student.studentName,
                'Davamiyyət (%)': student.attendance,
                'Tapşırıqlar': student.assignments,
                'Orta Qiymət': student.averageGrade || '-',
            }));

            // Create worksheet
            const ws = XLSX.utils.json_to_sheet(excelData);

            // Set column widths
            ws['!cols'] = [
                { wch: 5 },  // №
                { wch: 25 }, // Name
                { wch: 15 }, // Attendance
                { wch: 12 }, // Assignments
                { wch: 12 }, // Average
            ];

            // Create workbook
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Jurnal');

            // Generate filename with date
            const date = new Date().toISOString().split('T')[0];
            const filename = `${cohortName}_Jurnal_${date}.xlsx`;

            // Download
            XLSX.writeFile(wb, filename);

            toast.success('Jurnal uğurla yükləndi! 📊');
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Xəta baş verdi');
        }
    };

    return (
        <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-emerald-900/20"
        >
            <Download className="w-4 h-4 mr-2" />
            Excel Yüklə
        </button>
    );
}
