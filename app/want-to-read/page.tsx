"use client";

import { useState } from "react";
import { BookMarked, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookCard } from "@/components/book-card";
import { BookDetail } from "@/components/book-detail";
import { BookForm } from "@/components/book-form";
import { EmptyState } from "@/components/empty-state";
import { useBookStore, type Book } from "@/lib/book-store";

export default function WantToReadPage() {
  const { books, addBook } = useBookStore();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const wantToRead = books.filter((b) => b.status === "to-read");

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8 pt-6 md:pt-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookMarked className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Want to Read</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {wantToRead.length > 0
              ? `${wantToRead.length} book${wantToRead.length !== 1 ? "s" : ""} on your reading list`
              : "Your reading wishlist"}
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="gap-2 flex-shrink-0">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Book</span>
        </Button>
      </div>

      {wantToRead.length === 0 ? (
        <EmptyState
          title="Your reading list is empty"
          description="Add books you want to read next and track them all in one place."
          onAddBook={() => setAddOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {wantToRead.map((book) => (
            <BookCard key={book.id} book={book} view="grid" onClick={setSelectedBook} />
          ))}
        </div>
      )}

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add to Reading List</DialogTitle>
          </DialogHeader>
          <BookForm
            onSave={(data) => {
              addBook({ ...data, status: "to-read" });
              setAddOpen(false);
            }}
            onCancel={() => setAddOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <BookDetail
        book={selectedBook}
        open={selectedBook !== null}
        onClose={() => setSelectedBook(null)}
      />
    </div>
  );
}
