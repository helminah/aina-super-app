# AINA — Claude Code Guide

## Build & Dev Commands

```bash
npm run dev:full      # Vite (port 5173) + Express proxy (port 3001) in parallel
npm run dev           # Frontend only
npm run server        # Express proxy only
npm run build         # TypeScript check + Vite production build
npm run lint          # ESLint
```

## Architecture

```
aina-super-app/
├── server/
│   ├── index.js              # Express proxy (dev) — 4 routes: nutrition, redflag, chat, normalize-shopping
│   ├── ai.js                 # Anthropic client, MODEL='claude-opus-4-7', callClaude(), extractJson()
│   └── prompts.js            # System prompts: NUTRITION_SYSTEM, CHAT_SYSTEM, REDFLAG_SYSTEM
├── api/                      # Vercel serverless functions (production)
│   ├── chat.js               # SSE streaming chat — maxDuration: 60s
│   ├── nutrition.js          # Recipe + weekly plan generation
│   ├── redflag.js            # Medical triage with Extended Thinking
│   ├── normalize-shopping.js # Shopping list normalization
│   └── shopping-pdf.js       # Categorized shopping list
├── src/
│   ├── App.tsx               # React Router + React.lazy code splitting
│   ├── pages/                # 11 pages (lazy-loaded)
│   ├── components/
│   │   ├── AIChatAssistant.tsx   # Streaming SSE chatbot with vision
│   │   └── health/AIRedFlagChecker.tsx  # Vision + Extended Thinking triage
│   ├── data/
│   │   ├── vaccines.ts       # 31-country vaccine database (PEV/CDC/European)
│   │   ├── food-guide.ts     # WHO food introduction guide by age
│   │   └── emergency-numbers.ts  # Emergency numbers for 30 countries
│   ├── lib/anthropic.ts      # Frontend API client (streamChatMessage, generateRecipe...)
│   └── i18n/locales/         # FR / EN / MG (Malagasy) / WO (Wolof)
└── public/
    ├── aina-ia.jpg           # AINA IA avatar
    └── helminah.png          # Dr Helminah photo
```

## Anthropic / Claude Opus 4.7 Features Used

| Feature | Where | Notes |
|---|---|---|
| **Extended Thinking** (adaptive) | `api/redflag.js` | `thinking: { type: 'adaptive' }, output_config: { effort: 'high' }` |
| **Vision multimodal** | `/api/redflag` + `/api/chat` | `imageBase64` + `imageMediaType` in request body |
| **SSE Streaming** | `/api/chat` | `anthropic.messages.stream()` — tokens sent as `data: {"token":"..."}` |
| **Prompt caching** | All routes | `cache_control: { type: 'ephemeral' }` on system prompts |
| **Multilingual** | `server/prompts.js` | CHAT_SYSTEM detects parent's language and responds in it |

## Key Constraints

- **API key never in client bundle** — all Anthropic calls go through Express/Vercel proxy
- **No diagnosis ever** — enforced at system prompt level AND server-side disclaimer injection
- **Medical disclaimer** — forced server-side on every redflag response regardless of model output
- `temperature` parameter is **deprecated** for claude-opus-4-7 — do not add it
- Extended Thinking syntax for Opus 4.7: `thinking: { type: 'adaptive' }` (NOT `enabled` + `budget_tokens`)

## Environment Variables

```bash
ANTHROPIC_API_KEY=sk-ant-...   # Server-side only — never prefix with VITE_
VITE_API_URL=                  # Empty in production (same-origin). http://localhost:3001 in dev (via vite proxy)
```

## Testing & Validation Norms

```bash
npm run build   # TypeScript strict check — must pass with 0 errors before any PR
npm run lint    # ESLint — no warnings allowed on AI/medical components
```

**Manual smoke tests before deploy:**
1. `curl https://aina-super-app.vercel.app/api/health` → `{"ok":true,"model":"claude-opus-4-7"}`
2. POST `/api/redflag` with `{ symptoms, babyAgeMonths }` → must return `{ level, message, disclaimer }`
3. POST `/api/nutrition` with `{ action:"recipe", babyAgeMonths, country, ingredients }` → valid JSON recipe
4. POST `/api/chat` → SSE stream with `data: {"token":"..."}` events

**Medical safety invariants (never break these):**
- `disclaimer` field always present in redflag response (server-side forced)
- `level` always one of `green|yellow|red` (server validates, defaults to `yellow`)
- API key never in client bundle (no `VITE_ANTHROPIC_*` env vars)
- `temperature` param must NOT be set for claude-opus-4-7 (deprecated)

## Vercel Deployment

```bash
vercel deploy --prod --yes
```

API routes in `/api/` are auto-detected. `vercel.json` sets maxDuration (60s for chat streaming).
SPA routing handled by `rewrites: [{ source: "/((?!api/).*)", destination: "/index.html" }]`.
