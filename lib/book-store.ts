"use client";

import { create } from "zustand";
import { createClient } from "@/utils/supabase/client";

export type ReadingStatus = "reading" | "read" | "to-read" | "dnf";

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  status: ReadingStatus;
  rating: number; // 0-5
  pages: number;
  pagesRead: number;
  coverColor: string;
  coverPattern: number;
  coverUrl?: string; // For API integration
  notes: string;
  startDate: string | null;
  finishDate: string | null;
  dateAdded: string;
  isbn?: string;
}

interface BookStore {
  books: Book[];
  isLoading: boolean;
  fetchBooks: () => Promise<void>;
  addBook: (book: Omit<Book, "id" | "dateAdded">) => Promise<void>;
  updateBook: (id: string, updates: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  getBook: (id: string) => Book | undefined;
}

const COVER_COLORS = [
  "#8B4513", "#2F4F4F", "#483D8B", "#8B0000", "#006400",
  "#4B0082", "#B8860B", "#556B2F", "#8B008B", "#1C3A5E",
  "#5C3D2E", "#1B4332", "#6B2D5E", "#7B3F00", "#1A3A4A",
];

export function randomCoverColor(): string {
  return COVER_COLORS[Math.floor(Math.random() * COVER_COLORS.length)];
}

function mapDbToBook(db: any): Book {
  return {
    id: db.id,
    title: db.title,
    author: db.author,
    genre: db.genre || "",
    status: db.status as ReadingStatus,
    rating: db.rating || 0,
    pages: db.pages || 0,
    pagesRead: db.pages_read || 0,
    coverColor: db.cover_color,
    coverPattern: db.cover_pattern || 0,
    coverUrl: db.cover_url,
    notes: db.notes || "",
    startDate: db.start_date,
    finishDate: db.finish_date,
    dateAdded: db.date_added,
    isbn: db.isbn,
  };
}

function mapBookToDb(book: any): any {
  return {
    title: book.title,
    author: book.author,
    genre: book.genre,
    status: book.status,
    rating: book.rating,
    pages: book.pages,
    pages_read: book.pagesRead,
    cover_color: book.coverColor,
    cover_pattern: book.coverPattern,
    cover_url: book.coverUrl,
    notes: book.notes,
    start_date: book.startDate,
    finish_date: book.finishDate,
    isbn: book.isbn,
  };
}

export const useBookStore = create<BookStore>((set, get) => ({
  books: [],
  isLoading: true,
  fetchBooks: async () => {
    set({ isLoading: true });
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      set({ isLoading: false });
      return;
    }

    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("date_added", { ascending: false });

    if (!error && data) {
      set({ books: data.map(mapDbToBook), isLoading: false });
    } else {
      console.error("Error fetching books:", error);
      set({ isLoading: false });
    }
  },
  addBook: async (book) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const dbBook = mapBookToDb(book);
    dbBook.user_id = user.id;

    const { data, error } = await supabase
      .from("books")
      .insert([dbBook])
      .select()
      .single();

    if (!error && data) {
      set((state) => ({ books: [mapDbToBook(data), ...state.books] }));
    } else {
      console.error("Error adding book:", error);
    }
  },
  updateBook: async (id, updates) => {
    const supabase = createClient();
    
    // Optimsitic UI update
    set((state) => ({
      books: state.books.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    }));

    const dbUpdates = mapBookToDb(updates);
    
    const { error } = await supabase
      .from("books")
      .update(dbUpdates)
      .eq("id", id);

    if (error) {
      console.error("Error updating book:", error);
      // To be robust, we could rollback the optimistic update here if needed.
    }
  },
  deleteBook: async (id) => {
    const supabase = createClient();
    
    // Optimistic UI update
    set((state) => ({ books: state.books.filter((b) => b.id !== id) }));

    const { error } = await supabase
      .from("books")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting book:", error);
    }
  },
  getBook: (id) => get().books.find((b) => b.id === id),
}));
