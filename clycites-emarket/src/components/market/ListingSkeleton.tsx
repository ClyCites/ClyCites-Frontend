import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function ListingSkeletonCard() {
  return (
    <Card className="overflow-hidden flex flex-col">
      <Skeleton className="aspect-4/3 w-full rounded-none" />
      <CardContent className="p-4 space-y-3 flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </CardContent>
      <CardFooter className="p-4 pt-0 gap-2">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 flex-1" />
      </CardFooter>
    </Card>
  );
}

interface ListingSkeletonProps {
  count?: number;
  className?: string;
}

export function ListingSkeleton({ count = 8, className }: ListingSkeletonProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ListingSkeletonCard key={i} />
      ))}
    </div>
  );
}
