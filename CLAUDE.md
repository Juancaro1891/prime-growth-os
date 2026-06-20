# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

PRIME GROWTH OS (`prime-growth-os`) — an AI-powered marketing/growth dashboard for Latin American SMBs, built with Next.js App Router. The UI and all AI prompts are in Spanish (Latin American Spanish, "es-CO" locale). The product pitches itself as an AI "Director de Marketing" (CMO copilot).

## Commands

```bash
npm run dev      # start dev server (next dev)
npm run build    # production build
npm run start    # run production build
npm run lint     # next lint
```

There is no test suite or test runner configured in this repo.

## Environment variables

Required at runtime (set in `.env.local`, gitignored, not present in the repo):

- `ANTHROPIC_API_KEY` — used directly via raw `fetch` calls to `https://api.anthropic.com/v1/messages` (see Architecture below), not just via the SDK.
- `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_URL` — Supabase REST endpoint for the `leads` table.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_ANON_KEY` — Supabase anon key. Each var is read with a `NEXT_PUBLIC_*` fallback to a non-public name (see `app/api/leads/route.ts`).

There's no Supabase schema/migration file in the repo — the `leads` table (columns: `id`, `created_at`, `name`, `email`, `phone`, `source`, `stage`, `value`, `notes`) exists only in the Supabase project itself.

## Architecture

**Routing has two parallel trees.** Every top-level route under `app/<name>/page.tsx` (e.g. `app/dashboard`, `app/crm`, `app/analytics`, ...) is just a `redirect()` stub pointing to `app/dashboard-layout/<name>/page.tsx`, where the real page and its sidebar chrome live. This split exists so `app/dashboard-layout/layout.tsx` can wrap all real pages in the shared `<Sidebar />` without affecting the root layout. **When asked to modify a page, edit the file under `app/dashboard-layout/`, not the top-level redirect stub.**

**Pages fall into two categories:**
- *Live/wired*: `dashboard` (chat), `analyzer`, `creatives`, `crm` call real API routes (`/api/chat`, `/api/analyze-business`, `/api/generate-copy`, `/api/leads`).
- *Static mocks*: `analytics`, `automation`, `campaigns`, `landings`, `playbooks`, `whatsapp` render hardcoded in-file sample data (gym-business scenario) with no backend calls. Don't assume there's a hidden API behind their numbers — there isn't.

**AI calls bypass the Anthropic SDK.** All `app/api/*/route.ts` handlers call `https://api.anthropic.com/v1/messages` directly via `fetch` (commit "Fix API routes - use fetch instead of SDK"), each with its own inline `SYSTEM_PROMPT`/prompt string. `lib/anthropic.ts` exports an `Anthropic` SDK client and a `SYSTEM_PROMPT` but **is dead code — nothing imports it**. The canonical, currently-used system prompt for the chat copilot lives in `app/api/chat/route.ts`, not in `lib/anthropic.ts`; keep both in sync (or remove the unused one) if you change the assistant's persona/instructions.

**Supabase access is hand-rolled REST, no SDK.** `app/api/leads/route.ts` talks to Supabase's PostgREST endpoint (`${url}/rest/v1/leads`) directly via `fetch` with `apikey`/`Authorization` headers — there is no `@supabase/supabase-js` dependency. CRM UI (`app/dashboard-layout/crm/page.tsx`) calls this route for list/create/patch (stage changes via Kanban or detail panel).

**JSON-from-LLM parsing pattern**: `analyze-business` and `generate-copy` routes prompt Claude to return raw JSON, strip ` ```json ` fences with a regex, then `JSON.parse` the result. There's no schema validation beyond that — if you add a new structured-output route, follow the same strip-then-parse convention used there.

**Chat streaming**: `app/api/chat/route.ts` proxies Anthropic's SSE stream, parsing `content_block_delta` events and re-emitting just the text deltas as a plain chunked `text/plain` stream (not SSE) — the client (`app/dashboard-layout/dashboard/page.tsx`) reads it with a raw `ReadableStream` reader, not an SSE/event-source client.

**Styling**: Tailwind only, dark theme hardcoded (`bg-[#0a0a0f]`, violet/purple accents). No CSS modules or styled-components. `lib/utils.ts#cn()` (clsx + tailwind-merge) is the standard way to compose conditional class names — used throughout `components/`.

**Path alias**: `@/*` maps to the repo root (see `tsconfig.json`), e.g. `@/lib/utils`, `@/components/sidebar`.
