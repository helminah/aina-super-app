import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const srcDir = path.join(root, 'src');
const outDir = path.join(root, 'translation-review');
const outFile = path.join(outDir, 'aina_textes_hardcoded_a_integrer_i18n.csv');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(tsx|ts)$/.test(entry.name) ? [full] : [];
  });
}

function csvCell(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

function priorityFor(text, file) {
  if (/urgence|urgent|dose|fi[eè]vre|pédiatre|sympt[oô]me|m[eé]dical|diagnostic|photo|selles|OMS/i.test(text + file)) {
    return 'medical/safety';
  }
  if (/Auth|Dashboard|Profile|Onboarding|BottomNav|Layout/i.test(file)) return 'core-ui';
  return 'content';
}

const ignore = [
  /^[\s·•✓✕+./:-]+$/,
  /^[\d\s.,/%()a-zA-Z_-]+$/,
  /[<>=]|&&|\|\||=>/,
  /\b(Promise|unknown|string|number|boolean|Country)\b/,
  /\b\w+\.\w+\b/,
  /^#[0-9a-fA-F]+$/,
  /^(true|false|null|undefined)$/,
  /^http/,
  /^AINA$/,
  /^Dr Helminah/,
  /^Facebook|Instagram|TikTok|YouTube|LinkedIn$/,
];

function shouldIgnore(text) {
  if (text.includes('=') || text.includes('&&') || text.includes('||') || text.includes('Promise')) return true;
  return ignore.some(re => re.test(text));
}

const rows = [[
  'file',
  'line',
  'priority',
  'text',
  'suggested_key',
  'fr_correction',
  'mg_correction',
  'wo_correction',
  'notes',
]];

for (const file of walk(srcDir)) {
  const rel = path.relative(root, file);
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, index) => {
    const candidates = [];

    for (const match of line.matchAll(/>\s*([^<>{}`]*[A-Za-zÀ-ÿ][^<>{}`]*)\s*</g)) {
      candidates.push(match[1].trim());
    }
    for (const match of line.matchAll(/\b(?:placeholder|aria-label|title)=["']([^"']*[A-Za-zÀ-ÿ][^"']*)["']/g)) {
      candidates.push(match[1].trim());
    }

    candidates
      .map(text => text.replace(/\s+/g, ' ').trim())
      .filter(text => text && !shouldIgnore(text))
      .forEach(text => {
        const base = rel
          .replace(/^src\//, '')
          .replace(/\.(tsx|ts)$/, '')
          .replaceAll('/', '.')
          .replace(/[^a-zA-Z0-9.]+/g, '_')
          .toLowerCase();
        rows.push([
          rel,
          index + 1,
          priorityFor(text, rel),
          text,
          `${base}.todo_${index + 1}`,
          '',
          '',
          '',
          '',
        ]);
      });
  });
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, rows.map(row => row.map(csvCell).join(',')).join('\n'));
console.log(outFile);
