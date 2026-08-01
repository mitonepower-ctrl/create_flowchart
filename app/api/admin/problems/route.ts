import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/requireAdmin";
import { validateProblemBody } from "@/lib/validateProblem";

export async function GET() {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("problems")
    .select("*")
    .order("difficulty_level", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const valid = body && validateProblemBody(body);
  if (!valid) {
    return NextResponse.json({ error: "ข้อมูลโจทย์ไม่ถูกต้อง" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("problems")
    .insert(valid)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
