"use client";

import { useState } from "react";
import { Pencil, Trash2, X, BookOpen, Calendar, FileText, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BookCover } from "./book-cover";
import { StarRating } from "./star-rating";
import { StatusBadge } from "./status-badge";
import { BookForm } from "./book-form";
import { type Book } from "@/lib/book-store";
import { useBookStore } from "@/lib/book-store";

interface BookDetailProps {
  book: Book | null;
  open: boolean;
  onClose: () => void;
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function BookDetail({ book, open, onClose }: BookDetailProps) {
  const { updateBook, deleteBook } = useBookStore();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!book) return null;

  function handleSave(data: Omit<Book, "id" | "dateAdded">) {
    if (!book) return;
    updateBook(book.id, data);
    setEditing(false);
  }

  function handleDelete() {
    if (!book) return;
    deleteBook(book.id);
    setConfirmDelete(false);
    onClose();
  }

  const progress = book.pages > 0 ? Math.min(100, Math.round((book.pagesRead / book.pages) * 100)) : 0;

  return (
    <>
      <Dialog open={open && !editing} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-2">
              <DialogTitle className="text-left leading-tight pr-4">{book.title}</DialogTitle>
            </div>
          </DialogHeader>

          <div className="flex gap-5 mt-1">
            {/* Cover */}
            <div className="flex-shrink-0">
              <BookCover
                title={book.title}
                author={book.author}
                coverColor={book.coverColor}
                coverPattern={book.coverPattern}
                coverUrl={book.coverUrl}
                size="lg"
              />
            </div>

            {/* Meta */}
            <div className="flex-1 min-w-0 flex flex-col gap-2.5">
              <div>
                <p className="text-base font-medium text-foreground">{book.author}</p>
                <p className="text-sm text-muted-foreground">{book.genre}</p>
              </div>

              <StatusBadge status={book.status} />

              {book.rating > 0 && (
                <StarRating rating={book.rating} size="md" />
              )}

              {book.status === "reading" && book.pages > 0 && (
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{book.pagesRead} / {book.pages} pages</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {book.pages > 0 && (
              <InfoRow
                icon={<BookOpen className="w-4 h-4" />}
                label="Pages"
                value={String(book.pages)}
              />
            )}
            {book.startDate && (
              <InfoRow
                icon={<Calendar className="w-4 h-4" />}
                label="Started"
                value={new Date(book.startDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              />
            )}
            {book.finishDate && (
              <InfoRow
                icon={<Calendar className="w-4 h-4" />}
                label="Finished"
                value={new Date(book.finishDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              />
            )}
            <InfoRow
              icon={<Tag className="w-4 h-4" />}
              label="Added"
              value={new Date(book.dateAdded).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            />
          </div>

          {/* Notes */}
          {book.notes && (
            <div className="mt-2 p-4 bg-secondary/40 rounded-xl">
              <div className="flex items-center gap-1.5 mb-2">
                <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Notes</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{book.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border mt-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setConfirmDelete(true)}
              className="gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(true)}
              className="gap-1.5"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={editing} onOpenChange={(o) => !o && setEditing(false)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
          </DialogHeader>
          <BookForm
            initial={book}
            onSave={handleSave}
            onCancel={() => setEditing(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this book?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{book.title}&rdquo; will be permanently removed from your library. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
