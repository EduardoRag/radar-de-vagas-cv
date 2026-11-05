// Shared (client + server) scoring logic. The AI only classifies requirements;
// the score is always computed here from validated data.

export type RequirementCategory = "obrigatorio" | "experiencia" | "desejavel" | "formacao";
export type RequirementStatus = "atendido" | "parcial" | "nao_identificado";

export const CATEGORY_WEIGHTS: Record<RequirementCategory, number> = {
  obrigatorio: 50,
  experiencia: 25,
  desejavel: 15,
  formacao: 10,
};

export const CATEGORY_LABELS: Record<RequirementCategory, string> = {
  obrigatorio: "Requisitos técnicos obrigatórios",
  experiencia: "Experiências e responsabilidades",
  desejavel: "Competências desejáveis",
  formacao: "Formação e qualificações",
};

const STATUS_VALUE: Record<RequirementStatus, number> = {
  atendido: 1,
  parcial: 0.5,
  nao_identificado: 0,
};

export interface ScoredRequirement {
  category: RequirementCategory;
  status: RequirementStatus;
}

export interface CategoryBreakdown {
  category: RequirementCategory;
  weight: number; // normalized weight (0-100)
  total: number;
  ratio: number; // 0-1
  contribution: number; // points contributed to the final score
}

export function computeScore(requirements: ScoredRequirement[]) {
  const present = (Object.keys(CATEGORY_WEIGHTS) as RequirementCategory[]).filter((c) =>
    requirements.some((r) => r.category === c),
  );
  const weightSum = present.reduce((s, c) => s + CATEGORY_WEIGHTS[c], 0);
  const breakdown: CategoryBreakdown[] = present.map((category) => {
    const items = requirements.filter((r) => r.category === category);
    const ratio = items.reduce((s, r) => s + STATUS_VALUE[r.status], 0) / items.length;
    const weight = (CATEGORY_WEIGHTS[category] / weightSum) * 100;
    return { category, weight, total: items.length, ratio, contribution: ratio * weight };
  });
  const score = weightSum === 0 ? 0 : Math.round(breakdown.reduce((s, b) => s + b.contribution, 0));
  return { score, breakdown };
}

export function interpretScore(score: number) {
  if (score >= 80) return "Alta aderência textual aos requisitos da vaga.";
  if (score >= 60) return "Boa aderência, com alguns pontos a destacar melhor.";
  if (score >= 40) return "Aderência moderada. Há requisitos sem evidência clara no currículo.";
  return "Baixa aderência textual. Muitos requisitos não foram identificados no currículo.";
}
