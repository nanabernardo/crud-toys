// app/api/upload/route.ts
// Recebe o arquivo via FormData, salva em /public/uploads/ e retorna o caminho.
// Em produção, substituir por S3, Cloudinary, etc.

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    // Validação de tipo (aceita apenas imagens)
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de arquivo não permitido. Use JPG, PNG, WEBP ou GIF." },
        { status: 400 }
      );
    }

    // Limite de 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Arquivo muito grande. Máximo 5MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Nome único para evitar colisões
    const ext = path.extname(file.name) || ".jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Retorna o path público acessível pelo browser
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error("[POST /api/upload]", error);
    return NextResponse.json({ error: "Erro no upload" }, { status: 500 });
  }
}
