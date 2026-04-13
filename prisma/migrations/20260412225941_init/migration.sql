-- CreateTable
CREATE TABLE "Toy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "valorEncontrado" REAL NOT NULL,
    "valorOferecido" REAL NOT NULL,
    "observacoes" TEXT,
    "imagem" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
