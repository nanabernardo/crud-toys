"use client";
// components/SortControls.tsx
// Controles de ordenação que atualizam a URL (search params) sem reload.

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SortField, SortOrder } from "@/lib/types";

interface Props {
  currentSort: SortField;
  currentOrder: SortOrder;
}

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "createdAt", label: "Mais recentes" },
  { value: "nome", label: "Nome" },
  { value: "valorEncontrado", label: "Valor encontrado" },
  { value: "valorOferecido", label: "Valor oferecido" },
];

export function SortControls({ currentSort, currentOrder }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const update = (sortBy: SortField, order: SortOrder) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", sortBy);
    params.set("order", order);
    router.push(`${pathname}?${params.toString()}`);
  };

  const toggleOrder = () => {
    update(currentSort, currentOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="flex items-center gap-2">
      <select
        className="input-field w-auto text-sm cursor-pointer"
        value={currentSort}
        onChange={(e) => update(e.target.value as SortField, currentOrder)}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Botão asc/desc */}
      <button
        onClick={toggleOrder}
        title={currentOrder === "asc" ? "Crescente" : "Decrescente"}
        className="btn-secondary px-3 text-base"
      >
        {currentOrder === "asc" ? "↑" : "↓"}
      </button>
    </div>
  );
}
