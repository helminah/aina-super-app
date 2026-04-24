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
  const { profile, babies, activeBabyId, switchBaby, isVaccineDone, weightEntries, dailyLogs, getLogsForDate, checkVaccineReminders } = useBaby();
  const navigate = useNavigate();
  const [showEmergency, setShowEmergency] = useState(false);
  const [showBabyMenu, setShowBabyMenu] = useState(false);

  if (!profile) return null;

  const ageText = getAgeText(profile.birthDate);
  const ageMonths = getAgeInMonths(profile.birthDate);

  // Vaccine reminders
  const vaccineReminders = checkVaccineReminders();
  const overdueReminders = vaccineReminders.filter(r => r.status === 'overdue');
  const soonReminders = vaccineReminders.filter(r => r.status === 'soon');

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
      case 'feed': return 'Biberon / Tétée';
      case 'sleep': return 'Sieste / Dodo';
      case 'diaper': return 'Couche';
      case 'mood': return 'Humeur';
      default: return type;
    }
  };
  const logTypeEmoji = (type: string) => {
    switch (type) {
      case 'feed': return '🍼';
      case 'sleep': return '🌙';
      case 'diaper': return '👶';
      case 'mood': return '😊';
      default: return '📋';
    }
  };

  const emergencySteps = [
    { title: 'Évaluez la situation', desc: 'Bébé tousse-t-il ? Peut-il pleurer ou émettre des sons ? Si oui, encouragez-le à tousser.' },
    { title: 'Position', desc: 'Placez bébé à plat ventre sur votre avant-bras, tête plus basse que le corps, en soutenant sa mâchoire.' },
    { title: '5 tapes dans le dos', desc: 'Donnez 5 tapes fermes entre les omoplates avec le talon de votre main.' },
    { title: '5 compressions thoraciques', desc: 'Retournez bébé sur le dos. Effectuez 5 compressions au milieu du sternum avec 2 doigts.' },
    { title: 'Répétez ou appelez les secours', desc: 'Alternez tapes et compressions. Si l\'obstruction persiste, appelez immédiatement le SAMU (15) ou les pompiers (18).' },
  ];

  const formatVaccineDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="pb-24 safe-top bg-ivory-100 min-h-full relative">
      {/* Hero editorial : mesh gradient + serif display */}
      <div className="relative brand-mesh grain overflow-hidden pt-10 pb-16 px-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 hero-text"
        >
          <p className="text-sm text-white/80 font-medium tracking-wide">
            Bonjour, maman de
          </p>
          <div className="flex items-end gap-3 mt-1">
            <h1
              className={`font-display text-white leading-[0.95] font-semibold ${profile.name.length > 8 ? 'text-5xl' : profile.name.length > 6 ? 'text-[3.5rem]' : 'text-6xl'}`}
            >
              {profile.name}
            </h1>
            {babies.length > 1 && (
              <div className="relative mb-1">
                <button
                  onClick={() => setShowBabyMenu(!showBabyMenu)}
                  className="w-8 h-8 rounded-full bg-white/25 backdrop-blur flex items-center justify-center"
                >
                  <ChevronRight className={`w-4 h-4 text-white transition-transform ${showBabyMenu ? 'rotate-90' : ''}`} />
                </button>
                {showBabyMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowBabyMenu(false)} />
                    <div className="absolute top-10 left-0 z-20 bg-white rounded-xl shadow-lg p-2 min-w-[180px]">
                      {babies.filter(b => b.id !== activeBabyId).map(baby => (
                        <button
                          key={baby.id}
                          onClick={() => { switchBaby(baby.id); setShowBabyMenu(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-ivory-100 transition-colors"
                        >
                          <span className="text-lg">{baby.sex === 'boy' ? '👦' : '👧'}</span>
                          <span className="text-sm font-semibold text-bark-800">{baby.name}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          <p className="text-white/95 text-sm mt-2.5 font-medium tracking-wide">{ageText}</p>
        </motion.div>
      </div>

      <div className="px-5 -mt-8 relative z-10 animate-stagger">

        {/* ── Vaccine Reminder Banner ── */}
        {(overdueReminders.length > 0 || soonReminders.length > 0) && (
          <button
            onClick={() => navigate('/health')}
            className="w-full mb-4 text-left"
          >
            <div className={`rounded-2xl px-5 py-4 flex items-start gap-3 ${overdueReminders.length > 0 ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${overdueReminders.length > 0 ? 'bg-red-100' : 'bg-amber-100'}`}>
                <ShieldCheck className={`w-5 h-5 ${overdueReminders.length > 0 ? 'text-red-500' : 'text-amber-500'}`} />
              </div>
              <div className="flex-1">
                <p className={`font-heading font-bold text-sm ${overdueReminders.length > 0 ? 'text-red-700' : 'text-amber-700'}`}>
                  {overdueReminders.length > 0
                    ? `${overdueReminders.length} vaccin${overdueReminders.length > 1 ? 's' : ''} en retard`
                    : `${soonReminders.length} vaccin${soonReminders.length > 1 ? 's' : ''} à venir`}
                </p>
                <p className={`text-xs mt-0.5 ${overdueReminders.length > 0 ? 'text-red-500' : 'text-amber-500'}`}>
                  {overdueReminders.length > 0
                    ? overdueReminders.slice(0, 2).map(r => r.vaccineName).join(', ')
                    : soonReminders.slice(0, 2).map(r => r.vaccineName).join(', ')}
                  {(overdueReminders.length > 2 || soonReminders.length > 2) && '…'}
                </p>
              </div>
              <ChevronRight className={`w-4 h-4 mt-1 ${overdueReminders.length > 0 ? 'text-red-400' : 'text-amber-400'}`} />
            </div>
          </button>
        )}

        {/* Conseil du jour — surface blanche, accent ambré (rythme visuel après hero rose) */}
        <div className="bg-white rounded-2xl p-5 mb-4 elev-2">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-100 to-terra-100 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-amber-500" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] text-amber-500 font-semibold uppercase tracking-[0.15em]">
                {tip.categoryEmoji} Conseil du jour
              </p>
              <p className="font-heading font-bold text-bark-800 mt-1">{tip.title}</p>
              <p className="text-sm text-bark-500 mt-1 leading-relaxed">{tip.content}</p>
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
              {latestWeight ? 'dernier relevé' : 'naissance'}
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

        {/* ── Activités Récentes ── */}
        {recentLogs.length > 0 && (
          <div className="bg-ivory-50 rounded-2xl p-5 mb-4 ambient-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="font-heading font-bold text-bark-800">Activités Récentes</p>
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
            Suivi pédiatrique avec{' '}
            <span className="font-semibold text-forest-600">Dr Helminah</span>
          </p>
        </div>

      </div>

      {/* FAB Mode Urgence — flottant, discret mais accessible */}
      <motion.button
        onClick={() => setShowEmergency(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 22 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-24 right-5 z-30 flex items-center gap-2 pr-5 pl-3.5 py-3 rounded-full bg-red-500 text-white shadow-[0_12px_30px_-8px_rgba(239,68,68,0.55)]"
        aria-label="Mode urgence"
      >
        <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4" />
        </span>
        <span className="font-heading font-bold text-xs uppercase tracking-wider">SOS</span>
      </motion.button>

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
                    {'🚨'} Fausse Route - Bébé
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
