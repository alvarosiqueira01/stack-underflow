"use client";

import { useState } from "react";

const testimonials = [
  {
    quote:
      "A qualidade das respostas aqui é incomparável. Resolvi meu primeiro bug grande em 20 minutos depois de postar, e a comunidade foi incrivelmente solícita.",
    name: "Alex Chen",
    role: "Desenvolvedor Rust Sênior",
  },
  {
    quote:
      "Encontrei soluções para problemas que eu pesquisava há semanas em outros lugares. A busca por tags realmente funciona.",
    name: "Mariana Silva",
    role: "Engenheira de Backend",
  },
  {
    quote:
      "Como autodidata, esse espaço foi essencial pra eu entender conceitos avançados de TypeScript sem me sentir julgada por perguntar.",
    name: "Priya Nair",
    role: "Desenvolvedora Frontend",
  },
];

export function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const current = testimonials[index];

  function previous() {
    setIndex((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  }

  function next() {
    setIndex((i) => (i === testimonials.length - 1 ? 0 : i + 1));
  }

  return (
    <div className="rounded-2xl bg-black/40 p-6 text-white backdrop-blur-sm">
      <p className="text-sm leading-relaxed text-zinc-100">&quot;{current.quote}&quot;</p>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-zinc-500" />
          <div>
            <div className="text-sm font-medium">{current.name}</div>
            <div className="text-xs text-zinc-400">{current.role}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={previous}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10"
            aria-label="Depoimento anterior"
          >
            ←
          </button>
          <button
            type="button"
            onClick={next}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10"
            aria-label="Próximo depoimento"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
