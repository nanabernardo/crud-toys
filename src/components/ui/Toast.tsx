"use client";
// components/ui/Toast.tsx
// Notificação temporária de sucesso ou erro, com auto-dismiss.

import { useEffect } from "react";

interface Props {
  type: "success" | "error";
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ type, message, onClose, duration = 3500 }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium animate-slide-up
        ${type === "success"
          ? "bg-pine/10 border-pine-light text-pine"
          : "bg-rust/10 border-rust text-rust"}
      `}
    >
      <span>{type === "success" ? "✅" : "❌"}</span>
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="text-current/50 hover:text-current text-xs"
      >
        ✕
      </button>
    </div>
  );
}
