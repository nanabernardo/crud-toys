// app/api/toys/route.ts
// Endpoints REST para listagem (GET) e criação (POST) de brinquedos.
// A validação com Zod garante que dados inválidos nunca chegam ao banco.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toySchema } from "@/lib/validations";
import { SortField, SortOrder } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? "";
    const sortBy = (searchParams.get("sortBy") as SortField) ?? "createdAt";
    const order = (searchParams.get("order") as SortOrder) ?? "desc";

    // Campos permitidos para ordenação (whitelist de segurança)
    const allowedSort: SortField[] = [
      "nome", "valorEncontrado", "valorOferecido", "createdAt",
    ];
    const safeSortBy = allowedSort.includes(sortBy) ? sortBy : "createdAt";

    const toys = await prisma.toy.findMany({
      where: search
        ? { nome: { contains: search, mode: "insensitive" } }
        : undefined,
      orderBy: { [safeSortBy]: order },
    });

    return NextResponse.json(toys);
  } catch (error) {
    console.error("[GET /api/toys]", error);
    return NextResponse.json(
      { error: "Erro ao buscar brinquedos" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Zod valida e transforma tipos (coerce)
    const parsed = toySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const toy = await prisma.toy.create({ data: parsed.data });
    return NextResponse.json(toy, { status: 201 });
  } catch (error) {
    console.error("[POST /api/toys]", error);
    return NextResponse.json(
      { error: "Erro ao criar brinquedo" },
      { status: 500 }
    );
  }
}
