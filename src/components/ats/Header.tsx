import { Link } from "@tanstack/react-router";
import { FileSearch, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Header() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const saved = localStorage.getItem("ats-theme");
    if (saved === "light") setDark(false);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("ats-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-glow">
            <FileSearch className="size-4" aria-hidden />
          </span>
          <span className="text-base font-semibold tracking-tight">
            ATS <span className="text-primary">Match</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Principal">
          <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex">
            <Link to="/" hash="como-funciona">Como funciona</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex">
            <Link to="/sobre-ats">Sobre ATS</Link>
          </Button>
          <Separator orientation="vertical" className="mx-1 hidden h-5 md:block" />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setDark((d) => !d)} aria-label={dark ? "Ativar tema claro" : "Ativar tema escuro"}>
                  {dark ? <Sun /> : <Moon />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{dark ? "Tema claro" : "Tema escuro"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="hero" size="sm" asChild>
            <Link to="/" hash="analisar">Analisar currículo</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
