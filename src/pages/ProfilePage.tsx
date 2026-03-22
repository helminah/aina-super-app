import { useState } from 'react';
import { useBaby } from '@/contexts/BabyContext';
import { getAgeText } from '@/lib/age-utils';
import type { Country } from '@/types/child';
import { User, MapPin, Calendar, Ruler, Weight, Settings, Trash2, Moon, Sun } from 'lucide-react';

export function ProfilePage() {
  const { profile, updateProfile, clearProfile } = useBaby();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(profile?.name || '');
  const [editWeight, setEditWeight] = useState(String(profile?.birthWeight || ''));
  const [editHeight, setEditHeight] = useState(String(profile?.birthHeight || ''));
  const [darkMode, setDarkMode] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!profile) return null;

  const handleSave = () => {
    updateProfile({
      name: editName.trim() || profile.name,
      birthWeight: parseFloat(editWeight) || profile.birthWeight,
      birthHeight: parseFloat(editHeight) || profile.birthHeight,
    });
    setEditing(false);
  };

  const countryLabels: Record<Country, string> = { senegal: '🇸🇳 Sénégal', france: '🇫🇷 France', madagascar: '🇲🇬 Madagascar' };

  return (
    <div className="px-5 pt-6 pb-6 safe-top">
      <h1 className="font-heading text-2xl font-bold text-bark-800 mb-5">Profil</h1>

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
              <span className="text-bark-600">{countryLabels[profile.country]}</span>
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

      {/* Settings */}
      <div className="bg-ivory-50 rounded-2xl p-5 mb-5 shadow-sm">
        <h3 className="font-heading font-bold text-bark-800 mb-3 flex items-center gap-2"><Settings className="w-5 h-5" /> Réglages</h3>

        {/* Country */}
        <div className="mb-4">
          <p className="text-sm text-bark-600 font-medium mb-2">Pays</p>
          <div className="flex gap-2">
            {(['senegal', 'france', 'madagascar'] as Country[]).map(c => (
              <button key={c} onClick={() => updateProfile({ country: c })}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${profile.country === c ? 'bg-forest-600 text-white' : 'bg-ivory-200 text-bark-500'}`}>
                {countryLabels[c].split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="flex items-center justify-between py-3">
          <span className="text-sm text-bark-600 font-medium">Thème sombre</span>
          <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-7 rounded-full relative transition-colors ${darkMode ? 'bg-forest-600' : 'bg-ivory-300'}`}>
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <button onClick={() => setShowConfirm(true)} className="w-full py-3 rounded-2xl bg-red-50 text-red-500 font-semibold text-sm flex items-center justify-center gap-2">
        <Trash2 className="w-4 h-4" /> Réinitialiser toutes les données
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h3 className="font-heading font-bold text-lg text-bark-800 mb-2">Confirmer la suppression</h3>
            <p className="text-sm text-bark-500 mb-5">Toutes les données de {profile.name} seront définitivement supprimées.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-2.5 rounded-xl bg-ivory-100 text-bark-600 font-semibold text-sm">Annuler</button>
              <button onClick={() => { clearProfile(); setShowConfirm(false); }} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
