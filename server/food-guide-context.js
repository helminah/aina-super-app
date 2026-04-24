/**
 * Contexte nutritionnel distillé depuis src/data/food-guide.ts.
 * Chargé au boot du serveur, injecté dans le system prompt avec
 * cache_control: ephemeral pour bénéficier du prompt caching Anthropic
 * (réduction significative du coût sur plusieurs requêtes).
 *
 * Si food-guide.ts change significativement, régénérer cette constante.
 */

export const FOOD_GUIDE_CONTEXT = `
## Guide d'introduction des aliments (AINA)

### 4-6 mois — Premières découvertes (purée très lisse)
Légumes : carotte, courgette, patate douce, potiron/courge, haricots verts.
Fruits : pomme, poire, banane (écrasée), compote.
Céréales : riz, farine infantile sans gluten.
Aucun allergène. Pas de sel, ni sucre, ni miel.
Contexte Afrique : manioc, patate douce, courges locales très nutritives.

### 6-9 mois — Nouvelles textures (purée + moulinée)
Légumes : épinards, brocoli, tomate pelée, poireau, petits pois.
Fruits : mangue, papaye, avocat, prune, abricot, fraise (allergène).
Céréales : blé, avoine, maïs, semoule fine, pain grillé sans croûte.
Protéines : poulet bien cuit mixé, œuf dur entier (allergène), lentilles écrasées.
Laitages : yaourt nature, fromage blanc (allergène).
Attention allergènes : introduire un à la fois, surveiller 3 jours.

### 9-12 mois — Morceaux fondants + autonomie
Textures : petits morceaux, finger food.
Nouveaux aliments : poisson blanc cuit (allergène), œuf brouillé, houmous,
pois chiches écrasés, couscous, riz complet, boulettes maison.
Afrique : fonio, mil écrasé, moringa, arachide en pâte lisse (attention allergène).
Diversification texture : bébé apprend à mastiquer.

### 12-24 mois — Repas variés en famille
Quasi tout autorisé en adaptant la texture. Morceaux taille bouchée.
Introduire progressivement : fruits de mer cuits (allergène), noix
entières interdites avant 3 ans (risque fausse route), miel OK dès 12 mois.
Repas de famille partagés, 4 repas/jour (petit-déj, déj, goûter, dîner).

### Règles constantes
- Pas de sel ajouté avant 12 mois, peu après.
- Pas de sucre ajouté, pas de miel avant 12 mois.
- Pas d'épices fortes (piment, poivre) avant 2 ans.
- Eau pure à volonté, pas de jus de fruits, pas de boissons sucrées.
- Cuisson vapeur privilégiée, éviter frit/grillé avant 2 ans.
- Introduire un allergène à la fois, surveiller 3 jours.

### Conservation
- Purée maison : 48h frigo / 1 mois congélateur.
- Biberon lait maternel : 48h frigo / 4-6 mois congélateur.
- Biberon lait infantile : 1h ambiant / 24h frigo non entamé.
- Ne jamais recongeler, réchauffer une seule fois à 70°C min.

### Valeurs nutritionnelles clés
- Fer : viande rouge, lentilles, épinards, mil, moringa.
- Vitamine A : carotte, patate douce, mangue, papaye, potiron.
- Calcium : yaourt, fromage, lait, sésame, moringa.
- Oméga-3 : poisson gras, huile de colza, noix lisses.
- Protéines : viande, poisson, œuf, légumineuses.
`.trim();
