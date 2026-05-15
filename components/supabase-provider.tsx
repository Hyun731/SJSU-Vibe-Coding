"use client";

import { useEffect } from "react";
import { useBookStore } from "@/lib/book-store";

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const fetchBooks = useBookStore((state) => state.fetchBooks);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return <>{children}</>;
}
