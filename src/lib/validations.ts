// lib/validations.ts
// Schemas Zod centralizados — reutilizados tanto na API quanto no frontend.
// Isso garante uma única fonte de verdade para regras de validação.

import { z } from "zod";

export const toySchema = z.object({
  nome: z
    .string()
    .min(2, "Nome deve ter ao menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),

  valorEncontrado: z
    .number({ invalid_type_error: "Informe um valor válido" })
    .min(0, "Valor não pode ser negativo"),

  valorOferecido: z
    .number({ invalid_type_error: "Informe um valor válido" })
    .min(0, "Valor não pode ser negativo"),

  observacoes: z.string().max(1000, "Máximo 1000 caracteres").optional(),

  imagem: z.string().optional(), // URL ou caminho local
});

// Para o formulário (raw strings antes de parsear números)
export const toyFormSchema = z.object({
  nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  valorEncontrado: z
    .string()
    .min(1, "Campo obrigatório")
    .refine((v) => !isNaN(parseFloat(v.replace(/[^0-9,.-]/g, "").replace(",", "."))), {
      message: "Informe um valor válido",
    }),
  valorOferecido: z
    .string()
    .min(1, "Campo obrigatório")
    .refine((v) => !isNaN(parseFloat(v.replace(/[^0-9,.-]/g, "").replace(",", "."))), {
      message: "Informe um valor válido",
    }),
  observacoes: z.string().optional(),
  imagem: z.string().optional(),
});

export type ToyFormValues = z.infer<typeof toyFormSchema>;
export type ToyValues = z.infer<typeof toySchema>;
