// components/ui/Spinner.tsx
// Spinner de carregamento reutilizável com tamanhos variáveis.

interface Props {
  size?: "sm" | "md";
}

export function Spinner({ size = "md" }: Props) {
  const cls =
    size === "sm"
      ? "w-3.5 h-3.5 border-2"
      : "w-6 h-6 border-2";

  return (
    <span
      className={`inline-block ${cls} border-current border-t-transparent rounded-full animate-spin`}
      aria-label="Carregando..."
    />
  );
}
