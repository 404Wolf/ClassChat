import type { ReactNode } from "react";
import { Header } from "~/components/general/Header";
import { Footer } from "~/components/general/Footer";

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

export function MainLayout({
  children,
  className = ""
}: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className={`flex-1 w-full py-8 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
