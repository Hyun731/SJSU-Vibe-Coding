import { BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onAddBook?: () => void;
}

export function EmptyState({
  title = "No books yet",
  description = "Start building your personal reading history.",
  onAddBook,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
        <BookOpen className="w-9 h-9 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground max-w-xs leading-relaxed">
        {description}
      </p>
      {onAddBook && (
        <Button onClick={onAddBook} className="mt-6 gap-2">
          <Plus className="w-4 h-4" />
          Add Book
        </Button>
      )}
    </div>
  );
}
