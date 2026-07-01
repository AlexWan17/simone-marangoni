"use client";

export function PrintSheetButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center justify-center rounded-full border border-black px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-black transition hover:bg-black hover:text-white print:hidden"
    >
      Imprimir ficha
    </button>
  );
}
