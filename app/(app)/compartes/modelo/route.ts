import { NextResponse } from "next/server";

export async function GET() {
  const XLSX = await import("xlsx");
  const rows = [
    [
      "nome_completo",
      "cartao_cidadao",
      "nif",
      "morada",
      "localidade",
      "telefone",
      "email",
      "data_nascimento",
      "data_admissao",
      "fundamento",
      "estado",
      "observacoes"
    ],
    [
      "Maria da Silva",
      "12345678 9 ZX0",
      "123456789",
      "Rua do Baldio, 12",
      "Montalegre",
      "912345678",
      "maria@example.com",
      "1979-03-05",
      "2024-01-15",
      "Residência e ligação comunitária ao baldio",
      "ativo",
      "Observação livre"
    ]
  ];

  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.aoa_to_sheet(rows);
  sheet["!cols"] = [
    { wch: 28 },
    { wch: 18 },
    { wch: 12 },
    { wch: 32 },
    { wch: 18 },
    { wch: 14 },
    { wch: 28 },
    { wch: 16 },
    { wch: 16 },
    { wch: 34 },
    { wch: 12 },
    { wch: 28 }
  ];

  XLSX.utils.book_append_sheet(workbook, sheet, "Compartes");
  const buffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "buffer"
  });

  return new NextResponse(buffer, {
    headers: {
      "Content-Disposition": 'attachment; filename="modelo-compartes.xlsx"',
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }
  });
}
