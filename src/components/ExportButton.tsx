"use client";

export function ExportButton() {
  return (
    <a
      href="/api/export"
      download="brinquedos.csv"
      className="btn-secondary inline-flex items-center gap-2"
    >
      ⬇️ Exportar lista
    </a>
  );
}
