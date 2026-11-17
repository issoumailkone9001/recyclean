/* Recyclean — version HTML/CSS/JS (sans framework) */
const I = (n, s = 20, x = {}) =>
  `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${x.fill || "none"}" stroke="currentColor" stroke-width="${x.sw || 2}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ""}</svg>`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const KEYS = ["district", "delay", "channel", "remind", "done"];
const S = { screen: "home", profile: false, onb: 0, filter: "Tous", q: "", guide: null, rstep: 1, rtype: "Dépôt sauvage", sent: false, rid: "", note: "", resolved: false, toast: "", district: "Colobane", delay: "1 h", channel: "Notification", remind: true, done: false };
try { Object.assign(S, JSON.parse(localStorage.getItem("recyclean") || "{}")); } catch (e) {}
const save = () => { try { localStorage.setItem("recyclean", JSON.stringify(Object.fromEntries(KEYS.map((k) => [k, S[k]])))); } catch (e) {} };
if (!S.done) S.onb = 1;

const DAYS = [["Lun", 14, 0], ["Mar", 15, 1], ["Mer", 16, 0], ["Jeu", 17, 1], ["Ven", 18, 0], ["Sam", 19, 1], ["Dim", 20, 0]];
const POINTS = [
  { n: "Point propre Colobane", a: "Marché de Colobane", d: "350 m", t: ["Plastique", "Ménager"], c: "#155b4d" },
  { n: "Atelier Keur Gui", a: "Rue 12 × Avenue Blaise Diagne", d: "800 m", t: ["Tissu", "Plastique"], c: "#f0a04b" },
  { n: "Bac municipal Fass", a: "Près de la mairie de quartier", d: "1,2 km", t: ["Ménager"], c: "#2c7f6d" },
];
const TIPS = [
  ["Déchets ménagers", "Bien préparer son bac", "trash-2", "mint"],
  ["Plastiques", "Trier, rincer, aplatir", "recycle", "orange"],
  ["Chutes de tissu", "Donner une seconde vie", "sparkles", "lilac"],
];

/* ---------- Composants ---------- */
const logo = (c) => `<div class="brand"><span class="brand-mark">${I("leaf", c ? 17 : 20, { sw: 2.6 })}</span>${c ? "" : "<span>Recyclean</span>"}</div>`;
const toggle = (on, a) => `<button class="toggle ${on ? "is-on" : ""}" data-a="${a}" role="switch" aria-checked="${on}" aria-label="${on ? "Désactiver" : "Activer"}"><span></span></button>`;
const pill = (t, tone = "green") => `<span class="status-pill ${tone}">${t}</span>`;
const go = (s, icon, label, cls = "") => `<button class="${cls}" data-a="go" data-v="${s}">${icon}${label}</button>`;
const header = (title, sub, back = `data-a="go" data-v="home"`) => `
<header class="topbar"><div class="topbar-title">
  ${title ? `<button class="icon-button" ${back} aria-label="Retour">${I("arrow-left", 21)}</button>` : logo()}
  ${title ? `<div><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ""}</div>` : ""}
</div><div class="top-actions">
  <button class="connection" title="Mode faible connexion"><span></span> ${navigator.onLine ? "En ligne" : "Hors ligne"}</button>
  <button class="avatar" data-a="profile" aria-label="Ouvrir le menu">${I("user-round", 18)}</button>
</div></header>`;
const quick = (icon, label, cap, tone, s) => `<button class="quick-card" data-a="go" data-v="${s}"><span class="quick-icon ${tone}">${I(icon, 23)}</span><span><b>${label}</b><small>${cap}</small></span>${I("chevron-right", 18)}</button>`;
const heading = (h, r = "") => `<div class="section-heading"><h2>${h}</h2>${r}</div>`;
const navItem = (s, icon, label) => `<button class="${S.screen === s ? "active" : ""}" data-a="go" data-v="${s}">${I(icon, 21)}<span>${label}</span></button>`;
const primary = (a, label, icon = "arrow-right", extra = "") => `<button class="primary-button ${extra}" data-a="${a}">${label} ${I(icon, 18)}</button>`;

