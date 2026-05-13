import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const localesDir = path.join(root, 'src/i18n/locales');
const outDir = path.join(root, 'translation-review');
const outFile = path.join(outDir, 'aina_traductions_mg_wo_review.csv');

const fr = JSON.parse(fs.readFileSync(path.join(localesDir, 'fr.json'), 'utf8'));
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

function priorityFor(key) {
  if (/red_flag|urgent|emergency|care|dose|fever|stool|medication|symptom|disclaimer|auth|privacy|terms/i.test(key)) {
    return 'medical/safety';
  }
  if (/onboarding|profile|common|nav|dashboard|appointment/i.test(key)) {
    return 'core-ui';
  }
  return 'content';
}

function csvCell(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

const frFlat = flatten(fr);
const mgFlat = flatten(mg);
const woFlat = flatten(wo);
const keys = [...new Set([...Object.keys(frFlat), ...Object.keys(mgFlat), ...Object.keys(woFlat)])].sort();

const rows = [
  [
    'key',
    'priority',
    'fr_source',
    'mg_current',
    'mg_correction',
    'mg_notes',
    'wo_current',
    'wo_correction',
    'wo_notes',
  ],
  ...keys.map(key => [
    key,
    priorityFor(key),
    frFlat[key] ?? '',
    mgFlat[key] ?? '',
    '',
    '',
    woFlat[key] ?? '',
    '',
    '',
  ]),
];

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, rows.map(row => row.map(csvCell).join(',')).join('\n'));
console.log(outFile);
