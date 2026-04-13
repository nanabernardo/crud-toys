// app/api/toys/[id]/route.ts
// Endpoints para busca por ID (GET), atualização (PATCH) e exclusão (DELETE).

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toySchema } from "@/lib/validations";

interface Params {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  const id = parseInt(params.id);
  if (isNaN(id))
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const toy = await prisma.toy.findUnique({ where: { id } });
  if (!toy)
    return NextResponse.json({ error: "Brinquedo não encontrado" }, { status: 404 });

  return NextResponse.json(toy);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id))
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const body = await req.json();

    // partial() permite atualização parcial sem exigir todos os campos
    const parsed = toySchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const toy = await prisma.toy.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(toy);
  } catch (error: unknown) {
    // P2025 = registro não encontrado no Prisma
    if ((error as { code?: string })?.code === "P2025")
      return NextResponse.json({ error: "Brinquedo não encontrado" }, { status: 404 });

    console.error("[PATCH /api/toys/:id]", error);
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id))
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    await prisma.toy.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if ((error as { code?: string })?.code === "P2025")
      return NextResponse.json({ error: "Brinquedo não encontrado" }, { status: 404 });

    console.error("[DELETE /api/toys/:id]", error);
    return NextResponse.json({ error: "Erro ao deletar" }, { status: 500 });
  }
}
