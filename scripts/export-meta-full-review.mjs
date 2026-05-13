import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const localesDir = path.join(root, 'src/i18n/locales');
const dataDir = path.join(root, 'src/data');
const outDir = path.join(root, 'translation-review');
const outFile = path.join(outDir, 'AINA_META_RELECTURE_COMPLETE_2026-05-13.csv');
const instructionsFile = path.join(outDir, 'CONSIGNE_META_AI_RELECTURE_MG_WO.txt');

const localeNames = ['fr', 'en', 'mg', 'wo'];
const locales = Object.fromEntries(
  localeNames.map((locale) => [
    locale,
    JSON.parse(fs.readFileSync(path.join(localesDir, `${locale}.json`), 'utf8')),
  ]),
);

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

function csvCell(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

function parseTsString(raw) {
  const quote = raw[0];
  const body = raw.slice(1, -1);
  if (quote === '`') return body.replace(/\\`/g, '`').replace(/\\n/g, '\n');
  return body
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')
    .replace(/\\n/g, '\n');
}

function priorityFor(key, text = '') {
  const haystack = `${key} ${text}`;
  if (/red.?flag|urgent|emergency|care|dose|fever|stool|medication|symptom|disclaimer|auth|privacy|terms|OMS|WHO|vaccin|santé|health/i.test(haystack)) {
    return 'medical/safety';
  }
  if (/recipe|nutrition|food|ingredient|step|why|conseil|allergen|menu|onboarding|profile|common|nav|dashboard|appointment|journal|health/i.test(haystack)) {
    return 'core-product';
  }
  return 'content';
}

function findDataFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.ts'))
    .map((name) => path.join(dir, name));
}

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

const flatLocales = Object.fromEntries(localeNames.map((locale) => [locale, flatten(locales[locale])]));
const i18nKeys = [...new Set(localeNames.flatMap((locale) => Object.keys(flatLocales[locale])))].sort();

for (const key of i18nKeys) {
  rows.push([
    'i18n',
    key,
    priorityFor(key, flatLocales.fr[key] ?? ''),
    flatLocales.fr[key] ?? '',
    flatLocales.en[key] ?? '',
    flatLocales.mg[key] ?? '',
    '',
    '',
    flatLocales.wo[key] ?? '',
    '',
    '',
  ]);
}

const localizedObjectPattern = /([a-zA-Z0-9_]+)\s*:\s*\{([^{}]*(?:fr|en|mg|wo)\s*:\s*(?:'[^'\\]*(?:\\.[^'\\]*)*'|"[^"\\]*(?:\\.[^"\\]*)*"|`[^`\\]*(?:\\.[^`\\]*)*`)[^{}]*)\}/g;
const langValuePattern = /(fr|en|mg|wo)\s*:\s*('[^'\\]*(?:\\.[^'\\]*)*'|"[^"\\]*(?:\\.[^"\\]*)*"|`[^`\\]*(?:\\.[^`\\]*)*`)/g;
const plainStringPattern = /\b(title|name|t|d|why|conseil|description|tip|text|label|warning|note)\s*:\s*('[^'\\]*(?:\\.[^'\\]*)*'|"[^"\\]*(?:\\.[^"\\]*)*"|`[^`\\]*(?:\\.[^`\\]*)*`)/g;

const seen = new Set();

for (const filePath of findDataFiles(dataDir)) {
  const rel = path.relative(root, filePath);
  const source = fs.readFileSync(filePath, 'utf8');

  for (const match of source.matchAll(localizedObjectPattern)) {
    const field = match[1];
    const block = match[2];
    const line = source.slice(0, match.index).split('\n').length;
    const values = { fr: '', en: '', mg: '', wo: '' };

    for (const langMatch of block.matchAll(langValuePattern)) {
      values[langMatch[1]] = parseTsString(langMatch[2]);
    }

    if (!values.fr && !values.en && !values.mg && !values.wo) continue;
    const id = `${rel}:${line}:${field}`;
    if (seen.has(id)) continue;
    seen.add(id);

    rows.push([
      'data-localized',
      id,
      priorityFor(id, values.fr || values.en),
      values.fr,
      values.en,
      values.mg,
      '',
      '',
      values.wo,
      '',
      '',
    ]);
  }

  for (const match of source.matchAll(plainStringPattern)) {
    const field = match[1];
    const value = parseTsString(match[2]);
    if (!value || value.length < 2) continue;
    if (/^(fr|en|mg|wo|dejeuner|diner|gouter|petit-dejeuner|lisse|fondant|morceaux|false|true)$/i.test(value)) continue;

    const line = source.slice(0, match.index).split('\n').length;
    const id = `${rel}:${line}:${field}:fr-only`;
    if (seen.has(id)) continue;
    seen.add(id);

    rows.push([
      'data-fr-only',
      id,
      priorityFor(id, value),
      value,
      '',
      '',
      '',
      'Traduire depuis le français, ton naturel Madagascar, pas littéral.',
      '',
      '',
      'Traduire depuis le français, wolof naturel Sénégal, pas littéral.',
    ]);
  }
}

const instructions = `CONSIGNE POUR META AI - RELECTURE AINA MG/WO

Objectif :
Relire et corriger TOUT le fichier CSV pour l'application AINA, une app de santé/nutrition bébé destinée aux parents africains.

Langues à corriger :
- mg_correction = malgache naturel, clair, rassurant, compréhensible par une mère/un père, pas une traduction mot à mot.
- wo_correction = wolof naturel du Sénégal, clair, oral mais propre, compréhensible par les parents. Si un terme médical wolof est peu naturel, garder le mot français courant entre parenthèses.

Règles importantes :
1. Ne pas recopier automatiquement mg_current ou wo_current si la phrase sonne bizarre.
2. Corriger les phrases comme "ny dokotera ao an-paosyinao" si elles sont maladroites. L'idée doit être "assistant santé dans votre poche", pas prétendre être un vrai médecin.
3. Pour les textes médicaux, garder un ton prudent : AINA guide, aide à trier, mais ne pose pas de diagnostic.
4. Pour les recettes, traduire aussi les étapes : préparer, cuire, mixer, couper, vapeur, four, feu doux, texture lisse, etc.
5. Ne pas laisser de français dans mg_correction ou wo_correction sauf si le mot est réellement utilisé localement.
6. Garder les variables intactes : {{name}}, {{count}}, {{age}}, <br/>, %s, etc.
7. Garder les unités intactes : g, ml, min, °C, mois, kg.
8. Garder les noms AINA, OMS/WHO, WhatsApp, Supabase, Google.
9. Si une traduction est incertaine, remplir quand même correction + ajouter une note courte dans mg_notes ou wo_notes.
10. Ne pas modifier les colonnes source, key_or_file_line, priority, fr_source, en_current, mg_current, wo_current.

À rendre :
Le même CSV, avec seulement ces colonnes complétées/modifiées :
- mg_correction
- mg_notes
- wo_correction
- wo_notes

Exemples de corrections attendues :
- "AINA IA — ny dokotera ao an-paosyinao" est trop fort et maladroit. Préférer une idée du type "AINA IA — mpanampy ara-pahasalamana eny an-tananao" en malgache naturel.
- Si une étape est en français comme "Couper la patate douce en cubes", fournir la traduction MG et WO.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, rows.map((row) => row.map(csvCell).join(',')).join('\n'));
fs.writeFileSync(instructionsFile, instructions);

console.log(outFile);
console.log(instructionsFile);
