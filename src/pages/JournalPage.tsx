import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { useBaby } from '@/contexts/BabyContext';
import { format, subDays, isSameDay, isToday } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Baby, Moon, Droplets, Smile, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { LogType, FeedDetails, SleepDetails, DiaperDetails, MoodDetails } from '@/types/child';

const LOG_TYPE_META: { type: LogType; icon: typeof Baby; color: string; bg: string }[] = [
  { type: 'feed', icon: Baby, color: 'text-terra-500', bg: 'bg-terra-50' },
  { type: 'sleep', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { type: 'diaper', icon: Droplets, color: 'text-sky-500', bg: 'bg-sky-50' },
  { type: 'mood', icon: Smile, color: 'text-amber-500', bg: 'bg-amber-50' },
];

export function JournalPage() {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language.startsWith('en') ? enUS : fr;
  const { profile, getLogsForDate, addLog, removeLog } = useBaby();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAdd, setShowAdd] = useState(false);
  const [addType, setAddType] = useState<LogType | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Form states
  const [feedType, setFeedType] = useState<'breast' | 'bottle' | 'solid'>('breast');
  const [feedSide, setFeedSide] = useState<'left' | 'right' | 'both'>('left');
  const [feedQty, setFeedQty] = useState('');
  const [sleepDuration, setSleepDuration] = useState('');
  const [sleepQuality, setSleepQuality] = useState<'good' | 'average' | 'poor'>('good');
  const [diaperType, setDiaperType] = useState<'pee' | 'poop' | 'mixed'>('pee');
  const [diaperColor, setDiaperColor] = useState('yellow');
  const [moodEmoji, setMoodEmoji] = useState('😊');

  useEffect(() => {
    // Scroll to today on mount
    if (scrollRef.current) {
      const todayEl = scrollRef.current.querySelector('[data-today="true"]');
      if (todayEl) todayEl.scrollIntoView({ inline: 'center', behavior: 'smooth' });
    }
  }, []);

  if (!profile) return null;

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const logs = getLogsForDate(dateStr);

  // Generate dates for horizontal scroller (14 days before, 7 after)
  const dates = Array.from({ length: 21 }, (_, i) => subDays(new Date(), 14 - i));

  const resetForm = () => {
    setFeedType('breast'); setFeedSide('left'); setFeedQty('');
    setSleepDuration(''); setSleepQuality('good');
    setDiaperType('pee'); setDiaperColor('yellow');
    setMoodEmoji('😊');
  };

  const handleSubmit = () => {
    if (!addType) return;
    const now = format(new Date(), 'HH:mm');
    let details: FeedDetails | SleepDetails | DiaperDetails | MoodDetails;

    switch (addType) {
      case 'feed':
        details = { feedType, side: feedType === 'breast' ? feedSide : undefined, quantity: feedQty ? parseInt(feedQty) : undefined } as FeedDetails;
        break;
      case 'sleep':
        details = { duration: parseInt(sleepDuration) || 0, quality: sleepQuality } as SleepDetails;
        break;
      case 'diaper':
        details = { diaperType, color: diaperColor } as DiaperDetails;
        break;
      case 'mood':
        details = { emoji: moodEmoji } as MoodDetails;
        break;
    }

    addLog({ date: dateStr, type: addType, time: now, details });
    setShowAdd(false);
    setAddType(null);
    resetForm();
    toast.success(t('journal_form.log_saved'));
  };

  const getLogIcon = (type: LogType) => {
    const meta = LOG_TYPE_META.find(l => l.type === type);
    const label = t(`journal.log_types.${type}`, { defaultValue: type });
    return meta ? { Icon: meta.icon, color: meta.color, bg: meta.bg, label } : { Icon: Baby, color: '', bg: '', label };
  };

  const getLogSummary = (entry: typeof logs[0]) => {
    switch (entry.type) {
      case 'feed': {
        const d = entry.details as FeedDetails;
        const feedLabel = d.feedType === 'breast'
          ? t('journal_form.summary_feed_breast')
          : d.feedType === 'bottle'
            ? t('journal_form.summary_feed_bottle')
            : t('journal_form.summary_feed_solid');
        const sideLabel = d.side
          ? ` (${d.side === 'left' ? t('journal_form.side_left') : d.side === 'right' ? t('journal_form.side_right') : t('journal_form.side_both')})`
          : '';
        return `${feedLabel}${d.quantity ? ` - ${d.quantity}ml` : ''}${sideLabel}`;
      }
      case 'sleep': {
        const d = entry.details as SleepDetails;
        const qualityLabel = d.quality === 'good'
          ? t('journal_form.summary_sleep_good')
          : d.quality === 'average'
            ? t('journal_form.summary_sleep_average')
            : t('journal_form.summary_sleep_poor');
        return `${d.duration} min - ${qualityLabel}`;
      }
      case 'diaper': {
        const d = entry.details as DiaperDetails;
        return d.diaperType === 'pee'
          ? t('journal_form.summary_diaper_pee')
          : d.diaperType === 'poop'
            ? t('journal_form.summary_diaper_poop')
            : t('journal_form.summary_diaper_mixed');
      }
      case 'mood': {
        const d = entry.details as MoodDetails;
        return d.emoji;
      }
      default: return '';
    }
  };

  return (
    <div className="pb-24 safe-top min-h-full">
      {/* Hero bleu — Journal (mémoire, continuité) */}
      <div className="relative mesh-sky grain overflow-hidden pt-10 pb-14 px-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 hero-text"
        >
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/95 font-semibold">{t('journal.hero_kicker')}</p>
          <h1 className="font-display font-semibold text-white text-6xl leading-[0.95] mt-1.5">
            {t('journal.title')}
          </h1>
          <p className="text-white/95 text-sm mt-2.5 font-medium tracking-wide">{t('journal.hero_tagline')}</p>
        </motion.div>
      </div>

      {/* Date scroller en glass au-dessus du hero */}
      <div ref={scrollRef} className="flex gap-2 -mt-6 mx-5 p-2 glass-card rounded-2xl overflow-x-auto no-scrollbar relative z-10 mb-5">
        {dates.map(date => {
          const active = isSameDay(date, selectedDate);
          const today = isToday(date);
          return (
            <button
              key={date.toISOString()}
              data-today={today}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center min-w-[48px] py-2 px-2 rounded-xl transition-all ${
                active ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30' : today ? 'bg-sky-100 text-sky-600' : 'text-bark-500'
              }`}
            >
              <span className="text-[10px] font-medium uppercase">{format(date, 'EEE', { locale: dateLocale })}</span>
              <span className="text-lg font-bold">{format(date, 'd')}</span>
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="px-5">
        {logs.length === 0 ? (
          <div className="text-center py-16">
            <Clock className="w-12 h-12 text-ivory-400 mx-auto mb-3" />
            <p className="text-bark-500 font-medium">{t('journal.empty')}</p>
            <p className="text-sm text-bark-400 mt-1">{t('journal.empty_hint')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map(entry => {
              const { Icon, color, bg, label } = getLogIcon(entry.type);
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-ivory-50 rounded-2xl p-4 flex items-center gap-3"
                >
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-bark-800">{label}</p>
                    <p className="text-xs text-bark-500">{getLogSummary(entry)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-bark-500 font-medium">{entry.time}</p>
                    <button onClick={() => { removeLog(entry.id); toast(t('journal_form.log_deleted'), { description: t('journal_form.log_deleted_desc') }); }} className="text-[10px] text-red-400 mt-0.5">{t('journal_form.delete_short')}</button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-forest-600 text-white shadow-xl shadow-forest-600/30 flex items-center justify-center z-30 active:scale-95 transition-transform"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center" onClick={() => { setShowAdd(false); setAddType(null); }}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }} className="w-full max-w-[480px] bg-white rounded-t-3xl max-h-[80dvh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-heading text-lg font-bold">{addType ? t(`journal.log_types.${addType}`) : t('common.add')}</h3>
                <button onClick={() => { setShowAdd(false); setAddType(null); }} className="w-8 h-8 rounded-full bg-ivory-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
              </div>

              {!addType ? (
                <div className="grid grid-cols-2 gap-3">
                  {LOG_TYPE_META.map(lt => {
                    const Icon = lt.icon;
                    return (
                      <button key={lt.type} onClick={() => setAddType(lt.type)} className={`${lt.bg} rounded-2xl p-5 flex flex-col items-center gap-2`}>
                        <Icon className={`w-8 h-8 ${lt.color}`} />
                        <span className="text-sm font-semibold text-bark-800">{t(`journal.log_types.${lt.type}`)}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  {addType === 'feed' && (
                    <>
                      <div>
                        <label className="text-sm text-bark-600 font-medium block mb-2">{t('journal_form.type_label')}</label>
                        <div className="flex gap-2">
                          {(['breast', 'bottle', 'solid'] as const).map(ft => (
                            <button key={ft} onClick={() => setFeedType(ft)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold ${feedType === ft ? 'bg-forest-600 text-white' : 'bg-ivory-200 text-bark-500'}`}>
                              {ft === 'breast' ? t('journal_form.feed_breast') : ft === 'bottle' ? t('journal_form.feed_bottle') : t('journal_form.feed_solid')}
                            </button>
                          ))}
                        </div>
                      </div>
                      {feedType === 'breast' && (
                        <div>
                          <label className="text-sm text-bark-600 font-medium block mb-2">{t('journal_form.side_label')}</label>
                          <div className="flex gap-2">
                            {(['left', 'right', 'both'] as const).map(s => (
                              <button key={s} onClick={() => setFeedSide(s)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold ${feedSide === s ? 'bg-forest-600 text-white' : 'bg-ivory-200 text-bark-500'}`}>
                                {s === 'left' ? t('journal_form.side_left') : s === 'right' ? t('journal_form.side_right') : t('journal_form.side_both')}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {feedType === 'bottle' && (
                        <div>
                          <label className="text-sm text-bark-600 font-medium block mb-1">{t('journal_form.quantity_label')}</label>
                          <input type="number" value={feedQty} onChange={e => setFeedQty(e.target.value)} placeholder={t('journal_form.quantity_example')} className="w-full px-4 py-3 rounded-xl bg-ivory-200 focus:outline-none focus:ring-2 focus:ring-forest-300" />
                        </div>
                      )}
                    </>
                  )}
                  {addType === 'sleep' && (
                    <>
                      <div>
                        <label className="text-sm text-bark-600 font-medium block mb-1">{t('journal_form.duration_label')}</label>
                        <input type="number" value={sleepDuration} onChange={e => setSleepDuration(e.target.value)} placeholder={t('journal_form.duration_example')} className="w-full px-4 py-3 rounded-xl bg-ivory-200 focus:outline-none focus:ring-2 focus:ring-forest-300" />
                      </div>
                      <div>
                        <label className="text-sm text-bark-600 font-medium block mb-2">{t('journal_form.quality_label')}</label>
                        <div className="flex gap-2">
                          {(['good', 'average', 'poor'] as const).map(q => (
                            <button key={q} onClick={() => setSleepQuality(q)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold ${sleepQuality === q ? 'bg-forest-600 text-white' : 'bg-ivory-200 text-bark-500'}`}>
                              {q === 'good' ? t('journal_form.quality_good') : q === 'average' ? t('journal_form.quality_average') : t('journal_form.quality_poor')}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  {addType === 'diaper' && (
                    <>
                      <div>
                        <label className="text-sm text-bark-600 font-medium block mb-2">{t('journal_form.type_label')}</label>
                        <div className="flex gap-2">
                          {(['pee', 'poop', 'mixed'] as const).map(dt => (
                            <button key={dt} onClick={() => setDiaperType(dt)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold ${diaperType === dt ? 'bg-forest-600 text-white' : 'bg-ivory-200 text-bark-500'}`}>
                              {dt === 'pee' ? t('journal_form.diaper_pee') : dt === 'poop' ? t('journal_form.diaper_poop') : t('journal_form.diaper_mixed')}
                            </button>
                          ))}
                        </div>
                      </div>
                      {(diaperType === 'poop' || diaperType === 'mixed') && (
                        <div>
                          <label className="text-sm text-bark-600 font-medium block mb-2">{t('journal_form.color_label')}</label>
                          <div className="flex gap-2 flex-wrap">
                            {([
                              ['yellow', '🟡', t('journal_form.color_yellow')],
                              ['green', '🟢', t('journal_form.color_green')],
                              ['brown', '🟤', t('journal_form.color_brown')],
                              ['black', '⚫', t('journal_form.color_black')],
                              ['red', '🔴', t('journal_form.color_red')],
                            ] as const).map(([val, emoji, label]) => (
                              <button key={val} onClick={() => setDiaperColor(val)} className={`px-3 py-2 rounded-xl text-xs font-semibold ${diaperColor === val ? 'bg-forest-600 text-white' : 'bg-ivory-200 text-bark-500'}`}>
                                {emoji} {label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {addType === 'mood' && (
                    <div>
                      <label className="text-sm text-bark-600 font-medium block mb-2">{t('journal_form.mood_label', { name: profile.name })}</label>
                      <div className="flex gap-3 justify-center">
                        {['😊', '😐', '😢', '😠', '😴'].map(e => (
                          <button key={e} onClick={() => setMoodEmoji(e)} className={`text-3xl p-2 rounded-xl transition-all ${moodEmoji === e ? 'bg-forest-100 scale-125' : ''}`}>
                            {e}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button onClick={handleSubmit} className="w-full py-3 rounded-full bg-forest-600 text-white font-bold mt-2">{t('journal_form.save')}</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
