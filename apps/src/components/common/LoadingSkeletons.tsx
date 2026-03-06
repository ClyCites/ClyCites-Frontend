import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeletons() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-24 w-full rounded-[var(--radius-xl)]" />
      <Skeleton className="h-14 w-full rounded-[var(--radius-xl)]" />
      <Skeleton className="h-72 w-full rounded-[var(--radius-xl)]" />
      <div className="grid gap-3 md:grid-cols-3">
        <Skeleton className="h-24 w-full rounded-[var(--radius-xl)]" />
        <Skeleton className="h-24 w-full rounded-[var(--radius-xl)]" />
        <Skeleton className="h-24 w-full rounded-[var(--radius-xl)]" />
      </div>
    </div>
  );
}
