import { useState } from 'react';
import { useBaby } from '@/contexts/BabyContext';
import { getAgeText, getAgeInMonths } from '@/lib/age-utils';
import { vaccines } from '@/data/vaccines';
import { recipes } from '@/data/recipes';
import { getTipOfTheDay } from '@/data/daily-tips';
import { getLocalizedField } from '@/lib/i18n-data';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AppointmentWidget } from '@/components/dashboard/AppointmentWidget';
import { BabyAvatar } from '@/components/BabyAvatar';
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
  Pill,
} from 'lucide-react';

const EMERGENCY_NUMBERS: Record<string, string> = {
  // Europe
  france: '15', belgique: '112', suisse: '144', luxembourg: '112', canada: '911',
  // Afrique de l'Ouest
  senegal: '15', 'cote-ivoire': '185', mali: '15', 'burkina-faso': '112',
  niger: '15', benin: '15', togo: '15', guinee: '15', mauritanie: '15',
  // Afrique Centrale
  cameroun: '15', gabon: '1300', congo: '15', rdc: '12', tchad: '15', rca: '15',
  // Afrique de l'Est
  rwanda: '912', burundi: '117', djibouti: '15',
  // Océan Indien
  madagascar: '15', comores: '15', maurice: '114', seychelles: '999',
  // Maghreb
  maroc: '15', algerie: '14', tunisie: '190',
  // Amérique
  haiti: '118',
};

