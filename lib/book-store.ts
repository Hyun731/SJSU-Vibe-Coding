"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  notes: string;
  startDate: string | null;
  finishDate: string | null;
  dateAdded: string;
  isbn?: string;
}

interface BookStore {
  books: Book[];
  addBook: (book: Omit<Book, "id" | "dateAdded">) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
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

const SEED_BOOKS: Book[] = [
  {
    id: "1",
    title: "The Midnight Library",
    author: "Matt Haig",
    genre: "Fiction",
    status: "read",
    rating: 5,
    pages: 304,
    pagesRead: 304,
    coverColor: "#1C3A5E",
    coverPattern: 1,
    notes: "A beautiful exploration of regret and second chances.",
    startDate: "2024-01-05",
    finishDate: "2024-01-14",
    dateAdded: "2024-01-05",
  },
  {
    id: "2",
    title: "Lessons in Chemistry",
    author: "Bonnie Garmus",
    genre: "Historical Fiction",
    status: "read",
    rating: 4,
    pages: 390,
    pagesRead: 390,
    coverColor: "#5C3D2E",
    coverPattern: 2,
    notes: "Funny, sharp, and deeply moving.",
    startDate: "2024-02-01",
    finishDate: "2024-02-18",
    dateAdded: "2024-01-28",
  },
  {
    id: "3",
    title: "Demon Copperhead",
    author: "Barbara Kingsolver",
    genre: "Literary Fiction",
    status: "read",
    rating: 5,
    pages: 548,
    pagesRead: 548,
    coverColor: "#4B0082",
    coverPattern: 0,
    notes: "Pulitzer-winning masterpiece.",
    startDate: "2024-03-01",
    finishDate: "2024-03-22",
    dateAdded: "2024-02-25",
  },
  {
    id: "4",
    title: "Fourth Wing",
    author: "Rebecca Yarros",
    genre: "Fantasy",
    status: "reading",
    rating: 0,
    pages: 517,
    pagesRead: 210,
    coverColor: "#8B0000",
    coverPattern: 3,
    notes: "Can't put it down!",
    startDate: "2025-05-01",
    finishDate: null,
    dateAdded: "2025-04-28",
  },
  {
    id: "5",
    title: "Tomorrow, and Tomorrow, and Tomorrow",
    author: "Gabrielle Zevin",
    genre: "Literary Fiction",
    status: "reading",
    rating: 0,
    pages: 416,
    pagesRead: 88,
    coverColor: "#1B4332",
    coverPattern: 1,
    notes: "About creativity, friendship, and games.",
    startDate: "2025-05-08",
    finishDate: null,
    dateAdded: "2025-05-06",
  },
  {
    id: "6",
    title: "Intermezzo",
    author: "Sally Rooney",
    genre: "Literary Fiction",
    status: "to-read",
    rating: 0,
    pages: 464,
    pagesRead: 0,
    coverColor: "#B8860B",
    coverPattern: 2,
    notes: "",
    startDate: null,
    finishDate: null,
    dateAdded: "2025-05-10",
  },
  {
    id: "7",
    title: "Orbital",
    author: "Samantha Harvey",
    genre: "Literary Fiction",
    status: "to-read",
    rating: 0,
    pages: 209,
    pagesRead: 0,
    coverColor: "#2F4F4F",
    coverPattern: 3,
    notes: "Booker Prize winner.",
    startDate: null,
    finishDate: null,
    dateAdded: "2025-05-12",
  },
  {
    id: "8",
    title: "The House in the Cerulean Sea",
    author: "TJ Klune",
    genre: "Fantasy",
    status: "read",
    rating: 5,
    pages: 394,
    pagesRead: 394,
    coverColor: "#006400",
    coverPattern: 0,
    notes: "Cozy and heartwarming.",
    startDate: "2024-04-01",
    finishDate: "2024-04-12",
    dateAdded: "2024-03-28",
  },
  {
    id: "9",
    title: "A Little Life",
    author: "Hanya Yanagihara",
    genre: "Literary Fiction",
    status: "dnf",
    rating: 2,
    pages: 720,
    pagesRead: 150,
    coverColor: "#556B2F",
    coverPattern: 1,
    notes: "Too intense for me right now.",
    startDate: "2024-05-01",
    finishDate: "2024-05-10",
    dateAdded: "2024-04-29",
  },
  {
    id: "10",
    title: "Pachinko",
    author: "Min Jin Lee",
    genre: "Historical Fiction",
    status: "read",
    rating: 5,
    pages: 485,
    pagesRead: 485,
    coverColor: "#7B3F00",
    coverPattern: 2,
    notes: "Epic, multigenerational saga.",
    startDate: "2024-06-01",
    finishDate: "2024-06-25",
    dateAdded: "2024-05-28",
  },
];

export const useBookStore = create<BookStore>()(
  persist(
    (set, get) => ({
      books: SEED_BOOKS,
      addBook: (book) =>
        set((state) => ({
          books: [
            ...state.books,
            {
              ...book,
              id: crypto.randomUUID(),
              dateAdded: new Date().toISOString().split("T")[0],
            },
          ],
        })),
      updateBook: (id, updates) =>
        set((state) => ({
          books: state.books.map((b) => (b.id === id ? { ...b, ...updates } : b)),
        })),
      deleteBook: (id) =>
        set((state) => ({ books: state.books.filter((b) => b.id !== id) })),
      getBook: (id) => get().books.find((b) => b.id === id),
    }),
    { name: "bookshelf-store" }
  )
);
