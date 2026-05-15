"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { BookCard } from "@/components/book-card";
import { BookDetail } from "@/components/book-detail";
import { EmptyState } from "@/components/empty-state";
import { useBookStore, type Book } from "@/lib/book-store";

export default function CurrentlyReadingPage() {
  const { books } = useBookStore();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const readingBooks = books.filter((b) => b.status === "reading");

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8 pt-6 md:pt-0">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Currently Reading</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {readingBooks.length > 0
            ? `You are reading ${readingBooks.length} book${readingBooks.length !== 1 ? "s" : ""} right now`
            : "No books in progress"}
        </p>
      </div>

      {readingBooks.length === 0 ? (
        <EmptyState
          title="Nothing in progress"
          description="Start a new book and mark it as Reading to track your progress here."
        />
      ) : (
        <div className="space-y-3">
          {readingBooks.map((book) => (
            <div key={book.id} className="group">
              <BookCard book={book} view="list" onClick={setSelectedBook} />
            </div>
          ))}
        </div>
      )}

      <BookDetail
        book={selectedBook}
        open={selectedBook !== null}
        onClose={() => setSelectedBook(null)}
      />
    </div>
  );
}