/* ---------- Écrans ---------- */
const R = {
  home: () => `${header()}
<main class="page home-page">
  <section class="welcome"><div><p class="eyebrow">Mardi 15 octobre</p><h1>Bonjour, Fatou</h1><p>Votre quartier est prêt pour la collecte.</p></div>
    <div class="weather">${I("cloud-sun", 20)}<span>28°</span></div></section>
  <section class="pickup-card">
    <div class="pickup-head"><span class="mini-label">${I("truck", 16)} Prochain passage</span>${pill("Confirmé")}</div>
    <div class="countdown"><div><strong>01</strong><span>jour</span></div><i>:</i><div><strong>12</strong><span>heures</span></div></div>
    <div class="pickup-details">
      <div>${I("calendar-days", 19)}<span><small>Jeudi 17 octobre</small><b>07:30 – 09:30</b></span></div>
      <div>${I("map-pin", 19)}<span><small>Votre quartier</small><b>${S.district}</b></span></div></div>
    ${go("schedule", "", `Voir le calendrier ${I("arrow-right", 17)}`, "light-button")}
  </section>
  <section class="reminder-strip" data-a="go" data-v="reminders"><span class="reminder-icon">${I("bell", 20)}</span>
    <div><b>${S.remind ? "Rappel activé" : "Rappel désactivé"}</b><p>${S.remind ? `Notification ${S.delay} avant le passage` : "Activez-le pour ne rien manquer"}</p></div>${I("chevron-right", 19)}</section>
  <section>${heading("Que souhaitez-vous faire ?")}
    <div class="quick-grid">
      ${quick("map-pin", "Trouver un point", "3 près de vous", "green", "map")}
      ${quick("recycle", "Guide de tri", "Trier simplement", "orange", "guide")}
      ${quick("circle-alert", "Signaler", "En 3 étapes", "coral", "reports")}
      ${quick("calendar-days", "Horaires", "Cette semaine", "blue", "schedule")}
    </div></section>
  <section class="tip-banner"><div class="tip-art">${I("package-open", 30)}</div>
    <div><span>Conseil du jour</span><h3>Aplatissez vos bouteilles</h3><p>Elles prennent jusqu’à 4× moins de place.</p></div>
    <button data-a="go" data-v="guide" aria-label="Ouvrir le guide">${I("arrow-right", 18)}</button></section>
</main>`,

  schedule: () => `${header("Calendrier", "Passages de collecte")}
<main class="page">
  <button class="district-select" data-a="district"><span>${I("map-pin", 18)} Quartier : <b>${S.district}</b></span>${I("chevron-down", 19)}</button>
  <section class="calendar-card">
    <div class="calendar-month"><button aria-label="Semaine précédente">${I("arrow-left", 18)}</button><h2>Octobre 2025</h2><button aria-label="Semaine suivante">${I("arrow-right", 18)}</button></div>
    <div class="week-row">${DAYS.map(([d, n, a]) => `<div class="day-cell ${a ? "active" : ""}"><span>${d}</span><b>${n}</b>${a ? "<i></i>" : ""}</div>`).join("")}</div>
    <div class="legend"><span><i></i> Jour de collecte</span><span class="today">Aujourd’hui</span></div>
  </section>
  <section>${heading("Prochains passages", "<span>3 cette semaine</span>")}
    <div class="timeline">
      ${tl("MAR", "15", "07:30 – 09:30", "Passage terminé", "muted")}
      ${tl("JEU", "17", "07:30 – 09:30", "Prochain passage", "current")}
      ${tl("SAM", "19", "08:00 – 10:00", "Dans 4 jours", "")}
    </div></section>
  <div class="offline-note">${I("shield-check", 19)}<div><b>Disponible hors connexion</b><p>Les horaires sont enregistrés sur votre téléphone.</p></div></div>
</main>`,

  reminders: () => {
    const dis = S.remind ? "" : "disabled";
    const ch = (t, icon, note) => `<button class="channel ${S.channel === t ? "active" : ""}" data-a="channel" data-v="${t}"><span>${I(icon, 21)}</span><div><b>${t}</b><small>${note}</small></div><i>${S.channel === t ? I("check", 14) : ""}</i></button>`;
    return `${header("Mes rappels", "Ne manquez plus un passage")}
<main class="page">
  <section class="settings-hero"><span>${I("bell", 25)}</span><div><h2>Rappels de collecte</h2><p>Recevez un rappel avant chaque passage.</p></div>${toggle(S.remind, "remind")}</section>
  <section class="setting-group ${dis}"><label>Quand souhaitez-vous être prévenu ?</label>
    <div class="choice-grid">${["1 h", "3 h", "12 h", "1 jour"].map((v) => `<button class="${S.delay === v ? "selected" : ""}" data-a="delay" data-v="${v}">${S.delay === v ? I("check", 15) : ""} ${v} avant</button>`).join("")}</div></section>
  <section class="setting-group ${dis}"><label>Canal de rappel</label>
    <div class="channel-list">${ch("Notification", "bell", "Gratuit, via l’application")}${ch("WhatsApp", "message-circle", "Idéal avec une connexion internet")}${ch("SMS", "phone", "Fiable, même sans internet")}</div></section>
  <div class="preview-message"><span class="preview-bell">${I("bell", 18)}</span>
    <div><small>APERÇU DU RAPPEL</small><b>La collecte passe dans ${S.delay}</b><p>Sortez vos déchets avant 07:30 à ${S.district}${S.channel === "SMS" ? "." : ". Merci !"}</p></div></div>
  ${primary("save", "Enregistrer mes préférences", "check")}
</main>`;
  },

  map: () => {
    const q = S.q.trim().toLowerCase();
    const list = POINTS.filter((p) => (S.filter === "Tous" || p.t.includes(S.filter)) && (!q || (p.n + p.a).toLowerCase().includes(q)));
    const pin = (c, n, acc) => `<span class="map-marker ${c} ${acc ? "accent" : ""}">${I("map-pin", 31, { fill: "currentColor" })}<b>${n}</b></span>`;
    return `${header("Points de dépôt", `Autour de ${S.district}`)}
<main class="map-page">
  <div class="map-search">${I("search", 19)}<input id="q" data-i="q" placeholder="Rechercher un point" value="${esc(S.q)}" aria-label="Rechercher un point"><button aria-label="Filtrer">${I("filter", 18)}</button></div>
  <div class="filter-row">${["Tous", "Plastique", "Tissu", "Ménager"].map((x) => `<button class="${S.filter === x ? "active" : ""}" data-a="filter" data-v="${x}">${x}</button>`).join("")}</div>
  <section class="map-canvas"><span class="road road-a"></span><span class="road road-b"></span><span class="road road-c"></span><span class="road road-d"></span>
    <span class="map-label label-a">Marché Colobane</span><span class="map-label label-b">Av. Blaise Diagne</span>
    <span class="user-dot"><i></i></span>${pin("pin-one", 1)}${pin("pin-two", 2, 1)}${pin("pin-three", 3)}
    <button class="locate" data-a="locate" aria-label="Me localiser">${I("locate-fixed", 19)}</button></section>
  <section class="map-list">${heading("Près de vous", `<span>${list.length} point${list.length > 1 ? "s" : ""}</span>`)}
    ${list.map((p, i) => `<button class="point-card"><span class="point-number" style="background:${p.c}">${i + 1}</span><div><h3>${p.n}</h3><p>${p.a}</p><div>${p.t.map((t) => `<em>${t}</em>`).join("")}</div></div><span class="distance">${I("navigation", 14)}${p.d}</span></button>`).join("") || `<p class="offline-note">Aucun point ne correspond à votre recherche.</p>`}
  </section>
</main>`;
  },

  guide: () => `${header("Guide de tri", "Des gestes simples et utiles")}
<main class="page">
  <section class="guide-hero"><div><span>LE BON GESTE</span><h2>Chaque déchet a sa place.</h2><p>Apprenez à mieux trier en moins de 2 minutes.</p></div>${I("recycle", 58, { sw: 1.4 })}</section>
  <section>${heading("Que voulez-vous trier ?")}
    <div class="tip-list">${TIPS.map(([t, s, ic, c]) => `<button class="tip-card" data-a="tip" data-v="${t}"><span class="${c}">${I(ic, 27)}</span><div><h3>${t}</h3><p>${s}</p></div>${I("chevron-right", 19)}</button>`).join("")}</div></section>
  <section class="textile-feature"><span class="feature-icon">${I("sparkles", 26)}</span>
    <div><small>SPÉCIAL ARTISANS</small><h3>Ne jetez plus vos chutes de tissu</h3><p>Transformez-les en rembourrage, accessoires ou patchworks.</p>
    <button data-a="tip" data-v="Chutes de tissu">Voir 6 idées ${I("arrow-right", 16)}</button></div></section>
  <section class="three-rules"><h2>Les 3 règles d’or</h2>
    <div><span>1</span><p><b>Vider</b> les contenants</p></div><div><span>2</span><p><b>Rincer</b> rapidement</p></div><div><span>3</span><p><b>Aplatir</b> pour gagner de la place</p></div></section>
</main>`,

  reports: () => {
    if (S.sent) return `${header("Signalement envoyé")}
<main class="page success-page"><span class="success-mark">${I("check", 34)}</span><p class="eyebrow">MERCI POUR VOTRE AIDE</p><h1>C’est bien reçu !</h1>
  <p>Votre signalement a été transmis à l’équipe de ${S.district}.</p>
  <div class="tracking-card"><div><small>NUMÉRO DE SUIVI</small><b>#${S.rid}</b></div>${pill("Envoyé")}</div>
  <div class="report-progress"><span class="done">${I("check", 14)}</span><i></i><span>2</span><i></i><span>3</span><div><b>Envoyé</b><b>Pris en charge</b><b>Résolu</b></div></div>
  ${go("home", "", "Retour à l’accueil", "primary-button")}
  <button class="secondary-button" data-a="rreset">Faire un autre signalement</button></main>`;
    const st = S.rstep;
    const issues = [["Dépôt sauvage", "trash-2"], ["Bac débordant", "package-open"], ["Collecte manquée", "truck"], ["Autre problème", "circle-alert"]];
    const body = [
      `<p class="eyebrow">QU’AVEZ-VOUS REMARQUÉ ?</p><h1>Choisissez le problème</h1><p>Une seule réponse suffit.</p>
       <div class="issue-grid">${issues.map(([l, ic]) => `<button class="${S.rtype === l ? "selected" : ""}" data-a="rtype" data-v="${l}">${I(ic, 25)}<span>${l}</span>${S.rtype === l ? I("check", 16) : ""}</button>`).join("")}</div>`,
      `<p class="eyebrow">OÙ EST LE PROBLÈME ?</p><h1>Confirmez la position</h1><p>Déplacez le repère si nécessaire.</p>
       <div class="report-map"><span class="road road-a"></span><span class="road road-b"></span>${I("map-pin", 42, { fill: "#f37352" })}<button data-a="locate">${I("locate-fixed", 18)} Me localiser</button></div>
       <label class="address-field">${I("map-pin", 19)}<span><small>Position détectée</small><b>Rue 14, ${S.district}, Dakar</b></span>${I("chevron-right", 19)}</label>`,
      `<p class="eyebrow">DERNIÈRE ÉTAPE</p><h1>Ajoutez une photo</h1><p>Facultatif, mais utile pour l’équipe.</p>
       <button class="photo-zone" data-a="photo"><span>${I("camera", 29)}</span><b>Prendre une photo</b><small>ou choisir dans la galerie</small></button>
       <input type="file" id="photo" accept="image/*" capture="environment" hidden>
       <label class="comment-field">Un détail à ajouter ? <textarea id="note" data-i="note" placeholder="Ex. Le dépôt bloque le passage...">${esc(S.note)}</textarea></label>
       <div class="summary-line"><span>${I("trash-2", 18)}</span><div><small>Votre signalement</small><b>${S.rtype} · Rue 14, ${S.district}</b></div>${I("check", 18)}</div>`,
    ][st - 1];
    return `${header("Faire un signalement", `Étape ${st} sur 3`, `data-a="rback"`)}
<div class="stepper"><span class="active"></span><span class="${st >= 2 ? "active" : ""}"></span><span class="${st >= 3 ? "active" : ""}"></span></div>
<main class="page report-page">${body}
  ${primary("rnext", st < 3 ? "Continuer" : "Envoyer le signalement", "arrow-right", "report-next")}
  ${st === 3 ? `<p class="privacy">${I("shield-check", 14)} Votre identité ne sera pas affichée publiquement.</p>` : ""}
</main>`;
  },

  collector: () => `${header("Espace collecteur", "GIE Colobane Propre")}
<main class="page">
  <div class="role-banner">${I("truck", 22)}<div><b>Tournée en cours</b><p>${S.district} · Secteur Est</p></div>${pill("07:30")}</div>
  <div class="stats-row"><div><b>8</b><span>À traiter</span></div><div><b>3</b><span>En cours</span></div><div><b>${S.resolved ? 13 : 12}</b><span>Résolus</span></div></div>
  ${heading("Signalements reçus", `<button>${I("filter", 16)} Filtrer</button>`)}
  <div class="ticket">
    <div class="ticket-head"><span class="alert-icon">${I("trash-2", 19)}</span><div><h3>Dépôt sauvage</h3><p>#RC-24015 · il y a 12 min</p></div>${pill(S.resolved ? "Résolu" : "Nouveau", S.resolved ? "green" : "orange")}</div>
    <div class="ticket-location">${I("map-pin", 17)}<span>Rue 14, près du marché Colobane</span><b>450 m</b></div>
    <div class="fake-photo">${I("trash-2", 30)}<span>Photo du signalement</span></div>
    <div class="ticket-actions"><button data-a="route">${I("navigation", 17)} Itinéraire</button><button class="resolve" data-a="resolve">${I("check", 17)} ${S.resolved ? "Marqué résolu" : "Prendre en charge"}</button></div>
  </div>
  <div class="ticket compact">
    <div class="ticket-head"><span class="alert-icon yellow">${I("package-open", 19)}</span><div><h3>Bac débordant</h3><p>#RC-24012 · il y a 45 min</p></div>${pill("En cours", "gray")}</div>
    <div class="ticket-location">${I("map-pin", 17)}<span>Avenue 6, secteur Ouest</span><b>1,1 km</b></div>
  </div>
</main>`,

  admin: () => {
    const st = (ic, v, l, e, g) => `<div><span>${I(ic, 19)}</span><b>${v}</b><small>${l}</small><em class="${g ? "good" : ""}">${e}</em></div>`;
    const z = (r, h, t, s) => `<div><span class="rank ${h ? "hot" : ""}">${r}</span><div><b>${t}</b><p>${s}</p></div>${I("chevron-right", 19)}</div>`;
    return `${header("Tableau de bord", "Mairie · Vue opérationnelle")}
<main class="page admin-page">
  <div class="admin-period"><span>Cette semaine</span>${I("chevron-down", 18)}</div>
  <div class="admin-stats">${st("circle-alert", 24, "Signalements", "+12%", 0)}${st("clock-3", "5h 20", "Délai moyen", "−18%", 1)}${st("bell", "68%", "Rappels activés", "+6%", 1)}</div>
  ${heading("Zones à surveiller", "<span>Mise à jour à 09:12</span>")}
  <div class="heat-map"><span class="road road-a"></span><span class="road road-b"></span><span class="heat heat-a"></span><span class="heat heat-b"></span><span class="heat heat-c"></span>
    <span class="zone-label z1">Colobane</span><span class="zone-label z2">Fass</span><div class="map-legend"><i></i> Faible <i></i> Élevé</div></div>
  <div class="zone-list">${z(1, 1, "Colobane Est", "8 signalements · 3 non traités")}${z(2, 0, "Fass Delorme", "5 signalements · 1 non traité")}</div>
</main>`;
  },
};

