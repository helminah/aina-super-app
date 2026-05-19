/** Numéros d'urgence médicale (ambulance/SAMU) par code pays AINA. */
export interface EmergencyInfo {
  number: string;
  label: string; // nom du service
}

export const EMERGENCY_NUMBERS: Record<string, EmergencyInfo> = {
  // Afrique de l'Ouest
  'senegal':       { number: '1515', label: 'SAMU' },
  'mali':          { number: '122',  label: 'Protection Civile' },
  'burkina-faso':  { number: '15',   label: 'SAMU' },
  'niger':         { number: '15',   label: 'SAMU' },
  'benin':         { number: '112',  label: 'SAMU' },
  'togo':          { number: '113',  label: 'Ambulance' },
  'guinee':        { number: '18',   label: 'Pompiers' },
  'mauritanie':    { number: '101',  label: 'SAMU' },
  'cote-ivoire':   { number: '185',  label: 'SAMU' },
  // Afrique centrale
  'cameroun':      { number: '119',  label: 'SAMU' },
  'gabon':         { number: '1300', label: 'SAMU' },
  'congo-kinshasa':{ number: '+243 818 880 007', label: 'SOS Médecins' },
  'congo-brazza':  { number: '118',  label: 'Pompiers' },
  'tchad':         { number: '18',   label: 'Pompiers' },
  'centrafrique':  { number: '1212', label: 'SAMU' },
  // Afrique de l'Est & Océan Indien
  'madagascar':    { number: '118',  label: 'Pompiers' },
  'rwanda':        { number: '912',  label: 'SAMU' },
  'burundi':       { number: '112',  label: 'Urgences' },
  'comores':       { number: '118',  label: 'Pompiers' },
  'djibouti':      { number: '18',   label: 'Pompiers' },
  'maurice':       { number: '114',  label: 'SAMU' },
  // Caraïbes
  'haiti':         { number: '116',  label: 'Ambulance' },
  // Maghreb
  'maroc':         { number: '15',   label: 'SAMU' },
  'tunisie':       { number: '190',  label: 'SAMU' },
  'algerie':       { number: '16',   label: 'SAMU' },
  // Europe
  'france':        { number: '15',   label: 'SAMU' },
  'belgique':      { number: '112',  label: 'Urgences' },
  'suisse':        { number: '144',  label: 'Ambulance' },
  'luxembourg':    { number: '112',  label: 'Urgences' },
  'monaco':        { number: '15',   label: 'SAMU' },
  // Amérique du Nord
  'united-states': { number: '911',  label: 'Emergency (911)' },
  'canada':        { number: '911',  label: 'Emergency (911)' },
};

export const DEFAULT_EMERGENCY: EmergencyInfo = { number: '112', label: 'Urgences' };

export function getEmergency(countryCode: string): EmergencyInfo {
  return EMERGENCY_NUMBERS[countryCode] ?? DEFAULT_EMERGENCY;
}

/** Génère le texte des numéros pour les prompts IA. */
export function buildEmergencyContext(): string {
  const lines = Object.entries(EMERGENCY_NUMBERS).map(
    ([code, info]) => `  - ${code} : ${info.number} (${info.label})`
  );
  return `NUMÉROS D'URGENCE MÉDICALE PAR PAYS :\n${lines.join('\n')}\n  - Autre pays : 112 (numéro international)`;
}
