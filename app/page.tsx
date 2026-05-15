"use client";

import { useState } from "react";
import { Plus, BookOpen, Star, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookCard } from "@/components/book-card";
import { BookDetail } from "@/components/book-detail";
import { BookForm } from "@/components/book-form";
import { EmptyState } from "@/components/empty-state";
import { useBookStore, type Book } from "@/lib/book-store";

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold text-foreground leading-tight">{value}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { books, addBook } = useBookStore();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  // Stats
  const totalBooks = books.length;
  const readBooks = books.filter((b) => b.status === "read");
  const readingBooks = books.filter((b) => b.status === "reading");
  const totalPages = books.reduce((sum, b) => sum + (b.status === "read" ? b.pages : b.pagesRead), 0);
  const ratedBooks = books.filter((b) => b.rating > 0);
  const avgRating = ratedBooks.length
    ? (ratedBooks.reduce((sum, b) => sum + b.rating, 0) / ratedBooks.length).toFixed(1)
    : "—";
  const recentBooks = [...books]
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 6);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pt-6 md:pt-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground text-balance">My Reading Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Welcome back to your library</p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="gap-2 flex-shrink-0">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Book</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard icon={<BookOpen className="w-5 h-5" />} label="Total Books" value={totalBooks} />
        <StatCard icon={<CheckCircle className="w-5 h-5" />} label="Books Read" value={readBooks.length} />
        <StatCard icon={<Clock className="w-5 h-5" />} label="Pages Read" value={totalPages.toLocaleString()} />
        <StatCard icon={<Star className="w-5 h-5" />} label="Avg Rating" value={avgRating} sub={ratedBooks.length > 0 ? `from ${ratedBooks.length} rated` : undefined} />
      </div>

      {/* Currently Reading */}
      {readingBooks.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            Currently Reading
          </h2>
          <div className="grid grid-cols-1 gap-2.5">
            {readingBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                view="list"
                onClick={setSelectedBook}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recently Added */}
      <section>
        <h2 className="text-base font-semibold text-foreground mb-3">Recently Added</h2>
        {recentBooks.length === 0 ? (
          <EmptyState onAddBook={() => setAddOpen(true)} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {recentBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                view="grid"
                onClick={setSelectedBook}
              />
            ))}
          </div>
        )}
      </section>

      {/* Add book dialog */}
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

      {/* Book detail */}
      <BookDetail
        book={selectedBook}
        open={selectedBook !== null}
        onClose={() => setSelectedBook(null)}
      />
    </div>
  );
}