function tl(d, n, time, note, cls) {
  return `<div class="timeline-item ${cls}"><div class="timeline-date"><span>${d}</span><b>${n}</b></div><div class="timeline-line"><i></i></div>
  <div class="timeline-content"><span>${note}</span><h3>Collecte ménagère</h3><p>${I("clock-3", 15)} ${time}</p></div>${cls === "current" ? `<span class="truck-badge">${I("truck", 18)}</span>` : ""}</div>`;
}

/* ---------- Navigation, feuilles, onboarding ---------- */
const bottomNav = () => `<nav class="bottom-nav">${navItem("home", "home", "Accueil")}${navItem("map", "map", "Carte")}
  <button class="report-fab" data-a="go" data-v="reports" aria-label="Signaler">${I("plus", 24)}<span>Signaler</span></button>
  ${navItem("guide", "recycle", "Guide")}${navItem("reminders", "menu", "Plus")}</nav>`;

const sideNav = () => {
  const l = (s, ic, t) => `<button class="${S.screen === s ? "active" : ""}" data-a="go" data-v="${s}">${I(ic, 19)}<span>${t}</span></button>`;
  return `<aside class="side-nav">${logo()}<div class="district-chip"><span>Quartier actuel</span><b>${I("map-pin", 15)} ${S.district}</b></div>
  <nav>${l("home", "home", "Accueil")}${l("schedule", "calendar-days", "Calendrier")}${l("map", "map", "Points de dépôt")}${l("guide", "recycle", "Guide de tri")}${l("reports", "circle-alert", "Mes signalements")}${l("reminders", "bell", "Mes rappels")}</nav>
  <div class="side-bottom"><p>Espaces de démonstration</p>${l("collector", "truck", "Vue collecteur")}${l("admin", "users", "Vue mairie")}
  <button class="restart-button" data-a="onb">${I("sparkles", 16)} Revoir l’accueil</button></div></aside>`;
};

