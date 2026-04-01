import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBaby } from '@/contexts/BabyContext';
import { vaccines } from '@/data/vaccines';
import { getAgeInMonths } from '@/lib/age-utils';
import { generateId } from '@/lib/utils';
import type { Country, Sex, ChildProfile } from '@/types/child';
import { Baby, Calendar, Ruler, Globe, ShieldCheck, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

export function OnboardingFlow() {
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

  const totalSteps = 5;

  const next = () => { setDir(1); setStep(s => Math.min(s + 1, totalSteps)); };
  const prev = () => { setDir(-1); setStep(s => Math.max(s - 1, 1)); };

  const canProceed = () => {
    switch (step) {
      case 1: return name.trim().length > 0;
      case 2: return birthDate !== '' && sex !== '';
      case 3: return birthWeight !== '' && birthHeight !== '';
      case 4: return country !== '';
      case 5: return true;
      default: return false;
    }
  };

  const finish = () => {
    const profile: ChildProfile = {
      id: generateId(),
      name: name.trim(),
      birthDate,
      sex: sex as Sex,
      birthWeight: parseFloat(birthWeight),
      birthHeight: parseFloat(birthHeight),
      country: country as Country,
      completedVaccines: selectedVaccines,
      createdAt: new Date().toISOString(),
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
    const groups: { ageLabel: string; ageMonths: number; label: string; vaccineIds: string[] }[] = [];
    const seen = new Set<string>();
    for (const v of applicable) {
      if (!seen.has(v.ageLabel)) {
        seen.add(v.ageLabel);
        const groupLabel = v.ageMonths === 0 ? 'Vaccins de naissance' : `Vaccins de ${v.ageLabel}`;
        groups.push({ ageLabel: v.ageLabel, ageMonths: v.ageMonths, label: groupLabel, vaccineIds: applicable.filter(vv => vv.ageLabel === v.ageLabel).map(vv => vv.id) });
      }
    }
    return groups;
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
        <p className="text-xs text-bark-400 mt-2 font-body">Étape {step} sur {totalSteps}</p>
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
            className="absolute inset-0 px-6 flex flex-col justify-center"
          >
            {step === 1 && (
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center mx-auto">
                  <Baby className="w-8 h-8 text-forest-500" />
                </div>
                <div className="text-center">
                  <h1 className="font-heading text-2xl font-bold text-bark-800">Bienvenue dans AINA</h1>
                  <p className="text-bark-500 mt-2">Quel est le doux prénom de votre bébé ?</p>
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Prénom de bébé"
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
                  <h1 className="font-heading text-2xl font-bold text-bark-800">Quand est-ce que {name} a pointé le bout de son nez ?</h1>
                  <p className="text-bark-500 mt-2">Et est-ce un petit garçon ou une petite fille ?</p>
                </div>
                <input
                  type="date"
                  value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-5 py-4 rounded-2xl bg-ivory-50 text-bark-800 font-medium focus:outline-none focus:ring-2 focus:ring-forest-300"
                />
                <div className="flex gap-4">
                  {([['boy', '\u{1F466}', 'Garçon'], ['girl', '\u{1F467}', 'Fille']] as const).map(([val, emoji, label]) => (
                    <button
                      key={val}
                      onClick={() => setSex(val)}
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
                  <h1 className="font-heading text-2xl font-bold text-bark-800">Mensurations à la naissance</h1>
                  <p className="text-bark-500 mt-2">Nous en avons besoin pour suivre sa croissance.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-bark-600 mb-1 block">Poids (kg)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.5"
                      max="6"
                      value={birthWeight}
                      onChange={e => setBirthWeight(e.target.value)}
                      placeholder="ex: 3.25"
                      className="w-full px-5 py-4 rounded-2xl bg-ivory-50 text-bark-800 font-medium focus:outline-none focus:ring-2 focus:ring-forest-300"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-bark-600 mb-1 block">Taille (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="30"
                      max="60"
                      value={birthHeight}
                      onChange={e => setBirthHeight(e.target.value)}
                      placeholder="ex: 50"
                      className="w-full px-5 py-4 rounded-2xl bg-ivory-50 text-bark-800 font-medium focus:outline-none focus:ring-2 focus:ring-forest-300"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center mx-auto">
                  <Globe className="w-8 h-8 text-forest-500" />
                </div>
                <div className="text-center">
                  <h1 className="font-heading text-2xl font-bold text-bark-800">Où grandit {name} ?</h1>
                  <p className="text-bark-500 mt-2">Le calendrier vaccinal sera adapté à votre pays.</p>
                </div>
                <div className="space-y-3">
                  {([['senegal', '\u{1F1F8}\u{1F1F3}', 'Sénégal'], ['france', '\u{1F1EB}\u{1F1F7}', 'France'], ['madagascar', '\u{1F1F2}\u{1F1EC}', 'Madagascar']] as const).map(([val, flag, label]) => (
                    <button
                      key={val}
                      onClick={() => setCountry(val)}
                      className={`w-full py-4 px-6 rounded-2xl font-heading font-semibold text-lg flex items-center gap-4 transition-all ${
                        country === val
                          ? 'bg-forest-600 text-white shadow-lg shadow-forest-600/25'
                          : 'bg-ivory-50 text-bark-600 hover:bg-ivory-200'
                      }`}
                    >
                      <span className="text-3xl">{flag}</span> {label}
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
                  <h1 className="font-heading text-2xl font-bold text-bark-800">Vaccins déjà reçus</h1>
                  <p className="text-bark-500 mt-2">Cochez les vaccins que {name} a déjà reçus pour un suivi sur-mesure.</p>
                </div>
                <div className="space-y-2">
                  {vaccineGroups().length === 0 ? (
                    <p className="text-center text-bark-500 py-8">{name} est encore tout petit(e), aucun vaccin n'est attendu pour le moment.</p>
                  ) : (
                    vaccineGroups().map(group => {
                      const allSelected = group.vaccineIds.every(id => selectedVaccines.includes(id));
                      return (
                        <button
                          key={group.ageLabel}
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
                          <div>
                            <p className="font-medium text-bark-800">{group.label}</p>
                            <p className="text-xs text-bark-500">{group.vaccineIds.length} vaccin{group.vaccineIds.length > 1 ? 's' : ''}</p>
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
            <>Commencer <Sparkles className="w-5 h-5" /></>
          ) : (
            <>Continuer <ArrowRight className="w-5 h-5" /></>
          )}
        </button>
      </div>
    </div>
  );
}
