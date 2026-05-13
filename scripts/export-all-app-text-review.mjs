import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const localesDir = path.join(root, 'src/i18n/locales');
const outDir = path.join(root, 'translation-review');
const outFile = path.join(outDir, 'aina_tout_le_texte_app_review.csv');

const fr = JSON.parse(fs.readFileSync(path.join(localesDir, 'fr.json'), 'utf8'));
const en = JSON.parse(fs.readFileSync(path.join(localesDir, 'en.json'), 'utf8'));
const mg = JSON.parse(fs.readFileSync(path.join(localesDir, 'mg.json'), 'utf8'));
const wo = JSON.parse(fs.readFileSync(path.join(localesDir, 'wo.json'), 'utf8'));

function flatten(value, prefix = '') {
  if (Array.isArray(value)) {
    return Object.fromEntries(value.flatMap((item, index) => Object.entries(flatten(item, `${prefix}[${index}]`))));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).flatMap(([key, item]) => {
        const next = prefix ? `${prefix}.${key}` : key;
        return Object.entries(flatten(item, next));
      }),
    );
  }
  return { [prefix]: value == null ? '' : String(value) };
}

function priorityFor(key, text = '') {
  if (/red_flag|urgent|emergency|care|dose|fever|stool|medication|symptom|disclaimer|auth|privacy|terms|OMS|WHO/i.test(key + text)) {
    return 'medical/safety';
  }
  if (/onboarding|profile|common|nav|dashboard|appointment|journal|nutrition|health/i.test(key)) {
    return 'core-ui';
  }
  return 'content';
}

function csvCell(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

const frFlat = flatten(fr);
const enFlat = flatten(en);
const mgFlat = flatten(mg);
const woFlat = flatten(wo);
const keys = [...new Set([...Object.keys(frFlat), ...Object.keys(enFlat), ...Object.keys(mgFlat), ...Object.keys(woFlat)])].sort();

const rows = [[
  'source',
  'key_or_file_line',
  'priority',
  'fr_source',
  'en_current',
  'mg_current',
  'mg_correction',
  'mg_notes',
  'wo_current',
  'wo_correction',
  'wo_notes',
]];

for (const key of keys) {
  rows.push([
    'i18n',
    key,
    priorityFor(key, frFlat[key] ?? ''),
    frFlat[key] ?? '',
    enFlat[key] ?? '',
    mgFlat[key] ?? '',
    '',
    '',
    woFlat[key] ?? '',
    '',
    '',
  ]);
}

// Remaining hardcoded user-facing strings that should be moved into i18n.
const hardcoded = [
  {
    id: 'src/pages/NutritionPage.tsx:377',
    priority: 'medical/safety',
    fr: 'Source : Organisation Mondiale de la Santé (OMS)',
    mg: 'Loharanon-kevitra : Fikambanana Iraisam-pirenena momba ny Fahasalamana (OMS)',
    wo: 'Source : Ndajeel Àdduna ci wér-gu-yaram (OMS)',
  },
  {
    id: 'src/pages/NutritionPage.tsx:397',
    priority: 'medical/safety',
    fr: 'Source : OMS',
    mg: 'Loharanon-kevitra : OMS',
    wo: 'Source : OMS',
  },
  {
    id: 'src/pages/NutritionPage.tsx:604',
    priority: 'medical/safety',
    fr: 'Source : Organisation Mondiale de la Santé (OMS)',
    mg: 'Loharanon-kevitra : Fikambanana Iraisam-pirenena momba ny Fahasalamana (OMS)',
    wo: 'Source : Ndajeel Àdduna ci wér-gu-yaram (OMS)',
  },
  {
    id: 'src/pages/NutritionPage.tsx:725',
    priority: 'content',
    fr: '✨ Liste adaptée par AINA',
    mg: "✨ Lisitra namboarin'ny AINA",
    wo: '✨ Liste bi AINA defar',
  },
];

for (const item of hardcoded) {
  rows.push([
    'hardcoded',
    item.id,
    item.priority,
    item.fr,
    '',
    item.mg,
    '',
    '',
    item.wo,
    '',
    '',
  ]);
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, rows.map(row => row.map(csvCell).join(',')).join('\n'));
console.log(outFile);
