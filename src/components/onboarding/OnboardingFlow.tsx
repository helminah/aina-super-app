import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useTranslation } from 'react-i18next';
import { useBaby } from '@/contexts/BabyContext';
import { vaccines } from '@/data/vaccines';
import { COUNTRIES, REGION_ORDER } from '@/data/countries';

// Calendrier PEV OMS : 6 semaines / 10 semaines / 14 semaines (≠ schéma européen 2/4/6 mois)
const PEV_WEEK_LABELS: Record<string, { fr: string; en: string; mg: string; wo: string }> = {
  '2 mois':  { fr: '6 semaines (1 mois ½)',  en: '6 weeks (1.5 months)',  mg: 'herinandro 6 (volana 1½)',  wo: '6 ayubés (1½ weer)'  },
  '3 mois':  { fr: '10 semaines (2 mois ½)', en: '10 weeks (2.5 months)', mg: 'herinandro 10 (volana 2½)', wo: '10 ayubés (2½ weer)' },
  '4 mois':  { fr: '14 semaines (3 mois ½)', en: '14 weeks (3.5 months)', mg: 'herinandro 14 (volana 3½)', wo: '14 ayubés (3½ weer)' },
};
import { getAgeInMonths } from '@/lib/age-utils';
import { getLocalizedField } from '@/lib/i18n-data';
import { generateId } from '@/lib/utils';
import type { Country, Sex, ChildProfile } from '@/types/child';
import { Baby, Calendar, Ruler, ShieldCheck, ArrowRight, ArrowLeft, Sparkles, Search, Check } from 'lucide-react';

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

