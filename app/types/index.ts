export type UserRole = 'student' | 'teacher' | 'admin';
export type AssignmentStatus = 'new' | 'submitted' | 'changes_requested' | 'approved';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface Profile {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    avatar_url?: string;
}

export interface Course {
    id: string;
    title: string;
    description: string;
}

export interface Cohort {
    id: string;
    name: string;
    course_id: string;
    start_date?: string;
}

export interface Lesson {
    id: string;
    cohort_id: string;
    title: string;
    video_url?: string;
    date: string;
}

export interface Assignment {
    id: string;
    lesson_id: string;
    title: string;
    description: string;
    due_date: string;
}

export interface Submission {
    id: string;
    assignment_id: string;
    student_id: string;
    content: string;
    status: AssignmentStatus;
    grade?: number;
    feedback?: string;
}

export interface AttendanceRecord {
    id: string;
    lesson_id: string;
    student_id: string;
    status: AttendanceStatus;
    late_minutes: number;
    note?: string;
    created_at: string;
}
