import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AlertCircle, Eraser, Loader2, RotateCw, ShieldCheck, Sparkles, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { analyzeResume, LIMITS, type Analysis } from "@/lib/ats.functions";
import { Results } from "./Results";

const formSchema = z.object({
  job: z
    .string()
    .trim()
    .min(LIMITS.min, `Cole pelo menos ${LIMITS.min} caracteres da descrição da vaga.`)
    .max(LIMITS.max, `Limite de ${LIMITS.max.toLocaleString("pt-BR")} caracteres.`),
  resume: z
    .string()
    .trim()
    .min(LIMITS.min, `Cole pelo menos ${LIMITS.min} caracteres do seu currículo.`)
    .max(LIMITS.max, `Limite de ${LIMITS.max.toLocaleString("pt-BR")} caracteres.`),
});
type FormValues = z.infer<typeof formSchema>;

const JOB_PLACEHOLDER = `Ex.: Desenvolvedor(a) Back-end Pleno

Responsabilidades:
- Desenvolver e manter APIs REST em Node.js e TypeScript
- Modelar bancos de dados PostgreSQL

Requisitos:
- 3+ anos com Node.js
- Experiência com Docker
Diferenciais: Kubernetes, GraphQL`;

const RESUME_PLACEHOLDER = `Ex.: Maria Souza
maria@email.com | São Paulo, SP

Experiência
Desenvolvedora Back-end — Empresa X (2021–atual)
- Desenvolvi APIs REST com Node.js e TypeScript
- Mantive bancos PostgreSQL

Formação
Bacharelado em Ciência da Computação — Universidade Y`;

const STEPS = ["Identificando requisitos da vaga...", "Comparando competências...", "Preparando recomendações..."];

