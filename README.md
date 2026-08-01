# Flowchart Learning App

A full-stack app for practicing flowcharts: read a problem's pseudocode, build
the matching flowchart on a drag-and-drop canvas, and get AI feedback from
Gemini. Admins can log in to manage the 100-problem bank and view usage
statistics.

## Tech stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres + Auth) for data and admin login
- Google Gemini API for flowchart evaluation and pseudocode generation
- `@xyflow/react` (React Flow) for the canvas
- `html2canvas-pro` + `jspdf` for JPEG/PDF export (the `-pro` fork is required: Tailwind v4's `oklch()`/`lab()` colors aren't supported by vanilla `html2canvas`)

## 1. Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Where to get it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project → Project Settings → API → Project URL (`https://<ref>.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project → Project Settings → API → the publishable/anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project → Project Settings → API → the secret/service role key. **Server-only, never expose to the client.** |
| `GEMINI_API_KEY` | https://aistudio.google.com/apikey |
| `GEMINI_MODEL` | Optional, defaults to `gemini-flash-latest`. Override if you want a specific model. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Credentials for the seeded admin account (defaults: `admin@admin.com` / `123456`) |

`.env.local` is git-ignored and never committed.

## 2. Database schema

In the Supabase dashboard, open **SQL Editor** and run [`supabase/schema.sql`](supabase/schema.sql).
This creates the `problems` and `user_attempts` tables, indexes, and Row Level
Security policies (public read on `problems`; all writes go through the
server API using the service role key).

## 3. Install & seed

```bash
npm install
npm run seed
```

`npm run seed` will:
1. Create the admin auth user (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) via the Supabase Auth admin API, if it doesn't already exist.
2. Insert the 100 seed problems (34 sequence, 33 condition, 33 loop) if the `problems` table is empty.

It's safe to re-run — it skips work that's already done.

## 4. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000` for the student view, or
`http://localhost:3000/admin/login` to sign in as admin.

## Project structure

- `app/` — pages and API routes (App Router)
  - `app/problem/[id]` — the flowchart workspace (canvas + AI check + export)
  - `app/admin/*` — protected admin dashboard and problem CRUD
  - `app/api/evaluate` — POST: sends the flowchart + pseudocode to Gemini, records the attempt
  - `app/api/stats` — GET: aggregated stats for the admin dashboard
  - `app/api/stats/reset` — DELETE: admin-only, clears all rows in `user_attempts`
  - `app/api/admin/*` — problem CRUD + AI pseudocode generation (admin-only)
- `components/workspace/` — React Flow canvas, node types, node palette, AI panel, export buttons
- `lib/supabase/` — browser / server / admin (service-role) Supabase clients
- `lib/gemini.ts` — Gemini prompt wrappers
- `scripts/seed.mts` + `scripts/seed-data.ts` — seed script and the 100 problem definitions
- `supabase/schema.sql` — database schema + RLS policies

## Deployment (Vercel)

1. Push this repo to GitHub and import it into Vercel.
2. Add the same environment variables from step 1 in the Vercel project settings.
3. Run the schema SQL and `npm run seed` against your production Supabase project (seeding can be run locally with `.env.local` pointed at the same project — it just needs network access to Supabase, not to Vercel).
