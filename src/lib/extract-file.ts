// Browser-only text extraction from PDF / DOCX resumes.
export const MAX_FILE_BYTES = 5 * 1024 * 1024;

export async function extractResumeText(file: File): Promise<string> {
  if (file.size > MAX_FILE_BYTES) throw new Error("Arquivo maior que 5 MB.");
  const name = file.name.toLowerCase();
  const buf = await file.arrayBuffer();

  if (name.endsWith(".docx")) {
    const mammoth = await import("mammoth");
    const { value } = await mammoth.extractRawText({ arrayBuffer: buf });
    return clean(value);
  }

  if (name.endsWith(".pdf") || file.type === "application/pdf") {
    const pdfjs = await import("pdfjs-dist");
    const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise;
    const pages: string[] = [];
    for (let p = 1; p <= pdf.numPages; p++) {
      const content = await (await pdf.getPage(p)).getTextContent();
      let line = "";
      const lines: string[] = [];
      for (const item of content.items as Array<{ str?: string; hasEOL?: boolean }>) {
        line += item.str ?? "";
        if (item.hasEOL) {
          lines.push(line);
          line = "";
        }
      }
      if (line) lines.push(line);
      pages.push(lines.join("\n"));
    }
    const text = clean(pages.join("\n\n"));
    if (!text) throw new Error("Não encontramos texto neste PDF (pode ser uma imagem escaneada).");
    return text;
  }

  throw new Error("Formato não suportado. Envie um arquivo PDF ou DOCX.");
}

function clean(t: string) {
  return t.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}