const profileSheet = () => {
  const row = (a, v, ic, t) => `<button data-a="${a}" data-v="${v}">${I(ic, 19)}<span>${t}</span>${I("chevron-right", 18)}</button>`;
  return `<div class="modal-backdrop"><div class="profile-sheet" role="dialog" aria-label="Menu"><div class="sheet-handle"></div>
  <button class="sheet-close" data-a="closeP" aria-label="Fermer">${I("x", 20)}</button>
  <div class="profile-head"><span>${I("user-round", 25)}</span><div><h2>Fatou Ndiaye</h2><p>${S.district} · Français</p></div></div>
  ${row("go", "reminders", "bell", "Mes rappels")}${row("onb", "", "settings", "Changer de quartier")}
  <p class="role-title">APERÇU DES AUTRES ESPACES</p>${row("go", "collector", "truck", "Espace collecteur")}${row("go", "admin", "users", "Tableau de bord mairie")}</div></div>`;
};

const tipSheet = () => {
  const t = S.guide, tx = t === "Chutes de tissu";
  return `<div class="modal-backdrop"><div class="bottom-sheet" role="dialog" aria-label="${t}"><div class="sheet-handle"></div>
  <button class="sheet-close" data-a="closeTip" aria-label="Fermer">${I("x", 20)}</button>
  <span class="sheet-icon">${I(tx ? "sparkles" : "recycle", 31)}</span><p class="eyebrow">FICHE PRATIQUE</p><h2>${t}</h2>
  <p class="sheet-intro">${tx ? "Les petites chutes ont encore beaucoup de valeur. Triez-les par matière et par couleur." : "Un tri simple commence par quelques gestes faciles à retenir."}</p>
  <div class="do-list"><div>${I("check", 17)}<span><b>À faire</b><p>${tx ? "Les garder propres et bien sèches" : "Vider et rincer les contenants"}</p></span></div>
  <div>${I("check", 17)}<span><b>Bon à savoir</b><p>${tx ? "Les grandes chutes peuvent devenir des pochettes" : "Aplatir permet de réduire le volume"}</p></span></div></div>
  <button class="primary-button" data-a="closeTip">J’ai compris</button></div></div>`;
};

