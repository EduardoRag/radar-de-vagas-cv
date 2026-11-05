import { AlertTriangle, CheckCircle2, CircleDashed, Info, Quote } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Analysis } from "@/lib/ats.functions";
import { CATEGORY_LABELS } from "@/lib/score";
import { Optimizer } from "./Optimizer";
import { ScoreRing } from "./ScoreRing";

const PRIORITY: Record<string, { label: string; variant: "warning" | "match" | "muted" }> = {
  alta: { label: "Alta prioridade", variant: "warning" },
  media: { label: "Média prioridade", variant: "match" },
  baixa: { label: "Baixa prioridade", variant: "muted" },
};
const ORDER = { alta: 0, media: 1, baixa: 2 } as const;

export function Results({ analysis, input }: { analysis: Analysis; input: { job: string; resume: string } }) {
  const reqs = analysis.requirements;
  const found = reqs.filter((r) => r.status !== "nao_identificado").length;
  const recs = [...analysis.recommendations].sort((a, b) => ORDER[a.priority] - ORDER[b.priority]);

  return (
    <div className="mt-16 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-semibold tracking-tight">Resultado da análise</h2>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Compatibilidade estimada</CardTitle>
            <CardDescription>Estimativa textual e de requisitos.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-5">
            <ScoreRing score={analysis.compatibilityScore} />
            <p className="text-center text-sm">{analysis.scoreExplanation}</p>
            <div className="grid w-full grid-cols-3 gap-2 text-center">
              <Stat label="Identificados" value={reqs.length} />
              <Stat label="Com evidência" value={found} tone="text-success" />
              <Stat label="Sem evidência" value={reqs.length - found} tone="text-warning" />
            </div>
            <p className="text-xs text-muted-foreground">
              A pontuação representa uma estimativa baseada na comparação com a vaga. Ela não garante aprovação em
              sistemas ATS ou processos seletivos.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Como a pontuação foi calculada</CardTitle>
            <CardDescription>{analysis.summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.breakdown.map((b) => (
              <div key={b.category} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span>{CATEGORY_LABELS[b.category]} <span className="text-muted-foreground">· peso {Math.round(b.weight)}%</span></span>
                  <span className="tabular-nums text-muted-foreground">{Math.round(b.ratio * 100)}%</span>
                </div>
                <Progress value={b.ratio * 100} aria-label={CATEGORY_LABELS[b.category]} />
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              Evidência completa vale 100%, parcial vale 50%. Pesos base 50/25/15/10, normalizados quando uma categoria
              não aparece na vaga.
            </p>
            <Accordion type="single" collapsible>
              <AccordionItem value="reqs" className="border-b-0">
                <AccordionTrigger>Ver os {reqs.length} requisitos</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3">
                    {reqs.map((r, i) => (
                      <li key={i} className="rounded-lg border border-border bg-background-2/50 p-3 text-sm">
                        <div className="flex flex-wrap items-center gap-2">
                          {r.status === "atendido" ? <CheckCircle2 className="size-4 text-success" /> : r.status === "parcial" ? <CircleDashed className="size-4 text-primary" /> : <AlertTriangle className="size-4 text-warning" />}
                          <span className="font-medium">{r.name}</span>
                          <Badge variant="muted">{r.status === "atendido" ? "Com evidência" : r.status === "parcial" ? "Evidência parcial" : "Não identificado"}</Badge>
                          {r.needsConfirmation && <Badge variant="warning">Confirmar</Badge>}
                          <span className="text-xs text-muted-foreground">confiança {r.confidence}</span>
                        </div>
                        {r.evidence && <p className="mt-2 border-l-2 border-primary/50 pl-3 text-muted-foreground italic">“{r.evidence}”</p>}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Competências identificadas</CardTitle>
            <CardDescription>Termos da vaga com evidência no seu currículo.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {analysis.matchedKeywords.length ? analysis.matchedKeywords.map((k) => <Badge key={k} variant="match">{k}</Badge>) : <p className="text-sm text-muted-foreground">Nenhuma competência identificada.</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Requisitos não identificados</CardTitle>
            <CardDescription>Sem evidência suficiente no texto enviado.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {analysis.missingKeywords.length ? analysis.missingKeywords.map((k) => <Badge key={k} variant="warning">{k}</Badge>) : <p className="text-sm text-muted-foreground">Todos os requisitos tiveram alguma evidência.</p>}
            </div>
            <Alert>
              <Info className="size-4" />
              <AlertDescription className="text-xs">
                Essas competências não foram identificadas no currículo enviado. Inclua-as somente se você realmente
                possuir essa experiência.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Como melhorar seu currículo</CardTitle>
          <CardDescription>Recomendações ordenadas por prioridade.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={["r0"]}>
            {recs.map((r, i) => (
              <AccordionItem key={i} value={`r${i}`}>
                <AccordionTrigger className="text-left">
                  <span className="flex flex-wrap items-center gap-3">
                    <Badge variant={PRIORITY[r.priority].variant}>{PRIORITY[r.priority].label}</Badge>
                    {r.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 text-sm">
                  <p>{r.description}</p>
                  <p className="text-muted-foreground"><span className="font-medium text-foreground">Por quê: </span>{r.justification}</p>
                  {r.relatedExcerpt && (
                    <p className="flex gap-2 rounded-md bg-background-2 p-3 text-muted-foreground">
                      <Quote className="size-4 shrink-0 text-primary" aria-hidden /> {r.relatedExcerpt}
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Optimizer analysis={analysis} input={input} />
    </div>
  );
}

function Stat({ label, value, tone = "" }: { label: string; value: number; tone?: string }) {
  return (
    <div className="rounded-lg border border-border bg-background-2/60 p-2">
      <div className={`text-xl font-semibold tabular-nums ${tone}`}>{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}
