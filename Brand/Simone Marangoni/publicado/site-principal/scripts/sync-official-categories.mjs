import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const envPath = path.join(process.cwd(), ".env.local");
const envText = fs.readFileSync(envPath, "utf8");
const env = {};

for (const line of envText.split(/\r?\n/)) {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith("#")) {
    continue;
  }

  const separatorIndex = trimmed.indexOf("=");

  if (separatorIndex === -1) {
    continue;
  }

  const key = trimmed.slice(0, separatorIndex).trim();
  const value = trimmed.slice(separatorIndex + 1).trim();
  env[key] = value.replace(/^['"]|['"]$/g, "");
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  },
);

const tenantId = env.DEFAULT_TENANT_ID ?? "4a0fae57-c55d-4f68-9b43-7f50b5d7659e";

const categories = [
  "Franchising & Expansão de Negócios",
  "Advocacia Corporativa & Riscos Empresariais",
  "Direito de Família & Sucessões",
  "Direito das Neurodivergências (TEA, TDAH, TOD)",
  "Direito Médico & Defesa do Paciente",
  "Direito Previdenciário & Proteção Social",
  "Direito do Trabalho Estratégico",
];

const createSlug = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

const payload = categories.map((name) => ({
  tenant_id: tenantId,
  name,
  slug: createSlug(name),
}));

const { error } = await supabase.from("categories").upsert(payload, {
  onConflict: "tenant_id,slug",
  ignoreDuplicates: false,
});

if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log(`Categorias sincronizadas: ${payload.length}`);
