"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRate?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  max = 5,
  size = "md",
  interactive = false,
  onRate,
  className,
}: StarRatingProps) {
  const sizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: max }).map((_, i) =>
        interactive ? (
          <button
            key={i}
            type="button"
            onClick={() => onRate?.(i + 1)}
            className="cursor-pointer transition-transform hover:scale-110 focus:outline-none"
            aria-label={`Rate ${i + 1} star${i !== 0 ? "s" : ""}`}
          >
            <Star
              className={cn(
                sizes[size],
                i < rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-muted-foreground/40"
              )}
            />
          </button>
        ) : (
          <span key={i} className="cursor-default">
            <Star
              className={cn(
                sizes[size],
                i < rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-muted-foreground/40"
              )}
            />
          </span>
        )
      )}
    </div>
  );
}
