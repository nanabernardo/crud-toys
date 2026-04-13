// app/layout.tsx
// Layout raiz: define fonte, metadados e estrutura HTML global.

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Registro de Brinquedos",
  description: "Gerencie sua coleção de brinquedos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-cream font-body text-pine antialiased">
        {/* Navbar */}
        <header className="bg-pine shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🧸</span>
              <div>
                <h1 className="text-cream font-display text-xl font-bold leading-tight tracking-wide">
                  Registro de Brinquedos
                </h1>
                <p className="text-sand text-xs">Acervo & Negociações</p>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="mt-16 py-6 text-center text-sm text-pine-light/60">
          Registro de Brinquedos © {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
