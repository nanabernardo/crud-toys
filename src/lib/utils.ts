// lib/utils.ts
// Funções utilitárias: formatação de moeda e parsing de valores monetários.

/** Formata número para moeda BRL: 1234.5 → "R$ 1.234,50" */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/** Parseia string monetária para float: "R$ 1.234,50" → 1234.5 */
export function parseCurrency(value: string): number {
  const cleaned = value
    .replace(/[^\d,.-]/g, "") // remove R$, espaços etc.
    .replace(/\./g, "")       // remove separador de milhar
    .replace(",", ".");        // troca vírgula por ponto decimal
  return parseFloat(cleaned) || 0;
}

/** Aplica máscara de moeda em tempo real: "1234" → "R$ 12,34" */
export function maskCurrency(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  const number = parseInt(digits, 10) / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(number);
}

/** Calcula percentual de economia entre dois valores */
export function savings(found: number, offered: number): string {
  if (!found || found <= offered) return "";
  const pct = ((found - offered) / found) * 100;
  return `${pct.toFixed(0)}% abaixo`;
}