export function OnboardingFlow() {
  const { t, i18n } = useTranslation();
  const { setProfile, toggleVaccine } = useBaby();
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [sex, setSex] = useState<Sex | ''>('');
  const [birthWeight, setBirthWeight] = useState('');
  const [birthHeight, setBirthHeight] = useState('');
  const [country, setCountry] = useState<Country | ''>('');
  const [selectedVaccines, setSelectedVaccines] = useState<string[]>([]);
  const [parentRole, setParentRole] = useState<'maman' | 'papa' | 'parent' | ''>('');

  const totalSteps = 6;

  const next = () => { setDir(1); setStep(s => Math.min(s + 1, totalSteps)); };
  const prev = () => { setDir(-1); setStep(s => Math.max(s - 1, 1)); };

  const canProceed = () => {
    switch (step) {
      case 1: return name.trim().length > 0;
      case 2: return birthDate !== '' && sex !== '';
      case 3: return birthWeight !== '' && birthHeight !== '';
      case 4: return country !== '';
      case 5: return true;
      case 6: return parentRole !== '';
      default: return false;
    }
  };

  const finish = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FF2D78', '#FF7F5E', '#FFA641', '#fff', '#ffd6ea'],
    });
    const profile: ChildProfile = {
      id: generateId(),
      name: name.trim(),
      birthDate,
      sex: sex as Sex,
      birthWeight: parseFloat(birthWeight),
      birthHeight: parseFloat(birthHeight),
      country: country as Country,
      createdAt: new Date().toISOString(),
      parentRole: (parentRole as 'maman' | 'papa' | 'parent') || 'parent',
    };
    setProfile(profile);
    selectedVaccines.forEach(v => toggleVaccine(v));
  };

  const applicableVaccines = () => {
    if (!birthDate || !country) return [];
    const ageMonths = getAgeInMonths(birthDate);
    return vaccines.filter(v => v.country.includes(country as Country) && v.ageMonths <= ageMonths);
  };

  const vaccineGroups = () => {
    const applicable = applicableVaccines();
    const groups: { ageKey: string; ageMonths: number; label: string; vaccineIds: string[]; vaccineNames: string[] }[] = [];
    const seen = new Set<string>();
    const isPEV = COUNTRIES.find(c => c.code === country)?.schedule === 'pev-base';
    const lang = i18n.language as 'fr' | 'en' | 'mg' | 'wo';
    for (const v of applicable) {
      const ageKey = v.ageLabel.fr;
      if (!seen.has(ageKey)) {
        seen.add(ageKey);
        let ageDisplay: string;
        if (isPEV && PEV_WEEK_LABELS[ageKey]) {
          ageDisplay = PEV_WEEK_LABELS[ageKey][lang] ?? PEV_WEEK_LABELS[ageKey].fr;
        } else {
          ageDisplay = getLocalizedField(v.ageLabel);
        }
        const groupLabel = v.ageMonths === 0
          ? t('onboarding.birth_vaccines')
          : t('onboarding.age_vaccines', { age: ageDisplay });
        const vaccineIds = applicable.filter(vv => vv.ageLabel.fr === ageKey).map(vv => vv.id);
        const vaccineNames = applicable.filter(vv => vv.ageLabel.fr === ageKey).map(vv => getLocalizedField(vv.name));
        groups.push({ ageKey, ageMonths: v.ageMonths, label: groupLabel, vaccineIds, vaccineNames });
      }
    }
    return groups;
  };

  const toggleVaccineSelection = (id: string) => {
    setSelectedVaccines(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
  };

  const toggleVaccineGroup = (ids: string[]) => {
    const allSelected = ids.every(id => selectedVaccines.includes(id));
    if (allSelected) {
      setSelectedVaccines(prev => prev.filter(id => !ids.includes(id)));
    } else {
      setSelectedVaccines(prev => [...new Set([...prev, ...ids])]);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-ivory-100 flex flex-col safe-top safe-bottom">
      {/* Progress bar */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-ivory-400">
              <motion.div
                className="h-full bg-forest-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: i < step ? '100%' : '0%' }}
                transition={{ duration: 0.4 }}
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-bark-400 mt-2 font-body">{t('onboarding.step_of', { current: step, total: totalSteps })}</p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 overflow-hidden relative">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`absolute inset-0 px-6 flex flex-col ${step === 4 || step === 5 ? 'justify-start pt-4' : 'justify-center'}`}
          >
            {step === 1 && (
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center mx-auto">
                  <Baby className="w-8 h-8 text-forest-500" />
                </div>
                <div className="text-center">
                  <h1 className="font-heading text-2xl font-bold text-bark-800">{t('onboarding.welcome_title')}</h1>
                  <p className="text-bark-500 mt-2">{t('onboarding.welcome_subtitle')}</p>
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t('onboarding.name_placeholder')}
                  className="w-full px-5 py-4 rounded-2xl bg-ivory-50 text-bark-800 font-medium text-lg placeholder:text-ivory-500 focus:outline-none focus:ring-2 focus:ring-forest-300 transition-all"
                  autoFocus
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center mx-auto">
                  <Calendar className="w-8 h-8 text-forest-500" />
                </div>
                <div className="text-center">
                  <h1 className="font-heading text-2xl font-bold text-bark-800">{t('onboarding.birth_date_title', { name })}</h1>
                  <p className="text-bark-500 mt-2">{t('onboarding.birth_date_subtitle')}</p>
                </div>
                <input
                  type="date"
                  value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-5 py-4 rounded-2xl bg-ivory-50 text-bark-800 font-medium focus:outline-none focus:ring-2 focus:ring-forest-300"
                />
                <div className="flex gap-4">
                  {([['boy', '\u{1F466}', t('common.boy')], ['girl', '\u{1F467}', t('common.girl')]] as const).map(([val, emoji, label]) => (
                    <button
                      key={val}
                      onClick={() => setSex(val as Sex)}
                      className={`flex-1 py-4 rounded-2xl font-heading font-semibold text-lg transition-all ${
                        sex === val
                          ? 'bg-forest-600 text-white shadow-lg shadow-forest-600/25'
                          : 'bg-ivory-50 text-bark-600 hover:bg-ivory-200'
                      }`}
                    >
                      {emoji} {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center mx-auto">
                  <Ruler className="w-8 h-8 text-forest-500" />
                </div>
                <div className="text-center">
                  <h1 className="font-heading text-2xl font-bold text-bark-800">{t('onboarding.measurements_title')}</h1>
                  <p className="text-bark-500 mt-2">{t('onboarding.measurements_subtitle')}</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-bark-600 mb-1 block">{t('onboarding.weight_kg')}</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0.5"
                      max="6"
                      value={birthWeight}
                      onChange={e => setBirthWeight(e.target.value)}
                      placeholder={t('onboarding.weight_example')}
                      className="w-full px-5 py-4 rounded-2xl bg-ivory-50 text-bark-800 font-medium focus:outline-none focus:ring-2 focus:ring-forest-300"
                    />
                    {birthWeight && (parseFloat(birthWeight) < 0.5 || parseFloat(birthWeight) > 6) && (
                      <p className="text-xs text-red-500 mt-1 px-1">{t('onboarding.weight_range_error')}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-bark-600 mb-1 block">{t('onboarding.height_cm')}</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      min="30"
                      max="65"
                      value={birthHeight}
                      onChange={e => setBirthHeight(e.target.value)}
                      placeholder={t('onboarding.height_example')}
                      className="w-full px-5 py-4 rounded-2xl bg-ivory-50 text-bark-800 font-medium focus:outline-none focus:ring-2 focus:ring-forest-300"
                    />
                    {birthHeight && (parseFloat(birthHeight) < 30 || parseFloat(birthHeight) > 65) && (
                      <p className="text-xs text-red-500 mt-1 px-1">{t('onboarding.height_range_error')}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <CountryPicker
                name={name}
                country={country}
                onPick={setCountry}
              />
            )}

            {step === 6 && (
              <div className="flex flex-col items-center justify-center gap-6">
                <div className="text-5xl">👨‍👩‍👧</div>
                <div className="text-center">
                  <h1 className="font-heading text-2xl font-bold text-bark-800">{t('onboarding.parent_role_title')}</h1>
                  <p className="text-bark-500 text-sm mt-2">{t('onboarding.parent_role_subtitle')}</p>
                </div>
                <div className="flex flex-col gap-3 w-full">
                  {([
                    { id: 'maman' as const, emoji: '👩', label: t('onboarding.parent_maman') },
                    { id: 'papa'  as const, emoji: '👨', label: t('onboarding.parent_papa')  },
                    { id: 'parent' as const, emoji: '🧑', label: t('onboarding.parent_other') },
                  ]).map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setParentRole(opt.id)}
                      className={`w-full p-4 rounded-2xl flex items-center gap-4 text-left transition-all ${
                        parentRole === opt.id ? 'bg-violet-100 ring-2 ring-violet-500' : 'bg-ivory-50'
                      }`}
                    >
                      <span className="text-3xl">{opt.emoji}</span>
                      <span className="font-heading font-bold text-bark-800 text-lg">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6 overflow-y-auto max-h-[65dvh] no-scrollbar pb-4">
                <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-8 h-8 text-forest-500" />
                </div>
                <div className="text-center">
                  <h1 className="font-heading text-2xl font-bold text-bark-800">{t('onboarding.vaccines_title')}</h1>
                  <p className="text-bark-500 mt-2">{t('onboarding.vaccines_subtitle', { name })}</p>
                </div>
                <div className="space-y-2">
                  {vaccineGroups().length === 0 ? (
                    <p className="text-center text-bark-500 py-8">{t('onboarding.vaccines_too_young', { name })}</p>
                  ) : (
                    vaccineGroups().map(group => {
                      const allSelected = group.vaccineIds.every(id => selectedVaccines.includes(id));
                      return (
                        <button
                          key={group.ageKey}
                          onClick={() => toggleVaccineGroup(group.vaccineIds)}
                          className={`w-full p-4 rounded-2xl flex items-center gap-3 text-left transition-all ${
                            allSelected
                              ? 'bg-forest-100 ring-2 ring-forest-600'
                              : 'bg-ivory-50'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            allSelected ? 'bg-forest-600 border-forest-600' : 'border-ivory-400'
                          }`}>
                            {allSelected && (
                              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-bark-800">{group.label}</p>
                            <p className="text-xs text-bark-500 truncate">{group.vaccineNames.join(' · ')}</p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="px-6 pb-8 pt-4 flex gap-3 safe-bottom">
        {step > 1 && (
          <button onClick={prev} className="px-6 py-4 rounded-full bg-ivory-200 text-bark-600 font-semibold">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={step === totalSteps ? finish : next}
          disabled={!canProceed()}
          className={`flex-1 py-4 rounded-full font-heading font-bold text-lg flex items-center justify-center gap-2 transition-all ${
            canProceed()
              ? 'bg-forest-600 text-white shadow-lg shadow-forest-600/30 active:scale-[0.98]'
              : 'bg-ivory-300 text-ivory-500 cursor-not-allowed'
          }`}
        >
          {step === totalSteps ? (
            <>{t('onboarding.start')} <Sparkles className="w-5 h-5" /></>
          ) : (
            <>{t('onboarding.continue')} <ArrowRight className="w-5 h-5" /></>
          )}
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// CountryPicker — grid searchable groupé par région, glassmorphism
// ────────────────────────────────────────────────────────────────

interface CountryPickerProps {
  name: string;
  country: Country | '';
  onPick: (code: Country) => void;
}

function CountryPicker({ name, country, onPick }: CountryPickerProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(c =>
      c.label.toLowerCase().includes(q) || c.code.includes(q),
    );
  }, [query]);

  const byRegion = useMemo(() => {
    const map = new Map<string, typeof COUNTRIES>();
    for (const c of filtered) {
      const arr = map.get(c.region) || [];
      arr.push(c);
      map.set(c.region, arr);
    }
    return map;
  }, [filtered]);

  return (
    <div className="flex flex-col h-full pt-2">
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
        <span className="text-3xl">🌍</span>
      </div>
      <div className="text-center mt-4">
        <h1 className="font-heading text-2xl font-bold text-bark-800">
          {t('onboarding.country_title', { name: name || t('onboarding.baby_fallback') })}
        </h1>
        <p className="text-bark-500 mt-1 text-sm">
          {t('onboarding.country_subtitle')}
        </p>
      </div>

      {/* Barre de recherche glass */}
      <div className="mt-5 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bark-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t('onboarding.country_search')}
          className="w-full glass-card pl-11 pr-4 py-3.5 rounded-2xl text-bark-800 placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-forest-300 text-sm"
        />
      </div>

      {/* Liste groupée par région — scroll interne */}
      <div className="flex-1 overflow-y-auto no-scrollbar mt-4 -mx-2 px-2 pb-6 min-h-0">
        {REGION_ORDER.map(region => {
          const countries = byRegion.get(region);
          if (!countries || countries.length === 0) return null;
          return (
            <div key={region} className="mb-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-bark-400 font-semibold mb-2 px-1">
                {t(`onboarding.regions.${region}`)}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {countries.map(c => {
                  const selected = country === c.code;
                  return (
                    <button
                      key={c.code}
                      onClick={() => onPick(c.code)}
                      className={`relative py-3.5 px-3.5 rounded-2xl flex items-center gap-3 text-left transition-all ${
                        selected
                          ? 'bg-forest-600 text-white shadow-lg shadow-forest-600/30'
                          : 'glass-card text-bark-700'
                      }`}
                    >
                      <span className="text-2xl flex-shrink-0">{c.flag}</span>
                      <span className="text-sm font-semibold leading-tight">{c.label}</span>
                      {selected && (
                        <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white/25 backdrop-blur flex items-center justify-center">
                          <Check className="w-3 h-3" strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-bark-400 text-sm py-8">
            {t('onboarding.country_no_results', { query })}
          </p>
        )}
      </div>
    </div>
  );
}
