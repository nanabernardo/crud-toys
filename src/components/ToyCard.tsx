"use client";
// components/ToyCard.tsx
// Card individual de brinquedo com imagem, valores e ações.

import Link from "next/link";
import Image from "next/image";
import { Toy } from "@/lib/types";
import { formatCurrency, savings } from "@/lib/utils";

interface Props {
  toy: Toy;
  onDelete: () => void;
}

export function ToyCard({ toy, onDelete }: Props) {
  const savingsBadge = savings(toy.valorEncontrado, toy.valorOferecido);

  return (
    <div className="card group flex flex-col h-full">
      {/* Imagem */}
      <div className="relative w-full h-44 bg-sand/30 flex-shrink-0">
        {toy.imagem ? (
          <Image
            src={toy.imagem}
            alt={toy.nome}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized={toy.imagem.startsWith("http")}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.png";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl text-pine/20">
            🧸
          </div>
        )}

        {/* Badge de economia */}
        {savingsBadge && (
          <span className="absolute top-2 right-2 bg-pine-light text-cream text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
            {savingsBadge}
          </span>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-bold text-pine text-base leading-tight mb-3 line-clamp-2">
          {toy.nome}
        </h3>

        {/* Valores */}
        <div className="space-y-1 mb-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-pine/50 text-xs">Encontrado</span>
            <span className="font-semibold text-pine/70 line-through decoration-rust/60">
              {formatCurrency(toy.valorEncontrado)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-pine/50 text-xs">Oferecido</span>
            <span className="font-bold text-pine text-base">
              {formatCurrency(toy.valorOferecido)}
            </span>
          </div>
        </div>

        {/* Observações */}
        {toy.observacoes && (
          <p className="text-xs text-pine/50 italic line-clamp-2 mb-3 flex-1">
            {toy.observacoes}
          </p>
        )}

        {/* Ações */}
        <div className="flex gap-2 mt-auto pt-3 border-t border-sand">
          <Link
            href={`/toys/${toy.id}`}
            className="flex-1 text-center text-xs font-semibold py-1.5 rounded-lg bg-sand hover:bg-sand-dark text-pine transition-colors"
          >
            ✏️ Editar
          </Link>
          <button
            onClick={onDelete}
            className="flex-1 text-xs font-semibold py-1.5 rounded-lg bg-rust/10 hover:bg-rust text-rust hover:text-white transition-colors"
          >
            🗑 Deletar
          </button>
        </div>
      </div>
    </div>
  );
}
