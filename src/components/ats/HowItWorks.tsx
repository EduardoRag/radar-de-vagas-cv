import { ClipboardPaste, FileCheck2, Gauge, Wand2 } from "lucide-react";

const STEPS = [
  { icon: ClipboardPaste, title: "Cole vaga e currículo", text: "Nenhum cadastro necessário. Os textos não são armazenados." },
  { icon: Gauge, title: "Veja a compatibilidade", text: "A IA classifica os requisitos; a pontuação segue pesos fixos e explicáveis." },
  { icon: Wand2, title: "Gere a versão otimizada", text: "Reescrita focada na vaga, sem inventar experiências ou habilidades." },
  { icon: FileCheck2, title: "Revise e exporte", text: "Edite o texto e baixe em PDF ou DOCX, em formato simples para ATS." },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-20 border-y border-border/60 bg-background-2/50">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight">Como funciona</h2>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="rounded-xl border border-border bg-card/60 p-5">
              <div className="mb-4 flex items-center justify-between">
                <s.icon className="size-5 text-primary" aria-hidden />
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="font-medium">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
