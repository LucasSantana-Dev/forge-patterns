# Forge Space Strategic Positioning (2026-02-24)

## Identity
- **What**: "The Open Full-Stack AI Workspace"
- **Tagline**: "Generate. Integrate. Ship."
- **Problem**: Every AI code tool generates beautiful frontends, but nobody owns the full-stack integration layer (auth, DB, APIs, deployment). That's what Forge Space is.
- **NOT**: a SaaS, a design tool, an AI company, a hosting provider, a marketplace-first

## Differentiation (Competitive Moat)
1. **MCP-Native Architecture** — composable tools via Model Context Protocol, swap AI providers, chain tools, extend with custom servers. Nobody else has this.
2. **True Zero-Cost** — Cloudflare Workers + Supabase + Gemini free tiers support ~50K users at $0/month COGS. Not freemium bait.
3. **Privacy-First BYOK** — client-side AES-256 encryption for API keys. We literally cannot read user keys.
4. **Self-Hostable** — everything runs locally with Docker. Enterprises get full control. MIT licensed.

## Pricing Model
| Tier | Price | Target | Key Limits |
|------|-------|--------|------------|
| Free | $0 forever | Individual devs, students | 10 gen/month, 2 projects, BYOK unlimited |
| Pro | $19/month | Professional developers | 500 gen/month, unlimited projects, multi-LLM |
| Team | $49/month (5 seats) | Small teams, agencies | 2,500 gen/month, shared projects, templates |
| Enterprise | Custom | Companies | Unlimited, SSO, audit logs, on-premise |

## Revenue Streams (prioritized)
1. SaaS subscriptions (Stripe already integrated)
2. Template marketplace (70/30 creator split)
3. Managed MCP Gateway ($25/user/month)
4. Enterprise consulting
5. Sponsorships/partnerships

## Community Strategy: shadcn/ui + Supabase hybrid
- Phase 1 (Now-Month 3): Discord, CONTRIBUTING.md, good first issues, public roadmap, 10+ templates
- Phase 2 (Month 3-6): MCP server directory, template marketplace, monthly community calls
- Phase 3 (Month 6-12): Framework partnerships, university programs, enterprise pilots

## Ecosystem Repos
| Repo | GitHub | Purpose |
|------|--------|---------|
| siza | Forge-Space/siza | AI workspace (Next.js 16, Cloudflare Workers) |
| siza-mcp | Forge-Space/ui-mcp | 12 MCP tools for UI generation |
| mcp-gateway | Forge-Space/mcp-gateway | AI-powered tool routing hub |
| forge-patterns | Forge-Space/core | Shared standards, MCP context server |
| branding-mcp | Forge-Space/branding-mcp | Brand identity generation (7 tools) |

## What We Build Next (Priority Order)
1. Live Preview (iframe sandbox) — immediate
2. Export to GitHub (one-click push) — immediate
3. Template library (20 starter templates) — immediate
4. Documentation site (docs.siza.dev) — month 1-2
5. Discord launch — month 1-2
6. Activate Pro/Team tier in Stripe — month 1-2
7. MCP server directory — month 2-4
8. CLI tool: npx create-siza-app — month 2-4
