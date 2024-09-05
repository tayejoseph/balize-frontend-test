"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonLoaderProps {
  rows: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ rows }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, idx) => (
        <Skeleton key={idx} className="h-8 w-full" />
      ))}
    </div>
  );
};

export default SkeletonLoader;
