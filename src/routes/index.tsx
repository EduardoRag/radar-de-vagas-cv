import { createFileRoute } from "@tanstack/react-router";
import { Analyzer } from "@/components/ats/Analyzer";
import { Header } from "@/components/ats/Header";
import { Hero } from "@/components/ats/Hero";
import { HowItWorks } from "@/components/ats/HowItWorks";
import { Footer } from "@/components/ats/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ATS Match — Analisador e otimizador de currículos" },
      { name: "description", content: "Compare seu currículo com a vaga, veja a compatibilidade e gere uma versão otimizada para ATS, sem inventar experiências." },
      { property: "og:title", content: "ATS Match — Analisador e otimizador de currículos" },
      { property: "og:description", content: "Compare seu currículo com a vaga e gere uma versão otimizada para ATS, sem inventar experiências." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Analyzer />
      </main>
      <Footer />
    </div>
  );
}
