import type { ProblemType } from "@/lib/types";

export function validateProblemBody(body: Record<string, unknown>) {
  const { title, description, difficulty_level, type, pseudocode } = body;
  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof description !== "string" ||
    !description.trim() ||
    typeof pseudocode !== "string" ||
    !pseudocode.trim() ||
    typeof difficulty_level !== "number" ||
    difficulty_level < 1 ||
    difficulty_level > 100 ||
    !["sequence", "condition", "loop"].includes(type as string)
  ) {
    return null;
  }
  return {
    title: title.trim(),
    description: description.trim(),
    pseudocode: pseudocode.trim(),
    difficulty_level,
    type: type as ProblemType,
  };
}
