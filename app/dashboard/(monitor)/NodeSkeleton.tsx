import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const NodeSkeleton = () => {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-6 w-full rounded-lg" />
      <Skeleton className="h-6 w-full rounded-lg" />
      <Skeleton className="h-6 w-full rounded-lg" />
      <Skeleton className="h-6 w-full rounded-lg" />
      <Skeleton className="h-40 w-full rounded-lg" />
    </div>
  );
};

export default NodeSkeleton;
