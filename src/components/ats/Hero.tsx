import { ArrowRight, CheckCircle2, CircleDashed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScoreRing } from "./ScoreRing";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Badge variant="match" className="mb-6">Analisar · Comparar · Otimizar</Badge>
          <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Seu currículo está preparado para a{" "}
            <span className="text-primary text-glow">próxima oportunidade</span>?
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Compare seu currículo com a vaga desejada, descubra competências relevantes e gere uma versão otimizada para
            sistemas ATS. Sem inventar experiências.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="hero" size="xl" asChild>
              <a href="#analisar">
                Analisar meu currículo <ArrowRight />
              </a>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <a href="#como-funciona">Entenda como funciona</a>
            </Button>
          </div>
        </div>

        <Card className="relative border-border/80 bg-card/80 p-6 shadow-2xl backdrop-blur" aria-label="Demonstração ilustrativa do painel">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm font-medium">Painel de análise</span>
            <Badge variant="muted">Demonstração</Badge>
          </div>
          <div className="flex items-center gap-6">
            <ScoreRing score={72} size={128} />
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2"><CheckCircle2 className="size-4 text-success" /> 9 requisitos com evidência</p>
              <p className="flex items-center gap-2"><CircleDashed className="size-4 text-warning" /> 3 não identificados</p>
              <p className="text-xs text-muted-foreground">Exemplo ilustrativo, não é um resultado real.</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Competências</p>
            <div className="flex flex-wrap gap-2">
              {["TypeScript", "Node.js", "PostgreSQL", "REST APIs"].map((k) => (
                <Badge key={k} variant="match">{k}</Badge>
              ))}
              {["Kubernetes", "GraphQL"].map((k) => (
                <Badge key={k} variant="warning">{k}</Badge>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
