import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pill, Thermometer, Droplets, Phone, AlertTriangle, Info } from 'lucide-react';
import { useBaby } from '@/contexts/BabyContext';
import { useTranslation } from 'react-i18next';
import { getAgeInMonths } from '@/lib/age-utils';
import { MEDICATION_FORMS, DOSE_PER_KG, getPracticalDose, type MedicationForm } from '@/data/medications';
import { getEmergency } from '@/data/emergency-numbers';

type CareSection = 'dose' | 'fever' | 'stool';

export function CarePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile, weightEntries } = useBaby();
  const [section, setSection] = useState<CareSection>('dose');

  if (!profile) return null;

  const latestWeight = weightEntries.at(-1)?.weight ?? profile.birthWeight ?? 5;

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
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/95 font-semibold">{t('care.hero_kicker')}</p>
          <h1 className="font-display font-semibold text-white text-6xl leading-[0.95] mt-1.5">{t('care.title')}</h1>
          <p className="text-white/95 text-sm mt-2.5 font-medium tracking-wide">{t('care.hero_tagline')}</p>
        </motion.div>
      </div>

      {/* Section switcher */}
      <div className="flex gap-2 -mt-6 mx-5 mb-5 p-1.5 glass-card rounded-2xl relative z-10">
        {([
          { id: 'dose' as const, key: 'dose', icon: Pill },
          { id: 'fever' as const, key: 'fever', icon: Thermometer },
          { id: 'stool' as const, key: 'stool', icon: Droplets },
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
              <Icon className="w-4 h-4" /> {t(`care.tabs.${s.key}`)}
            </button>
          );
        })}
      </div>

      <div className="px-5">
        {section === 'dose' && <DoseCalculator weight={latestWeight} />}
        {section === 'fever' && <FeverGuide ageMonths={getAgeInMonths(profile.birthDate)} weight={latestWeight} country={profile.country} />}
        {section === 'stool' && <StoolGuide />}
      </div>

      {/* Disclaimer persistant */}
      <div className="mx-5 mt-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 leading-relaxed">
          {t('care.disclaimer')}
        </p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Dose Calculator — paracétamol / ibuprofène
// ────────────────────────────────────────────────────────────

