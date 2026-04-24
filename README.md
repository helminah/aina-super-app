# AINA — Breath of Life

[![Built with Claude Haiku](https://img.shields.io/badge/Built%20with-Claude%20Haiku%204.5-8B5CF6)](https://www.anthropic.com/claude)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green)](#license)

**AINA** is a pediatric super-app built for French-speaking Africa and Europe.
Vaccine tracking (EPI schedule for 31 countries), baby growth curves (WHO),
nutrition with local African/European foods, dentition, daily journal, and
exportable health record.

Designed for the **Anthropic Hackathon 2026 (Opus 4.7)** — deadline Apr 26.

> 🌐 Live demo: _deployment link coming soon_
>
> 🇫🇷 Lire en français : see below

---

## ✨ AI Features (powered by Claude Haiku 4.5)

Three integrated AI capabilities, backed by an Express proxy that keeps the
Anthropic API key server-side (never in the bundle), with prompt caching on
the large system prompts (~90% cost reduction on cache hits).

### 🍽️ AI Recipe Generator
Natural-language ingredient list + baby age + country → a personalized baby
recipe (title, ingredients, steps, nutrition notes, texture). A _Weekly meal
plan_ button generates a full 7-day plan adapted to allergies and age.

### 🚨 AI Red Flag Checker
Parents describe what they observe in plain text; Claude classifies the
situation in 3 levels (🟢 monitor · 🟡 consult within 24h · 🔴 immediate
emergency) with clear guidance. **Never diagnoses** — always orients to a
pediatrician or SAMU when appropriate. Disclaimer enforced server-side.

### 💬 AINA IA Chatbot
Floating conversational assistant, available from any page. Parents can ask
free-form questions about sleep, feeding, development, vaccines, etc. Limited
to 10 turns per session (token safety). Urgent symptoms trigger an immediate
emergency redirect.

All three integrate the WHO/EPI food guide as contextual knowledge (cached).

---

## 🚀 Quick start

```bash
# Install
npm install
cp .env.example .env.local
# → fill in ANTHROPIC_API_KEY in .env.local (never prefix with VITE_)

# Dev (both frontend + backend in parallel)
npm run dev:full

# Or separately:
npm run server    # Express proxy on :3001
npm run dev       # Vite on :5173
```

Get an Anthropic API key at https://console.anthropic.com.

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev:full` | Vite + Express proxy in parallel (recommended) |
| `npm run dev` | Vite only (frontend) |
| `npm run server` | Express proxy only (backend) |
| `npm run build` | Type check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |

---

## 🏗️ Stack

- **Frontend** — React 19 · TypeScript · Vite 8 · Tailwind CSS 4 (`@theme`) · Radix UI · Framer Motion · Recharts · Sonner · i18next
- **Backend proxy** — Express 5 · `@anthropic-ai/sdk` · prompt caching (`cache_control: ephemeral`)
- **Mobile** — Capacitor (iOS · Android)
- **Optional cloud** — Supabase (auth only — data stays local via localStorage)

---

## 🌍 Internationalization

4 locales shipped: **Français · Malagasy · Wolof · English**.

Translations live in `src/i18n/locales/{fr,mg,wo,en}.json`. Keys are
hierarchical (e.g. `vaccine_info.bcg.why`, `care.fever.level_mild`).

To fix a translation: open the locale file, `Ctrl+F` the current text, edit,
commit. Never rename keys — they must stay identical across the 4 files.

AINA means _"life / breath of life"_ in Malagasy — perfectly aligned.

---

## 🏛️ Architecture

```
aina-super-app/
├─ server/                       Express proxy (Node)
│  ├─ index.js                   3 routes: /api/nutrition · /api/redflag · /api/chat
│  └─ food-guide-context.js      WHO nutrition context injected in cached system prompt
├─ src/
│  ├─ App.tsx                    Router + auth/onboarding guards
│  ├─ main.tsx                   Providers (Theme, Auth, Baby, Router, i18n)
│  ├─ pages/                     Dashboard · Health · Nutrition · Journal · Profile
│  │                             Care (dose/fever/stool) · About · Auth · HealthReport
│  ├─ components/
│  │  ├─ AIChatAssistant.tsx     Floating chatbot, 10-turn max
│  │  ├─ QuickSettings.tsx       Top-right floating button (lang + theme)
│  │  ├─ SplashScreen.tsx        Animated splash with breathing logo
│  │  ├─ health/                 TeethChart · RedFlagsSection · VaccineEducation
│  │  │                          GrowthInterpretation · AIRedFlagChecker
│  │  ├─ nutrition/              FoodGuide · ConservationGuide · AIRecipeGenerator
│  │  ├─ dashboard/              AppointmentWidget
│  │  ├─ layout/                 AppLayout · BottomNav (colored morphing pill)
│  │  └─ onboarding/             OnboardingFlow · CountryPicker
│  ├─ contexts/                  AuthContext · BabyContext · ThemeContext
│  ├─ data/                      vaccines (31 countries) · countries · teeth
│  │                             red-flags · medications · food-guide
│  │                             oms-growth · milestones · recipes · daily-tips
│  ├─ config/drhelminah.ts       Creator's social links (editable)
│  ├─ i18n/                      i18next + 4 locales
│  ├─ lib/
│  │  ├─ anthropic.ts            Client → proxy functions
│  │  ├─ supabase.ts             Auth client (optional)
│  │  └─ age-utils.ts · storage.ts
│  └─ types/
```

---

## 🔐 Security

- **Anthropic API key** lives only in `.env.local` on the server side
  (no `VITE_` prefix → never in the bundle). The Express proxy reads it at
  runtime via `process.env.ANTHROPIC_API_KEY`.
- `.env.local` is gitignored (`*.local` pattern).
- Medical disclaimer is **enforced server-side** (never trusts the model to
  always include it) and the red-flag level is defaulted to `yellow` if
  invalid (fail-safe toward caution).
- CORS restricted to `localhost:5173/5174` in dev — update `server/index.js`
  for production domains.
- No telemetry, no tracking. Baby data stays in localStorage.

---

## 🩺 Medical content sources

Clinical data in `src/data/` — always source French, translations in JSON:

- **Vaccines** — EPI/WHO schedule (31 countries in 3 groups: `pev-base`,
  `european`, `maghreb`). Disease info cards in `vaccine-info.ts`.
- **Growth curves** — WHO percentiles P3/P15/P50/P85/P97 for boys/girls
  0-24 months (weight, height, head circumference).
- **Red flags** — developmental warning signs at 4/9/12/18/24 months.
- **Teeth** — 20 baby teeth with eruption ranges.
- **Medications** — paracetamol (15 mg/kg), ibuprofen (10 mg/kg), syrup
  and suppository forms.
- **Foods** — introduction by age 4-24m, allergens, African/European
  local context.

---

## 🇫🇷 À propos

AINA — _Souffle de vie_. Super-app pédiatrique pour le suivi santé et
nutrition bébé. Calendrier vaccinal PEV pour 31 pays, courbes OMS, alimentation
avec contexte local africain et européen, dentition, journal, carnet de santé
exportable.

Créée pour le hackathon **Anthropic Opus 4.7**, deadline **26 avril 2026**.

L'assistante **AINA IA** (basée sur **Claude Haiku 4.5** d'Anthropic) génère
des recettes personnalisées, analyse les signaux d'alerte et répond aux
questions quotidiennes des parents — toujours avec disclaimer médical et
orientation vers un pédiatre en cas de doute.

---

## 📱 Mobile (Capacitor)

```bash
npx cap add ios
npx cap add android
npm run build && npx cap sync
npx cap open ios       # Xcode
npx cap open android   # Android Studio
```

---

## License

MIT — see [LICENSE](LICENSE) if present, otherwise consider this project MIT-licensed.

Built with ❤️ for the Anthropic Hackathon 2026.
