"use client";

import { toPng } from "html-to-image";
import { useMemo, useRef, useState } from "react";

type CardFormat = "square" | "story";

const cardFormats: Array<{
  label: string;
  value: CardFormat;
  width: number;
  height: number;
  helper: string;
}> = [
  {
    label: "Quadrado (Feed)",
    value: "square",
    width: 1080,
    height: 1080,
    helper: "Exportação em 1080x1080 para feed do Instagram e LinkedIn.",
  },
  {
    label: "Vertical (Stories)",
    value: "story",
    width: 1080,
    height: 1920,
    helper: "Exportação em 1080x1920 para stories com leitura vertical refinada.",
  },
];

const previewScaleMap: Record<CardFormat, number> = {
  square: 0.26,
  story: 0.16,
};

export function SocialCardStudio() {
  const [title, setTitle] = useState("Consultoria jurídica estratégica para decisões que exigem precisão.");
  const [subtitle, setSubtitle] = useState(
    "Conteúdo institucional para autoridade, confiança e presença premium.",
  );
  const [format, setFormat] = useState<CardFormat>("square");
  const [isExporting, setIsExporting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const selectedFormat = useMemo(
    () => cardFormats.find((item) => item.value === format) ?? cardFormats[0],
    [format],
  );

  const scale = previewScaleMap[selectedFormat.value];
  const previewHeight = Math.round(selectedFormat.height * scale);

  async function handleExport() {
    if (!previewRef.current) {
      setFeedback("Não foi possível localizar o preview para exportação.");
      return;
    }

    try {
      setIsExporting(true);
      setFeedback(null);

      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 1,
        canvasWidth: selectedFormat.width,
        canvasHeight: selectedFormat.height,
        width: selectedFormat.width,
        height: selectedFormat.height,
      });

      const link = document.createElement("a");
      link.download = `card-social-${selectedFormat.value}.png`;
      link.href = dataUrl;
      link.click();

      setFeedback("Arte exportada com sucesso para PNG.");
    } catch {
      setFeedback("Falha ao exportar a arte. Tente novamente em instantes.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="panel-sheen rounded-[1.8rem] p-6 sm:p-8">
        <div className="border-b border-border/70 pb-6">
          <p className="text-xs uppercase tracking-[0.45em] text-foreground-soft">
            Configuração criativa
          </p>
          <h2 className="mt-4 font-display text-4xl text-foreground">Gerador de Cards</h2>
          <p className="mt-4 text-sm leading-7 text-foreground-soft">
            Estruture a mensagem institucional com elegância e exporte a arte final em alta
            definição para publicação imediata.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.28em] text-foreground-soft">
              Título do card
            </span>
            <textarea
              rows={4}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full resize-y rounded-[1.5rem] border border-line-impact/60 bg-background-soft/70 px-4 py-4 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
              placeholder="Digite a mensagem principal da arte."
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.28em] text-foreground-soft">
              Subtítulo opcional
            </span>
            <textarea
              rows={3}
              value={subtitle}
              onChange={(event) => setSubtitle(event.target.value)}
              className="w-full resize-y rounded-[1.5rem] border border-line-impact/60 bg-background-soft/70 px-4 py-4 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
              placeholder="Adicione um complemento elegante para reforçar a mensagem."
            />
          </label>

          <fieldset className="space-y-3">
            <legend className="text-xs uppercase tracking-[0.28em] text-foreground-soft">
              Formato
            </legend>

            <div className="grid gap-3 sm:grid-cols-2">
              {cardFormats.map((item) => {
                const isActive = item.value === selectedFormat.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFormat(item.value)}
                    className={[
                      "rounded-[1.4rem] border p-4 text-left transition",
                      isActive
                        ? "border-line-impact bg-accent/10"
                        : "border-border bg-background-soft/35 hover:border-line-impact/70",
                    ].join(" ")}
                  >
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="mt-2 text-xs leading-6 text-foreground-soft">{item.helper}</p>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="rounded-[1.4rem] border border-border/70 bg-background-soft/35 p-4">
            <p className="text-[10px] uppercase tracking-[0.28em] text-foreground-soft">
              Exportação
            </p>
            <p className="mt-3 text-sm leading-7 text-foreground-soft">
              O download é realizado diretamente no navegador do usuário, preservando as
              proporções oficiais do formato selecionado.
            </p>

            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className={[
                "mt-5 inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm uppercase tracking-[0.24em] transition",
                isExporting
                  ? "border-accent bg-accent/15 text-foreground animate-pulse"
                  : "border-line-impact text-foreground hover:border-accent-soft hover:bg-accent/10",
              ].join(" ")}
            >
              {isExporting ? "Exportando arte..." : "Exportar Arte"}
            </button>

            {feedback ? (
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-foreground-soft">
                {feedback}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="panel-sheen rounded-[1.8rem] p-6 sm:p-8">
        <div className="border-b border-border/70 pb-6">
          <p className="text-xs uppercase tracking-[0.45em] text-foreground-soft">
            Preview em tempo real
          </p>
          <h2 className="mt-4 font-display text-4xl text-foreground">Pré-visualização final</h2>
          <p className="mt-4 text-sm leading-7 text-foreground-soft">
            O card abaixo simula a arte exportada com fundo azul profundo, tipografia serifada
            prateada e contorno sutil em vermelho metálico.
          </p>
        </div>

        <div className="mt-8 rounded-[1.8rem] border border-border/70 bg-black/10 p-4 sm:p-6">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-foreground-soft">
            <span>{selectedFormat.label}</span>
            <span>
              {selectedFormat.width}x{selectedFormat.height}
            </span>
          </div>

          <div className="mt-6 flex justify-center overflow-auto rounded-[1.5rem] bg-background/40 p-4">
            <div style={{ height: `${previewHeight}px` }}>
              <div
                style={{
                  width: `${selectedFormat.width}px`,
                  height: `${selectedFormat.height}px`,
                  transform: `scale(${scale})`,
                  transformOrigin: "top center",
                }}
              >
                <div
                  ref={previewRef}
                  className="relative overflow-hidden"
                  style={{
                    width: `${selectedFormat.width}px`,
                    height: `${selectedFormat.height}px`,
                    border: "3px solid rgba(158, 31, 45, 0.88)",
                    borderRadius: selectedFormat.value === "story" ? "48px" : "32px",
                    background:
                      "radial-gradient(circle at top, rgba(196, 75, 87, 0.09), transparent 28%), linear-gradient(180deg, #0b1730 0%, #081225 58%, #07111f 100%)",
                    boxShadow: "0 32px 90px rgba(0, 0, 0, 0.38)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: "0",
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(158, 31, 45, 0.08) 48%, transparent 100%)",
                      opacity: 0.8,
                    }}
                  />

                  <div
                    style={{
                      position: "relative",
                      zIndex: 1,
                      display: "flex",
                      height: "100%",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding:
                        selectedFormat.value === "story" ? "116px 88px 92px" : "92px 88px 76px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          width: selectedFormat.value === "story" ? "240px" : "200px",
                          height: "3px",
                          background:
                            "linear-gradient(90deg, rgba(158, 31, 45, 0.95), rgba(158, 31, 45, 0.24), transparent)",
                        }}
                      />

                      <p
                        style={{
                          marginTop: selectedFormat.value === "story" ? "80px" : "64px",
                          fontFamily: "var(--font-display), serif",
                          fontSize: selectedFormat.value === "story" ? "86px" : "72px",
                          lineHeight: 1.06,
                          color: "var(--foreground)",
                          letterSpacing: "-0.03em",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {title || "Título principal do card institucional."}
                      </p>

                      <p
                        style={{
                          marginTop: "32px",
                          maxWidth: selectedFormat.value === "story" ? "760px" : "720px",
                          fontFamily: "var(--font-sans), sans-serif",
                          fontSize: selectedFormat.value === "story" ? "34px" : "30px",
                          lineHeight: 1.65,
                          color: "rgba(215, 220, 229, 0.82)",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {subtitle || "Subtítulo opcional para reforço de autoridade, contexto e sofisticação."}
                      </p>
                    </div>

                    <div>
                      <div
                        style={{
                          height: "2px",
                          width: "100%",
                          background:
                            "linear-gradient(90deg, rgba(158, 31, 45, 0), rgba(158, 31, 45, 0.84), rgba(158, 31, 45, 0))",
                        }}
                      />
                      <div
                        style={{
                          marginTop: "28px",
                          display: "flex",
                          alignItems: "flex-end",
                          justifyContent: "space-between",
                          gap: "24px",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              fontFamily: "var(--font-display), serif",
                              fontSize: selectedFormat.value === "story" ? "36px" : "32px",
                              color: "var(--foreground)",
                              letterSpacing: "0.06em",
                            }}
                          >
                            SIMONE MARANGONI
                          </p>
                          <p
                            style={{
                              marginTop: "12px",
                              fontFamily: "var(--font-sans), sans-serif",
                              fontSize: selectedFormat.value === "story" ? "22px" : "20px",
                              color: "rgba(215, 220, 229, 0.7)",
                              letterSpacing: "0.22em",
                              textTransform: "uppercase",
                            }}
                          >
                            Advocacia Boutique
                          </p>
                        </div>

                        <div
                          style={{
                            width: selectedFormat.value === "story" ? "92px" : "82px",
                            height: selectedFormat.value === "story" ? "92px" : "82px",
                            borderRadius: "999px",
                            border: "2px solid rgba(158, 31, 45, 0.72)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "rgba(215, 220, 229, 0.92)",
                            fontFamily: "var(--font-display), serif",
                            fontSize: selectedFormat.value === "story" ? "36px" : "30px",
                          }}
                        >
                          SM
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
