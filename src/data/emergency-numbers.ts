/** Numéros d'urgence médicale (ambulance/SAMU) par code pays AINA. */
export interface EmergencyInfo {
  number: string;
  label: string; // nom du service
}

export const EMERGENCY_NUMBERS: Record<string, EmergencyInfo> = {
  // Afrique de l'Ouest
  'senegal':       { number: '1515', label: 'SAMU' },
  'mali':          { number: '15',   label: 'SAMU' },
  'burkina-faso':  { number: '112',  label: 'Urgences' },
  'niger':         { number: '15',   label: 'SAMU' },
  'benin':         { number: '112',  label: 'Urgences' },
  'togo':          { number: '112',  label: 'Urgences' },
  'guinee':        { number: '112',  label: 'Urgences' },
  'mauritanie':    { number: '112',  label: 'Urgences' },
  'cote-ivoire':   { number: '143',  label: 'SAMU' },
  // Afrique centrale
  'cameroun':      { number: '112',  label: 'Urgences' },
  'gabon':         { number: '1300', label: 'SAMU' },
  'congo-kinshasa':{ number: '112',  label: 'Urgences' },
  'congo-brazza':  { number: '112',  label: 'Urgences' },
  'tchad':         { number: '1313', label: 'Urgences' },
  'centrafrique':  { number: '112',  label: 'Urgences' },
  // Afrique de l'Est & Océan Indien
  'madagascar':    { number: '910',  label: 'Ambulance' },
  'rwanda':        { number: '912',  label: 'SAMU' },
  'burundi':       { number: '112',  label: 'Urgences' },
  'comores':       { number: '112',  label: 'Urgences' },
  'djibouti':      { number: '351515', label: 'SAMU' },
  'maurice':       { number: '114',  label: 'SAMU' },
  // Caraïbes
  'haiti':         { number: '115',  label: 'SAMU' },
  // Maghreb
  'maroc':         { number: '15',   label: 'SAMU' },
  'tunisie':       { number: '190',  label: 'SAMU' },
  'algerie':       { number: '115',  label: 'SAMU' },
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
