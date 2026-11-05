import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Footer } from "@/components/ats/Footer";
import { Header } from "@/components/ats/Header";

export const Route = createFileRoute("/sobre-ats")({
  head: () => ({
    meta: [
      { title: "O que é um ATS? — ATS Match" },
      { name: "description", content: "Entenda o que são sistemas ATS e como deixar seu currículo legível para eles sem exageros." },
      { property: "og:title", content: "O que é um ATS? — ATS Match" },
      { property: "og:description", content: "Entenda os sistemas ATS e boas práticas de currículo." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: About,
});

const TIPS = [
  ["Coluna única", "Layouts com várias colunas e tabelas podem ser lidos fora de ordem."],
  ["Títulos convencionais", "Use “Experiência profissional”, “Formação acadêmica”, “Competências”."],
  ["Termos da vaga, com verdade", "Use as palavras da vaga apenas para o que você realmente fez."],
  ["Sem gráficos", "Barras de habilidade e ícones não são lidos como texto."],
];

function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-4xl font-semibold tracking-tight">O que é um <span className="text-primary">ATS</span>?</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          ATS (Applicant Tracking System) é o software que empresas usam para receber, organizar e filtrar candidaturas.
          Ele extrai o texto do seu currículo e ajuda recrutadores a encontrar perfis aderentes à vaga.
        </p>
        <p className="mt-4 text-muted-foreground">
          Cada sistema funciona de um jeito, e nenhuma ferramenta consegue garantir aprovação. O que está ao seu alcance é
          apresentar suas experiências reais de forma clara, legível e alinhada à linguagem da vaga.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {TIPS.map(([t, d]) => (
            <Card key={t} className="p-5">
              <h2 className="font-medium">{t}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </Card>
          ))}
        </div>
        <Button variant="hero" size="lg" asChild className="mt-10">
          <Link to="/" hash="analisar">Analisar meu currículo</Link>
        </Button>
      </main>
      <Footer />
    </div>
  );
}