export function Analyzer() {
  const analyze = useServerFn(analyzeResume);
  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const form = useForm<FormValues>({ resolver: zodResolver(formSchema), defaultValues: { job: "", resume: "" } });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await analyze({ data: values });
      if (!res.ok) throw new Error(res.error);
      return res.data as Analysis;
    },
  });

  const onSubmit = (values: FormValues) => {
    setSubmitted(values);
    mutation.mutate(values);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const job = form.watch("job");
  const resume = form.watch("resume");

  return (
    <section id="analisar" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
      <div className="mb-10 max-w-2xl">
        <h2 className="text-3xl font-semibold tracking-tight">Analisar currículo</h2>
        <p className="mt-3 flex items-start gap-2 text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          Seu currículo, sua história. A IA melhora a apresentação das suas experiências, sem inventar informações.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-6 lg:grid-cols-2">
          <TextCard
            id="job"
            title="Descrição da vaga"
            description="Cole aqui os requisitos e responsabilidades da oportunidade."
            placeholder={JOB_PLACEHOLDER}
            value={job}
            error={form.formState.errors.job?.message}
            register={form.register("job")}
            onClear={() => form.setValue("job", "", { shouldValidate: false })}
          />
          <TextCard
            id="resume"
            title="Seu currículo"
            description="Cole o conteúdo atual do seu currículo para começar."
            placeholder={RESUME_PLACEHOLDER}
            value={resume}
            error={form.formState.errors.resume?.message}
            register={form.register("resume")}
            onClear={() => form.setValue("resume", "", { shouldValidate: false })}
            onFileText={(t) => form.setValue("resume", t.slice(0, LIMITS.max), { shouldValidate: true })}
          />
        </div>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Button type="submit" variant="hero" size="xl" disabled={mutation.isPending} className="min-w-64">
            {mutation.isPending ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {mutation.isPending ? "Analisando..." : "Analisar compatibilidade"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Os textos são processados apenas para esta análise e não são armazenados.
          </p>
        </div>
      </form>

      <div ref={resultsRef} className="scroll-mt-20">
        {mutation.isPending && <LoadingState />}
        {mutation.isError && (
          <Alert variant="destructive" className="mt-12" role="alert">
            <AlertCircle className="size-4" />
            <AlertTitle>Não foi possível concluir a análise</AlertTitle>
            <AlertDescription className="flex flex-col items-start gap-3">
              {mutation.error.message || "Erro de conexão. Verifique sua internet e tente novamente."}
              <Button variant="outline" size="sm" onClick={() => submitted && mutation.mutate(submitted)}>
                <RotateCw /> Tentar novamente
              </Button>
            </AlertDescription>
          </Alert>
        )}
        {mutation.isSuccess && submitted && <Results analysis={mutation.data} input={submitted} />}
      </div>
    </section>
  );
}

function TextCard(props: {
  id: string;
  title: string;
  description: string;
  placeholder: string;
  value: string;
  error?: string | undefined;
  register: ReturnType<ReturnType<typeof useForm<FormValues>>["register"]>;
  onClear: () => void;
  onFileText?: (text: string) => void;
}) {
  const len = props.value?.length ?? 0;
  const fileRef = useRef<HTMLInputElement>(null);
  const [reading, setReading] = useState(false);
  const [fileMsg, setFileMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f || !props.onFileText) return;
    setReading(true);
    setFileMsg(null);
    try {
      const { extractResumeText } = await import("@/lib/extract-file");
      const text = await extractResumeText(f);
      props.onFileText(text);
      setFileMsg({ ok: true, text: `Texto extraído de "${f.name}". Revise antes de analisar.` });
    } catch (err) {
      setFileMsg({ ok: false, text: err instanceof Error ? err.message : "Não foi possível ler o arquivo." });
    } finally {
      setReading(false);
    }
  };
  return (
    <Card className="bg-card/70">
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1.5">
          <CardTitle>
            <Label htmlFor={props.id} className="text-base font-semibold">{props.title}</Label>
          </CardTitle>
          <CardDescription id={`${props.id}-desc`}>{props.description}</CardDescription>
        </div>
        <div className="flex shrink-0 gap-1">
          {props.onFileText && (
            <>
              <input ref={fileRef} type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={onFile} />
              <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={reading}>
                {reading ? <Loader2 className="animate-spin" /> : <Upload />} Enviar PDF/DOCX
              </Button>
            </>
          )}
          <Button type="button" variant="ghost" size="sm" onClick={props.onClear} disabled={!len} aria-label={`Limpar ${props.title}`}>
            <Eraser /> Limpar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {fileMsg && (
          <p className={`mb-2 text-xs ${fileMsg.ok ? "text-primary" : "text-destructive"}`} role="status">{fileMsg.text}</p>
        )}
        <Textarea
          id={props.id}
          {...props.register}
          placeholder={props.placeholder}
          aria-invalid={!!props.error}
          aria-describedby={`${props.id}-desc ${props.id}-count${props.error ? ` ${props.id}-err` : ""}`}
          className="min-h-80 resize-y bg-background/60 font-mono text-sm leading-relaxed focus-visible:ring-2"
        />
        <div className="mt-2 flex items-start justify-between gap-4 text-xs">
          <span id={`${props.id}-err`} className="text-destructive" role={props.error ? "alert" : undefined}>
            {props.error}
          </span>
          <span id={`${props.id}-count`} className={`shrink-0 tabular-nums ${len > LIMITS.max ? "text-destructive" : "text-muted-foreground"}`}>
            {len.toLocaleString("pt-BR")} / {LIMITS.max.toLocaleString("pt-BR")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => Math.min(v + 1, STEPS.length - 1)), 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="mt-12 space-y-6" role="status" aria-live="polite" aria-busy="true">
      <div className="flex items-center gap-3 text-sm">
        <Loader2 className="size-4 animate-spin text-primary" aria-hidden />
        <span>{STEPS[i]}</span>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Skeleton className="h-64 md:col-span-1" />
        <Skeleton className="h-64 md:col-span-2" />
      </div>
      <Skeleton className="h-40" />
    </div>
  );
}
