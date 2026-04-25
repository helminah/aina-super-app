import { useNavigate } from 'react-router-dom';
import { useBaby } from '@/contexts/BabyContext';
import { vaccines as allVaccines } from '@/data/vaccines';
import { milestones } from '@/data/milestones';
import { getAgeText, getAgeInMonths } from '@/lib/age-utils';
import { getLocalizedField, translateAgeRange } from '@/lib/i18n-data';
import { COUNTRY_BY_CODE } from '@/data/countries';
import { ArrowLeft, Printer } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function HealthReportPage() {
  const { t, i18n } = useTranslation();
  const dateLocaleMap: Record<string, string> = { fr: 'fr-FR', en: 'en-US', mg: 'mg-MG', wo: 'fr-SN' };
  const dateLocale = dateLocaleMap[i18n.language.split('-')[0]] || 'fr-FR';
  const navigate = useNavigate();
  const {
    profile,
    weightEntries,
    heightEntries,
    hcEntries,
    isVaccineDone,
  } = useBaby();

  if (!profile) return null;

  const ageMonths = getAgeInMonths(profile.birthDate);
  const countryVaccines = allVaccines
    .filter(v => v.country.includes(profile.country))
    .sort((a, b) => a.ageMonths - b.ageMonths);

  const doneVaccines = countryVaccines.filter(v => isVaccineDone(v.id));
  const overdueVaccines = countryVaccines.filter(v => !isVaccineDone(v.id) && v.ageMonths < ageMonths);
  const upcomingVaccines = countryVaccines.filter(v => !isVaccineDone(v.id) && v.ageMonths >= ageMonths).slice(0, 5);

  const latestWeight = weightEntries.length > 0 ? weightEntries[weightEntries.length - 1] : null;
  const latestHeight = heightEntries.length > 0 ? heightEntries[heightEntries.length - 1] : null;
  const latestHc = hcEntries.length > 0 ? hcEntries[hcEntries.length - 1] : null;

  // Milestones for current age range
  const currentAgeRange = (() => {
    const ranges = [...new Set(milestones.map(m => m.ageRange))];
    return ranges.find(r => {
      const ms = milestones.filter(m => m.ageRange === r);
      return ageMonths >= ms[0].ageMinMonths && ageMonths <= ms[0].ageMaxMonths;
    }) || ranges[0];
  })();

  const currentMilestones = milestones.filter(m => m.ageRange === currentAgeRange);

  return (
    <div className="min-h-[100dvh] bg-white">
      {/* Print-hidden nav */}
      <div className="print:hidden flex items-center justify-between px-5 pt-6 pb-4 bg-ivory-100 border-b border-ivory-300">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-bark-600 font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> {t('common.back')}
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full btn-gradient text-white font-semibold text-sm"
        >
          <Printer className="w-4 h-4" /> {t('health_report.print')}
        </button>
      </div>

      {/* Report content */}
      <div className="max-w-2xl mx-auto px-8 py-10 print:px-6 print:py-8">
        {/* Header */}
        <div className="border-b-2 border-black pb-6 mb-8">
          <h1 className="text-3xl font-bold text-black tracking-tight">{t('health_report.record_title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('health_report.generated_on', { date: new Date().toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' }) })}</p>
        </div>

        {/* Profile */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-black mb-4 uppercase tracking-wide text-sm border-b border-gray-200 pb-2">
            {t('health_report.section_baby_info')}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{t('health_report.field_first_name')}</p>
              <p className="font-semibold text-black text-lg">{profile.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{t('health_report.field_age')}</p>
              <p className="font-semibold text-black text-lg">{getAgeText(profile.birthDate)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{t('health_report.field_birth_date')}</p>
              <p className="font-semibold text-black">{new Date(profile.birthDate).toLocaleDateString(dateLocale)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{t('health_report.field_sex')}</p>
              <p className="font-semibold text-black">{profile.sex === 'boy' ? t('common.boy') : t('common.girl')}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{t('health_report.field_country')}</p>
              <p className="font-semibold text-black">{COUNTRY_BY_CODE[profile.country]?.label || profile.country}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{t('health_report.field_birth_weight')}</p>
              <p className="font-semibold text-black">{profile.birthWeight} kg</p>
            </div>
          </div>
        </section>

        {/* Latest measurements */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-black mb-4 uppercase tracking-wide text-sm border-b border-gray-200 pb-2">
            {t('health_report.section_latest_measures')}
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('health_report.measure_weight')}</p>
              <p className="text-2xl font-bold text-black">
                {latestWeight ? `${latestWeight.weight} kg` : `${profile.birthWeight} kg`}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {latestWeight ? new Date(latestWeight.date).toLocaleDateString(dateLocale) : t('health_report.birth_short')}
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('health_report.measure_height')}</p>
              <p className="text-2xl font-bold text-black">
                {latestHeight ? `${latestHeight.height} cm` : `${profile.birthHeight} cm`}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {latestHeight ? new Date(latestHeight.date).toLocaleDateString(dateLocale) : t('health_report.birth_short')}
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('health_report.measure_hc')}</p>
              <p className="text-2xl font-bold text-black">
                {latestHc ? `${latestHc.circumference} cm` : '—'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {latestHc ? new Date(latestHc.date).toLocaleDateString(dateLocale) : t('health_report.not_set')}
              </p>
            </div>
          </div>
        </section>

        {/* Vaccines */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-black mb-4 uppercase tracking-wide text-sm border-b border-gray-200 pb-2">
            {t('health_report.section_vaccines')}
          </h2>
          <div className="grid grid-cols-3 gap-3 mb-4 text-center">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-black">{doneVaccines.length}</p>
              <p className="text-xs text-gray-500">{t('health_report.vaccines_done')}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-black">{overdueVaccines.length}</p>
              <p className="text-xs text-gray-500">{t('health_report.vaccines_overdue')}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-black">{upcomingVaccines.length}</p>
              <p className="text-xs text-gray-500">{t('health_report.vaccines_upcoming')}</p>
            </div>
          </div>

          {overdueVaccines.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-black mb-2">{t('health_report.overdue_heading')}</p>
              <div className="space-y-1">
                {overdueVaccines.map(v => (
                  <div key={v.id} className="flex items-center gap-3 py-1.5 border-b border-gray-100">
                    <span className="w-2 h-2 rounded-full bg-black flex-shrink-0" />
                    <span className="text-sm text-black font-medium">{getLocalizedField(v.name)}</span>
                    <span className="text-xs text-gray-400 ml-auto">{getLocalizedField(v.ageLabel)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {doneVaccines.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-black mb-2">{t('health_report.done_heading')}</p>
              <div className="space-y-1">
                {doneVaccines.map(v => (
                  <div key={v.id} className="flex items-center gap-3 py-1.5 border-b border-gray-100">
                    <span className="text-sm">✓</span>
                    <span className="text-sm text-black">{getLocalizedField(v.name)}</span>
                    <span className="text-xs text-gray-400 ml-auto">{getLocalizedField(v.ageLabel)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Milestones */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-black mb-4 uppercase tracking-wide text-sm border-b border-gray-200 pb-2">
            {t('health_report.section_development', { range: translateAgeRange(currentAgeRange) })}
          </h2>
          <div className="space-y-2">
            {currentMilestones.map(m => (
              <div key={m.id} className="flex items-start gap-3 py-1.5">
                <span className="text-sm mt-0.5">{m.domainEmoji}</span>
                <span className="text-sm text-black">{getLocalizedField(m.description)}</span>
              </div>
            ))}
            {currentMilestones.length === 0 && (
              <p className="text-sm text-gray-500">{t('health_report.no_milestones')}</p>
            )}
          </div>
        </section>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-xs text-gray-400">
            {t('health_report.footer')}
          </p>
        </div>
      </div>
    </div>
  );
}
