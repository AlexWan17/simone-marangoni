"use client";

import { useState } from "react";

type OracleMessage = {
  role: "user" | "assistant";
  content: string;
};

const quickPrompts = [
  "Analisar Risco de Contestação",
  "Revisar Cláusula Contratual",
  "Estruturar Tese de Direito Digital",
] as const;

export function OracleChat() {
  const [messages, setMessages] = useState<OracleMessage[]>([
    {
      role: "assistant",
      content:
        "Oráculo IA Jurídico inicializado. Estruture seu caso, tese ou cláusula e receba uma análise preliminar pronta para ser conectada a um modelo LLM de alto raciocínio técnico.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitPrompt(prompt: string) {
    const normalized = prompt.trim();

    if (!normalized) {
      return;
    }

    const nextMessages = [...messages, { role: "user" as const, content: normalized }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/oraculo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao consultar o Oráculo IA Jurídico.");
      }

      const data = (await response.json()) as { message?: string };

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            data.message ||
            "Resposta indisponível no momento. Revise o prompt e tente novamente.",
        },
      ]);
    } catch {
      setError("Não foi possível obter a análise no momento.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
      <div className="panel-sheen rounded-[1.8rem] p-6 sm:p-8">
        <div className="border-b border-border/70 pb-6">
          <p className="text-xs uppercase tracking-[0.45em] text-foreground-soft">
            Prompts estratégicos
          </p>
          <h2 className="mt-4 font-display text-4xl text-foreground">
            Consultoria acima do sênior
          </h2>
          <p className="mt-4 text-sm leading-7 text-foreground-soft">
            Atalhos prontos para acelerar análises jurídicas complexas com foco em decisão,
            risco e tese.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => submitPrompt(prompt)}
              disabled={isLoading}
              className="block w-full rounded-[1.35rem] border border-line-impact/60 bg-background-soft/35 px-4 py-4 text-left text-sm text-foreground transition hover:border-accent-soft hover:bg-accent/10"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-border/70 bg-background-soft/35 p-4">
          <p className="text-[10px] uppercase tracking-[0.28em] text-foreground-soft">
            Campo livre
          </p>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={8}
            className="mt-4 w-full resize-y rounded-[1.4rem] border border-line-impact/60 bg-background-soft/70 px-4 py-4 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
            placeholder="Ex.: Estruture uma tese de dano moral por negativação indevida com matriz de risco, argumentos prováveis da parte contrária e pedidos subsidiários."
          />
          <button
            type="button"
            onClick={() => submitPrompt(input)}
            disabled={isLoading}
            className={[
              "mt-5 inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm uppercase tracking-[0.24em] transition",
              isLoading
                ? "border-accent bg-accent/15 text-foreground animate-pulse"
                : "border-line-impact text-foreground hover:border-accent-soft hover:bg-accent/10",
            ].join(" ")}
          >
            {isLoading ? "Consultando..." : "Consultar Oráculo"}
          </button>

          {error ? (
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-foreground-soft">
              {error}
            </p>
          ) : null}
        </div>
      </div>

      <div className="panel-sheen rounded-[1.8rem] p-6 sm:p-8">
        <div className="border-b border-border/70 pb-6">
          <p className="text-xs uppercase tracking-[0.45em] text-foreground-soft">
            Fluxo de análise
          </p>
          <h2 className="mt-4 font-display text-4xl text-foreground">
            Chat Jurídico Premium
          </h2>
          <p className="mt-4 text-sm leading-7 text-foreground-soft">
            Estrutura pronta para integração futura com modelos LLM de alto raciocínio técnico,
            preservando uma experiência focada, sóbria e operacional.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={[
                "rounded-[1.5rem] border p-5",
                message.role === "assistant"
                  ? "border-border/70 bg-background-soft/40"
                  : "border-line-impact/60 bg-accent/10",
              ].join(" ")}
            >
              <p className="text-[10px] uppercase tracking-[0.24em] text-foreground-soft">
                {message.role === "assistant" ? "Oráculo IA Jurídico" : "Solicitação"}
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-foreground-soft">
                {message.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
