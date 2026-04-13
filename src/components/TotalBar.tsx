import { formatCurrency } from "@/lib/utils";

interface Props {
  totalEncontrado: number;
  totalOferecido: number;
}

export function TotalsBar({ totalEncontrado, totalOferecido }: Props) {
  const diferenca = totalEncontrado - totalOferecido;

  return (
    <div className="mt-10 pt-6 border-sand grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl boder boder-sand p-5 text-center shadow-sm">
        <p className="label mb-1">Total Valor Encontrado</p>
        <p className="text-2xl font-display font-bold text-pine/70 line-through decoration-rust/50">
          {formatCurrency(totalEncontrado)}
        </p>
      </div>

      <div className="bg-white rounded-2xl boder boder-sand p-5 text-center shadow-sm">
        <p className="label mb-1">Total Valor Oferecido</p>
        <p className="text-2xl font-display font-bold text-pine">
          {formatCurrency(totalOferecido)}
        </p>
      </div>

      <div className="bg-pine rounded-2xl p-5 text-center shadow-sm">
        <p className="label text-cream/60 mb-1">Diferença total</p>
        <p className="text-2xl font-display font-bold text-cream">
          {diferenca > 0 ? formatCurrency(diferenca) : "-"}
        </p>
      </div>
    </div>
  );
}
