/**
 * Coordonnées Dr Helminah affichées dans /about.
 *
 * Édite juste les URLs ci-dessous, aucune autre partie du code à toucher.
 * Mets "" (chaîne vide) pour masquer un lien qui n'existe pas.
 */

export const DR_HELMINAH_LINKS = {
  website:   'https://drhelminah.com',
  instagram: '', // ex. 'https://instagram.com/handle'
  tiktok:    '',
  facebook:  '',
  youtube:   '',
  linkedin:  '',
} as const;

export type DrHelminahLinkKey = keyof typeof DR_HELMINAH_LINKS;
