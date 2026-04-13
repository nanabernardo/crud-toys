"use client";
// components/SearchBar.tsx
// Busca por nome com debounce — atualiza a URL sem recarregar a página.

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface Props {
  defaultValue?: string;
}

export function SearchBar({ defaultValue = "" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue);
  const [, startTransition] = useTransition();

  // Debounce: aguarda 350ms após parar de digitar para buscar
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      startTransition(() => router.push(`${pathname}?${params.toString()}`));
    }, 350);

    return () => clearTimeout(timer);
  }, [value, router, pathname, searchParams]);

  return (
    <div className="relative flex-1">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pine/40 text-sm">
        🔍
      </span>
      <input
        type="search"
        className="input-field pl-9 pr-9"
        placeholder="Buscar por nome..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {value && (
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 text-pine/40 hover:text-pine text-xs"
          onClick={() => setValue("")}
        >
          ✕
        </button>
      )}
    </div>
  );
}
