"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  Library,
  BookMarked,
  Star,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookStore } from "@/lib/book-store";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/login/actions";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/books", label: "All Books", icon: Library },
  { href: "/reading", label: "Currently Reading", icon: BookOpen },
  { href: "/favorites", label: "Favorites", icon: Star },
  { href: "/want-to-read", label: "Want to Read", icon: BookMarked },
];

interface NavLinkProps {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  active: boolean;
  onClick?: () => void;
}

function NavLink({ href, label, icon: Icon, badge, active, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
      )}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="text-xs font-semibold bg-sidebar-primary/20 text-sidebar-primary px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { books } = useBookStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const counts = {
    all: books.length,
    reading: books.filter((b) => b.status === "reading").length,
    favorites: books.filter((b) => b.rating === 5).length,
    toRead: books.filter((b) => b.status === "to-read").length,
  };

  const getBadge = (href: string) => {
    if (href === "/books") return counts.all;
    if (href === "/reading") return counts.reading;
    if (href === "/favorites") return counts.favorites;
    if (href === "/want-to-read") return counts.toRead;
    return undefined;
  };

  const sidebarContent = (
    <nav className="h-full flex flex-col">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary/20 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-sidebar-primary" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-sidebar-foreground leading-tight">Reading Notes</h1>
            <p className="text-[10px] text-sidebar-foreground/50">Personal Library</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            badge={getBadge(item.href)}
            active={pathname === item.href}
            onClick={() => setMobileOpen(false)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-sidebar-border flex flex-col gap-2">
        <p className="text-[10px] text-sidebar-foreground/40 text-center">
          {counts.all} books in your library
        </p>
        <form action={logout}>
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-foreground">
            Sign Out
          </Button>
        </form>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-3 left-3 z-50 md:hidden bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent h-9 w-9 p-0"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-60 bg-sidebar transition-transform duration-200 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 flex-shrink-0 flex-col bg-sidebar min-h-screen sticky top-0 h-screen">
        {sidebarContent}
      </aside>
    </>
  );
}
