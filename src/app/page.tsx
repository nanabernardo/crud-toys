// app/page.tsx
// Página principal: listagem de brinquedos com busca e ordenação.
// É um Server Component que delega interatividade para componentes client.

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ToyGrid } from "@/components/ToyGrid";
import { SearchBar } from "@/components/SearchBar";
import { SortControls } from "@/components/SortControls";
import { SortField, SortOrder } from "@/lib/types";
import { TotalsBar } from "@/components/TotalBar";
import { ExportButton } from "@/components/ExportButton";

interface PageProps {
  searchParams: {
    search?: string;
    sortBy?: SortField;
    order?: SortOrder;
  };
}

export const dynamic = "force-dynamic"; // sempre busca dados frescos

export default async function HomePage({ searchParams }: PageProps) {
  const search = searchParams.search ?? "";
  const sortBy: SortField = searchParams.sortBy ?? "createdAt";
  const order: SortOrder = searchParams.order ?? "desc";

  const allowedSort: SortField[] = [
    "nome",
    "valorEncontrado",
    "valorOferecido",
    "createdAt",
  ];
  const safeSortBy = allowedSort.includes(sortBy) ? sortBy : "createdAt";

  const toys = await prisma.toy.findMany({
    where: search ? { nome: { contains: search } } : undefined,
    orderBy: { [safeSortBy]: order },
  });

  const totalEncontrado = toys.reduce((acc, t) => acc + t.valorEncontrado, 0);
  const totalOferecido = toys.reduce((acc, t) => acc + t.valorOferecido, 0);

  return (
    <div className="animate-fade-in">
      {/* Cabeçalho da página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-pine">
            Minha Coleção
          </h2>
          <p className="text-sm text-pine/60 mt-0.5">
            {toys.length === 0
              ? "Nenhum brinquedo cadastrado"
              : `${toys.length} brinquedo${toys.length > 1 ? "s" : ""} encontrado${toys.length > 1 ? "s" : ""}`}
          </p>
        </div>
        <ExportButton />
        <Link
          href="/toys/new"
          className="btn-primary inline-flex items-center gap-2"
        >
          <span className="text-lg">+</span> Novo Brinquedo
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <SearchBar defaultValue={search} />
        <SortControls currentSort={safeSortBy} currentOrder={order} />
      </div>

      {/* Grid de cards */}
      {toys.length === 0 ? (
        <div className="text-center py-20 text-pine/40">
          <div className="text-6xl mb-4">🧸</div>
          <p className="text-lg font-display">
            {search
              ? `Nenhum resultado para "${search}"`
              : "Adicione seu primeiro brinquedo!"}
          </p>
        </div>
      ) : (
        <ToyGrid toys={toys} />
      )}
      <TotalsBar
        totalEncontrado={totalEncontrado}
        totalOferecido={totalOferecido}
      />
    </div>
  );
}
