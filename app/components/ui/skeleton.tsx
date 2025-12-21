import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-white/5",
                className
            )}
        />
    );
}

// Preset skeletons for common use cases
export function CardSkeleton() {
    return (
        <div className="glass p-6 rounded-xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </div>
    );
}

export function TableRowSkeleton() {
    return (
        <tr className="border-b border-slate-800">
            <td className="p-4"><Skeleton className="h-4 w-full" /></td>
            <td className="p-4"><Skeleton className="h-4 w-24" /></td>
            <td className="p-4"><Skeleton className="h-4 w-20" /></td>
            <td className="p-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
            <td className="p-4"><Skeleton className="h-4 w-12" /></td>
            <td className="p-4"><Skeleton className="h-4 w-16" /></td>
        </tr>
    );
}

export function ListItemSkeleton() {
    return (
        <div className="flex items-center space-x-4 p-4 glass rounded-lg border border-white/5">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
    );
}
