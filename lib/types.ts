export type ProblemType = "sequence" | "condition" | "loop";

export type AttemptStatus = "pass" | "fail";

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty_level: number;
  type: ProblemType;
  pseudocode: string;
  created_at: string;
}

export interface UserAttempt {
  id: string;
  session_id: string;
  problem_id: string;
  status: AttemptStatus;
  ai_feedback: string | null;
  created_at: string;
}

export interface FlowchartNodeData {
  label: string;
  [key: string]: unknown;
}

export interface FlowchartJson {
  nodes: Array<{
    id: string;
    type?: string;
    position: { x: number; y: number };
    data: FlowchartNodeData;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    sourceHandle?: string | null;
    targetHandle?: string | null;
    label?: string;
  }>;
}

export interface EvaluateResult {
  status: AttemptStatus;
  feedback: string;
}

export interface Stats {
  totalAttempts: number;
  passCount: number;
  failCount: number;
  hardestProblems: Array<{
    problem_id: string;
    title: string;
    type: ProblemType;
    attempts: number;
    fails: number;
    failRate: number;
  }>;
  byType: Array<{
    type: ProblemType;
    attempts: number;
    passCount: number;
    failCount: number;
  }>;
}
