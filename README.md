# Recyclean — HTML / CSS / JavaScript

Application web installable (PWA), sans build ni framework. Écrans : accueil, calendrier, rappels, carte des points de dépôt, guide de tri, signalement en 3 étapes, espace collecteur, tableau de bord mairie, onboarding.

## Déployer sur Vercel
1. Mettez le contenu de ce dossier dans un dépôt GitHub (ou `vercel` en ligne de commande depuis ce dossier).
2. Sur vercel.com : **Add New → Project** → importez le dépôt.
3. Framework Preset : **Other**. Build Command et Output Directory : laissez vides. **Deploy**.

## Structure
- `index.html` : page unique
- `css/style.css` : styles repris de la maquette Figma
- `js/app.js` : écrans et interactions · `js/icons.js` : icônes Lucide
- `sw.js` + `manifest.json` : mode hors connexion et installation sur téléphone
- `vercel.json` : configuration Vercel
