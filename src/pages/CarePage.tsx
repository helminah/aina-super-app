import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pill, Thermometer, Droplets, Phone, AlertTriangle, Info } from 'lucide-react';
import { useBaby } from '@/contexts/BabyContext';
import { getAgeInMonths } from '@/lib/age-utils';
import { MEDICATION_FORMS, DOSE_PER_KG, getPracticalDose, type MedicationForm } from '@/data/medications';

type CareSection = 'dose' | 'fever' | 'stool';

export function CarePage() {
  const navigate = useNavigate();
  const { profile, weightEntries } = useBaby();
  const [section, setSection] = useState<CareSection>('dose');

  if (!profile) return null;

  const latestWeight = weightEntries.at(-1)?.weight ?? profile.birthWeight;

  return (
    <div className="pb-24 safe-top min-h-full bg-ivory-100">
      {/* Hero rouge — Trousse / Soins (urgence douce) */}
      <div className="relative overflow-hidden pt-10 pb-14 px-5" style={{
        background: 'linear-gradient(135deg, #dc2626, #f43f5e 40%, #f97316)',
      }}>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 hero-text mt-8"
        >
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/95 font-semibold">Ma trousse à pharmacie</p>
          <h1 className="font-display font-semibold text-white text-6xl leading-[0.95] mt-1.5">Soins</h1>
          <p className="text-white/95 text-sm mt-2.5 font-medium tracking-wide">Dose · Fièvre · Selles</p>
        </motion.div>
      </div>

      {/* Section switcher */}
      <div className="flex gap-2 -mt-6 mx-5 mb-5 p-1.5 glass-card rounded-2xl relative z-10">
        {([
          { id: 'dose' as const, label: 'Dose', icon: Pill },
          { id: 'fever' as const, label: 'Fièvre', icon: Thermometer },
          { id: 'stool' as const, label: 'Selles', icon: Droplets },
        ]).map(s => {
          const Icon = s.icon;
          const active = section === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold flex-1 justify-center transition-all ${
                active ? 'bg-red-500 text-white shadow-md shadow-red-500/30' : 'text-bark-500'
              }`}
            >
              <Icon className="w-4 h-4" /> {s.label}
            </button>
          );
        })}
      </div>

      <div className="px-5">
        {section === 'dose' && <DoseCalculator weight={latestWeight} />}
        {section === 'fever' && <FeverGuide ageMonths={getAgeInMonths(profile.birthDate)} weight={latestWeight} />}
        {section === 'stool' && <StoolGuide />}
      </div>

      {/* Disclaimer persistant */}
      <div className="mx-5 mt-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 leading-relaxed">
          Ces infos sont indicatives. Toujours vérifier la notice et consulter un médecin en cas de doute. En urgence
          vitale : SAMU 15 / 1515.
        </p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Dose Calculator — paracétamol / ibuprofène
// ────────────────────────────────────────────────────────────

function DoseCalculator({ weight }: { weight: number }) {
  const [medication, setMedication] = useState<'paracetamol' | 'ibuprofen'>('paracetamol');
  const [form, setForm] = useState<MedicationForm>(MEDICATION_FORMS.paracetamol[0]);
  const [customWeight, setCustomWeight] = useState(weight);

  const doseMg = Math.round(customWeight * DOSE_PER_KG[medication]);
  const practical = getPracticalDose(doseMg, form);

  return (
    <div className="space-y-4">
      {/* Medication */}
      <div className="glass-card rounded-2xl p-5">
        <p className="text-[11px] uppercase tracking-[0.15em] text-bark-500 font-semibold mb-3">Médicament</p>
        <div className="flex gap-2">
          {(['paracetamol', 'ibuprofen'] as const).map(m => (
            <button
              key={m}
              onClick={() => {
                setMedication(m);
                setForm(MEDICATION_FORMS[m][0]);
              }}
              className={`flex-1 py-3 rounded-xl font-heading font-bold text-sm transition-all ${
                medication === m ? 'bg-red-500 text-white shadow-md' : 'bg-white text-bark-600'
              }`}
            >
              {m === 'paracetamol' ? 'Paracétamol' : 'Ibuprofène'}
            </button>
          ))}
        </div>
        {medication === 'ibuprofen' && (
          <p className="text-[11px] text-amber-700 mt-3 flex items-start gap-1.5">
            <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
            Contre-indiqué avant 3 mois, en cas de varicelle ou déshydratation.
          </p>
        )}
      </div>

      {/* Weight */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[11px] uppercase tracking-[0.15em] text-bark-500 font-semibold">Poids de bébé</p>
          <span className="font-display font-semibold text-2xl text-red-600">{customWeight.toFixed(1)} kg</span>
        </div>
        <input
          type="range"
          min={3}
          max={25}
          step={0.1}
          value={customWeight}
          onChange={e => setCustomWeight(parseFloat(e.target.value))}
          className="w-full accent-red-500"
        />
        <div className="flex justify-between text-[10px] text-bark-400 mt-1">
          <span>3 kg</span>
          <span>25 kg</span>
        </div>
      </div>

      {/* Form selector */}
      <div className="glass-card rounded-2xl p-5">
        <p className="text-[11px] uppercase tracking-[0.15em] text-bark-500 font-semibold mb-3">Présentation</p>
        <div className="space-y-2">
          {MEDICATION_FORMS[medication].map(f => (
            <button
              key={f.id}
              onClick={() => setForm(f)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                form.id === f.id ? 'bg-red-500 text-white' : 'bg-white text-bark-700'
              }`}
            >
              <span className="text-2xl">{f.emoji}</span>
              <span className="flex-1 font-semibold text-sm">{f.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      <div className="bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl p-6 text-white elev-brand">
        <p className="text-[11px] uppercase tracking-[0.15em] text-white/80 font-semibold">Dose recommandée</p>
        <p className="font-display font-semibold text-5xl mt-2">{practical.label}</p>
        <p className="text-sm text-white/85 mt-1">{practical.detail} · soit {doseMg} mg</p>
        <p className="text-xs text-white/70 mt-3 leading-relaxed">
          Toutes les 6h maximum ({medication === 'paracetamol' ? '4 prises/24h' : '3 prises/24h'}) · à ajuster selon
          la fièvre.
        </p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Fever Guide
// ────────────────────────────────────────────────────────────

function FeverGuide({ ageMonths, weight }: { ageMonths: number; weight: number }) {
  const thresholds = [
    {
      level: 'Normal',
      range: '< 37,5°C',
      color: 'emerald',
      advice: 'Pas de fièvre. Surveillez le comportement de bébé.',
    },
    {
      level: 'Légère',
      range: '37,5 – 38,5°C',
      color: 'amber',
      advice: 'Déshabiller, hydrater souvent, surveiller. Paracétamol non obligatoire si confort bon.',
    },
    {
      level: 'Modérée',
      range: '38,5 – 40°C',
      color: 'orange',
      advice: `Paracétamol ${Math.round(weight * 15)} mg toutes les 6h. Rafraîchir la pièce (18-20°C).`,
    },
    {
      level: 'Élevée',
      range: '> 40°C',
      color: 'red',
      advice: 'Consultez rapidement, surtout si bébé < 3 mois ou fièvre > 48h.',
    },
  ];

  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    red: 'bg-red-50 border-red-200 text-red-800',
  };

  return (
    <div className="space-y-3">
      {ageMonths < 3 && (
        <div className="bg-red-500 text-white rounded-2xl p-5 elev-brand">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-heading font-bold">Bébé {'<'} 3 mois</p>
              <p className="text-sm text-white/90 mt-1 leading-relaxed">
                Toute fièvre ≥ 38°C est une <strong>urgence</strong>. Consultez immédiatement.
              </p>
              <a
                href="tel:15"
                className="mt-3 inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white text-red-600 font-heading font-bold text-sm"
              >
                <Phone className="w-4 h-4" /> SAMU (15)
              </a>
            </div>
          </div>
        </div>
      )}

      {thresholds.map(t => (
        <div key={t.level} className={`rounded-2xl border p-4 ${colorMap[t.color]}`}>
          <div className="flex items-center justify-between mb-1">
            <p className="font-heading font-bold">{t.level}</p>
            <span className="text-sm font-mono">{t.range}</span>
          </div>
          <p className="text-sm leading-relaxed opacity-90">{t.advice}</p>
        </div>
      ))}

      <div className="bg-white rounded-2xl p-5 elev-1">
        <p className="font-heading font-bold text-bark-800 mb-2">Quand consulter en urgence ?</p>
        <ul className="space-y-1.5 text-sm text-bark-600">
          {[
            'Convulsions, raideur de la nuque, éruption de taches',
            'Vomissements répétitifs ou refus total de boire',
            'Somnolence inhabituelle, pleurs inconsolables',
            'Fièvre persistante > 48h sans amélioration',
          ].map((s, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Stool Guide
// ────────────────────────────────────────────────────────────

function StoolGuide() {
  const stools = [
    { emoji: '💛', color: 'Jaune moutarde', status: 'Normal', desc: 'Lait maternel : selles jaune d\'or, grumeleuses, odeur douce.', level: 'ok' },
    { emoji: '🟤', color: 'Marron clair', status: 'Normal', desc: 'Biberon ou diversification : plus moulées, plus brunes.', level: 'ok' },
    { emoji: '💚', color: 'Vert foncé', status: 'À surveiller', desc: 'Ponctuellement normal. Si persistant : trop de lactose ou inconfort digestif.', level: 'watch' },
    { emoji: '⚪', color: 'Blanc / décoloré', status: 'Consulter', desc: 'Suspicion de trouble hépatique. Consultez un pédiatre rapidement.', level: 'alert' },
    { emoji: '🔴', color: 'Rouge (sang vif)', status: 'Urgence', desc: 'Consultez rapidement. Peut signaler une allergie, une fissure, ou autre.', level: 'alert' },
    { emoji: '⚫', color: 'Noir goudron', status: 'Urgence', desc: 'Peut indiquer un saignement digestif. Consultation immédiate.', level: 'alert' },
  ];

  const badges: Record<string, string> = {
    ok: 'bg-emerald-100 text-emerald-700',
    watch: 'bg-amber-100 text-amber-700',
    alert: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-3">
      {stools.map(s => (
        <div key={s.color} className="bg-white rounded-2xl p-4 elev-1 flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-ivory-100 flex items-center justify-center text-2xl flex-shrink-0">
            {s.emoji}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-heading font-bold text-bark-800">{s.color}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${badges[s.level]}`}>
                {s.status}
              </span>
            </div>
            <p className="text-sm text-bark-500 mt-1 leading-relaxed">{s.desc}</p>
          </div>
        </div>
      ))}

      <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 text-sm text-bark-700 leading-relaxed">
        <p className="font-semibold text-sky-700 mb-1">💧 Consistance</p>
        Diarrhée = plus de 3 selles très liquides par jour. Risque de déshydratation : hydratez fréquemment,
        surveillez la couche et consultez si pas d'amélioration en 24h.
      </div>
    </div>
  );
}
