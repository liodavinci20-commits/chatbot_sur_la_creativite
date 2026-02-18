import { motion } from 'framer-motion'

/* ═══════════════════════════════════════
   SVG : Zones de saisie (text, password, textarea)
   ═══════════════════════════════════════ */
function ZonesSaisieSVG() {
    return (
        <svg viewBox="0 0 360 300" className="topic-svg" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="360" height="300" rx="16" fill="#1E1E2E" />
            <text x="15" y="25" fill="#ABB2BF" fontSize="11" fontFamily="sans-serif" fontWeight="bold">Les 3 zones de saisie :</text>
            {/* type="text" */}
            <rect x="10" y="38" width="340" height="60" rx="8" fill="#252536" />
            <text x="20" y="55" fill="#98C379" fontSize="10" fontFamily="monospace">type="text"</text>
            <text x="150" y="55" fill="#5C6370" fontSize="9" fontFamily="sans-serif">→ Texte normal</text>
            <rect x="20" y="62" width="180" height="26" rx="6" fill="#2D2D3F" stroke="#61AFEF" strokeWidth="1" />
            <text x="30" y="80" fill="#ABB2BF" fontSize="10" fontFamily="sans-serif">Jean Dupont</text>
            {/* type="password" */}
            <rect x="10" y="108" width="340" height="60" rx="8" fill="#252536" />
            <text x="20" y="125" fill="#98C379" fontSize="10" fontFamily="monospace">type="password"</text>
            <text x="168" y="125" fill="#5C6370" fontSize="9" fontFamily="sans-serif">→ Texte masqué 🔒</text>
            <rect x="20" y="132" width="180" height="26" rx="6" fill="#2D2D3F" stroke="#E06C75" strokeWidth="1" />
            <text x="30" y="150" fill="#ABB2BF" fontSize="13" fontFamily="monospace">••••••••</text>
            {/* textarea */}
            <rect x="10" y="178" width="340" height="105" rx="8" fill="#252536" />
            <text x="20" y="195" fill="#98C379" fontSize="10" fontFamily="monospace">&lt;textarea&gt;</text>
            <text x="130" y="195" fill="#5C6370" fontSize="9" fontFamily="sans-serif">→ Texte long (messages)</text>
            <rect x="20" y="202" width="240" height="65" rx="6" fill="#2D2D3F" stroke="#61AFEF" strokeWidth="1" />
            <text x="30" y="222" fill="#5C6370" fontSize="10" fontFamily="sans-serif">Ton message ici...</text>
            <text x="30" y="240" fill="#5C6370" fontSize="10" fontFamily="sans-serif">Tu peux écrire</text>
            <text x="30" y="255" fill="#5C6370" fontSize="10" fontFamily="sans-serif">plusieurs lignes !</text>
        </svg>
    )
}

/* ═══════════════════════════════════════
   SVG : Cases à cocher (checkbox)
   ═══════════════════════════════════════ */
function CasesACocherSVG() {
    return (
        <svg viewBox="0 0 360 240" className="topic-svg" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="360" height="240" rx="16" fill="#1E1E2E" />
            <text x="15" y="25" fill="#E5C07B" fontSize="11" fontFamily="sans-serif" fontWeight="bold">☑️ Cases à cocher (checkbox) :</text>
            {/* Code */}
            <text x="15" y="50" fill="#C678DD" fontSize="10" fontFamily="monospace">&lt;</text>
            <text x="22" y="50" fill="#E06C75" fontSize="10" fontFamily="monospace">input</text>
            <text x="52" y="50" fill="#D19A66" fontSize="10" fontFamily="monospace">type</text>
            <text x="75" y="50" fill="#56B6C2" fontSize="10" fontFamily="monospace">=</text>
            <text x="82" y="50" fill="#98C379" fontSize="10" fontFamily="monospace">"checkbox"</text>
            <text x="148" y="50" fill="#C678DD" fontSize="10" fontFamily="monospace">/&gt;</text>
            <text x="165" y="50" fill="#ABB2BF" fontSize="10" fontFamily="monospace">Football</text>
            {/* Rendu checkbox */}
            <rect x="200" y="60" width="140" height="120" rx="10" fill="#252536" />
            <text x="215" y="82" fill="#ABB2BF" fontSize="10" fontFamily="sans-serif">Rendu :</text>
            <rect x="215" y="90" width="16" height="16" rx="3" fill="#2D2D3F" stroke="#98C379" strokeWidth="2" />
            <text x="222" y="103" fill="#98C379" fontSize="12" fontFamily="sans-serif">✓</text>
            <text x="237" y="103" fill="#ABB2BF" fontSize="11" fontFamily="sans-serif">Football</text>
            <rect x="215" y="113" width="16" height="16" rx="3" fill="#2D2D3F" stroke="#98C379" strokeWidth="2" />
            <text x="222" y="126" fill="#98C379" fontSize="12" fontFamily="sans-serif">✓</text>
            <text x="237" y="126" fill="#ABB2BF" fontSize="11" fontFamily="sans-serif">Lecture</text>
            <rect x="215" y="136" width="16" height="16" rx="3" fill="#2D2D3F" stroke="#61AFEF" strokeWidth="1" />
            <text x="237" y="149" fill="#5C6370" fontSize="11" fontFamily="sans-serif">Jeux vidéo</text>
            {/* Explication */}
            <text x="15" y="90" fill="#5C6370" fontSize="9" fontFamily="sans-serif">→ Plusieurs choix possibles !</text>
            <text x="15" y="200" fill="#61AFEF" fontSize="9" fontFamily="sans-serif">💡 Checkbox = liste de courses : tu coches tout ce que tu veux !</text>
            <text x="15" y="225" fill="#98C379" fontSize="10" fontFamily="sans-serif">Chaque case a son propre name</text>
        </svg>
    )
}

