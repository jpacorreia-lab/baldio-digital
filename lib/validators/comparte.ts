import { z } from "zod";

export const comparteSchema = z.object({
  nome: z.string().min(2, "Indica o nome completo."),
  cartao_cidadao: z.string().trim().optional().nullable(),
  nif: z.string().trim().optional().nullable(),
  morada: z.string().trim().optional().nullable(),
  localidade: z.string().trim().optional().nullable(),
  telefone: z.string().trim().optional().nullable(),
  email: z.string().email("Email inválido.").optional().or(z.literal("")),
  data_nascimento: z.string().optional().nullable(),
  data_admissao: z.string().optional().nullable(),
  fundamento: z.string().trim().optional().nullable(),
  estado: z.enum(["pendente", "ativo", "suspenso", "falecido", "removido"]),
  observacoes: z.string().trim().optional().nullable()
});

export type ComparteFormValues = z.infer<typeof comparteSchema>;

export function parseComparteForm(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = comparteSchema.parse(raw);

  return {
    ...parsed,
    cartao_cidadao: parsed.cartao_cidadao || null,
    nif: parsed.nif || null,
    morada: parsed.morada || null,
    localidade: parsed.localidade || null,
    telefone: parsed.telefone || null,
    email: parsed.email || null,
    data_nascimento: parsed.data_nascimento || null,
    data_admissao: parsed.data_admissao || null,
    fundamento: parsed.fundamento || null,
    observacoes: parsed.observacoes || null
  };
}
