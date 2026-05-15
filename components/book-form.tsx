"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StarRating } from "./star-rating";
import { type Book, type ReadingStatus, randomCoverColor } from "@/lib/book-store";

type BookFormData = Omit<Book, "id" | "dateAdded">;

interface BookFormProps {
  initial?: Book;
  onSave: (data: BookFormData) => void;
  onCancel: () => void;
}

const GENRES = [
  "Fiction", "Literary Fiction", "Historical Fiction", "Fantasy", "Sci-Fi",
  "Mystery", "Thriller", "Romance", "Non-Fiction", "Biography", "Self-Help",
  "Poetry", "Graphic Novel", "Other",
];

const PATTERNS = [0, 1, 2, 3] as const;

export function BookForm({ initial, onSave, onCancel }: BookFormProps) {
  const [form, setForm] = useState<BookFormData>({
    title: initial?.title ?? "",
    author: initial?.author ?? "",
    genre: initial?.genre ?? "Fiction",
    status: initial?.status ?? "to-read",
    rating: initial?.rating ?? 0,
    pages: initial?.pages ?? 0,
    pagesRead: initial?.pagesRead ?? 0,
    coverColor: initial?.coverColor ?? randomCoverColor(),
    coverPattern: initial?.coverPattern ?? 0,
    notes: initial?.notes ?? "",
    startDate: initial?.startDate ?? null,
    finishDate: initial?.finishDate ?? null,
    isbn: initial?.isbn ?? "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BookFormData, string>>>({});
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=1`);
      const data = await res.json();
      
      if (data.items && data.items.length > 0) {
        const info = data.items[0].volumeInfo;
        
        let isbn = "";
        if (info.industryIdentifiers) {
          const isbn13 = info.industryIdentifiers.find((id: any) => id.type === "ISBN_13");
          const isbn10 = info.industryIdentifiers.find((id: any) => id.type === "ISBN_10");
          isbn = isbn13 ? isbn13.identifier : (isbn10 ? isbn10.identifier : "");
        }

        let coverUrl = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || "";
        if (coverUrl) {
          coverUrl = coverUrl.replace("http:", "https:");
        }

        setForm(prev => ({
          ...prev,
          title: info.title || prev.title,
          author: info.authors ? info.authors.join(", ") : prev.author,
          pages: info.pageCount || prev.pages,
          coverUrl: coverUrl || prev.coverUrl,
          isbn: isbn || prev.isbn,
        }));
      } else {
        alert("No book found with that query.");
      }
    } catch (e) {
      console.error("Search failed", e);
      alert("Failed to search book.");
    } finally {
      setIsSearching(false);
    }
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.author.trim()) e.author = "Author is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
  }

  const set = <K extends keyof BookFormData>(key: K, value: BookFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Google Books Search (Only show if not editing an existing book) */}
      {!initial && (
        <div className="flex gap-2 items-end p-3 bg-secondary/50 rounded-lg border border-border">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="book-search">Auto-fill from Google Books</Label>
            <Input
              id="book-search"
              placeholder="Search by title, author, or ISBN"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
          </div>
          <Button type="button" variant="secondary" onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>
      )}

      {/* Title & Author */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Book title"
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="author">Author <span className="text-destructive">*</span></Label>
          <Input
            id="author"
            value={form.author}
            onChange={(e) => set("author", e.target.value)}
            placeholder="Author name"
          />
          {errors.author && <p className="text-xs text-destructive">{errors.author}</p>}
        </div>
      </div>

      {/* Genre & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Genre</Label>
          <Select value={form.genre} onValueChange={(v) => set("genre", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GENRES.map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Reading Status</Label>
          <Select value={form.status} onValueChange={(v) => set("status", v as ReadingStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="to-read">Want to Read</SelectItem>
              <SelectItem value="reading">Reading</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="dnf">Did Not Finish</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-1.5">
        <Label>Rating</Label>
        <div className="flex items-center gap-2">
          <StarRating
            rating={form.rating}
            size="lg"
            interactive
            onRate={(r) => set("rating", form.rating === r ? 0 : r)}
          />
          {form.rating > 0 && (
            <button
              type="button"
              onClick={() => set("rating", 0)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Pages */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="pages">Total Pages</Label>
          <Input
            id="pages"
            type="number"
            min={0}
            value={form.pages || ""}
            onChange={(e) => set("pages", Number(e.target.value))}
            placeholder="0"
          />
        </div>
        {form.status === "reading" && (
          <div className="space-y-1.5">
            <Label htmlFor="pagesRead">Pages Read</Label>
            <Input
              id="pagesRead"
              type="number"
              min={0}
              max={form.pages}
              value={form.pagesRead || ""}
              onChange={(e) => set("pagesRead", Number(e.target.value))}
              placeholder="0"
            />
          </div>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="startDate">Date Started</Label>
          <Input
            id="startDate"
            type="date"
            value={form.startDate ?? ""}
            onChange={(e) => set("startDate", e.target.value || null)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="finishDate">Date Finished</Label>
          <Input
            id="finishDate"
            type="date"
            value={form.finishDate ?? ""}
            onChange={(e) => set("finishDate", e.target.value || null)}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Your thoughts, quotes, or impressions..."
          rows={3}
        />
      </div>

      {/* Cover color */}
      <div className="space-y-1.5">
        <Label>Cover Color</Label>
        <div className="flex flex-wrap gap-2">
          {[
            "#1C3A5E", "#5C3D2E", "#4B0082", "#8B0000", "#1B4332",
            "#B8860B", "#2F4F4F", "#7B3F00", "#556B2F", "#8B008B",
          ].map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => set("coverColor", color)}
              className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none"
              style={{
                backgroundColor: color,
                borderColor: form.coverColor === color ? "var(--color-primary)" : "transparent",
              }}
              aria-label={`Select color ${color}`}
            />
          ))}
          <button
            type="button"
            onClick={() => set("coverColor", randomCoverColor())}
            className="w-7 h-7 rounded-full border-2 border-dashed border-border text-muted-foreground text-xs hover:border-primary transition-colors focus:outline-none"
            aria-label="Random color"
          >
            ?
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initial ? "Save Changes" : "Add Book"}
        </Button>
      </div>
    </form>
  );
}
