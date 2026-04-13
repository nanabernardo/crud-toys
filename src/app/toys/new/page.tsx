// app/toys/new/page.tsx
// Página de criação — reutiliza o ToyForm com modo "create".

import Link from "next/link";
import { ToyForm } from "@/components/ToyForm";

export default function NewToyPage() {
  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-pine/60 hover:text-pine flex items-center gap-1"
        >
          ← Voltar para a lista
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-sand p-6 sm:p-8">
        <h2 className="text-2xl font-display font-bold text-pine mb-6">
          🧸 Novo Brinquedo
        </h2>
        <ToyForm mode="create" />
      </div>
    </div>
  );
}
