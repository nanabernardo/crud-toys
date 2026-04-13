"use client";
// components/ToyGrid.tsx
// Grid responsivo de cards de brinquedos.
// Recebe a lista do Server Component pai e gerencia deleção com feedback.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toy } from "@/lib/types";
import { ToyCard } from "@/components/ToyCard";
import { DeleteModal } from "@/components/DeleteModal";

interface Props {
  toys: Toy[];
}

export function ToyGrid({ toys }: Props) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleDelete = async () => {
    if (!deletingId) return;
    setLoadingDelete(true);
    try {
      await fetch(`/api/toys/${deletingId}`, { method: "DELETE" });
      setDeletingId(null);
      router.refresh(); // Revalida o Server Component
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {toys.map((toy, i) => (
          <div
            key={toy.id}
            className="animate-slide-up"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <ToyCard toy={toy} onDelete={() => setDeletingId(toy.id)} />
          </div>
        ))}
      </div>

      {deletingId && (
        <DeleteModal
          toyName={toys.find((t) => t.id === deletingId)?.nome ?? ""}
          loading={loadingDelete}
          onConfirm={handleDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </>
  );
}
