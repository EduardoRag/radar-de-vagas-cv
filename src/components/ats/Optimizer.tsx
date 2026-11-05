import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AlertCircle, Copy, FileDown, FileText, Loader2, RotateCw, Sparkles, Wand2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { optimizeResume, type Analysis, type Optimization } from "@/lib/ats.functions";
import { exportDocx, exportPdf } from "@/lib/export";

const CHANGE_LABEL = { reformulado: "Reformulado", organizacao: "Organização", palavra_chave: "Palavra-chave" } as const;

export function Optimizer({ analysis, input }: { analysis: Analysis; input: { job: string; resume: string } }) {
  const optimize = useServerFn(optimizeResume);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState<"pdf" | "docx" | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await optimize({
        data: {
          ...input,
          missingKeywords: analysis.missingKeywords,
          recommendations: analysis.recommendations.map((r) => `${r.title}: ${r.description}`.slice(0, 500)),
        },
      });
      if (!res.ok) throw new Error(res.error);
      return res.data as Optimization;
    },
    onSuccess: (d) => setText(d.resume),
  });

  const run = async (kind: "pdf" | "docx") => {
    setBusy(kind);
    try {
      await (kind === "pdf" ? exportPdf(text) : exportDocx(text));
      toast.success(kind === "pdf" ? "PDF gerado" : "DOCX gerado");
    } catch {
      toast.error("Não foi possível gerar o arquivo.");
    } finally {
      setBusy(null);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Currículo copiado");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  return (
    <Card className="border-primary/30">
      <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
        <div className="space-y-1.5">
          <CardTitle className="text-xl">Seu currículo otimizado</CardTitle>
          <CardDescription>
            Reescrito para a vaga com base apenas no que está no seu currículo original.
          </CardDescription>
        </div>
        {!mutation.data && (
          <Button variant="hero" size="lg" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? <Loader2 className="animate-spin" /> : <Wand2 />}
            {mutation.isPending ? "Gerando..." : "Gerar currículo otimizado"}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {mutation.isPending && (
          <div role="status" aria-live="polite" className="space-y-3">
            <p className="flex items-center gap-2 text-sm"><Sparkles className="size-4 text-primary" /> Reescrevendo sem inventar informações...</p>
            <Skeleton className="h-72" />
          </div>
        )}
        {mutation.isError && (
          <Alert variant="destructive" role="alert">
            <AlertCircle className="size-4" />
            <AlertTitle>Não foi possível gerar o currículo</AlertTitle>
            <AlertDescription className="flex flex-col items-start gap-3">
              {mutation.error.message}
              <Button variant="outline" size="sm" onClick={() => mutation.mutate()}><RotateCw /> Tentar novamente</Button>
            </AlertDescription>
          </Alert>
        )}
        {mutation.data && (
          <>
            {mutation.data.pendingConfirmations.length > 0 && (
              <Alert>
                <AlertCircle className="size-4" />
                <AlertTitle>Revise antes de enviar</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-4 text-sm">
                    {mutation.data.pendingConfirmations.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={copy}><Copy /> Copiar currículo</Button>
              <Button variant="outline" size="sm" onClick={() => run("pdf")} disabled={!!busy}>
                {busy === "pdf" ? <Loader2 className="animate-spin" /> : <FileDown />} Baixar PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => run("docx")} disabled={!!busy}>
                {busy === "docx" ? <Loader2 className="animate-spin" /> : <FileText />} Baixar DOCX
              </Button>
              <Button variant="ghost" size="sm" onClick={() => mutation.mutate()}><RotateCw /> Gerar novamente</Button>
            </div>

            <Tabs defaultValue="edit">
              <TabsList>
                <TabsTrigger value="original">Currículo original</TabsTrigger>
                <TabsTrigger value="edit">Currículo otimizado</TabsTrigger>
                <TabsTrigger value="compare" className="hidden lg:inline-flex">Comparar</TabsTrigger>
              </TabsList>
              <TabsContent value="original">
                <Plain text={input.resume} />
              </TabsContent>
              <TabsContent value="edit" className="space-y-2">
                <label htmlFor="optimized" className="text-xs text-muted-foreground">Edite livremente antes de exportar. Use "## " para títulos e "- " para tópicos.</label>
                <Textarea id="optimized" value={text} onChange={(e) => setText(e.target.value)} className="min-h-[32rem] bg-background/60 font-mono text-sm leading-relaxed" />
              </TabsContent>
              <TabsContent value="compare">
                <div className="grid gap-4 lg:grid-cols-2">
                  <div><p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Original</p><Plain text={input.resume} /></div>
                  <div><p className="mb-2 text-xs uppercase tracking-wider text-primary">Otimizado</p><Highlighted text={text} keywords={mutation.data.incorporatedKeywords} /></div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm font-semibold">O que mudou</h3>
                <ul className="space-y-2 text-sm">
                  {mutation.data.changes.map((c, i) => (
                    <li key={i} className="flex gap-2"><Badge variant={c.type === "palavra_chave" ? "match" : "muted"} className="h-fit shrink-0">{CHANGE_LABEL[c.type]}</Badge><span className="text-muted-foreground">{c.description}</span></li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold">Palavras-chave incorporadas com evidência</h3>
                <div className="flex flex-wrap gap-2">{mutation.data.incorporatedKeywords.map((k) => <Badge key={k} variant="match">{k}</Badge>)}</div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function Plain({ text }: { text: string }) {
  return (
    <ScrollArea className="h-[32rem] rounded-md border border-border bg-background-2/50">
      <pre className="whitespace-pre-wrap p-4 font-mono text-sm leading-relaxed">{text}</pre>
    </ScrollArea>
  );
}

function Highlighted({ text, keywords }: { text: string; keywords: string[] }) {
  const parts = useMemo(() => {
    const kws = keywords.filter((k) => k.trim().length > 1).map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    if (!kws.length) return [text];
    return text.split(new RegExp(`(${kws.join("|")})`, "gi"));
  }, [text, keywords]);
  const set = new Set(keywords.map((k) => k.toLowerCase()));
  return (
    <ScrollArea className="h-[32rem] rounded-md border border-primary/30 bg-background-2/50">
      <pre className="whitespace-pre-wrap p-4 font-mono text-sm leading-relaxed">
        {parts.map((p, i) => (set.has(p.toLowerCase()) ? <mark key={i} className="kw-mark">{p}</mark> : <span key={i}>{p}</span>))}
      </pre>
    </ScrollArea>
  );
}
