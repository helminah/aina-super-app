import { AlertTriangle, Phone } from 'lucide-react';
import { getRedFlagsForAge } from '@/data/red-flags';
import { useBaby } from '@/contexts/BabyContext';
import { getAgeInMonths } from '@/lib/age-utils';

/**
 * RedFlagsSection — signaux d'alarme développementaux par âge.
 * S'affiche en bas du tab Développement. Incite à consulter sans dramatiser.
 */
export function RedFlagsSection() {
  const { profile } = useBaby();
  if (!profile) return null;

  const ageMonths = getAgeInMonths(profile.birthDate);
  const flag = getRedFlagsForAge(ageMonths);
  if (!flag) return null;

  return (
    <div className="mt-6 rounded-2xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-rose-50 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-red-600 font-semibold">Quand consulter ?</p>
            <p className="font-heading font-bold text-bark-800 mt-0.5">Signaux d'alarme à {flag.ageLabel}</p>
          </div>
        </div>

        <p className="text-sm text-bark-600 leading-relaxed mb-3">
          Si à cet âge {profile.name} présente <strong>un ou plusieurs</strong> de ces signes, parlez-en à votre
          pédiatre :
        </p>

        <ul className="space-y-2">
          {flag.signs.map((sign, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-bark-700">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
              <span>{sign}</span>
            </li>
          ))}
        </ul>

        <a
          href="tel:15"
          className="mt-4 w-full py-3 rounded-full bg-white text-red-600 font-heading font-bold text-sm flex items-center justify-center gap-2 border border-red-200 hover:bg-red-50 transition-colors"
        >
          <Phone className="w-4 h-4" /> Appeler un médecin
        </a>

        <p className="text-[11px] text-bark-400 mt-3 text-center italic leading-relaxed">
          Chaque enfant évolue à son rythme — ces repères sont indicatifs, seul un professionnel peut poser un avis.
        </p>
      </div>
    </div>
  );
}
