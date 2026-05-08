import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createElectoralRollPdf } from "@/lib/pdf";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("compartes")
    .select("nome, cartao_cidadao")
    .eq("estado", "ativo")
    .order("nome", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []).map((row) => ({
    nome: String(row.nome ?? ""),
    cartao_cidadao: String(row.cartao_cidadao ?? "")
  }));
  const pdf = createElectoralRollPdf(rows);

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="caderno-eleitoral.pdf"'
    }
  });
}
