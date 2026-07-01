import { NextResponse } from "next/server";

type OracleRequestBody = {
  messages?: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
};

function buildPlaceholderResponse(prompt: string) {
  return [
    "Análise preliminar estruturada:",
    "",
    `1. Contexto central: ${prompt}`,
    "2. Vetores de risco: mapeie prova documental, cronologia, legitimidade e vulnerabilidades de narrativa.",
    "3. Linha de defesa ou ataque: organize tese principal, tese subsidiária e precedente dominante da matéria.",
    "4. Próximo passo sugerido: consolidar fatos, documentos-chave, pedidos e eventual matriz de contestação.",
    "",
    "Observação técnica: esta rota já está preparada para receber integração futura com provedores LLM de alto raciocínio jurídico, substituindo este retorno placeholder por inferência real.",
  ].join("\n");
}

export async function POST(request: Request) {
  const body = (await request.json()) as OracleRequestBody;
  const lastUserMessage = [...(body.messages ?? [])]
    .reverse()
    .find((message) => message.role === "user");

  const prompt = lastUserMessage?.content?.trim();

  if (!prompt) {
    return NextResponse.json(
      { error: "Nenhum prompt jurídico foi enviado." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    message: buildPlaceholderResponse(prompt),
  });
}