/* ═══════════════════════════════════════
   SVG : Boutons radio
   ═══════════════════════════════════════ */
function BoutonsRadioSVG() {
    return (
        <svg viewBox="0 0 360 240" className="topic-svg" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="360" height="240" rx="16" fill="#1E1E2E" />
            <text x="15" y="25" fill="#E5C07B" fontSize="11" fontFamily="sans-serif" fontWeight="bold">🔘 Boutons radio :</text>
            {/* Code */}
            <text x="15" y="50" fill="#C678DD" fontSize="10" fontFamily="monospace">&lt;</text>
            <text x="22" y="50" fill="#E06C75" fontSize="10" fontFamily="monospace">input</text>
            <text x="52" y="50" fill="#D19A66" fontSize="10" fontFamily="monospace">type</text>
            <text x="75" y="50" fill="#56B6C2" fontSize="10" fontFamily="monospace">=</text>
            <text x="82" y="50" fill="#98C379" fontSize="10" fontFamily="monospace">"radio"</text>
            <text x="15" y="68" fill="#D19A66" fontSize="10" fontFamily="monospace">  name</text>
            <text x="52" y="68" fill="#56B6C2" fontSize="10" fontFamily="monospace">=</text>
            <text x="59" y="68" fill="#98C379" fontSize="10" fontFamily="monospace">"ville"</text>
            <text x="115" y="68" fill="#C678DD" fontSize="10" fontFamily="monospace">/&gt;</text>
            {/* Rendu radio */}
            <rect x="200" y="40" width="140" height="130" rx="10" fill="#252536" />
            <text x="215" y="62" fill="#ABB2BF" fontSize="10" fontFamily="sans-serif">Rendu :</text>
            <circle cx="225" cy="80" r="8" fill="#2D2D3F" stroke="#61AFEF" strokeWidth="2" />
            <circle cx="225" cy="80" r="4" fill="#667EEA" />
            <text x="240" y="84" fill="#ABB2BF" fontSize="11" fontFamily="sans-serif">Douala</text>
            <circle cx="225" cy="105" r="8" fill="#2D2D3F" stroke="#61AFEF" strokeWidth="1" />
            <text x="240" y="109" fill="#5C6370" fontSize="11" fontFamily="sans-serif">Yaoundé</text>
            <circle cx="225" cy="130" r="8" fill="#2D2D3F" stroke="#61AFEF" strokeWidth="1" />
            <text x="240" y="134" fill="#5C6370" fontSize="11" fontFamily="sans-serif">Bafoussam</text>
            {/* Explication */}
            <text x="15" y="105" fill="#5C6370" fontSize="9" fontFamily="sans-serif">→ Un seul choix possible !</text>
            <text x="15" y="125" fill="#E06C75" fontSize="9" fontFamily="sans-serif">⚠️ Même name = même groupe</text>
            <text x="15" y="200" fill="#61AFEF" fontSize="9" fontFamily="sans-serif">💡 Radio = QCM à réponse unique. Un seul choix !</text>
            <text x="15" y="225" fill="#98C379" fontSize="10" fontFamily="sans-serif">Checkbox ≠ Radio : plusieurs vs un seul</text>
        </svg>
    )
}

/* ═══════════════════════════════════════
   SVG : Listes déroulantes (select)
   ═══════════════════════════════════════ */
