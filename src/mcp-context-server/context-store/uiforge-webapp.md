# Siza — Project Context

**Version:** 0.48.0  
**Last Updated:** 2026-03-16  
**Repository:** [Forge-Space/siza](https://github.com/Forge-Space/siza)  
**Status:** CI green, 85%+ test coverage, 0 open PRs

---

## Overview

Siza is the flagship Forge Space AI workspace — a Next.js 16 web application that lets developers generate, refine, and deploy full-stack code using a BYOK (Bring Your Own Key) AI model approach. It is self-hostable, MCP-native, and ships with an IDP governance layer via `@forgespace/core`.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, RSC, Server Actions) |
| Language | TypeScript 5.7 |
| Auth + DB | Supabase |
| Edge API | Cloudflare Workers |
| AI | BYOK — Gemini, Claude, GPT-4o (user-supplied keys) |
| Styling | Tailwind CSS v4 (`--forge-*` tokens) |
| Testing | Vitest + Playwright (E2E) |
| Package | npm workspaces |

---

## Key Features

- **AI Code Generation** — multi-model, BYOK (no vendor lock-in)
- **MCP-Native** — connects to forge-ui MCP server (`@forgespace/ui-mcp`)
- **IDP Governance** — forge-scorecard, forge-audit, forge-features via `@forgespace/core`
- **Theme Generator** — design token generation with `@forgespace/branding-mcp`
- **Self-Hostable** — Docker + Cloudflare Workers, zero forced cloud dependency
- **Interactive Landing** — CodeShowcase diff/hover view, split-panel auth layout

---

## Architecture

```
siza/
├── app/           # Next.js App Router (RSC + Server Actions)
├── components/    # UI components (Tailwind v4, --forge-* tokens)
├── lib/           # Supabase client, AI providers, edge utilities
├── workers/       # Cloudflare Workers edge functions
└── e2e/           # Playwright E2E tests
```

**Dependencies:**
- `@forgespace/siza-gen` v0.13.2 — AI generation engine
- `@forgespace/core` v1.13.0 — IDP patterns + shared constants
- `@forgespace/ui-mcp` v0.24.5 — MCP tool adapter (21 tools)

---

## Design System

Design tokens use `--forge-*` prefix (Phase 2 complete — migrated from `--siza-*`). Theme generation handled by `@forgespace/branding-mcp` v0.15.0.

---

## Dev Commands

```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build (tsc + next build)
npm test             # Vitest unit tests
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
npx playwright test  # E2E tests
```

---

## Ecosystem Integrations

| Package | Version | Role |
|---------|---------|------|
| @forgespace/siza-gen | 0.13.2 | AI generation engine |
| @forgespace/core | 1.13.0 | IDP governance, shared patterns |
| @forgespace/ui-mcp | 0.24.5 | MCP tools (21 tools) |
| @forgespace/branding-mcp | 0.15.0 | Brand token generation |

---

## Current State (2026-03-16)

- 0 open PRs, 0 open issues
- CI: green across all required checks
- Coverage: 85%+ (Vitest unit + Playwright E2E)
- Recent merges: PR #532 (CodeShowcase interactive diff), PR #533 (split-panel auth layout + trust signals)
- NLnet NGI Zero Commons Fund application in progress (deadline April 1 2026)
