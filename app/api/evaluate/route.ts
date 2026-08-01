import { NextResponse } from "next/server";
import { evaluateFlowchart } from "@/lib/gemini";
import { createAdminClient } from "@/lib/supabase/admin";
import type { FlowchartJson } from "@/lib/types";

export async function POST(request: Request) {
  let body: {
    problemId?: string;
    sessionId?: string;
    pseudocode?: string;
    flowchart?: FlowchartJson;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { problemId, sessionId, pseudocode, flowchart } = body;

  if (!problemId || !sessionId || !pseudocode || !flowchart) {
    return NextResponse.json(
      { error: "problemId, sessionId, pseudocode and flowchart are required" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const { data: problem } = await admin
    .from("problems")
    .select("id, title")
    .eq("id", problemId)
    .single();

  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  let result;
  try {
    result = await evaluateFlowchart(problem.title, pseudocode, flowchart);
  } catch (err) {
    console.error("Gemini evaluate error", err);
    return NextResponse.json(
      { error: "AI evaluation failed. Please try again shortly." },
      { status: 502 }
    );
  }

  const { error: insertError } = await admin.from("user_attempts").insert({
    session_id: sessionId,
    problem_id: problemId,
    status: result.status,
    ai_feedback: result.feedback,
  });

  if (insertError) {
    console.error("Failed to record attempt", insertError);
  }

  return NextResponse.json(result);
}
