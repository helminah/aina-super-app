import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, X, MapPin, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useBaby } from '@/contexts/BabyContext';
import type { Appointment } from '@/types/child';

/**
 * AppointmentWidget — prochains rendez-vous médicaux.
 * Liste simple + sheet pour ajouter. Persisté par bébé.
 */
export function AppointmentWidget() {
  const { t } = useTranslation();
  const { appointments, addAppointment, removeAppointment } = useBaby();
  const [showAdd, setShowAdd] = useState(false);

  // Filtrer à venir (date >= aujourd'hui)
  const today = new Date().toISOString().split('T')[0];
  const upcoming = appointments.filter(a => a.date >= today).slice(0, 3);

  if (upcoming.length === 0 && !showAdd) {
    return (
      <button
        onClick={() => setShowAdd(true)}
        className="w-full bg-white rounded-2xl p-4 elev-1 flex items-center gap-3 text-left"
      >
        <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
          <Calendar className="w-5 h-5 text-violet-600" />
        </div>
        <div className="flex-1">
          <p className="text-[11px] uppercase tracking-[0.15em] text-violet-600 font-semibold">{t('appointment.kicker')}</p>
          <p className="font-heading font-bold text-bark-800 mt-0.5">{t('appointment.no_appointments')}</p>
          <p className="text-xs text-bark-500 mt-0.5">{t('appointment.add_first')}</p>
        </div>
        <Plus className="w-4 h-4 text-violet-600" />
      </button>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-5 elev-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-violet-600" />
            <p className="text-[11px] uppercase tracking-[0.15em] text-violet-700 font-semibold">{t('appointment.upcoming_kicker')}</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="text-xs text-violet-600 font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> {t('common.add')}
          </button>
        </div>

        <div className="space-y-2">
          {upcoming.map(appt => (
            <AppointmentRow key={appt.id} appt={appt} onRemove={() => removeAppointment(appt.id)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showAdd && (
          <AddAppointmentSheet
            onClose={() => setShowAdd(false)}
            onSubmit={(a) => {
              addAppointment(a);
              setShowAdd(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function AppointmentRow({ appt, onRemove }: { appt: Appointment; onRemove: () => void }) {
  const { t, i18n } = useTranslation();
  const date = new Date(appt.date + 'T' + (appt.time || '09:00'));
  const daysAway = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const label = daysAway === 0
    ? t('appointment.today')
    : daysAway === 1
      ? t('appointment.tomorrow')
      : t('appointment.in_days', { count: daysAway });
  const typeEmoji: Record<Appointment['type'], string> = {
    checkup: '👶',
    vaccine: '💉',
    specialist: '🩺',
    other: '📋',
  };
  const localeMap: Record<string, string> = { fr: 'fr-FR', en: 'en-US', mg: 'mg-MG', wo: 'fr-SN' };
  const dateLocale = localeMap[i18n.language.split('-')[0]] || 'fr-FR';

  return (
    <div className="flex items-center gap-3 p-2 rounded-xl bg-ivory-100">
      <span className="text-2xl">{typeEmoji[appt.type]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-bark-800 truncate">{appt.title}</p>
        <div className="flex items-center gap-1.5 text-xs text-bark-500 mt-0.5">
          <span className="font-semibold text-violet-600">{label}</span>
          <span>·</span>
          <span>{date.toLocaleDateString(dateLocale, { day: 'numeric', month: 'short' })}</span>
          {appt.time && <span>· {appt.time}</span>}
        </div>
        {appt.location && (
          <p className="text-[11px] text-bark-400 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {appt.location}
          </p>
        )}
      </div>
      <button
        onClick={onRemove}
        className="text-bark-300 hover:text-red-500 p-1"
        aria-label={t('common.delete')}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function AddAppointmentSheet({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (a: Omit<Appointment, 'id'>) => void;
}) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00');
  const [type, setType] = useState<Appointment['type']>('checkup');
  const [location, setLocation] = useState('');

  const canSubmit = title.trim().length > 0 && date;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-[480px] bg-white rounded-t-3xl max-h-[85dvh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-xl font-bold text-bark-800">{t('appointment.new_appointment')}</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-ivory-200 flex items-center justify-center">
              <X className="w-4 h-4 text-bark-600" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-bark-600 font-medium">{t('appointment.title_label')}</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={t('appointment.title_placeholder')}
                className="w-full mt-1 px-4 py-3 rounded-xl bg-ivory-200 text-bark-800 focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
            </div>

            <div>
              <label className="text-sm text-bark-600 font-medium">{t('appointment.type_label')}</label>
              <div className="flex gap-2 mt-1">
                {([
                  { id: 'checkup' as const, label: t('appointment.type_checkup'), emoji: '👶' },
                  { id: 'vaccine' as const, label: t('appointment.type_vaccine'), emoji: '💉' },
                  { id: 'specialist' as const, label: t('appointment.type_specialist'), emoji: '🩺' },
                  { id: 'other' as const, label: t('appointment.type_other'), emoji: '📋' },
                ]).map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setType(opt.id)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-0.5 ${
                      type === opt.id ? 'bg-violet-500 text-white' : 'bg-ivory-200 text-bark-600'
                    }`}
                  >
                    <span className="text-lg">{opt.emoji}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-bark-600 font-medium">{t('appointment.date_label')}</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-ivory-200 text-bark-800 focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>
              <div>
                <label className="text-sm text-bark-600 font-medium">{t('appointment.time_label')}</label>
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-ivory-200 text-bark-800 focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-bark-600 font-medium">{t('appointment.location_label')}</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder={t('appointment.location_placeholder')}
                className="w-full mt-1 px-4 py-3 rounded-xl bg-ivory-200 text-bark-800 focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
            </div>

            <button
              onClick={() => onSubmit({ title: title.trim(), date, time, type, location: location.trim() || undefined })}
              disabled={!canSubmit}
              className={`w-full py-3.5 rounded-full font-heading font-bold transition-all ${
                canSubmit ? 'bg-violet-500 text-white active:scale-[0.98]' : 'bg-ivory-300 text-bark-400 cursor-not-allowed'
              }`}
            >
              {t('appointment.submit')}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
