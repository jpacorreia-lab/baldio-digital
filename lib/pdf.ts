type PdfRow = {
  nome: string;
  cartao_cidadao: string;
};

function cleanText(value: string) {
  return value
    .replace(/[^\x09\x0A\x0D\x20-\xFF]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function text(x: number, y: number, size: number, value: string) {
  return `BT /F1 ${size} Tf ${x} ${y} Td (${cleanText(value)}) Tj ET\n`;
}

function line(x1: number, y1: number, x2: number, y2: number) {
  return `${x1} ${y1} m ${x2} ${y2} l S\n`;
}

function rect(x: number, y: number, width: number, height: number) {
  return `${x} ${y} ${width} ${height} re S\n`;
}

function makePageContent(rows: PdfRow[], page: number, totalPages: number) {
  const pageWidth = 595;
  const left = 40;
  const top = 790;
  const rowHeight = 24;
  const nameWidth = 285;
  const cardWidth = 150;
  const voteWidth = 75;
  let y = top;
  let content = "";

  content += text(left, y, 17, "Baldio Digital");
  content += text(left, y - 24, 13, "Caderno eleitoral - compartes ativos");
  content += text(455, y - 24, 9, `Página ${page}/${totalPages}`);
  y -= 56;

  content += rect(left, y - 5, nameWidth + cardWidth + voteWidth, rowHeight);
  content += text(left + 8, y + 2, 10, "Nome");
  content += text(left + nameWidth + 8, y + 2, 10, "Cartão de cidadão");
  content += text(left + nameWidth + cardWidth + 14, y + 2, 10, "Votou");
  y -= rowHeight;

  rows.forEach((row) => {
    content += rect(left, y - 5, nameWidth + cardWidth + voteWidth, rowHeight);
    content += line(left + nameWidth, y - 5, left + nameWidth, y - 5 + rowHeight);
    content += line(
      left + nameWidth + cardWidth,
      y - 5,
      left + nameWidth + cardWidth,
      y - 5 + rowHeight
    );
    content += text(left + 8, y + 2, 9, row.nome.slice(0, 52));
    content += text(left + nameWidth + 8, y + 2, 9, row.cartao_cidadao);
    content += rect(left + nameWidth + cardWidth + 31, y, 12, 12);
    y -= rowHeight;
  });

  content += text(left, 34, 8, "Assinatura do responsável: ________________________________");
  content += text(pageWidth - 170, 34, 8, "Data: ____ / ____ / ______");

  return content;
}

export function createElectoralRollPdf(rows: PdfRow[]) {
  const rowsPerPage = 25;
  const pages: string[] = [];
  const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage));

  for (let index = 0; index < totalPages; index += 1) {
    const start = index * rowsPerPage;
    const pageRows = rows.slice(start, start + rowsPerPage);
    pages.push(makePageContent(pageRows, index + 1, totalPages));
  }

  const objects: Buffer[] = [];
  const addObject = (content: string | Buffer) => {
    objects.push(Buffer.isBuffer(content) ? content : Buffer.from(content, "latin1"));
    return objects.length;
  };

  const catalogId = addObject("<< /Type /Catalog /Pages 2 0 R >>");
  const pagesId = addObject("");
  const fontId = addObject(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>"
  );

  const pageIds: number[] = [];
  pages.forEach((pageContent) => {
    const stream = Buffer.from(pageContent, "latin1");
    const contentId = addObject(
      Buffer.concat([
        Buffer.from(`<< /Length ${stream.length} >>\nstream\n`, "latin1"),
        stream,
        Buffer.from("endstream", "latin1")
      ])
    );
    const pageId = addObject(
      `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`
    );
    pageIds.push(pageId);
  });

  objects[pagesId - 1] = Buffer.from(
    `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`,
    "latin1"
  );

  const chunks: Buffer[] = [Buffer.from("%PDF-1.4\n", "latin1")];
  const offsets = [0];
  let currentOffset = chunks[0].length;

  objects.forEach((object, index) => {
    offsets.push(currentOffset);
    const objectHeader = Buffer.from(`${index + 1} 0 obj\n`, "latin1");
    const objectFooter = Buffer.from("\nendobj\n", "latin1");
    chunks.push(objectHeader);
    chunks.push(object);
    chunks.push(objectFooter);
    currentOffset += objectHeader.length + object.length + objectFooter.length;
  });

  const xrefOffset = currentOffset;
  chunks.push(Buffer.from(`xref\n0 ${objects.length + 1}\n`, "latin1"));
  chunks.push(Buffer.from("0000000000 65535 f \n", "latin1"));
  offsets.slice(1).forEach((offset) => {
    chunks.push(Buffer.from(`${String(offset).padStart(10, "0")} 00000 n \n`, "latin1"));
  });
  chunks.push(
    Buffer.from(
      `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`,
      "latin1"
    )
  );

  return Buffer.concat(chunks);
}

