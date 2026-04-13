// lib/types.ts
// Tipos compartilhados entre frontend e backend.

export interface Toy {
  id: number;
  nome: string;
  valorEncontrado: number;
  valorOferecido: number;
  observacoes?: string | null;
  imagem?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type SortField =
  | "nome"
  | "valorEncontrado"
  | "valorOferecido"
  | "createdAt";
export type SortOrder = "asc" | "desc";

export interface ToysQuery {
  search?: string;
  sortBy?: SortField;
  order?: SortOrder;
}
