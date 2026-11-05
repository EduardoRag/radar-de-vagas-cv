import { describe, expect, it } from "vitest";
import { computeScore } from "./score";

describe("computeScore", () => {
  it("weights categories 50/25/15/10", () => {
    const { score } = computeScore([
      { category: "obrigatorio", status: "atendido" },
      { category: "experiencia", status: "nao_identificado" },
      { category: "desejavel", status: "nao_identificado" },
      { category: "formacao", status: "nao_identificado" },
    ]);
    expect(score).toBe(50);
  });

  it("normalizes weights when categories are missing", () => {
    // only obrigatorio (50) + formacao (10) -> formacao weighs 10/60
    const { score } = computeScore([
      { category: "obrigatorio", status: "nao_identificado" },
      { category: "formacao", status: "atendido" },
    ]);
    expect(score).toBe(17);
  });

  it("counts partial evidence as half", () => {
    const { score } = computeScore([{ category: "obrigatorio", status: "parcial" }]);
    expect(score).toBe(50);
  });

  it("returns 0 with no requirements", () => {
    expect(computeScore([]).score).toBe(0);
  });
});
