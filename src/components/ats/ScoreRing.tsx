export function ScoreRing({ score, size = 168 }: { score: number; size?: number }) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.max(0, Math.min(100, score)) / 100) * c;
  const tone = score >= 60 ? "text-primary" : score >= 40 ? "text-warning" : "text-destructive";
  return (
    <div className="relative" style={{ width: size, height: size }} role="img" aria-label={`Compatibilidade estimada: ${score} de 100`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-muted" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className={`${tone} stroke-current transition-[stroke-dashoffset] duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-semibold tabular-nums ${tone}`}>{score}%</span>
        <span className="text-xs text-muted-foreground">compatibilidade</span>
      </div>
    </div>
  );
}
