// exportação de arquivo .csv para leitura dos dados contidos

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

// Envolve o campo em aspas e escapa aspas internas (padrão CSV)
function csvField(value: string): string {
  return `"${value.replace("/g", '""')}"`;
}

export async function GET() {
  const toys = await prisma.toy.findMany({ orderBy: { nome: "asc" } });

  const totalEncontrado = toys.reduce((acc, t) => acc + t.valorEncontrado, 0);
  const totalOferecido = toys.reduce((acc, t) => acc + t.valorOferecido, 0);

  const linhas = [
    // cabeçalho
    [
      csvField("Nome"),
      csvField("Valor Encontrado"),
      csvField("Valor Oferecido"),
    ].join(";"),

    //uma linha por brinquedo
    ...toys.map((t) =>
      [
        csvField(t.nome),
        csvField(formatCurrency(t.valorEncontrado)),
        csvField(formatCurrency(t.valorOferecido)),
      ].join(";"),
    ),

    //linha em branco separadora
    ";;",

    //totais

    [
      csvField("TOTAL"),
      csvField(formatCurrency(totalEncontrado)),
      csvField(formatCurrency(totalOferecido)),
    ].join(";"),
  ];

  //BOM + conteúdo - o \uFEFF faz o Excel reconhecer UTF-8 corretamente
  const csv = "\uFEFF" + linhas.join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="brinquedos.csv"',
    },
  });
}
