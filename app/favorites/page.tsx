"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { BookCard } from "@/components/book-card";
import { BookDetail } from "@/components/book-detail";
import { EmptyState } from "@/components/empty-state";
import { useBookStore, type Book } from "@/lib/book-store";

export default function FavoritesPage() {
  const { books } = useBookStore();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const favoriteBooks = books.filter((b) => b.rating === 5);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8 pt-6 md:pt-0">
        <div className="flex items-center gap-2 mb-1">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          <h1 className="text-2xl font-bold text-foreground">Favorites</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {favoriteBooks.length > 0
            ? `${favoriteBooks.length} five-star book${favoriteBooks.length !== 1 ? "s" : ""}`
            : "Your top-rated books will appear here"}
        </p>
      </div>

      {favoriteBooks.length === 0 ? (
        <EmptyState
          title="No favorites yet"
          description="Rate a book 5 stars and it will appear here in your favorites collection."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {favoriteBooks.map((book) => (
            <BookCard key={book.id} book={book} view="grid" onClick={setSelectedBook} />
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
