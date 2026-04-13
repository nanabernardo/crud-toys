"use client";
// components/DeleteModal.tsx
// Modal de confirmação de exclusão com backdrop e animação.

import { Spinner } from "@/components/ui/Spinner";

interface Props {
  toyName: string;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteModal({ toyName, loading, onConfirm, onCancel }: Props) {
  return (
    // Backdrop com blur
    <div
      className="fixed inset-0 bg-pine/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-slide-up"
        onClick={(e) => e.stopPropagation()} // Impede fechar ao clicar no card
      >
        <div className="text-4xl text-center mb-3">⚠️</div>
        <h3 className="text-lg font-display font-bold text-pine text-center mb-2">
          Confirmar exclusão
        </h3>
        <p className="text-sm text-pine/60 text-center mb-6">
          Tem certeza que deseja excluir{" "}
          <strong className="text-pine">&ldquo;{toyName}&rdquo;</strong>?
          Esta ação não pode ser desfeita.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="btn-secondary flex-1 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="btn-danger flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading && <Spinner size="sm" />}
            {loading ? "Deletando..." : "Sim, excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}
