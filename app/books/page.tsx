"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookCard } from "@/components/book-card";
import { BookDetail } from "@/components/book-detail";
import { BookForm } from "@/components/book-form";
import { FilterBar, type SortOption } from "@/components/filter-bar";
import { EmptyState } from "@/components/empty-state";
import { useBookStore, type Book, type ReadingStatus } from "@/lib/book-store";

export default function BooksPage() {
  const { books, addBook } = useBookStore();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReadingStatus | "all">("all");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>("dateAdded");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((b) => b.status === statusFilter);
    }

    if (ratingFilter > 0) {
      result = result.filter((b) => b.rating >= ratingFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.localeCompare(b.author);
        case "rating":
          return b.rating - a.rating;
        case "finishDate":
          return (b.finishDate ?? "").localeCompare(a.finishDate ?? "");
        case "dateAdded":
        default:
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
    });

    return result;
  }, [books, search, statusFilter, ratingFilter, sortBy]);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-6 md:pt-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Books</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {books.length} book{books.length !== 1 ? "s" : ""} in your library
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="gap-2 flex-shrink-0">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Book</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          ratingFilter={ratingFilter}
          onRatingChange={setRatingFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          view={view}
          onViewChange={setView}
        />
      </div>

      {/* Results */}
      {filteredBooks.length === 0 ? (
        books.length === 0 ? (
          <EmptyState onAddBook={() => setAddOpen(true)} />
        ) : (
          <EmptyState
            title="No books match your filters"
            description="Try adjusting your search or filters to find what you're looking for."
          />
        )
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} view="grid" onClick={setSelectedBook} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} view="list" onClick={setSelectedBook} />
          ))}
        </div>
      )}

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add a Book</DialogTitle>
          </DialogHeader>
          <BookForm
            onSave={(data) => {
              addBook(data);
              setAddOpen(false);
            }}
            onCancel={() => setAddOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Detail */}
      <BookDetail
        book={selectedBook}
        open={selectedBook !== null}
        onClose={() => setSelectedBook(null)}
      />
    </div>
  );
}