function ListesDeroulantesSVG() {
    return (
        <svg viewBox="0 0 360 260" className="topic-svg" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="360" height="260" rx="16" fill="#1E1E2E" />
            <text x="15" y="25" fill="#E5C07B" fontSize="11" fontFamily="sans-serif" fontWeight="bold">📋 Liste déroulante (&lt;select&gt;) :</text>
            {/* Code */}
            <text x="15" y="50" fill="#C678DD" fontSize="10" fontFamily="monospace">&lt;</text>
            <text x="22" y="50" fill="#E06C75" fontSize="10" fontFamily="monospace">select</text>
            <text x="60" y="50" fill="#D19A66" fontSize="10" fontFamily="monospace">name</text>
            <text x="88" y="50" fill="#56B6C2" fontSize="10" fontFamily="monospace">=</text>
            <text x="95" y="50" fill="#98C379" fontSize="10" fontFamily="monospace">"classe"</text>
            <text x="150" y="50" fill="#C678DD" fontSize="10" fontFamily="monospace">&gt;</text>
            <text x="25" y="67" fill="#C678DD" fontSize="10" fontFamily="monospace">&lt;</text>
            <text x="32" y="67" fill="#E06C75" fontSize="10" fontFamily="monospace">option</text>
            <text x="70" y="67" fill="#C678DD" fontSize="10" fontFamily="monospace">&gt;</text>
            <text x="78" y="67" fill="#ABB2BF" fontSize="10" fontFamily="monospace">Seconde</text>
            <text x="130" y="67" fill="#C678DD" fontSize="10" fontFamily="monospace">&lt;/</text>
            <text x="142" y="67" fill="#E06C75" fontSize="10" fontFamily="monospace">option</text>
            <text x="180" y="67" fill="#C678DD" fontSize="10" fontFamily="monospace">&gt;</text>
            <text x="25" y="84" fill="#C678DD" fontSize="10" fontFamily="monospace">&lt;</text>
            <text x="32" y="84" fill="#E06C75" fontSize="10" fontFamily="monospace">option</text>
            <text x="70" y="84" fill="#C678DD" fontSize="10" fontFamily="monospace">&gt;</text>
            <text x="78" y="84" fill="#ABB2BF" fontSize="10" fontFamily="monospace">Première</text>
            <text x="137" y="84" fill="#C678DD" fontSize="10" fontFamily="monospace">&lt;/</text>
            <text x="149" y="84" fill="#E06C75" fontSize="10" fontFamily="monospace">option</text>
            <text x="187" y="84" fill="#C678DD" fontSize="10" fontFamily="monospace">&gt;</text>
            <text x="15" y="101" fill="#C678DD" fontSize="10" fontFamily="monospace">&lt;/</text>
            <text x="27" y="101" fill="#E06C75" fontSize="10" fontFamily="monospace">select</text>
            <text x="65" y="101" fill="#C678DD" fontSize="10" fontFamily="monospace">&gt;</text>
            {/* Rendu select */}
            <rect x="200" y="45" width="140" height="110" rx="10" fill="#252536" />
            <text x="215" y="62" fill="#ABB2BF" fontSize="9" fontFamily="sans-serif">Rendu :</text>
            <rect x="215" y="70" width="110" height="28" rx="6" fill="#2D2D3F" stroke="#61AFEF" strokeWidth="1.5" />
            <text x="225" y="89" fill="#ABB2BF" fontSize="10" fontFamily="sans-serif">Seconde</text>
            <text x="305" y="89" fill="#61AFEF" fontSize="10">▼</text>
            {/* Options déroulées */}
            <rect x="215" y="100" width="110" height="48" rx="4" fill="#2D2D3F" stroke="#3E4451" strokeWidth="1" />
            <text x="225" y="115" fill="#667EEA" fontSize="9" fontFamily="sans-serif">➜ Seconde</text>
            <text x="225" y="130" fill="#5C6370" fontSize="9" fontFamily="sans-serif">  Première</text>
            <text x="225" y="145" fill="#5C6370" fontSize="9" fontFamily="sans-serif">  Terminale</text>
            {/* Explication */}
            <text x="15" y="190" fill="#61AFEF" fontSize="9" fontFamily="sans-serif">💡 Idéal quand il y a beaucoup d'options (pays, classes...)</text>
            <text x="15" y="215" fill="#98C379" fontSize="10" fontFamily="sans-serif">Peu d'options → radio | Beaucoup → select</text>
            <text x="15" y="245" fill="#5C6370" fontSize="9" fontFamily="sans-serif">Compact et propre, pas besoin de tout afficher !</text>
        </svg>
    )
}

/* ═══════════════════════════════════════
   SVG : Boutons cliquables (submit + reset)
   ═══════════════════════════════════════ */
