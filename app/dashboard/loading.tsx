import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto mt-6 flex flex-col gap-5">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-48" />
        </div>
      </div>

      <Skeleton className="h-96 w-full rounded-lg" />

      <Skeleton className="h-6 w-full rounded-lg" />
      <Skeleton className="h-6 w-full rounded-lg" />

      <div className="flex flex-row gap-5 justify-between">
        <Skeleton className="h-20 w-1/6 rounded-lg" />
        <Skeleton className="h-20 w-1/6 rounded-lg" />
        <Skeleton className="h-20 w-1/6 rounded-lg" />
        <Skeleton className="h-20 w-1/6 rounded-lg" />
        <Skeleton className="h-20 w-1/6 rounded-lg" />
      </div>
    </div>
  );
}