const onboarding = () => {
  const s = S.onb;
  const body = [
    `<div class="onboarding-art welcome-art"><span class="sun"></span><span class="city c1"></span><span class="city c2"></span><span class="city c3"></span><span class="leaf-shape l1"></span><span class="leaf-shape l2"></span><div class="art-truck">${I("truck", 46)}</div></div>
     <p class="eyebrow">BIENVENUE SUR RECYCLEAN</p><h1>Une ville plus propre,<br>un geste à la fois.</h1><p>Les horaires, les rappels et les bons gestes pour votre quartier.</p>
     <div class="language-choice"><button class="active">${I("check", 16)} Français</button><button>Wolof</button></div>`,
    `<div class="onboarding-symbol">${I("map-pin", 38)}</div><p class="eyebrow">VOTRE QUARTIER</p><h1>Où habitez-vous ?</h1><p>Nous afficherons les horaires et les points de dépôt proches.</p>
     <div class="district-options">${["Colobane", "Fass"].map((x) => `<button class="${S.district === x ? "active" : ""}" data-a="district" data-v="${x}"><span>${I("map-pin", 20)}<b>${x}</b></span>${S.district === x ? I("check", 17) : ""}</button>`).join("")}</div>
     <button class="location-button" data-a="locate">${I("locate-fixed", 18)} Utiliser ma position</button>`,
    `<div class="onboarding-symbol bell-symbol">${I("bell", 38)}</div><p class="eyebrow">RESTEZ INFORMÉE</p><h1>Un rappel au bon moment.</h1><p>Nous vous prévenons avant le passage de la collecte.</p>
     <div class="reminder-onboarding"><div><span>${I("bell", 20)}</span><div><b>Rappel 1 h avant</b><p>Pour chaque collecte à ${S.district}</p></div></div>${toggle(S.remind, "remind")}</div>
     <div class="sample-notification">${logo(1)}<div><b>Collecte dans 1 heure</b><p>Pensez à sortir vos déchets avant 07:30.</p></div><small>maintenant</small></div>`,
  ][s - 1];
  return `<div class="onboarding"><div class="onboarding-top">${logo()}<button data-a="onbSkip">Passer</button></div>
  <div class="onboarding-progress"><span class="active"></span><span class="${s >= 2 ? "active" : ""}"></span><span class="${s >= 3 ? "active" : ""}"></span></div>
  <div class="onboarding-body">${body}</div>
  <div class="onboarding-footer"><button class="primary-button" data-a="onbNext">${s < 3 ? "Continuer" : "Découvrir Recyclean"} ${I("arrow-right", 18)}</button>
  ${s > 1 ? `<button class="back-link" data-a="onbBack">Retour</button>` : ""}</div></div>`;
};