export function createAssembleiaEditalPdf({
  titulo,
  tipo,
  data,
  hora,
  local,
  ordemTrabalhos
}: {
  titulo: string;
  tipo: string;
  data: string;
  hora: string;
  local: string;
  ordemTrabalhos: string;
}) {
  const lines = ordemTrabalhos
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  let y = 780;
  let content = "";
  content += text(245, y, 18, "EDITAL");
  y -= 42;
  content += text(50, y, 12, titulo);
  y -= 30;
  content += text(50, y, 10, `Tipo: ${tipo}`);
  y -= 20;
  content += text(50, y, 10, `Data: ${data}`);
  y -= 20;
  content += text(50, y, 10, `Hora: ${hora}`);
  y -= 20;
  content += text(50, y, 10, `Local: ${local}`);
  y -= 36;
  content += text(50, y, 12, "Ordem de trabalhos");
  y -= 24;
  lines.forEach((lineText, index) => {
    content += text(65, y, 10, `${index + 1}. ${lineText.slice(0, 88)}`);
    y -= 20;
  });
  y -= 18;
  content += text(
    50,
    y,
    9,
    "O presente edital deve ser tornado público com a antecedência legal mínima."
  );
  content += text(50, 95, 9, "Afixado em: ____ / ____ / ______");
  content += text(50, 65, 9, "O Presidente da Mesa: ________________________________");

  const objects: Buffer[] = [];
  const addObject = (body: string | Buffer) => {
    objects.push(Buffer.isBuffer(body) ? body : Buffer.from(body, "latin1"));
    return objects.length;
  };
  const catalogId = addObject("<< /Type /Catalog /Pages 2 0 R >>");
  const pagesId = addObject("");
  const fontId = addObject(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>"
  );
  const stream = Buffer.from(content, "latin1");
  const contentId = addObject(
    Buffer.concat([
      Buffer.from(`<< /Length ${stream.length} >>\nstream\n`, "latin1"),
      stream,
      Buffer.from("endstream", "latin1")
    ])
  );
  const pageId = addObject(
    `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`
  );
  objects[pagesId - 1] = Buffer.from(
    `<< /Type /Pages /Kids [${pageId} 0 R] /Count 1 >>`,
    "latin1"
  );

  const chunks: Buffer[] = [Buffer.from("%PDF-1.4\n", "latin1")];
  const offsets = [0];
  let currentOffset = chunks[0].length;
  objects.forEach((object, index) => {
    offsets.push(currentOffset);
    const header = Buffer.from(`${index + 1} 0 obj\n`, "latin1");
    const footer = Buffer.from("\nendobj\n", "latin1");
    chunks.push(header, object, footer);
    currentOffset += header.length + object.length + footer.length;
  });
  const xrefOffset = currentOffset;
  chunks.push(Buffer.from(`xref\n0 ${objects.length + 1}\n`, "latin1"));
  chunks.push(Buffer.from("0000000000 65535 f \n", "latin1"));
  offsets.slice(1).forEach((offset) => {
    chunks.push(Buffer.from(`${String(offset).padStart(10, "0")} 00000 n \n`, "latin1"));
  });
  chunks.push(
    Buffer.from(
      `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`,
      "latin1"
    )
  );

  return Buffer.concat(chunks);
}
