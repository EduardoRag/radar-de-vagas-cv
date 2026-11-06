import { createOpenAI } from "@ai-sdk/openai";
import { APICallError, NoObjectGeneratedError, Output, streamText } from "ai";
import type { z } from "zod";

const BASE_URL = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

export class AiError extends Error {
  constructor(
    message: string,
    public code: "config" | "credits" | "rate" | "denied" | "invalid" | "upstream",
  ) {
    super(message);
  }
}

// Best-effort in-memory rate limit (per worker isolate).
const hits = new Map<string, number[]>();
export function rateLimit(key: string, max = 8, windowMs = 60_000) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (list.length >= max) {
    throw new AiError("Muitas solicitações em pouco tempo. Aguarde um minuto e tente novamente.", "rate");
  }
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) hits.clear();
}

export async function generateStructured<T>(opts: {
  schema: z.ZodType<T>;
  system: string;
  prompt: string;
}): Promise<T> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new AiError("A integração de IA ainda não está configurada.", "config");

  const provider = createOpenAI({
    baseURL: BASE_URL,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });

  try {
    const result = streamText({
      model: provider.responses(MODEL),
      system: opts.system,
      prompt: opts.prompt,
      output: Output.object({ schema: opts.schema }),
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
    });
    return (await result.output) as T;
  } catch (err) {
    throw mapError(err);
  }
}

function mapError(err: unknown): AiError {
  if (err instanceof AiError) return err;
  if (NoObjectGeneratedError.isInstance(err)) {
    return new AiError("A IA retornou uma resposta inválida. Tente novamente.", "invalid");
  }
  const status = APICallError.isInstance(err)
    ? err.statusCode
    : (err as { statusCode?: number; cause?: { statusCode?: number } })?.statusCode ??
      (err as { cause?: { statusCode?: number } })?.cause?.statusCode;
  if (status === 401) return new AiError("A integração de IA não está configurada corretamente.", "config");
  if (status === 402) return new AiError("Os créditos de IA deste espaço acabaram. Adicione créditos para continuar.", "credits");
  if (status === 403) return new AiError("O serviço de IA recusou esta solicitação.", "denied");
  if (status === 429) return new AiError("O serviço de IA está sobrecarregado. Tente novamente em instantes.", "rate");
  console.error("AI call failed", status ?? "", err instanceof Error ? err.message : "");
  return new AiError("Não foi possível concluir a análise agora. Tente novamente.", "upstream");
}
