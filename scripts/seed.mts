import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import {
  sequenceProblems,
  conditionProblems,
  loopProblems,
  type SeedProblem,
} from "./seed-data";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL || "admin@admin.com";
const adminPassword = process.env.ADMIN_PASSWORD || "123456";

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function spreadDifficulty(
  index: number,
  count: number,
  min: number,
  max: number
) {
  if (count <= 1) return min;
  const value = min + (index * (max - min)) / (count - 1);
  return Math.round(value);
}

function buildProblems(
  list: SeedProblem[],
  type: "sequence" | "condition" | "loop",
  min: number,
  max: number
) {
  return list.map((p, i) => ({
    title: p.title,
    description: p.description,
    pseudocode: p.pseudocode,
    type,
    difficulty_level: spreadDifficulty(i, list.length, min, max),
  }));
}

async function seedAdminUser() {
  const { data: existing } = await supabase.auth.admin.listUsers();
  const alreadyExists = existing?.users?.some((u) => u.email === adminEmail);

  if (alreadyExists) {
    console.log(`Admin user ${adminEmail} already exists, skipping.`);
    return;
  }

  const { error } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
  });

  if (error) {
    console.error("Failed to create admin user:", error.message);
    process.exit(1);
  }

  console.log(`Created admin user: ${adminEmail}`);
}

async function seedProblems() {
  const { count } = await supabase
    .from("problems")
    .select("*", { count: "exact", head: true });

  if (count && count > 0) {
    console.log(`problems table already has ${count} rows, skipping insert.`);
    return;
  }

  const rows = [
    ...buildProblems(sequenceProblems, "sequence", 1, 76),
    ...buildProblems(conditionProblems, "condition", 30, 140),
    ...buildProblems(loopProblems, "loop", 60, 200),
  ];

  console.log(`Inserting ${rows.length} problems...`);

  const { error } = await supabase.from("problems").insert(rows);
  if (error) {
    console.error("Failed to insert problems:", error.message);
    process.exit(1);
  }

  console.log("Problems seeded successfully.");
}

async function main() {
  await seedAdminUser();
  await seedProblems();
  console.log("Seed complete.");
}

main();
