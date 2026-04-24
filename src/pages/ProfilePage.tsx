import { useState } from 'react';
import { toast } from 'sonner';
import { useBaby } from '@/contexts/BabyContext';
import { getAgeText } from '@/lib/age-utils';
import { generateId } from '@/lib/utils';
import type { Country, Sex, ChildProfile } from '@/types/child';
import { COUNTRY_BY_CODE, COUNTRIES } from '@/data/countries';
import { SUPPORTED_LANGUAGES } from '@/i18n';
import { Calendar, Ruler, Weight, Settings, Trash2, Plus, ChevronDown, UserPlus, X, Check, MapPin, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Helpers: renvoient flag + label depuis le code pays dynamique.
const countryFlag  = (code: string) => COUNTRY_BY_CODE[code]?.flag  ?? '🏳️';
const countryLabel = (code: string) => COUNTRY_BY_CODE[code]?.label ?? code;

export function ProfilePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { profile, babies, activeBabyId, switchBaby, addBaby, updateProfile, clearProfile, removeBaby } = useBaby();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(profile?.name || '');
  const [editWeight, setEditWeight] = useState(String(profile?.birthWeight || ''));
  const [editHeight, setEditHeight] = useState(String(profile?.birthHeight || ''));
  const [showConfirm, setShowConfirm] = useState(false);
  const [showBabySwitcher, setShowBabySwitcher] = useState(false);
  const [showAddBaby, setShowAddBaby] = useState(false);

  // New baby form state
  const [newName, setNewName] = useState('');
  const [newSex, setNewSex] = useState<Sex>('girl');
  const [newBirthDate, setNewBirthDate] = useState('');
  const [newWeight, setNewWeight] = useState('');
  const [newHeight, setNewHeight] = useState('');
  const [newCountry, setNewCountry] = useState<Country>(profile?.country || 'senegal');

  if (!profile) return null;

  const handleSave = () => {
    updateProfile({
      name: editName.trim() || profile.name,
      birthWeight: parseFloat(editWeight) || profile.birthWeight,
      birthHeight: parseFloat(editHeight) || profile.birthHeight,
    });
    setEditing(false);
    toast.success('Profil mis à jour ✓');
  };

  const handleAddBaby = () => {
    if (!newName.trim() || !newBirthDate || !newWeight || !newHeight) return;
    const baby: ChildProfile = {
      id: generateId(),
      name: newName.trim(),
      sex: newSex,
      birthDate: newBirthDate,
      birthWeight: parseFloat(newWeight),
      birthHeight: parseFloat(newHeight),
      country: newCountry,
      completedVaccines: [],
      createdAt: new Date().toISOString(),
    };
    addBaby(baby);
    setShowAddBaby(false);
    resetNewBabyForm();
    toast.success('Bébé ajouté ! 🍼');
  };

  const resetNewBabyForm = () => {
    setNewName('');
    setNewSex('girl');
    setNewBirthDate('');
    setNewWeight('');
    setNewHeight('');
    setNewCountry(profile?.country || 'senegal');
  };

  return (
    <div className="pb-24 safe-top overflow-y-auto min-h-full">
      {/* Hero violet — Profil (intime) */}
      <div className="relative mesh-violet grain overflow-hidden pt-10 pb-14 px-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 hero-text"
        >
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/95 font-semibold">{t('profile.hero_kicker')}</p>
          <h1 className="font-display font-semibold text-white text-6xl leading-[0.95] mt-1.5">
            {t('profile.title')}
          </h1>
          <p className="text-white/95 text-sm mt-2.5 font-medium tracking-wide">{t('profile.hero_tagline')}</p>
        </motion.div>
      </div>

      <div className="px-5 -mt-6 relative z-10">

      {/* Baby Switcher */}
      {babies.length > 1 && (
        <div className="mb-4">
          <button
            onClick={() => setShowBabySwitcher(!showBabySwitcher)}
            className="w-full flex items-center justify-between bg-forest-50 rounded-2xl px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center text-xl">
                {profile.sex === 'boy' ? '👦' : '👧'}
              </div>
              <div className="text-left">
                <p className="font-heading font-bold text-bark-800">{profile.name}</p>
                <p className="text-xs text-forest-600">{getAgeText(profile.birthDate)}</p>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-bark-400 transition-transform ${showBabySwitcher ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showBabySwitcher && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 bg-ivory-50 rounded-2xl p-2 shadow-sm space-y-1">
                  {babies.filter(b => b.id !== activeBabyId).map(baby => (
                    <button
                      key={baby.id}
                      onClick={() => { switchBaby(baby.id); setShowBabySwitcher(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-ivory-200 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-forest-100 flex items-center justify-center text-lg">
                        {baby.sex === 'boy' ? '👦' : '👧'}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-bark-800">{baby.name}</p>
                        <p className="text-xs text-bark-400">{getAgeText(baby.birthDate)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Baby card */}
      <div className="bg-ivory-50 rounded-2xl p-5 mb-5 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center text-3xl">
            {profile.sex === 'boy' ? '👦' : '👧'}
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-bark-800">{profile.name}</h2>
            <p className="text-sm text-forest-500">{getAgeText(profile.birthDate)}</p>
          </div>
        </div>

        {!editing ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-bark-400" />
              <span className="text-bark-600">Né(e) le {new Date(profile.birthDate).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Weight className="w-4 h-4 text-bark-400" />
              <span className="text-bark-600">Poids de naissance : {profile.birthWeight} kg</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Ruler className="w-4 h-4 text-bark-400" />
              <span className="text-bark-600">Taille de naissance : {profile.birthHeight} cm</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-bark-400" />
              <span className="text-bark-600">{countryFlag(profile.country)} {countryLabel(profile.country)}</span>
            </div>
            <button onClick={() => { setEditing(true); setEditName(profile.name); setEditWeight(String(profile.birthWeight)); setEditHeight(String(profile.birthHeight)); }} className="w-full mt-3 py-2.5 rounded-xl bg-forest-100 text-forest-600 text-sm font-semibold">
              Modifier
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-bark-600 font-medium">Prénom</label>
              <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-ivory-200 mt-1 focus:outline-none focus:ring-2 focus:ring-forest-300" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-bark-600 font-medium">Poids naissance (kg)</label>
                <input type="number" step="0.01" value={editWeight} onChange={e => setEditWeight(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-ivory-200 mt-1 focus:outline-none focus:ring-2 focus:ring-forest-300" />
              </div>
              <div>
                <label className="text-xs text-bark-600 font-medium">Taille naissance (cm)</label>
                <input type="number" step="0.1" value={editHeight} onChange={e => setEditHeight(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-ivory-200 mt-1 focus:outline-none focus:ring-2 focus:ring-forest-300" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-forest-600 text-white font-semibold text-sm">Enregistrer</button>
              <button onClick={() => setEditing(false)} className="px-4 py-2.5 rounded-xl bg-ivory-100 text-bark-500 text-sm">Annuler</button>
            </div>
          </div>
        )}
      </div>

      {/* Add Baby Button */}
      <button
        onClick={() => { resetNewBabyForm(); setShowAddBaby(true); }}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-forest-50 border-2 border-dashed border-forest-200 text-forest-600 font-semibold text-sm mb-5 hover:bg-forest-100 transition-colors"
      >
        <UserPlus className="w-5 h-5" /> Ajouter un bébé
      </button>

      {/* Settings */}
      <div className="bg-ivory-50 rounded-2xl p-5 mb-5 shadow-sm">
        <h3 className="font-heading font-bold text-bark-800 mb-3 flex items-center gap-2">
          <Settings className="w-5 h-5" /> {t('profile.settings')}
        </h3>

        {/* Country */}
        <div className="mb-4">
          <p className="text-sm text-bark-600 font-medium mb-2">{t('profile.country_vaccine')}</p>
          <select
            value={profile.country}
            onChange={e => updateProfile({ country: e.target.value as Country })}
            className="w-full py-3 px-4 rounded-xl bg-ivory-200 text-bark-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
          >
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>{c.flag} {c.label}</option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div className="mb-4">
          <p className="text-sm text-bark-600 font-medium mb-2">{t('profile.language')}</p>
          <div className="grid grid-cols-2 gap-2">
            {SUPPORTED_LANGUAGES.map(lang => {
              const active = i18n.language.startsWith(lang.code);
              return (
                <button
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  className={`flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-violet-500 text-white shadow-md shadow-violet-500/30'
                      : 'bg-ivory-200 text-bark-600'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="flex-1 text-left">{lang.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Export */}
      <button
        onClick={() => navigate('/report')}
        className="w-full py-3 rounded-2xl bg-ivory-200 text-bark-700 font-semibold text-sm flex items-center justify-center gap-2 mb-3"
      >
        <FileText className="w-4 h-4" /> Exporter carnet de santé
      </button>

      {/* Danger zone */}
      <button onClick={() => setShowConfirm(true)} className="w-full py-3 rounded-2xl bg-red-50 text-red-500 font-semibold text-sm flex items-center justify-center gap-2">
        <Trash2 className="w-4 h-4" /> Supprimer {profile.name}
      </button>

      {/* Confirm delete modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h3 className="font-heading font-bold text-lg text-bark-800 mb-2">Confirmer la suppression</h3>
            <p className="text-sm text-bark-500 mb-5">Toutes les données de {profile.name} seront définitivement supprimées.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-2.5 rounded-xl bg-ivory-100 text-bark-600 font-semibold text-sm">Annuler</button>
              <button onClick={() => { clearProfile(); setShowConfirm(false); toast.success('Profil supprimé'); }} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm">Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Baby Modal */}
      <AnimatePresence>
        {showAddBaby && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center"
            onClick={() => setShowAddBaby(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-[480px] bg-ivory-50 rounded-t-3xl max-h-[90dvh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-heading text-xl font-bold text-bark-800">
                    Ajouter un bébé
                  </h2>
                  <button
                    onClick={() => setShowAddBaby(false)}
                    className="w-8 h-8 rounded-full bg-ivory-200 flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-bark-600" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="text-sm text-bark-600 font-medium">Prénom</label>
                    <input
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      placeholder="Prénom du bébé"
                      className="w-full px-4 py-3 rounded-xl bg-ivory-200 mt-1 focus:outline-none focus:ring-2 focus:ring-forest-300"
                    />
                  </div>

                  {/* Sex */}
                  <div>
                    <label className="text-sm text-bark-600 font-medium">Sexe</label>
                    <div className="flex gap-3 mt-1">
                      {([['girl', '👧 Fille'], ['boy', '👦 Garçon']] as [Sex, string][]).map(([val, label]) => (
                        <button
                          key={val}
                          onClick={() => setNewSex(val)}
                          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${newSex === val ? 'bg-forest-600 text-white' : 'bg-ivory-200 text-bark-500'}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Birth date */}
                  <div>
                    <label className="text-sm text-bark-600 font-medium">Date de naissance</label>
                    <input
                      type="date"
                      value={newBirthDate}
                      onChange={e => setNewBirthDate(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-xl bg-ivory-200 mt-1 focus:outline-none focus:ring-2 focus:ring-forest-300"
                    />
                  </div>

                  {/* Weight & Height */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-bark-600 font-medium">Poids (kg)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newWeight}
                        onChange={e => setNewWeight(e.target.value)}
                        placeholder="3.2"
                        className="w-full px-4 py-3 rounded-xl bg-ivory-200 mt-1 focus:outline-none focus:ring-2 focus:ring-forest-300"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-bark-600 font-medium">Taille (cm)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newHeight}
                        onChange={e => setNewHeight(e.target.value)}
                        placeholder="50"
                        className="w-full px-4 py-3 rounded-xl bg-ivory-200 mt-1 focus:outline-none focus:ring-2 focus:ring-forest-300"
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="text-sm text-bark-600 font-medium">Pays (calendrier vaccinal)</label>
                    <select
                      value={newCountry}
                      onChange={e => setNewCountry(e.target.value as Country)}
                      className="w-full mt-1 py-3 px-4 rounded-xl bg-ivory-200 text-bark-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-forest-300"
                    >
                      <option value="">— Choisir un pays —</option>
                      {COUNTRIES.map(c => (
                        <option key={c.code} value={c.code}>{c.flag} {c.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleAddBaby}
                    disabled={!newName.trim() || !newBirthDate || !newWeight || !newHeight}
                    className="w-full py-3.5 rounded-full btn-gradient text-white font-heading font-bold text-base flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed mt-2"
                  >
                    <Check className="w-5 h-5" /> Ajouter {newName.trim() || 'bébé'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
