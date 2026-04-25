/**
 * Coordonnées Dr Helminah affichées dans /about.
 *
 * Édite juste les URLs ci-dessous, aucune autre partie du code à toucher.
 * Mets "" (chaîne vide) pour masquer un lien qui n'existe pas.
 */

export const DR_HELMINAH_LINKS = {
  website:   'https://drhelminah.com',
  instagram: 'https://www.instagram.com/dr.helminah/',
  tiktok:    'https://www.tiktok.com/@dr.helminah',
  youtube:   'https://www.youtube.com/@drhelminah',
  linkedin:  'https://linkedin.com/in/helminah-rm',
  email:     'mailto:helminahpro@gmail.com',
  calendly:  'https://calendly.com/helminahmalalaniaina/appel-decouverte-avec-helminah',
} as const;

export type DrHelminahLinkKey = keyof typeof DR_HELMINAH_LINKS;
