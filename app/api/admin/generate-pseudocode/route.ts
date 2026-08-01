import { NextResponse } from "next/server";
import { generatePseudocode } from "@/lib/gemini";
import { requireAdmin } from "@/lib/requireAdmin";

export async function POST(request: Request) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const title = body?.title;
  const description = body?.description;
  const type = body?.type;

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof description !== "string" ||
    !description.trim() ||
    typeof type !== "string"
  ) {
    return NextResponse.json(
      { error: "title, description and type are required" },
      { status: 400 }
    );
  }

  try {
    const pseudocode = await generatePseudocode(title, description, type);
    return NextResponse.json({ pseudocode });
  } catch (err) {
    console.error("Gemini generate-pseudocode error", err);
    return NextResponse.json(
      { error: "AI generation failed. Please try again shortly." },
      { status: 502 }
    );
  }
}