/* ---------- Rendu ---------- */
const app = document.getElementById("app");
function draw() {
  const f = document.activeElement && document.activeElement.id;
  const pos = f && document.activeElement.selectionStart;
  if (S.onb) app.innerHTML = onboarding();
  else {
    const nav = ["collector", "admin"].includes(S.screen) ? "" : bottomNav();
    app.innerHTML = `${sideNav()}<div class="mobile-stage">${R[S.screen]()}${nav}</div>${S.profile ? profileSheet() : ""}${S.guide ? tipSheet() : ""}`;
  }
  if (S.toast) app.insertAdjacentHTML("beforeend", `<div class="toast" role="status">${S.toast}</div>`);
  if (f) { const el = document.getElementById(f); if (el) { el.focus(); try { el.setSelectionRange(pos, pos); } catch (e) {} } }
}
function toast(m) { S.toast = m; draw(); clearTimeout(toast.t); toast.t = setTimeout(() => { S.toast = ""; document.querySelector(".toast")?.remove(); }, 2200); }
function nav(s) {
  Object.assign(S, { screen: R[s] ? s : "home", profile: false, guide: null, rstep: 1, sent: false, note: "" });
  if (location.hash !== "#/" + S.screen) { try { history.pushState(null, "", "#/" + S.screen); } catch (e) { location.hash = "/" + S.screen; } }
  draw(); window.scrollTo({ top: 0, behavior: "smooth" });
}
window.addEventListener("popstate", () => { S.screen = location.hash.slice(2) in R ? location.hash.slice(2) : "home"; draw(); });
if (location.hash.slice(2) in R) S.screen = location.hash.slice(2);

