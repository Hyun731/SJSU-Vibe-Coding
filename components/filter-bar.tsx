"use client";

import { Search, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReadingStatus } from "@/lib/book-store";

export type SortOption = "dateAdded" | "title" | "author" | "rating" | "finishDate";

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: ReadingStatus | "all";
  onStatusChange: (v: ReadingStatus | "all") => void;
  ratingFilter: number | 0;
  onRatingChange: (v: number) => void;
  sortBy: SortOption;
  onSortChange: (v: SortOption) => void;
  view: "grid" | "list";
  onViewChange: (v: "grid" | "list") => void;
}

export function FilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  ratingFilter,
  onRatingChange,
  sortBy,
  onSortChange,
  view,
  onViewChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2.5 flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-48">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Status filter */}
      <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as ReadingStatus | "all")}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="reading">Reading</SelectItem>
          <SelectItem value="read">Read</SelectItem>
          <SelectItem value="to-read">Want to Read</SelectItem>
          <SelectItem value="dnf">Did Not Finish</SelectItem>
        </SelectContent>
      </Select>

      {/* Rating filter */}
      <Select value={String(ratingFilter)} onValueChange={(v) => onRatingChange(Number(v))}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Any rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">Any rating</SelectItem>
          <SelectItem value="5">5 stars</SelectItem>
          <SelectItem value="4">4+ stars</SelectItem>
          <SelectItem value="3">3+ stars</SelectItem>
          <SelectItem value="2">2+ stars</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select value={sortBy} onValueChange={(v) => onSortChange(v as SortOption)}>
        <SelectTrigger className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="dateAdded">Date added</SelectItem>
          <SelectItem value="title">Title A–Z</SelectItem>
          <SelectItem value="author">Author A–Z</SelectItem>
          <SelectItem value="rating">Rating</SelectItem>
          <SelectItem value="finishDate">Date finished</SelectItem>
        </SelectContent>
      </Select>

      {/* View toggle */}
      <div className="flex gap-1 border border-border rounded-lg p-1">
        <Button
          variant={view === "grid" ? "secondary" : "ghost"}
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => onViewChange("grid")}
          aria-label="Grid view"
        >
          <LayoutGrid className="w-4 h-4" />
        </Button>
        <Button
          variant={view === "list" ? "secondary" : "ghost"}
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => onViewChange("list")}
          aria-label="List view"
        >
          <List className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