function BoutonsCliquablesSVG() {
    return (
        <svg viewBox="0 0 360 260" className="topic-svg" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="360" height="260" rx="16" fill="#1E1E2E" />
            <text x="15" y="25" fill="#E5C07B" fontSize="11" fontFamily="sans-serif" fontWeight="bold">🔲 Boutons cliquables :</text>
            {/* Submit */}
            <rect x="10" y="38" width="340" height="90" rx="8" fill="#252536" />
            <text x="20" y="58" fill="#98C379" fontSize="10" fontFamily="monospace">type="submit"</text>
            <text x="150" y="58" fill="#5C6370" fontSize="9" fontFamily="sans-serif">→ Envoie les données</text>
            <text x="20" y="78" fill="#C678DD" fontSize="10" fontFamily="monospace">&lt;</text>
            <text x="28" y="78" fill="#E06C75" fontSize="10" fontFamily="monospace">input</text>
            <text x="58" y="78" fill="#D19A66" fontSize="10" fontFamily="monospace">type</text>
            <text x="82" y="78" fill="#56B6C2" fontSize="10" fontFamily="monospace">=</text>
            <text x="89" y="78" fill="#98C379" fontSize="10" fontFamily="monospace">"submit"</text>
            <text x="145" y="78" fill="#D19A66" fontSize="10" fontFamily="monospace">value</text>
            <text x="178" y="78" fill="#56B6C2" fontSize="10" fontFamily="monospace">=</text>
            <text x="185" y="78" fill="#98C379" fontSize="10" fontFamily="monospace">"Envoyer"</text>
            <text x="250" y="78" fill="#C678DD" fontSize="10" fontFamily="monospace">/&gt;</text>
            {/* Bouton rendu submit */}
            <rect x="20" y="92" width="120" height="28" rx="8" fill="url(#submitGrad2)" />
            <defs>
                <linearGradient id="submitGrad2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#667EEA" />
                    <stop offset="100%" stopColor="#764BA2" />
                </linearGradient>
                <linearGradient id="resetGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#e74c3c" />
                    <stop offset="100%" stopColor="#c0392b" />
                </linearGradient>
            </defs>
            <text x="48" y="111" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Envoyer 🚀</text>
            {/* Reset */}
            <rect x="10" y="140" width="340" height="75" rx="8" fill="#252536" />
            <text x="20" y="160" fill="#E06C75" fontSize="10" fontFamily="monospace">type="reset"</text>
            <text x="140" y="160" fill="#5C6370" fontSize="9" fontFamily="sans-serif">→ Efface tout et recommence</text>
            <text x="20" y="180" fill="#C678DD" fontSize="10" fontFamily="monospace">&lt;</text>
            <text x="28" y="180" fill="#E06C75" fontSize="10" fontFamily="monospace">input</text>
            <text x="58" y="180" fill="#D19A66" fontSize="10" fontFamily="monospace">type</text>
            <text x="82" y="180" fill="#56B6C2" fontSize="10" fontFamily="monospace">=</text>
            <text x="89" y="180" fill="#98C379" fontSize="10" fontFamily="monospace">"reset"</text>
            <text x="137" y="180" fill="#D19A66" fontSize="10" fontFamily="monospace">value</text>
            <text x="170" y="180" fill="#56B6C2" fontSize="10" fontFamily="monospace">=</text>
            <text x="177" y="180" fill="#98C379" fontSize="10" fontFamily="monospace">"Annuler"</text>
            <text x="238" y="180" fill="#C678DD" fontSize="10" fontFamily="monospace">/&gt;</text>
            {/* Bouton rendu reset */}
            <rect x="20" y="190" width="120" height="28" rx="8" fill="url(#resetGrad)" />
            <text x="50" y="209" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Annuler ❌</text>
            {/* Explication */}
            <text x="15" y="245" fill="#61AFEF" fontSize="9" fontFamily="sans-serif">💡 Submit = remettre ta copie 📨 | Reset = tout effacer et recommencer</text>
        </svg>
    )
}

/* ═══════════════════════════════════════
   Map des SVGs par topic ID
   ═══════════════════════════════════════ */
const TOPIC_SVGS = {
    zones_saisie: ZonesSaisieSVG,
    cases_cocher: CasesACocherSVG,
    boutons_radio: BoutonsRadioSVG,
    listes_deroulantes: ListesDeroulantesSVG,
    boutons_cliquables: BoutonsCliquablesSVG,
}

export { TOPIC_SVGS }
export default function TopicVisualization({ topicId }) {
    const SVGComponent = TOPIC_SVGS[topicId]
    if (!SVGComponent) return null
    return (
        <motion.div
            className="topic-visualization"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <SVGComponent />
        </motion.div>
    )
}
