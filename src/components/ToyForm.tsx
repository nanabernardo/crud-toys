"use client";
// components/ToyForm.tsx
// Formulário reutilizável para criação e edição de brinquedos.
// Gerencia validação local (Zod), upload de imagem e submissão via fetch.

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toyFormSchema, ToyFormValues } from "@/lib/validations";
import { maskCurrency, parseCurrency } from "@/lib/utils";
import { Toy } from "@/lib/types";
import { Toast } from "@/components/ui/Toast";
import { Spinner } from "@/components/ui/Spinner";

interface Props {
  mode: "create" | "edit";
  toy?: Toy;
}

type FieldErrors = Partial<Record<keyof ToyFormValues, string>>;

export function ToyForm({ mode, toy }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  // Estado do formulário
  const [values, setValues] = useState<ToyFormValues>({
    nome: toy?.nome ?? "",
    valorEncontrado: toy ? maskCurrency(String(Math.round(toy.valorEncontrado * 100))) : "",
    valorOferecido: toy ? maskCurrency(String(Math.round(toy.valorOferecido * 100))) : "",
    observacoes: toy?.observacoes ?? "",
    imagem: toy?.imagem ?? "",
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(toy?.imagem ?? "");
  const [imageMode, setImageMode] = useState<"url" | "upload">(
    toy?.imagem && !toy.imagem.startsWith("/uploads") ? "url" : "upload"
  );

  // Reseta preview quando URL muda
  useEffect(() => {
    if (imageMode === "url") setPreview(values.imagem ?? "");
  }, [values.imagem, imageMode]);

  // Atualiza campo genérico
  const set = (field: keyof ToyFormValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  // Aplica máscara de moeda ao digitar
  const setCurrency = (field: "valorEncontrado" | "valorOferecido") => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const masked = maskCurrency(e.target.value);
    setValues((v) => ({ ...v, [field]: masked }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  // Upload de imagem para /api/upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro no upload");

      setValues((v) => ({ ...v, imagem: data.url }));
      setPreview(data.url);
      setErrors((er) => ({ ...er, imagem: undefined }));
    } catch (err: unknown) {
      setErrors((er) => ({
        ...er,
        imagem: err instanceof Error ? err.message : "Erro no upload",
      }));
    } finally {
      setUploading(false);
    }
  };

  // Submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação Zod no cliente
    const result = toyFormSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const [field, msgs] of Object.entries(
        result.error.flatten().fieldErrors
      )) {
        fieldErrors[field as keyof ToyFormValues] = (msgs as string[])[0];
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    setToast(null);

    try {
      const payload = {
        nome: values.nome.trim(),
        valorEncontrado: parseCurrency(values.valorEncontrado),
        valorOferecido: parseCurrency(values.valorOferecido),
        observacoes: values.observacoes?.trim() || null,
        imagem: values.imagem?.trim() || null,
      };

      const url = mode === "edit" ? `/api/toys/${toy!.id}` : "/api/toys";
      const method = mode === "edit" ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erro ao salvar");
      }

      setToast({ type: "success", msg: mode === "create" ? "Brinquedo criado!" : "Atualizado com sucesso!" });
      setTimeout(() => router.push("/"), 1200);
    } catch (err: unknown) {
      setToast({
        type: "error",
        msg: err instanceof Error ? err.message : "Erro inesperado",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.msg}
          onClose={() => setToast(null)}
        />
      )}

      {/* Nome */}
      <div>
        <label className="label">Nome *</label>
        <input
          className={`input-field ${errors.nome ? "border-rust" : ""}`}
          placeholder="Ex: LEGO Star Wars 2004"
          value={values.nome}
          onChange={set("nome")}
          maxLength={100}
        />
        {errors.nome && <p className="text-rust text-xs mt-1">{errors.nome}</p>}
      </div>

      {/* Valores lado a lado */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Valor Encontrado *</label>
          <input
            className={`input-field ${errors.valorEncontrado ? "border-rust" : ""}`}
            placeholder="R$ 0,00"
            value={values.valorEncontrado}
            onChange={setCurrency("valorEncontrado")}
            inputMode="numeric"
          />
          {errors.valorEncontrado && (
            <p className="text-rust text-xs mt-1">{errors.valorEncontrado}</p>
          )}
        </div>
        <div>
          <label className="label">Valor Oferecido *</label>
          <input
            className={`input-field ${errors.valorOferecido ? "border-rust" : ""}`}
            placeholder="R$ 0,00"
            value={values.valorOferecido}
            onChange={setCurrency("valorOferecido")}
            inputMode="numeric"
          />
          {errors.valorOferecido && (
            <p className="text-rust text-xs mt-1">{errors.valorOferecido}</p>
          )}
        </div>
      </div>

      {/* Observações */}
      <div>
        <label className="label">Observações</label>
        <textarea
          className="input-field resize-none"
          rows={3}
          placeholder="Estado de conservação, detalhes, contexto..."
          value={values.observacoes}
          onChange={set("observacoes")}
          maxLength={1000}
        />
        <p className="text-xs text-pine/40 mt-0.5 text-right">
          {values.observacoes?.length ?? 0}/1000
        </p>
      </div>

      {/* Imagem */}
      <div>
        <label className="label">Imagem</label>

        {/* Toggle URL / Upload */}
        <div className="flex gap-2 mb-3">
          {(["upload", "url"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setImageMode(m);
                setValues((v) => ({ ...v, imagem: "" }));
                setPreview("");
              }}
              className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                imageMode === m
                  ? "bg-pine text-cream border-pine"
                  : "bg-white text-pine border-sand-dark hover:border-pine"
              }`}
            >
              {m === "upload" ? "📁 Upload" : "🔗 URL"}
            </button>
          ))}
        </div>

        {imageMode === "upload" ? (
          <div
            className="border-2 border-dashed border-sand-dark rounded-xl p-6 text-center cursor-pointer hover:border-pine transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2 text-pine/60">
                <Spinner />
                <span className="text-sm">Enviando...</span>
              </div>
            ) : preview ? (
              <div className="relative w-full h-40">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="text-pine/40">
                <div className="text-4xl mb-2">🖼️</div>
                <p className="text-sm">Clique para selecionar uma imagem</p>
                <p className="text-xs mt-1">JPG, PNG, WEBP ou GIF — máx 5MB</p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div>
            <input
              className={`input-field ${errors.imagem ? "border-rust" : ""}`}
              placeholder="https://exemplo.com/imagem.jpg"
              value={values.imagem}
              onChange={set("imagem")}
            />
            {preview && (
              <div className="relative w-full h-40 mt-3 rounded-xl overflow-hidden border border-sand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                  onError={() => setPreview("")}
                />
              </div>
            )}
          </div>
        )}
        {errors.imagem && (
          <p className="text-rust text-xs mt-1">{errors.imagem}</p>
        )}
      </div>

      {/* Ações */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || uploading}
          className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading && <Spinner size="sm" />}
          {mode === "create" ? "Criar Brinquedo" : "Salvar Alterações"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
