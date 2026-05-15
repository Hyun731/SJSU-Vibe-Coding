import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { SupabaseProvider } from "@/components/supabase-provider";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Reading Notes — Personal Book Tracker",
  description: "Track your reading journey, save notes, and manage your personal book collection.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lora.variable} bg-background`}>
      <body className="font-sans antialiased">
        <div className="flex min-h-screen">
          <SupabaseProvider>
            <AppSidebar />
            <main className="flex-1 min-w-0">
              {children}
            </main>
          </SupabaseProvider>
        </div>
      </body>
    </html>
  );
}
