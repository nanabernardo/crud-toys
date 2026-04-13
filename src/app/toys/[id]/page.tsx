// app/toys/[id]/page.tsx
// Página de edição — busca o brinquedo pelo ID e passa ao ToyForm com modo "edit".

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ToyForm } from "@/components/ToyForm";

interface Props {
  params: { id: string };
}

export default async function EditToyPage({ params }: Props) {
  const id = parseInt(params.id);
  if (isNaN(id)) notFound();

  const toy = await prisma.toy.findUnique({ where: { id } });
  if (!toy) notFound();

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
        <h2 className="text-2xl font-display font-bold text-pine mb-1">
          ✏️ Editar Brinquedo
        </h2>
        <p className="text-sm text-pine/50 mb-6">{toy.nome}</p>
        <ToyForm mode="edit" toy={toy} />
      </div>
    </div>
  );
}
