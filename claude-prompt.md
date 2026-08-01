# Project Requirements: Flowchart Learning Web Application

## 1. Project Overview
Build a full-stack web application for learning how to create flowcharts. The system contains 100 programming problems categorized by type (Sequence, Condition, Loop) and sorted from easy to hard. Users can read the problem, view the pseudo-code, and build a flowchart using a drag-and-drop canvas. An AI (Gemini) will evaluate their flowchart and provide hints. Admins can log in to view statistics and manage problems.

## 2. Tech Stack
- **Framework:** Next.js (App Router)
- **Deployment:** Vercel
- **Database & Auth:** Supabase (PostgreSQL, Supabase Auth)
- **AI Integration:** Google Gemini API (for evaluating flowcharts and generating feedback)
- **Flowchart UI:** React Flow (or `@xyflow/react`)
- **Exporting:** `html2canvas` (for JPEG) and `jspdf` (for PDF)
- **Styling:** Tailwind CSS

## 3. User Roles & Authentication
- **Student (User):** 
  - No login required. 
  - Track user sessions using a generated UUID stored in LocalStorage.
- **Admin:** 
  - Login required. 
  - **Hardcoded/Seeded Credentials for setup:** 
    - Username/Email: `admin` (or `admin@admin.com` for Supabase compatibility)
    - Password: `123456`

## 4. Database Schema (Supabase)
Please generate SQL scripts or Prisma/Drizzle schemas (if used) for the following:
1. `problems` table: `id`, `title`, `description`, `difficulty_level` (1-100), `type` (sequence, condition, loop), `pseudocode`, `created_at`.
2. `user_attempts` table: `id`, `session_id` (string from localstorage), `problem_id` (FK), `status` (pass/fail), `ai_feedback`, `created_at`.

## 5. Core Features & Pages

### 5.1 User Frontend (Public)
- **`/` (Home):** 
  - Display the list of 100 problems.
  - Group or filter by type (Sequence, Condition, Loop).
  - Sort by difficulty level.
- **`/problem/[id]` (Workspace):**
  - **Left Panel:** Problem description and the pseudo-code.
  - **Center Panel (Canvas):** A React Flow workspace where users can drag and drop flowchart nodes (Start, Process, Decision, Loop, End) and connect them with edges.
  - **Right Panel (AI Assistant):** A button to "Check Answer". When clicked, send the flowchart data (Nodes & Edges in JSON format) + the problem's pseudo-code to the Gemini API. Display the AI's feedback here.
  - **Export Features:** Add two buttons on the canvas to "Export as JPEG" and "Export as PDF" using `html2canvas` and `jspdf`.

### 5.2 Admin Frontend (Protected Route)
- **`/admin/login`:** 
  - Simple login form (Username/Password).
- **`/admin/dashboard`:** 
  - Display system statistics (total attempts, pass/fail ratio).
  - Show a list of problems that users fail the most.
  - Show usage statistics grouped by problem type.
- **`/admin/problems`:** 
  - CRUD interface to manage the 100 problems (Add, Edit, Delete).
  - Include an AI button here: "Auto-generate pseudocode" using Gemini API based on the problem description.

### 5.3 Backend API (Next.js Route Handlers)
- **`POST /api/evaluate`:** 
  - Receives `flowchartJson` and `pseudocode`.
  - Prompts Gemini API to act as a strict but encouraging programming teacher. It must evaluate the logic, compare it to the pseudo-code, and return JSON containing `{ "status": "pass" | "fail", "feedback": "string" }`. The feedback must NOT give direct answers but provide hints.
- **`GET /api/stats`:** 
  - Fetch aggregated data from Supabase for the Admin Dashboard.

## 6. UI/UX & Global Components
- Use a clean, modern interface suitable for education.
- **Footer Requirement:** Every page must include the following exact footer text at the bottom:
  `Copyright © 2026 Nimit Trakoonta. All Rights Reserved.`

## 7. Instructions for Claude
1. Start by initializing the Next.js project structure and defining the Supabase SQL schema.
2. Implement the API routes for Gemini and Supabase interactions.
3. Build the React Flow components for the workspace.
4. Integrate the PDF/JPEG export functions.
5. Create the Admin Dashboard and auth guard.
6. Provide clear instructions on environment variables needed (e.g., `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`).