export function DashboardPage() {
  const { t, i18n } = useTranslation();
  const { profile, babies, activeBabyId, switchBaby, isVaccineDone, weightEntries, dailyLogs, getLogsForDate, checkVaccineReminders } = useBaby();
  const navigate = useNavigate();
  const [showEmergency, setShowEmergency] = useState(false);
  const [showBabyMenu, setShowBabyMenu] = useState(false);

  if (!profile) return null;

  const emergencyNumber = EMERGENCY_NUMBERS[profile.country] ?? '112';

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
  const ageApplicable = recipes.filter(r => r.age <= Math.max(6, Math.min(18, ageMonths)));
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

  const logTypeLabel = (type: string) => t(`journal.log_types.${type}`, { defaultValue: type });
  const logTypeEmoji = (type: string) => {
    switch (type) {
      case 'feed': return '🍼';
      case 'sleep': return '🌙';
      case 'diaper': return '👶';
      case 'mood': return '😊';
      default: return '📋';
    }
  };

  const emergencySteps = t('emergency.steps', { returnObjects: true, defaultValue: [] }) as Array<{ title: string; desc: string }>;

  const dateLocaleMap: Record<string, string> = { fr: 'fr-FR', en: 'en-US', mg: 'mg-MG', wo: 'fr-SN' };
  const dateLocale = dateLocaleMap[i18n.language.split('-')[0]] || 'fr-FR';
  const formatVaccineDate = (date: Date) => {
    return date.toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' });
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
          <div className="flex items-center gap-3">
            <BabyAvatar baby={profile} size="sm" ring />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/80 font-medium tracking-wide">
                {t('dashboard.hello_mom_of')}
              </p>
              <p className="text-white/95 text-xs font-medium tracking-wide">{ageText}</p>
            </div>
          </div>
          <div className="flex items-end gap-3 mt-3">
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
                    ? t('dashboard.vaccines_overdue', { count: overdueReminders.length })
                    : t('dashboard.vaccines_upcoming', { count: soonReminders.length })}
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

        {/* Rendez-vous à venir */}
        <div className="mb-4">
          <AppointmentWidget />
        </div>

        {/* Conseil du jour — surface blanche, accent ambré (rythme visuel après hero rose) */}
        <div className="bg-white rounded-2xl p-5 mb-4 elev-2">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-100 to-terra-100 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-amber-500" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] text-amber-500 font-semibold uppercase tracking-[0.15em]">
                {tip.categoryEmoji} {t('dashboard.tip_of_day')}
              </p>
              <p className="font-heading font-bold text-bark-800 mt-1">{getLocalizedField(tip.title)}</p>
              <p className="text-sm text-bark-500 mt-1 leading-relaxed">{getLocalizedField(tip.content)}</p>
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
                  {t('dashboard.next_vaccine')}
                </p>
                <p className="font-heading font-bold text-bark-800 mt-0.5">{getLocalizedField(nextVaccine.name)}</p>
                {vaccineTiming && (
                  <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                    {vaccineTiming.days > 0 ? (
                      <span className="text-sm font-semibold text-terra-500">
                        {t('dashboard.vaccine_days_remaining', { count: vaccineTiming.days })}
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-terra-500">
                        {t('dashboard.vaccine_overdue')}
                      </span>
                    )}
                    <span className="text-bark-300">&middot;</span>
                    <span className="text-xs text-bark-500">
                      {formatVaccineDate(vaccineTiming.date)}
                    </span>
                  </div>
                )}
                <p className="text-xs text-bark-400 mt-0.5">{getLocalizedField(nextVaccine.diseases)}</p>
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
              <p className="text-xs text-bark-500 font-semibold uppercase tracking-wide">{t('dashboard.sleep')}</p>
            </div>
            {totalSleepMin > 0 ? (
              <p className="font-heading text-xl font-bold text-bark-800">
                {sleepHours}h{sleepMinutes > 0 ? `${sleepMinutes.toString().padStart(2, '0')}` : ''}
              </p>
            ) : (
              <p className="font-heading text-sm text-bark-400">{t('dashboard.not_yet')}</p>
            )}
            <p className="text-xs text-bark-400 mt-0.5">{t('dashboard.today')}</p>
          </div>

          {/* Weight Widget */}
          <div className="bg-ivory-50 rounded-2xl p-4 ambient-shadow">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-forest-100 flex items-center justify-center">
                <Scale className="w-4 h-4 text-forest-600" />
              </div>
              <p className="text-xs text-bark-500 font-semibold uppercase tracking-wide">{t('dashboard.weight')}</p>
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
              {latestWeight ? t('dashboard.latest') : t('dashboard.birth_value')}
            </p>
          </div>
        </div>

        {/* ── Trousse à pharmacie (accès rapide /care) ── */}
        <button
          onClick={() => navigate('/care')}
          className="w-full bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 rounded-2xl p-4 mb-4 text-left flex items-center gap-4 active:scale-[0.99] transition-transform"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center flex-shrink-0">
            <Pill className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-[0.15em] text-red-700 font-semibold">{t('dashboard.care_kit_title')}</p>
            <p className="font-heading font-bold text-bark-800 mt-0.5 text-sm">{t('dashboard.care_kit_desc')}</p>
            <p className="text-xs text-bark-500 mt-0.5">{t('dashboard.care_kit_hint')}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-red-400 flex-shrink-0" />
        </button>

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
                  {t('dashboard.suggestion_of_day')}
                </p>
                <p className="font-heading font-bold text-bark-800 mt-0.5">
                  {t('dashboard.recipe_suggestion_template', { title: getLocalizedField(suggestedRecipe.title), months: ageMonths })}
                </p>
                <p className="text-sm text-bark-500 mt-0.5">
                  {t('dashboard.recipe_suggestion_meta', { months: ageMonths, time: suggestedRecipe.time, kcal: suggestedRecipe.kcal })}
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
              <p className="font-heading font-bold text-bark-800">{t('dashboard.recent_activity')}</p>
              <button
                onClick={() => navigate('/journal')}
                className="text-xs text-forest-600 font-semibold"
              >
                {t('common.see_all')}
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

        {/* ── Footer: Dr Helminah (cliquable → /about) ── */}
        <button
          onClick={() => navigate('/about')}
          className="mt-2 mb-4 w-full text-center py-2 rounded-xl transition-colors hover:bg-white/40 active:bg-white/60"
        >
          <p className="text-xs text-bark-400">
            {t('dashboard.pediatric_followup')}{' '}
            <span className="font-semibold text-forest-600 underline underline-offset-2 decoration-forest-300">
              Dr Helminah
            </span>
          </p>
        </button>

      </div>

      {/* FAB SOS unique (bottom-right). Trousse devient card dans le flux. Chatbot FAB est à bottom-left. */}
      <motion.button
        onClick={() => setShowEmergency(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 22 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-24 right-5 z-30 flex items-center gap-2 pr-5 pl-3.5 py-3 rounded-full bg-red-500 text-white shadow-[0_12px_30px_-8px_rgba(239,68,68,0.55)] print:hidden"
        aria-label={t('dashboard.emergency_aria')}
      >
        <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4" />
        </span>
        <span className="font-heading font-bold text-xs uppercase tracking-wider">{t('dashboard.sos_label')}</span>
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
                    {t('emergency.title')}
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
                  href={`tel:${emergencyNumber}`}
                  className="w-full py-4 rounded-full bg-terra-500 text-white font-heading font-bold text-lg flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" /> {t('emergency.call_samu')}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