const A = {
  go: (v) => nav(v),
  profile: () => { S.profile = true; draw(); },
  closeP: () => { S.profile = false; draw(); },
  onb: () => { S.profile = false; S.onb = 1; draw(); },
  onbNext: () => { if (S.onb < 3) S.onb++; else { S.onb = 0; S.done = true; save(); } draw(); },
  onbBack: () => { S.onb--; draw(); },
  onbSkip: () => { S.onb = 0; S.done = true; save(); draw(); },
  district: (v) => { S.district = v || (S.district === "Colobane" ? "Fass" : "Colobane"); save(); draw(); },
  remind: () => { S.remind = !S.remind; save(); draw(); },
  delay: (v) => { S.delay = v; draw(); },
  channel: (v) => { S.channel = v; draw(); },
  save: () => { save(); toast("Préférences enregistrées"); },
  filter: (v) => { S.filter = v; draw(); },
  tip: (v) => { S.guide = v; draw(); },
  closeTip: () => { S.guide = null; draw(); },
  rtype: (v) => { S.rtype = v; draw(); },
  rnext: () => { if (S.rstep < 3) S.rstep++; else { S.sent = true; S.rid = "RC-" + (24016 + Math.floor(Math.random() * 900)); } draw(); window.scrollTo({ top: 0 }); },
  rback: () => (S.rstep > 1 ? (S.rstep--, draw()) : nav("home")),
  rreset: () => { S.sent = false; S.rstep = 1; S.note = ""; draw(); },
  resolve: () => { S.resolved = !S.resolved; draw(); },
  route: () => toast("Itinéraire : bientôt disponible"),
  photo: () => document.getElementById("photo").click(),
  locate: () => {
    if (!navigator.geolocation) return toast("Position indisponible sur cet appareil");
    navigator.geolocation.getCurrentPosition(() => toast("Position détectée"), () => toast("Autorisez la localisation pour continuer"));
  },
};
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-backdrop")) { S.profile = false; S.guide = null; return draw(); }
  const b = e.target.closest("[data-a]");
  if (b && A[b.dataset.a]) A[b.dataset.a](b.dataset.v);
});
document.addEventListener("input", (e) => {
  const k = e.target.dataset.i;
  if (k === "q") { S.q = e.target.value; draw(); } else if (k === "note") S.note = e.target.value;
});
document.addEventListener("change", (e) => { if (e.target.id === "photo" && e.target.files[0]) toast("Photo ajoutée"); });
window.addEventListener("online", draw);
window.addEventListener("offline", draw);
draw();

if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
