// Client-side export of the optimized resume (plain text with "## " headings).

type Block =
  | { kind: "name"; text: string }
  | { kind: "contact"; text: string }
  | { kind: "heading"; text: string }
  | { kind: "bullet"; text: string }
  | { kind: "para"; text: string };

export function parseResume(text: string): Block[] {
  const lines = text.split(/\r?\n/).map((l) => l.trimEnd());
  const blocks: Block[] = [];
  let seenHeading = false;
  let headerLines = 0;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("## ") || line.startsWith("# ")) {
      seenHeading = true;
      blocks.push({ kind: "heading", text: line.replace(/^#+\s*/, "") });
    } else if (/^[-•*]\s+/.test(line)) {
      blocks.push({ kind: "bullet", text: line.replace(/^[-•*]\s+/, "") });
    } else if (!seenHeading && headerLines === 0) {
      headerLines++;
      blocks.push({ kind: "name", text: line });
    } else if (!seenHeading) {
      headerLines++;
      blocks.push({ kind: "contact", text: line });
    } else {
      blocks.push({ kind: "para", text: line });
    }
  }
  return blocks;
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function exportPdf(text: string, filename = "curriculo-otimizado.pdf") {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 56;
  const width = doc.internal.pageSize.getWidth() - margin * 2;
  const pageH = doc.internal.pageSize.getHeight();
  let y = margin;

  const write = (t: string, size: number, style: "normal" | "bold", gap: number, indent = 0, prefix = "") => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(t, width - indent) as string[];
    const lh = size * 1.35;
    lines.forEach((ln, i) => {
      if (y + lh > pageH - margin) {
        doc.addPage();
        y = margin;
      }
      if (i === 0 && prefix) doc.text(prefix, margin + indent - 10, y);
      doc.text(ln, margin + indent, y);
      y += lh;
    });
    y += gap;
  };

  for (const b of parseResume(text)) {
    if (b.kind === "name") write(b.text, 18, "bold", 2);
    else if (b.kind === "contact") write(b.text, 10, "normal", 2);
    else if (b.kind === "heading") {
      y += 8;
      write(b.text.toUpperCase(), 11.5, "bold", 0);
      doc.setDrawColor(160);
      doc.line(margin, y - 8, margin + width, y - 8);
      y += 4;
    } else if (b.kind === "bullet") write(b.text, 10.5, "normal", 2, 14, "•");
    else write(b.text, 10.5, /—|\|/.test(b.text) && b.text.length < 140 ? "bold" : "normal", 3);
  }
  download(doc.output("blob"), filename);
}

export async function exportDocx(text: string, filename = "curriculo-otimizado.docx") {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle } = await import("docx");
  const children = parseResume(text).map((b) => {
    switch (b.kind) {
      case "name":
        return new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun({ text: b.text, bold: true, size: 36 })] });
      case "contact":
        return new Paragraph({ children: [new TextRun({ text: b.text, size: 20 })] });
      case "heading":
        return new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 80 },
          border: { bottom: { color: "999999", style: BorderStyle.SINGLE, size: 6, space: 1 } },
          children: [new TextRun({ text: b.text.toUpperCase(), bold: true, size: 24, color: "000000" })],
        });
      case "bullet":
        return new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: b.text, size: 21 })] });
      default:
        return new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: b.text, size: 21 })] });
    }
  });
  const doc = new Document({
    styles: { default: { document: { run: { font: "Calibri" } } } },
    sections: [{ properties: {}, children }],
  });
  download(await Packer.toBlob(doc), filename);
}
