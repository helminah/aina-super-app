# AINA — Souffle de vie

Super-app de suivi santé et nutrition bébé, pensée pour l'Afrique francophone
et l'Europe. Pédiatrie, calendrier vaccinal PEV, journal, nutrition, dentition,
carnet de santé exportable.

Design 2026 : palette multi-couleur par section, glassmorphism, typo Fraunces
variable, dark mode, multilangue (FR · MG · WO · EN).

## Stack

- React 19 + TypeScript + Vite 8
- Tailwind CSS 4 (syntaxe `@theme`) + Radix UI primitives
- React Router 6 · Framer Motion · Sonner · Recharts
- Supabase (auth cloud optionnelle) · Capacitor (iOS/Android)
- i18next + react-i18next

## Démarrage

```bash
npm install
cp .env.example .env.local   # facultatif — voir section Auth
npm run dev                   # http://localhost:5173
npm run build                 # dist/
```

## Authentification (optionnelle)

L'app tourne en **mode démo local** sans configuration — le bouton « Continuer
en démo locale » s'affiche sur l'écran de connexion.

Pour activer l'auth cloud Supabase, éditer `.env.local` :

```
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon-publique
```

La clé ANON est destinée au client, elle est publique par design (protégée par
RLS côté Supabase). Aucune clé server-side (`service_role`) ne doit être
placée dans ce projet.

## Architecture

```
src/
├─ App.tsx                    Router + gardes auth/onboarding
├─ main.tsx                   Providers (Auth, Baby, Theme, Router)
├─ pages/                     Dashboard, Health, Nutrition, Journal,
│                             Profile, Care, RecipeDetail, Auth, HealthReport
├─ components/                SplashScreen, QuickSettings,
│  ├─ health/                 TeethChart, RedFlagsSection, VaccineEducation,
│  │                          GrowthInterpretation
│  ├─ nutrition/              FoodGuide, ConservationGuide
│  ├─ dashboard/              AppointmentWidget
│  ├─ layout/                 AppLayout, BottomNav
│  └─ onboarding/             OnboardingFlow, CountryPicker
├─ contexts/                  AuthContext, BabyContext, ThemeContext
├─ data/                      vaccines (31 pays PEV), countries, teeth,
│                             red-flags, medications, food-guide,
│                             oms-growth, milestones, recipes, daily-tips
├─ i18n/
│  ├─ index.ts                config i18next + LanguageDetector
│  └─ locales/{fr,mg,wo,en}.json
├─ lib/                       supabase, storage, age-utils, utils
└─ types/                     ChildProfile, records, etc.
```

## Traductions

Les 4 locales sont dans `src/i18n/locales/*.json` et partagent exactement la
même structure de clés (hiérarchie : `nav.health`, `vaccine_info.bcg.why`,
`teeth_tips`, `care.fever.level_mild`, etc.).

**Pour corriger une traduction** : ouvrir le fichier de la langue concernée,
chercher le texte actuel, éditer, commit. Ne **jamais** renommer une clé :
elle doit rester identique dans les 4 fichiers.

Langues :
- `fr` : référence (source du contenu médical)
- `mg` : malgache
- `wo` : wolof — approximations, révision locuteur natif bienvenue
- `en` : anglais standard

Les contenus longs qui restent en français dans toutes les langues (par
pragmatisme — ils demandent un locuteur natif par région et une validation
médicale) :
- Noms d'aliments dans `data/food-guide.ts` (60+ items avec contexte Afrique/France)
- Descriptions individuelles des milestones (`data/milestones.ts`)
- Titres et pas de recettes (`data/recipes.ts`)
- Tips quotidiens (`data/daily-tips.ts`)

## Contenu médical (source FR)

Toute donnée clinique de l'app est sourcée dans `src/data/` :

- **Vaccins** : `vaccines.ts` (PEV/OMS pour les pays en `pev-base`, schéma
  européen pour `european`, maghreb pour `maghreb`). Fiches éducatives
  (pourquoi/maladie/risque/effets) dans `vaccine-info.ts`.
- **Courbes croissance** : `oms-growth.ts` (poids/taille/périmètre crânien
  percentiles OMS pour garçons/filles de 0 à 24 mois + helpers
  `getGrowthZone`, `detectCurveBreak`).
- **Signaux d'alarme** : `red-flags.ts` (développement à 4/9/12/18/24 mois).
- **Dentition** : `teeth.ts` (20 dents de lait avec âges d'éruption).
- **Médicaments** : `medications.ts` (paracétamol/ibuprofène, calcul dose
  15 mg/kg resp 10 mg/kg, formes sirop/suppositoire avec tailles).
- **Aliments** : `food-guide.ts` (introduction par âge 4-24 mois, allergènes,
  contexte local Afrique/France).
- **Milestones** : `milestones.ts` (par tranches d'âge, 4 domaines).

## Données & vie privée

- Toutes les données locales sont stockées en localStorage, clés préfixées
  `aina-{babyId}-{domaine}` (poids, vaccins, logs, dents, doses, rendez-vous,
  meal plan, favoris…).
- Aucune télémétrie, aucun tracking.
- Si Supabase est configuré : seule l'auth (email/password) est cloud — les
  données bébé restent locales dans cette version.

## Dev

```bash
npm run lint      # eslint
npm run build     # type check + production build
```

Capacitor (mobile) :

```bash
npx cap add ios
npx cap add android
npm run build && npx cap sync
```
