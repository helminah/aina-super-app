import { useState, useMemo } from 'react';
import { useBaby } from '@/contexts/BabyContext';
import { vaccines as allVaccines } from '@/data/vaccines';
import { milestones } from '@/data/milestones';
import { weightBoys, weightGirls, heightBoys, heightGirls, hcBoys, hcGirls } from '@/data/oms-growth';
import { getAgeInMonths } from '@/lib/age-utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, Area, ResponsiveContainer, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ShieldCheck, TrendingUp, Brain, Check, Plus, X, Clock } from 'lucide-react';

const healthTabs = [
  { id: 'vaccines', label: 'Vaccins', icon: ShieldCheck },
  { id: 'growth', label: 'Croissance', icon: TrendingUp },
  { id: 'development', label: 'Développement', icon: Brain },
] as const;

type HealthTab = typeof healthTabs[number]['id'];

const growthMetrics = ['weight', 'height', 'hc'] as const;
type GrowthMetric = typeof growthMetrics[number];
const metricLabels: Record<GrowthMetric, string> = { weight: 'Poids (kg)', height: 'Taille (cm)', hc: 'PC (cm)' };

export function HealthPage() {
  const { profile, isVaccineDone, toggleVaccine, weightEntries, heightEntries, hcEntries, addWeight, addHeight, addHc, isMilestoneDone, toggleMilestone } = useBaby();
  const [activeTab, setActiveTab] = useState<HealthTab>('vaccines');
  const [metric, setMetric] = useState<GrowthMetric>('weight');
  const [showAddMeasure, setShowAddMeasure] = useState(false);
  const [measureDate, setMeasureDate] = useState(new Date().toISOString().split('T')[0]);
  const [measureValue, setMeasureValue] = useState('');
  const [selectedAgeRange, setSelectedAgeRange] = useState('');

  if (!profile) return null;

  const ageMonths = getAgeInMonths(profile.birthDate);
  const countryVaccines = allVaccines.filter(v => v.country.includes(profile.country)).sort((a, b) => a.ageMonths - b.ageMonths);

  // Growth chart data - memoize OMS data based on metric and sex
  const omsData = useMemo(() => {
    const isBoy = profile.sex === 'boy';
    switch (metric) {
      case 'weight': return isBoy ? weightBoys : weightGirls;
      case 'height': return isBoy ? heightBoys : heightGirls;
      case 'hc': return isBoy ? hcBoys : hcGirls;
    }
  }, [metric, profile.sex]);

  // Memoize entries based on metric and data
  const entriesData = useMemo(() => {
    switch (metric) {
      case 'weight': return weightEntries.map(e => ({ month: monthDiff(profile.birthDate, e.date), value: e.weight }));
      case 'height': return heightEntries.map(e => ({ month: monthDiff(profile.birthDate, e.date), value: e.height }));
      case 'hc': return hcEntries.map(e => ({ month: monthDiff(profile.birthDate, e.date), value: e.circumference }));
    }
  }, [metric, profile.birthDate, weightEntries, heightEntries, hcEntries]);

  const chartData = useMemo(() => {
    return omsData.map(p => {
      const child = entriesData.find(e => Math.abs(e.month - p.month) < 0.5);
      return { ...p, childValue: child?.value };
    });
  }, [omsData, entriesData]);

  const handleAddMeasure = () => {
    const val = parseFloat(measureValue);
    if (isNaN(val)) return;
    switch (metric) {
      case 'weight': addWeight({ date: measureDate, weight: val }); break;
      case 'height': addHeight({ date: measureDate, height: val }); break;
      case 'hc': addHc({ date: measureDate, circumference: val }); break;
    }
    setShowAddMeasure(false);
    setMeasureValue('');
  };

  // Milestones
  const ageRanges = [...new Set(milestones.map(m => m.ageRange))];
  const currentAgeRange = selectedAgeRange || ageRanges.find(r => {
    const ms = milestones.filter(m => m.ageRange === r);
    return ageMonths >= ms[0].ageMinMonths && ageMonths <= ms[0].ageMaxMonths;
  }) || ageRanges[0];

  const filteredMilestones = milestones.filter(m => m.ageRange === currentAgeRange);
  const domains = [...new Set(filteredMilestones.map(m => m.domain))];
  const milestoneProgress = filteredMilestones.length > 0
    ? Math.round((filteredMilestones.filter(m => isMilestoneDone(m.id)).length / filteredMilestones.length) * 100)
    : 0;

  return (
    <div className="px-5 pt-6 pb-6 safe-top">
      <h1 className="font-heading text-2xl font-bold text-bark-800 mb-5">Santé</h1>

      {/* Tab bar */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {healthTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-forest-600 text-white shadow-md shadow-forest-600/25'
                  : 'bg-ivory-50 text-bark-500'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Vaccines Tab */}
      {activeTab === 'vaccines' && (
        <div className="space-y-3 animate-stagger">
          {/* Progress */}
          <div className="bg-ivory-50 rounded-2xl p-4 mb-2">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-bark-600 font-medium">Progression</span>
              <span className="text-forest-500 font-bold">{countryVaccines.filter(v => isVaccineDone(v.id)).length}/{countryVaccines.length}</span>
            </div>
            <div className="h-2 bg-ivory-300 rounded-full overflow-hidden">
              <div className="h-full bg-forest-600 rounded-full transition-all" style={{ width: `${(countryVaccines.filter(v => isVaccineDone(v.id)).length / countryVaccines.length) * 100}%` }} />
            </div>
          </div>

          {/* Timeline grouped by month */}
          {(() => {
            const groups: { ageLabel: string; ageMonths: number; vaccines: typeof countryVaccines }[] = [];
            const seen = new Set<string>();
            for (const v of countryVaccines) {
              if (!seen.has(v.ageLabel)) {
                seen.add(v.ageLabel);
                groups.push({ ageLabel: v.ageLabel, ageMonths: v.ageMonths, vaccines: countryVaccines.filter(vv => vv.ageLabel === v.ageLabel) });
              }
            }
            return groups.map(group => {
              const groupDone = group.vaccines.every(v => isVaccineDone(v.id));
              const groupOverdue = !groupDone && group.vaccines.some(v => !isVaccineDone(v.id) && v.ageMonths < ageMonths);
              const doneCount = group.vaccines.filter(v => isVaccineDone(v.id)).length;
              const groupHeader = group.ageMonths === 0 ? 'Naissance' : group.ageLabel;
              return (
                <div key={group.ageLabel} className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      groupDone ? 'bg-forest-600' : groupOverdue ? 'bg-red-100' : 'bg-ivory-200'
                    }`}>
                      {groupDone ? <Check className="w-4 h-4 text-white" /> : <Clock className="w-4 h-4 text-bark-500" />}
                    </div>
                    <div className="flex-1">
                      <span className="font-heading font-bold text-bark-800">{groupHeader}</span>
                      <span className="text-xs text-bark-500 ml-2">{doneCount}/{group.vaccines.length}</span>
                    </div>
                    {groupOverdue && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">En retard</span>}
                    {groupDone && <span className="text-xs bg-forest-100 text-forest-600 px-2 py-0.5 rounded-full font-medium">Fait</span>}
                  </div>
                  <div className="ml-4 border-l-2 border-ivory-300 pl-4 space-y-2">
                    {group.vaccines.map(v => {
                      const done = isVaccineDone(v.id);
                      const overdue = !done && v.ageMonths < ageMonths;
                      return (
                        <button
                          key={v.id}
                          onClick={() => toggleVaccine(v.id)}
                          className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${
                            done ? 'bg-forest-50' : overdue ? 'bg-red-50' : 'bg-ivory-50'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            done ? 'bg-forest-600 border-forest-600' : overdue ? 'border-red-300' : 'border-ivory-400'
                          }`}>
                            {done && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div className="text-left flex-1">
                            <p className={`text-sm ${done ? 'text-forest-600' : overdue ? 'text-red-700' : 'text-bark-700'}`}>{v.name}</p>
                            <p className="text-xs text-bark-400">{v.diseases}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      )}

      {/* Growth Tab */}
      {activeTab === 'growth' && (
        <div>
          {/* Metric selector */}
          <div className="flex gap-2 mb-5">
            {growthMetrics.map(m => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${
                  metric === m ? 'bg-forest-600 text-white' : 'bg-ivory-50 text-bark-500'
                }`}
              >
                {metricLabels[m]}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-ivory-50 rounded-2xl p-4 mb-4">
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9e8e0" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#76786b' }} label={{ value: 'Mois', position: 'bottom', fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10, fill: '#76786b' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                <Area dataKey="p97" stroke="none" fill="#d4e4cd" />
                <Area dataKey="p85" stroke="none" fill="#b5d0a9" />
                <Area dataKey="p50" stroke="none" fill="#93ba82" />
                <Area dataKey="p15" stroke="none" fill="#b5d0a9" />
                <Area dataKey="p3" stroke="none" fill="#d4e4cd" />
                <Line dataKey="p50" stroke="#5a8f48" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                <Line dataKey="childValue" stroke="#e05241" strokeWidth={3} dot={{ r: 5, fill: '#e05241', stroke: '#fff', strokeWidth: 2 }} connectNulls />
              </ComposedChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-2 text-xs">
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-forest-300" /> Normes OMS</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-terra-400" /> {profile.name}</div>
            </div>
          </div>

          {/* Add button */}
          <button
            onClick={() => setShowAddMeasure(true)}
            className="w-full py-3 rounded-2xl bg-forest-600 text-white font-heading font-bold flex items-center justify-center gap-2 mb-4"
          >
            <Plus className="w-5 h-5" /> Ajouter une mesure
          </button>

          {/* Measurement history */}
          <div className="space-y-2">
            {(metric === 'weight' ? weightEntries : metric === 'height' ? heightEntries : hcEntries)
              .slice().reverse().slice(0, 10).map((e, i) => {
                const value = metric === 'weight'
                  ? `${(e as any).weight} kg`
                  : metric === 'height'
                    ? `${(e as any).height} cm`
                    : `${(e as any).circumference} cm`;
                return (
                  <div key={i} className="bg-ivory-50 rounded-xl px-4 py-3 flex justify-between items-center">
                    <span className="text-sm text-bark-600">{new Date(e.date).toLocaleDateString('fr-FR')}</span>
                    <span className="font-heading font-bold text-bark-800">{value}</span>
                  </div>
                );
              })}
          </div>

          {/* Add Measurement Modal */}
          <AnimatePresence>
            {showAddMeasure && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center" onClick={() => setShowAddMeasure(false)}>
                <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }} className="w-full max-w-[480px] bg-white rounded-t-3xl p-6" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-heading text-lg font-bold">Nouvelle mesure</h3>
                    <button onClick={() => setShowAddMeasure(false)} className="w-8 h-8 rounded-full bg-ivory-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-bark-600 font-medium block mb-1">Date</label>
                      <input type="date" value={measureDate} onChange={e => setMeasureDate(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-ivory-200 focus:outline-none focus:ring-2 focus:ring-forest-300" />
                    </div>
                    <div>
                      <label className="text-sm text-bark-600 font-medium block mb-1">{metricLabels[metric]}</label>
                      <input type="number" step="0.01" value={measureValue} onChange={e => setMeasureValue(e.target.value)} placeholder={metric === 'weight' ? 'ex: 6.5' : 'ex: 65'} className="w-full px-4 py-3 rounded-xl bg-ivory-200 focus:outline-none focus:ring-2 focus:ring-forest-300" />
                    </div>
                    <button onClick={handleAddMeasure} className="w-full py-3 rounded-full bg-forest-600 text-white font-bold">Enregistrer</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Development Tab */}
      {activeTab === 'development' && (
        <div>
          {/* Age range selector */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-5 pb-1">
            {ageRanges.map(range => (
              <button
                key={range}
                onClick={() => setSelectedAgeRange(range)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  (selectedAgeRange || currentAgeRange) === range
                    ? 'bg-forest-600 text-white'
                    : 'bg-ivory-50 text-bark-500'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Progress */}
          <div className="bg-ivory-50 rounded-2xl p-4 mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-bark-600 font-medium">Progrès ({currentAgeRange})</span>
              <span className="text-forest-500 font-bold">{milestoneProgress}%</span>
            </div>
            <div className="h-2 bg-ivory-300 rounded-full overflow-hidden">
              <div className="h-full bg-forest-600 rounded-full transition-all" style={{ width: `${milestoneProgress}%` }} />
            </div>
          </div>

          {/* Milestones by domain */}
          <div className="space-y-4">
            {domains.map(domain => {
              const domainMilestones = filteredMilestones.filter(m => m.domain === domain);
              const first = domainMilestones[0];
              return (
                <div key={domain} className="bg-ivory-50 rounded-2xl p-4">
                  <h3 className="font-heading font-bold text-bark-800 mb-3">{first.domainEmoji} {first.domainLabel}</h3>
                  <div className="space-y-2">
                    {domainMilestones.map(m => {
                      const done = isMilestoneDone(m.id);
                      return (
                        <button
                          key={m.id}
                          onClick={() => toggleMilestone(m.id)}
                          className="w-full flex items-center gap-3 py-2 text-left"
                        >
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            done ? 'bg-forest-600 border-forest-600' : 'border-ivory-400'
                          }`}>
                            {done && <Check className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <span className={`text-sm ${done ? 'text-forest-600 line-through' : 'text-bark-700'}`}>{m.description}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function monthDiff(birthDate: string, date: string): number {
  const b = new Date(birthDate);
  const d = new Date(date);
  return (d.getFullYear() - b.getFullYear()) * 12 + (d.getMonth() - b.getMonth()) + (d.getDate() - b.getDate()) / 30;
}
