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
- `REPLICATE_API_KEY` — used directly via raw `fetch` to `https://api.replicate.com/v1/models/black-forest-labs/flux-pro/predictions` (Flux Pro) in `app/api/generate-image/route.ts`, sent as `Authorization: Token <key>`. Same no-SDK convention as the Anthropic calls. Replicate predictions are async: the route polls the returned `urls.get` endpoint every 2s (60s max) until `status` is `succeeded`, then returns `output[0]` (or `output` if it's already a string).
- `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_URL` — Supabase REST endpoint, shared by the `leads` table and the `meta_accounts` table.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_ANON_KEY` — Supabase anon key, used for the `leads` table. Each var is read with a `NEXT_PUBLIC_*` fallback to a non-public name (see `app/api/leads/route.ts`).
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service-role key, used **only** by `lib/meta.ts` (server-side, never exported to the client) to read/write the `meta_accounts` table. That table holds live Meta access tokens with `ads_management` scope, so it's deliberately kept off the anon key + RLS-less path the `leads` table uses — `meta_accounts` has RLS enabled with no public policies, so only the service-role key (which bypasses RLS) can touch it.
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` — Clerk auth. See `middleware.ts` and the Architecture section below.
- `META_APP_ID` / `META_APP_SECRET` / `META_REDIRECT_URI` — Meta (Facebook) Marketing API OAuth app credentials, used in `app/api/meta/*` routes. `META_REDIRECT_URI` must exactly match the OAuth redirect URI configured in the Meta App dashboard (currently `https://prime-growth-os.vercel.app/api/meta/callback`).

If a key is missing/invalid, `process.env.X` resolves to `undefined`, which gets fetch-serialized into the auth header as the literal string `"undefined"` — the upstream API then rejects it with a generic auth error (e.g. Anthropic's "invalid x-api-key"). That symptom means a missing/wrong env var, not a code bug — check `.env.local` actually has content before debugging the route logic. `next dev` only reads `.env.local` at startup, so a key added while the dev server is already running needs a restart to take effect.

There's no Supabase schema/migration file in the repo:
- `leads` (columns: `id`, `created_at`, `name`, `email`, `phone`, `source`, `stage`, `value`, `notes`) exists only in the Supabase project itself, accessed via the anon key with (presumably) permissive/no RLS.
- `meta_accounts` (columns: `id`, `user_id` [Clerk user id, unique], `access_token`, `expires_at`, `ad_account_id`, `ad_account_name`, `created_at`, `updated_at`) also only exists in the Supabase project — RLS is enabled with no policies, so it's only reachable via the service-role key from `lib/meta.ts`.

## Architecture

**Routing has two parallel trees.** Every top-level route under `app/<name>/page.tsx` (e.g. `app/dashboard`, `app/crm`, `app/analytics`, ...) is just a `redirect()` stub pointing to `app/dashboard-layout/<name>/page.tsx`, where the real page and its sidebar chrome live. This split exists so `app/dashboard-layout/layout.tsx` can wrap all real pages in the shared `<Sidebar />` without affecting the root layout. **When asked to modify a page, edit the file under `app/dashboard-layout/`, not the top-level redirect stub.**

**Pages fall into two categories:**
- *Live/wired*: `dashboard` (chat), `analyzer`, `creatives`, `strategy`, `images`, `crm` call real API routes (`/api/chat`, `/api/analyze-business`, `/api/generate-copy`, `/api/generate-strategy`, `/api/generate-image`, `/api/leads`).
- *Static mocks*: `analytics`, `automation`, `campaigns`, `landings`, `playbooks`, `whatsapp` render hardcoded in-file sample data (gym-business scenario) with no backend calls. Don't assume there's a hidden API behind their numbers — there isn't.

**Two standalone public pages bypass the dashboard tree entirely**: `app/landing/page.tsx` (marketing/sales page) and `app/lead-capture/page.tsx` (generic embeddable lead form). Both live directly under `app/`, not under `app/dashboard-layout/`, so they render through the bare root layout with no `<Sidebar/>` — each has its own `layout.tsx` sibling only to set page-specific `<title>`/meta.

**Auth is Clerk, enforced in `middleware.ts` (repo root, not `app/middleware.ts` — Next.js only picks up middleware at the project root).** `clerkMiddleware` + `createRouteMatcher(["/dashboard-layout(.*)"])` calls `auth.protect()` only for `/dashboard-layout/*`; everything else (`/landing`, `/lead-capture`, `/api/leads`, `/sign-in`, `/sign-up`, and all other `/api/*` routes) is reachable without a session at the middleware level. Individual `/api/*` route handlers that need a real user (currently `app/api/meta/*`) call `auth()` themselves and return 401 — the middleware running on `/api/*` only attaches Clerk's auth context, it doesn't block anything there. `app/layout.tsx` wraps the app in `<ClerkProvider>`. Custom-styled sign-in/up pages live at `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx` (catch-all routes, required by Clerk's `<SignIn>`/`<SignUp>` components for multi-step flows), sharing one `appearance` theme object from `lib/clerk-appearance.ts`. `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up` are required in env — without them `auth.protect()` redirects to Clerk's hosted Account Portal instead of these pages.

**AI calls bypass the Anthropic SDK.** All `app/api/*/route.ts` handlers call `https://api.anthropic.com/v1/messages` directly via `fetch` (commit "Fix API routes - use fetch instead of SDK"), each with its own inline `SYSTEM_PROMPT`/prompt string. `lib/anthropic.ts` exports an `Anthropic` SDK client and a `SYSTEM_PROMPT` but **is dead code — nothing imports it**. The canonical, currently-used system prompt for the chat copilot lives in `app/api/chat/route.ts`, not in `lib/anthropic.ts`; keep both in sync (or remove the unused one) if you change the assistant's persona/instructions.

**Supabase access is hand-rolled REST, no SDK.** `app/api/leads/route.ts` talks to Supabase's PostgREST endpoint (`${url}/rest/v1/leads`) directly via `fetch` with `apikey`/`Authorization` headers — there is no `@supabase/supabase-js` dependency. CRM UI (`app/dashboard-layout/crm/page.tsx`) calls this route for list/create/patch (stage changes via Kanban or detail panel).

**JSON-from-LLM parsing pattern**: `analyze-business`, `generate-copy`, and `generate-strategy` routes prompt Claude to return raw JSON, strip ` ```json ` fences with a regex, then `JSON.parse` the result. There's no schema validation beyond that — if you add a new structured-output route, follow the same strip-then-parse convention used there. `generate-strategy` additionally falls back to extracting a `{...}` substring via regex if the direct parse fails, and logs the raw model output on any failure — worth copying into new routes with large/nested JSON schemas, since bigger schemas are more likely to get truncated by `max_tokens` mid-response.

**`generate-image` doesn't need the strip-fence dance** — it calls Replicate's Flux Pro model (`app/api/generate-image/route.ts`), which returns structured JSON natively, no markdown-wrapped text to parse. Replicate predictions are async (create + poll `urls.get` until `succeeded`), and the resulting image URL is temporary (Replicate-hosted, expires after a while), so the frontend (`app/dashboard-layout/images/page.tsx`) fetches the URL client-side into a blob before triggering a download — a plain `<a download>` won't force-download a cross-origin URL.

**Meta (Facebook) Ads integration lives under `app/api/meta/*`, sharing helpers from `lib/meta.ts`.** OAuth flow: `GET /api/meta/auth` requires a Clerk session, generates a random `state`, stores it in an httpOnly `meta_oauth_state` cookie, and 302s to Facebook's OAuth dialog with `scope=ads_management,ads_read,business_management`. `GET /api/meta/callback` (the configured `META_REDIRECT_URI`) verifies `state` against that cookie (CSRF check), exchanges `code` for a short-lived token, exchanges that for a long-lived (~60 day) token, fetches the user's first ad account via `/me/adaccounts`, and upserts `{ user_id, access_token, expires_at, ad_account_id, ad_account_name }` into `meta_accounts` keyed on `user_id` (Clerk id) — then redirects to `/dashboard-layout/dashboard?meta_connected=true` (or `?meta_error=<reason>`). `GET /api/meta/campaigns` and `POST /api/meta/create-campaign` both call `getMetaAccount(userId)` to look up the stored token/ad account and proxy straight to the Marketing API (`${ad_account_id}/campaigns`); there's no per-request `adAccountId` param — it's always whichever ad account was first returned by `/me/adaccounts` at connect time. `create-campaign` defaults `status` to `PAUSED` if the caller doesn't specify one, so wiring up the route can't accidentally start real ad spend. None of the four routes have a frontend page yet — they're API-only.

**Lead `source` values are an evolving, ungoverned string enum.** `app/dashboard-layout/crm/page.tsx` keeps a local `sourceColors` map and a hardcoded option list for the "new lead" modal; anything posting to `/api/leads` from outside the CRM (the `/landing` and `/lead-capture` public forms) invents its own `source` string ("Landing", "Formulario Web"). When adding a new lead-capturing surface, add its source string to both `sourceColors` and the select options in `crm/page.tsx` too, or it'll just render with the gray fallback badge.

**Chat streaming**: `app/api/chat/route.ts` proxies Anthropic's SSE stream, parsing `content_block_delta` events and re-emitting just the text deltas as a plain chunked `text/plain` stream (not SSE) — the client (`app/dashboard-layout/dashboard/page.tsx`) reads it with a raw `ReadableStream` reader, not an SSE/event-source client.

**Styling**: Tailwind only, dark theme hardcoded (`bg-[#0a0a0f]`, violet/purple accents). No CSS modules or styled-components. `lib/utils.ts#cn()` (clsx + tailwind-merge) is the standard way to compose conditional class names — used throughout `components/`.

**Path alias**: `@/*` maps to the repo root (see `tsconfig.json`), e.g. `@/lib/utils`, `@/components/sidebar`.
