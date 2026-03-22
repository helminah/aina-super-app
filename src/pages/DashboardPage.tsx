import { useState } from 'react';
import { useBaby } from '@/contexts/BabyContext';
import { getAgeText, getAgeInMonths } from '@/lib/age-utils';
import { vaccines } from '@/data/vaccines';
import { recipes } from '@/data/recipes';
import { getTipOfTheDay } from '@/data/daily-tips';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  ShieldCheck,
  Lightbulb,
  X,
  Phone,
  ChevronRight,
  Moon,
  Scale,
  Clock,
} from 'lucide-react';

export function DashboardPage() {
  const { profile, isVaccineDone, weightEntries, dailyLogs, getLogsForDate } = useBaby();
  const navigate = useNavigate();
  const [showEmergency, setShowEmergency] = useState(false);

  if (!profile) return null;

  const ageText = getAgeText(profile.birthDate);
  const ageMonths = getAgeInMonths(profile.birthDate);

  // Next vaccine
  const countryVaccines = vaccines
    .filter(v => v.country.includes(profile.country))
    .sort((a, b) => a.ageMonths - b.ageMonths);
  const nextVaccine = countryVaccines.find(v => !isVaccineDone(v.id));

  // Days until next vaccine
  const getVaccineDaysRemaining = () => {
    if (!nextVaccine) return null;
    const birthDate = new Date(profile.birthDate);
    const vaccineDate = new Date(birthDate);
    vaccineDate.setMonth(vaccineDate.getMonth() + nextVaccine.ageMonths);
    const now = new Date();
    const diffMs = vaccineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return { days: diffDays, date: vaccineDate };
  };
  const vaccineTiming = getVaccineDaysRemaining();

  // Today's recipe suggestion
  const dayIndex = new Date().getDate();
  const ageApplicable = recipes.filter(r => r.age <= Math.max(6, Math.min(12, ageMonths)));
  const suggestedRecipe = ageApplicable.length > 0 ? ageApplicable[dayIndex % ageApplicable.length] : null;

  // Tip of the day
  const tip = getTipOfTheDay(ageMonths);

  // Latest weight
  const latestWeight = weightEntries.length > 0 ? weightEntries[weightEntries.length - 1] : null;

  // Today's sleep logs
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = getLogsForDate(today);
  const sleepLogs = todayLogs.filter(l => l.type === 'sleep');
  const totalSleepMin = sleepLogs.reduce((sum, l) => {
    const details = l.details as { duration?: number };
    return sum + (details.duration || 0);
  }, 0);
  const sleepHours = Math.floor(totalSleepMin / 60);
  const sleepMinutes = totalSleepMin % 60;

  // Recent activity (last 5 logs)
  const recentLogs = dailyLogs.slice(0, 5);

  const logTypeLabel = (type: string) => {
    switch (type) {
      case 'feed': return 'Biberon / T\u00e9t\u00e9e';
      case 'sleep': return 'Sieste / Dodo';
      case 'diaper': return 'Couche';
      case 'mood': return 'Humeur';
      default: return type;
    }
  };
  const logTypeEmoji = (type: string) => {
    switch (type) {
      case 'feed': return '\ud83c\udf7c';
      case 'sleep': return '\ud83c\udf19';
      case 'diaper': return '\ud83d\udc76';
      case 'mood': return '\ud83d\ude0a';
      default: return '\ud83d\udccb';
    }
  };

  const emergencySteps = [
    { title: '\u00c9valuez la situation', desc: 'B\u00e9b\u00e9 tousse-t-il ? Peut-il pleurer ou \u00e9mettre des sons ? Si oui, encouragez-le \u00e0 tousser.' },
    { title: 'Position', desc: 'Placez b\u00e9b\u00e9 \u00e0 plat ventre sur votre avant-bras, t\u00eate plus basse que le corps, en soutenant sa m\u00e2choire.' },
    { title: '5 tapes dans le dos', desc: 'Donnez 5 tapes fermes entre les omoplates avec le talon de votre main.' },
    { title: '5 compressions thoraciques', desc: 'Retournez b\u00e9b\u00e9 sur le dos. Effectuez 5 compressions au milieu du sternum avec 2 doigts.' },
    { title: 'R\u00e9p\u00e9tez ou appelez les secours', desc: 'Alternez tapes et compressions. Si l\'obstruction persiste, appelez imm\u00e9diatement le SAMU (15) ou les pompiers (18).' },
  ];

  const formatVaccineDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="px-5 pt-6 pb-6 safe-top bg-ivory-100 min-h-full">
      <div className="animate-stagger">

        {/* ── Editorial Header ── */}
        <div className="mb-6">
          <p className="text-sm text-bark-500 font-body">Bonjour, maman de</p>
          <h1 className="font-heading text-3xl font-bold text-bark-800 tracking-tight">
            {profile.name} <span className="inline-block">{'\ud83c\udf3f'}</span>
          </h1>
          <p className="text-sm text-forest-600 font-semibold mt-1">{ageText}</p>
        </div>

        {/* ── MODE URGENCE Button (forest green bg) ── */}
        <button
          onClick={() => setShowEmergency(true)}
          className="w-full mb-5 relative overflow-hidden"
        >
          <div className="relative flex items-center gap-3 bg-forest-600 rounded-2xl px-5 py-4 ambient-shadow">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div className="text-left flex-1">
              <p className="font-heading font-bold text-white text-base">MODE URGENCE</p>
              <p className="text-xs text-white/70">Fausse route &middot; Gestes de premiers secours</p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/60" />
          </div>
        </button>

        {/* ── Conseil du jour (forest green card, white text) ── */}
        <div className="bg-forest-600 rounded-2xl p-5 mb-4 ambient-shadow">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-white/70 font-semibold uppercase tracking-wide">
                {tip.categoryEmoji} Conseil du jour
              </p>
              <p className="font-heading font-bold text-white mt-0.5">{tip.title}</p>
              <p className="text-sm text-white/80 mt-1 leading-relaxed">{tip.content}</p>
            </div>
          </div>
        </div>

        {/* ── Vaccine Card with days remaining ── */}
        {nextVaccine && (
          <button
            onClick={() => navigate('/health')}
            className="w-full bg-ivory-50 rounded-2xl p-5 mb-4 ambient-shadow text-left"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-forest-100 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-forest-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-forest-600 font-semibold uppercase tracking-wide">
                  Prochain Vaccin
                </p>
                <p className="font-heading font-bold text-bark-800 mt-0.5">{nextVaccine.name}</p>
                {vaccineTiming && (
                  <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                    {vaccineTiming.days > 0 ? (
                      <span className="text-sm font-semibold text-terra-500">
                        Dans {vaccineTiming.days} jour{vaccineTiming.days > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-terra-500">
                        En retard
                      </span>
                    )}
                    <span className="text-bark-300">&middot;</span>
                    <span className="text-xs text-bark-500">
                      {formatVaccineDate(vaccineTiming.date)}
                    </span>
                  </div>
                )}
                <p className="text-xs text-bark-400 mt-0.5">{nextVaccine.diseases}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-bark-300 mt-1" />
            </div>
          </button>
        )}

        {/* ── Sleep + Weight Side-by-Side ── */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Sleep Summary */}
          <div className="bg-ivory-50 rounded-2xl p-4 ambient-shadow">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-forest-100 flex items-center justify-center">
                <Moon className="w-4 h-4 text-forest-600" />
              </div>
              <p className="text-xs text-bark-500 font-semibold uppercase tracking-wide">Sommeil</p>
            </div>
            {totalSleepMin > 0 ? (
              <p className="font-heading text-xl font-bold text-bark-800">
                {sleepHours}h{sleepMinutes > 0 ? `${sleepMinutes.toString().padStart(2, '0')}` : ''}
              </p>
            ) : (
              <p className="font-heading text-sm text-bark-400">Pas encore</p>
            )}
            <p className="text-xs text-bark-400 mt-0.5">aujourd&apos;hui</p>
          </div>

          {/* Weight Widget */}
          <div className="bg-ivory-50 rounded-2xl p-4 ambient-shadow">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-forest-100 flex items-center justify-center">
                <Scale className="w-4 h-4 text-forest-600" />
              </div>
              <p className="text-xs text-bark-500 font-semibold uppercase tracking-wide">Poids</p>
            </div>
            {latestWeight ? (
              <p className="font-heading text-xl font-bold text-bark-800">
                {latestWeight.weight} kg
              </p>
            ) : (
              <p className="font-heading text-sm text-bark-400">
                {profile.birthWeight} kg
              </p>
            )}
            <p className="text-xs text-bark-400 mt-0.5">
              {latestWeight ? 'dernier relev\u00e9' : 'naissance'}
            </p>
          </div>
        </div>

        {/* ── Recipe Suggestion ── */}
        {suggestedRecipe && ageMonths >= 6 && (
          <button
            onClick={() => navigate(`/recipe/${suggestedRecipe.id}`)}
            className="w-full bg-ivory-50 rounded-2xl p-5 mb-4 ambient-shadow text-left"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-terra-50 flex items-center justify-center flex-shrink-0 text-2xl">
                {suggestedRecipe.emoji}
              </div>
              <div className="flex-1">
                <p className="text-xs text-terra-500 font-semibold uppercase tracking-wide">
                  Suggestion du jour
                </p>
                <p className="font-heading font-bold text-bark-800 mt-0.5">
                  Suggestion : {suggestedRecipe.title} ({ageMonths} mois+)
                </p>
                <p className="text-sm text-bark-500 mt-0.5">
                  pour ses {ageMonths} mois &middot; {suggestedRecipe.time} min &middot; {suggestedRecipe.kcal} kcal
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-bark-300 mt-1" />
            </div>
          </button>
        )}

        {/* ── Activit\u00e9s R\u00e9centes ── */}
        {recentLogs.length > 0 && (
          <div className="bg-ivory-50 rounded-2xl p-5 mb-4 ambient-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="font-heading font-bold text-bark-800">Activit\u00e9s R\u00e9centes</p>
              <button
                onClick={() => navigate('/journal')}
                className="text-xs text-forest-600 font-semibold"
              >
                Voir tout
              </button>
            </div>
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-ivory-200 flex items-center justify-center flex-shrink-0 text-base">
                    {logTypeEmoji(log.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-bark-800 truncate">
                      {logTypeLabel(log.type)}
                    </p>
                    <p className="text-xs text-bark-400">{log.date} &middot; {log.time}</p>
                  </div>
                  <Clock className="w-3.5 h-3.5 text-bark-300 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Footer: Dr Helminah ── */}
        <div className="mt-2 mb-4 text-center">
          <p className="text-xs text-bark-400">
            Suivi p\u00e9diatrique avec{' '}
            <span className="font-semibold text-forest-600">Dr Helminah</span>
          </p>
        </div>

      </div>

      {/* ── Emergency Modal ── */}
      <AnimatePresence>
        {showEmergency && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center"
            onClick={() => setShowEmergency(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-[480px] bg-ivory-50 rounded-t-3xl max-h-[85dvh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-heading text-xl font-bold text-terra-500">
                    {'\ud83d\udea8'} Fausse Route - B\u00e9b\u00e9
                  </h2>
                  <button
                    onClick={() => setShowEmergency(false)}
                    className="w-8 h-8 rounded-full bg-ivory-200 flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-bark-600" />
                  </button>
                </div>
                <div className="space-y-4 mb-6">
                  {emergencySteps.map((s, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-terra-500 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-heading font-bold text-bark-800">{s.title}</p>
                        <p className="text-sm text-bark-500 mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <a
                  href="tel:15"
                  className="w-full py-4 rounded-full bg-terra-500 text-white font-heading font-bold text-lg flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" /> Appeler le SAMU (15)
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
