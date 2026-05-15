import { cn } from "@/lib/utils";
import type { ReadingStatus } from "@/lib/book-store";

interface StatusBadgeProps {
  status: ReadingStatus;
  className?: string;
}

const STATUS_CONFIG: Record<ReadingStatus, { label: string; className: string }> = {
  reading: {
    label: "Reading",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  read: {
    label: "Read",
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  "to-read": {
    label: "Want to Read",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  dnf: {
    label: "Did Not Finish",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
