"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isMobileOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-x-hidden">
          <div className="mx-auto max-w-6xl p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