function DoseCalculator({ weight }: { weight: number }) {
  const { t, i18n } = useTranslation();
  const timeLocale = i18n.language.startsWith('en') ? 'en-US' : 'fr-FR';
  const { doseRecords, addDose, removeDose } = useBaby();
  const [medication, setMedication] = useState<'paracetamol' | 'ibuprofen'>('paracetamol');
  const [form, setForm] = useState<MedicationForm>(MEDICATION_FORMS.paracetamol[0]);
  const [customWeight, setCustomWeight] = useState(weight);

  const doseMg = Math.round(customWeight * DOSE_PER_KG[medication]);
  const practical = getPracticalDose(doseMg, form);

  // Last dose for this med + next allowed time (6h)
  const lastDose = doseRecords.find(d => d.medication === medication);
  const INTERVAL_MS = 6 * 60 * 60 * 1000;
  const nextAllowedAt = lastDose ? new Date(new Date(lastDose.givenAt).getTime() + INTERVAL_MS) : null;
  const nowMs = Date.now();
  const mustWait = nextAllowedAt && nextAllowedAt.getTime() > nowMs;
  const waitMinutes = mustWait ? Math.ceil((nextAllowedAt.getTime() - nowMs) / 60000) : 0;

  // Last 24h history (all meds)
  const recent = doseRecords.filter(d => Date.now() - new Date(d.givenAt).getTime() < 24 * 60 * 60 * 1000);

  const handleRecord = () => {
    addDose({
      medication,
      doseMg,
      givenAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-4">
      {/* Medication */}
      <div className="glass-card rounded-2xl p-5">
        <p className="text-[11px] uppercase tracking-[0.15em] text-bark-500 font-semibold mb-3">{t('care.dose.medication')}</p>
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
              {m === 'paracetamol' ? t('care_dose.paracetamol') : t('care_dose.ibuprofen')}
            </button>
          ))}
        </div>
        {medication === 'ibuprofen' && (
          <p className="text-[11px] text-amber-700 mt-3 flex items-start gap-1.5">
            <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
            {t('care.dose.ibuprofen_warning')}
          </p>
        )}
      </div>

      {/* Weight */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[11px] uppercase tracking-[0.15em] text-bark-500 font-semibold">{t('care.dose.weight_of_baby')}</p>
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
        <p className="text-[11px] uppercase tracking-[0.15em] text-bark-500 font-semibold mb-3">{t('care.dose.form')}</p>
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
        <p className="text-[11px] uppercase tracking-[0.15em] text-white/80 font-semibold">{t('care.dose.recommended_dose')}</p>
        <p className="font-display font-semibold text-5xl mt-2">{practical.label}</p>
        <p className="text-sm text-white/85 mt-1">{practical.detail} · soit {doseMg} mg</p>
        <p className="text-xs text-white/70 mt-3 leading-relaxed">
          {t('care.dose.max_interval', { count: medication === 'paracetamol' ? 4 : 3 })}
        </p>

        <button
          onClick={handleRecord}
          disabled={!!mustWait}
          className={`mt-4 w-full py-3 rounded-full font-heading font-bold text-sm transition-all ${
            mustWait
              ? 'bg-white/15 text-white/60 cursor-not-allowed'
              : 'bg-white text-red-600 active:scale-[0.98]'
          }`}
        >
          {mustWait ? `${t('care.dose.too_soon')} ~${waitMinutes} min` : `${t('care.dose.record_dose')} ✓`}
        </button>
      </div>

      {/* History 24h */}
      {recent.length > 0 && (
        <div className="bg-white rounded-2xl p-5 elev-1">
          <p className="text-[11px] uppercase tracking-[0.15em] text-bark-500 font-semibold mb-3">{t('care.dose.history')}</p>
          <div className="space-y-2">
            {recent.map(d => {
              const date = new Date(d.givenAt);
              const ago = Math.round((Date.now() - date.getTime()) / 60000);
              const hours = Math.floor(ago / 60);
              const leftoverMin = ago % 60;
              const agoLabel = ago < 60
                ? t('care_dose.ago_minutes', { minutes: ago })
                : leftoverMin > 0
                  ? t('care_dose.ago_hours_minutes', { hours, minutes: leftoverMin })
                  : t('care_dose.ago_hours', { hours });
              return (
                <div key={d.id} className="flex items-center gap-3 py-2 border-b border-ivory-200 last:border-0">
                  <span className="text-xl">{d.medication === 'paracetamol' ? '💊' : '💉'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-bark-800 capitalize">
                      {d.medication === 'paracetamol' ? t('care_dose.paracetamol') : t('care_dose.ibuprofen')} {d.doseMg} mg
                    </p>
                    <p className="text-xs text-bark-400">
                      {date.toLocaleTimeString(timeLocale, { hour: '2-digit', minute: '2-digit' })} · {agoLabel}
                    </p>
                  </div>
                  <button
                    onClick={() => removeDose(d.id)}
                    className="text-bark-300 hover:text-red-500 text-xs"
                    aria-label={t('common.delete')}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Fever Guide
// ────────────────────────────────────────────────────────────

function FeverGuide({ ageMonths, weight, country }: { ageMonths: number; weight: number; country: string }) {
  const { t } = useTranslation();
  const doseMg = Math.round(weight * 15);

  const thresholds = [
    { key: 'normal',   level: t('care.fever.level_normal'),   range: '< 37,5°C',      color: 'emerald', advice: t('fever_advice.normal') },
    { key: 'mild',     level: t('care.fever.level_mild'),     range: '37,5 – 38,5°C', color: 'amber',   advice: t('fever_advice.mild') },
    { key: 'moderate', level: t('care.fever.level_moderate'), range: '38,5 – 40°C',   color: 'orange',  advice: t('fever_advice.moderate_template', { doseMg }) },
    { key: 'high',     level: t('care.fever.level_high'),     range: '> 40°C',        color: 'red',     advice: t('fever_advice.high') },
  ];

  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    red: 'bg-red-50 border-red-200 text-red-800',
  };

  const emergencySigns = t('fever_advice.emergency_signs', { returnObjects: true, defaultValue: [] }) as string[];

  return (
    <div className="space-y-3">
      {ageMonths < 3 && (
        <div className="bg-red-500 text-white rounded-2xl p-5 elev-brand">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-heading font-bold">{t('care.fever.baby_under_3m_title')}</p>
              <p className="text-sm text-white/90 mt-1 leading-relaxed">
                {t('care.fever.baby_under_3m_body')}
              </p>
              <a
                href={`tel:${getEmergency(country).number}`}
                className="mt-3 inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white text-red-600 font-heading font-bold text-sm"
              >
                <Phone className="w-4 h-4" /> {getEmergency(country).label} ({getEmergency(country).number})
              </a>
            </div>
          </div>
        </div>
      )}

      {thresholds.map(th => (
        <div key={th.key} className={`rounded-2xl border p-4 ${colorMap[th.color]}`}>
          <div className="flex items-center justify-between mb-1">
            <p className="font-heading font-bold">{th.level}</p>
            <span className="text-sm font-mono">{th.range}</span>
          </div>
          <p className="text-sm leading-relaxed opacity-90">{th.advice}</p>
        </div>
      ))}

      <div className="bg-white rounded-2xl p-5 elev-1">
        <p className="font-heading font-bold text-bark-800 mb-2">{t('care.fever.when_emergency')}</p>
        <ul className="space-y-1.5 text-sm text-bark-600">
          {emergencySigns.map((s, i) => (
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
  const { t } = useTranslation();
  const stools = t('stool_types', { returnObjects: true, defaultValue: [] }) as Array<{
    emoji: string; color: string; status: string; desc: string; level: string;
  }>;

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
        <p className="font-semibold text-sky-700 mb-1">{t('stool_consistency_title')}</p>
        {t('stool_note')}
      </div>
    </div>
  );
}
