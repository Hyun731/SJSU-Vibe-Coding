"use client";

import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Book } from "@/lib/book-store";
import { BookCover } from "./book-cover";
import { StarRating } from "./star-rating";
import { StatusBadge } from "./status-badge";

interface BookCardProps {
  book: Book;
  view?: "grid" | "list";
  onClick?: (book: Book) => void;
}

export function BookCard({ book, view = "grid", onClick }: BookCardProps) {
  if (view === "list") {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onClick?.(book)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.(book)}
        className="w-full text-left group flex items-center gap-4 p-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
      >
        <BookCover
          title={book.title}
          author={book.author}
          coverColor={book.coverColor}
          coverPattern={book.coverPattern}
          coverUrl={book.coverUrl}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground text-sm leading-tight truncate group-hover:text-primary transition-colors">
                {book.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">{book.author}</p>
            </div>
            <StatusBadge status={book.status} className="flex-shrink-0" />
          </div>

          <div className="flex items-center gap-3 mt-2">
            {book.rating > 0 && <StarRating rating={book.rating} size="sm" />}
            {book.genre && (
              <span className="text-xs text-muted-foreground">{book.genre}</span>
            )}
            {book.finishDate && (
              <span className="text-xs text-muted-foreground ml-auto">
                {new Date(book.finishDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </span>
            )}
          </div>

          {book.notes && (
            <p className="mt-1.5 text-xs text-muted-foreground line-clamp-1 italic">
              &ldquo;{book.notes}&rdquo;
            </p>
          )}

          {book.status === "reading" && book.pages > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${Math.min(100, (book.pagesRead / book.pages) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground flex-shrink-0">
                {book.pagesRead} / {book.pages} pages
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(book)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.(book)}
      className="text-left group flex flex-col rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all overflow-hidden cursor-pointer"
    >
      <div className="flex justify-center items-center p-4 bg-secondary/40">
        <BookCover
          title={book.title}
          author={book.author}
          coverColor={book.coverColor}
          coverPattern={book.coverPattern}
          coverUrl={book.coverUrl}
          size="md"
        />
      </div>

      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <div>
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">{book.author}</p>
        </div>

        <StatusBadge status={book.status} />

        {book.rating > 0 && <StarRating rating={book.rating} size="sm" />}

        {book.notes && (
          <p className="text-xs text-muted-foreground line-clamp-2 italic">
            &ldquo;{book.notes}&rdquo;
          </p>
        )}

        {book.status === "reading" && book.pages > 0 && (
          <div className="mt-auto pt-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {Math.round((book.pagesRead / book.pages) * 100)}%
              </span>
              <span className="text-[10px] text-muted-foreground">
                {book.pagesRead}/{book.pages}
              </span>
            </div>
            <div className="h-1 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${Math.min(100, (book.pagesRead / book.pages) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
