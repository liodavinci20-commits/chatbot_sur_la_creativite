import { useState, useRef, useEffect, useCallback } from 'react'
import { API_BASE_URL } from '../config'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCpu, FiSend, FiLock, FiUnlock, FiStar, FiZap, FiTool, FiFolder, FiCoffee, FiAlignLeft, FiAward, FiPlay, FiEye, FiBox } from 'react-icons/fi'


/* ══════════════════════════════════════════════════════════════
   DONNÉES LOCALES — Réponses offline-first, API en fallback
══════════════════════════════════════════════════════════════ */
/* ── Analogie Restaurant — Concept 1 ── */
const ANALOGY_PARTS = [
  `<strong>1. Le plateau = la balise &lt;form&gt;</strong><br><br>Imagine que tu es au restaurant. Pour apporter ta commande complète à la cuisine d'un seul voyage, le serveur a besoin d'un <strong>plateau</strong>.<br>En HTML, ce plateau c'est <code>&lt;form&gt;</code> — il regroupe <em>toutes</em> tes informations ensemble avant de les envoyer.`,
  `<strong>2. Les plats = les champs &lt;input&gt;</strong><br><br>Chaque plat posé sur le plateau = une info demandée à l'utilisateur :<br>• Le burger → <code>type="text"</code> pour le nom<br>• Le gobelet → <code>type="email"</code> pour l'adresse<br>• La salade → <code>type="checkbox"</code> pour les options à cocher`,
  `<strong>3. Le bouton "Envoyer" = type="submit"</strong><br><br>Le serveur attend à côté de toi, plateau en main. Tant que tu n'as pas dit <em>"C'est bon !"</em>, il reste là.<br>Dès que tu cliques sur <strong>Envoyer</strong>, c'est le signal : <em>"La commande est prête, file à la cuisine !"</em>`,
  `<strong>4. La cuisine = le serveur informatique</strong><br><br>La cuisine reçoit le plateau. Les chefs (les programmes) lisent chaque papier, traitent les données et enregistrent ta commande.<br><br>Sans <code>&lt;form&gt;</code>, les infos n'arriveraient jamais là-bas ! (^_^)<br><br>— Tap <strong>oui</strong> si c'est clair, ou <strong>non</strong> si tu veux une autre explication !`,
]

const ANALOGY_ALT = `Essayons avec un panier de supermarché ! (^_^)<br><br>• Le <strong>panier</strong> = <code>&lt;form&gt;</code> — il contient tout<br>• Les <strong>articles</strong> = les <code>&lt;input&gt;</code> — chaque article = une info<br>• La <strong>caisse</strong> = le bouton submit — c'est là qu'on valide tout<br>• Le <strong>magasinier</strong> derrière = le serveur qui reçoit et traite<br><br>L'idée clé : CONTENIR → REMPLIR → ENVOYER. (^_^)<br><br>— C'est plus clair maintenant ? Tape <strong>oui</strong> ou <strong>non</strong> !`

/* ── Analogie Enveloppe — Concept 2 ── */
const ANALOGY_C2_PARTS = [
  `<strong>1. L'enveloppe et ses lignes pointillées</strong><br><br>Si <code>&lt;form&gt;</code> est une <strong>enveloppe postale</strong>, alors chaque <code>&lt;input&gt;</code> est une <strong>ligne pointillée</strong> à remplir.<br>Sans ces lignes, impossible d'écrire son nom, son adresse... L'enveloppe resterait vide et ne pourrait jamais être envoyée !`,
  `<strong>2. Chaque ligne a un rôle précis</strong><br><br>Sur une vraie enveloppe, certaines lignes sont réservées à un usage particulier :<br>• Ligne "Nom :" → <code>type="text"</code> (accepte n'importe quel texte)<br>• Ligne "Email :" → <code>type="email"</code> (vérifie qu'il y a un @)<br>• Ligne "Code secret :" → <code>type="password"</code> (cache les caractères tapés)<br><br>C'est l'attribut <strong>type=</strong> qui définit le rôle de chaque ligne.`,
  `<strong>3. Les attributs = les instructions imprimées sur la ligne</strong><br><br>Chaque ligne peut avoir des indications supplémentaires :<br>• <code>placeholder="Ton prénom..."</code> → le texte grisé qu'on voit avant d'écrire<br>• <code>name="prenom"</code> → l'étiquette que le facteur (serveur) lit pour trier le courrier<br>• <code>required</code> → "Cette ligne est obligatoire — on ne peut pas envoyer sans !"`,
  `<strong>4. La règle d'or à retenir</strong><br><br>Les lignes sont <em>toujours imprimées sur l'enveloppe</em>, jamais en dehors. De la même façon, un <code>&lt;input&gt;</code> doit <em>toujours être à l'intérieur</em> d'un <code>&lt;form&gt;</code>.<br><br>Sans enveloppe autour, tes données remplies s'envolent dans le vent et n'arrivent jamais à destination ! (^_^)<br><br>— Tape <strong>oui</strong> si c'est clair, ou <strong>non</strong> pour une autre explication !`,
]

const ANALOGY_C2_ALT = `Essayons avec une feuille d'examen ! (^_^)<br><br>Imagine une feuille que tu remplis en classe :<br>• La <strong>feuille entière</strong> = <code>&lt;form&gt;</code> — elle regroupe tout<br>• Les <strong>cases à remplir</strong> = les <code>&lt;input&gt;</code> — chaque case = une info<br>• Le <strong>texte imprimé</strong> avant chaque case = le <code>placeholder</code><br>• Ton <strong>prénom en haut à droite</strong> = l'attribut <code>name="eleve"</code><br><br>Quand tu rends la feuille au prof, c'est comme cliquer sur <strong>Envoyer</strong> ! (^_^)<br><br>— C'est plus clair maintenant ? Tape <strong>oui</strong> ou <strong>non</strong> !`

/* ── Analogie Ustensiles — Concept 3 ── */
const ANALOGY_C3_PARTS = [
  `<strong>1. La cuisine et ses ustensiles</strong><br><br>Imagine-toi dans une cuisine équipée. Tu n'utilises pas une fourchette pour faire de la soupe, ni une louche pour manger des pâtes !<br>C'est exactement le rôle de l'attribut <code>type=</code> — il donne à chaque <code>&lt;input&gt;</code> l'<strong>outil adapté à la situation</strong>.`,
  `<strong>2. Chaque type = un ustensile différent</strong><br><br>• <code>type="text"</code> → La <strong>cuillère polyvalente</strong> — accepte n'importe quoi<br>• <code>type="email"</code> → Le <strong>tamis</strong> — filtre et vérifie qu'il y a un @<br>• <code>type="password"</code> → La <strong>boîte hermétique</strong> — cache ce qu'il y a dedans<br>• <code>type="number"</code> → La <strong>balance de cuisine</strong> — n'accepte que des chiffres`,
  `<strong>3. Le navigateur fait le travail à ta place</strong><br><br>Le grand avantage ? C'est le navigateur qui s'occupe de <strong>tout valider automatiquement</strong>.<br><br>Si tu mets <code>type="email"</code> et que l'utilisateur tape "bonjour" sans @, le formulaire bloque tout seul — sans une seule ligne de JavaScript ! (^_^)`,
  `<strong>4. La règle d'or</strong><br><br>Toujours choisir le type le plus <em>précis</em> possible :<br>• Un champ date ? → <code>type="date"</code> (le navigateur ouvre un calendrier !)<br>• Un mot de passe ? → <code>type="password"</code> (les caractères sont masqués)<br>• Une couleur ? → <code>type="color"</code> (un sélecteur graphique apparaît !)<br><br>Plus ton type est précis, moins tu as besoin d'écrire de code. (^_^)<br><br>— Tape <strong>oui</strong> si c'est clair, ou <strong>non</strong> pour une autre explication !`,
]

const ANALOGY_C3_ALT = `Essayons avec les transports ! (^_^)<br><br>Imagine que tu dois te déplacer en ville :<br>• <code>type="text"</code> → Les <strong>pieds</strong> — ça marche partout, mais c'est basique<br>• <code>type="email"</code> → Le <strong>vélo</strong> — rapide et efficace, mais seulement sur les bonnes routes (avec un @)<br>• <code>type="password"</code> → Le <strong>coffre blindé</strong> — personne ne voit ce qu'il y a dedans<br>• <code>type="date"</code> → Le <strong>GPS</strong> — il affiche directement un calendrier pour choisir<br><br>L'idée clé : le bon <code>type=</code> = le bon outil = moins de travail pour toi ! (^_^)<br><br>— C'est plus clair maintenant ? Tape <strong>oui</strong> ou <strong>non</strong> !`

const LOCAL_REPLIES = {
  "j'ai pas compris":     "Aucun souci ! Sur quel point tu bloques exactement ? Dis-moi et j'adapte l'explication.",
  "jai pas compris":      "Aucun souci ! Dis-moi ce qui te pose problème — j'ai plusieurs façons d'expliquer.",
  "analogie":             "Imagine une maison : <strong>&lt;form&gt;</strong> = les murs de la pièce. <strong>&lt;input&gt;</strong> = les fenêtres. <strong>&lt;label&gt;</strong> = les panneaux « Entrée / Sortie ». Et <strong>type=</strong> = le matériau de chaque ouverture !",
  "get vs post":          "<strong>GET</strong> ajoute les données dans l'URL — elles sont visibles (ex&nbsp;: ?nom=Lionel). <strong>POST</strong> les cache dans la requête — indispensable pour les mots de passe ! [ - ]",
  "c'est quoi action":    "<strong>action=</strong> indique où envoyer les données du formulaire — c'est l'URL de la page qui va les traiter. Sans action=, les données ne vont nulle part !",
  "cest quoi action":     "<strong>action=</strong> indique l'URL de destination des données du formulaire.",
  "c'est quoi name":      "<strong>name=</strong> est l'identifiant du champ côté serveur. C'est comme un badge : quand le formulaire est envoyé, le serveur utilise ce nom pour retrouver la valeur du champ !",
  "cest quoi name":       "<strong>name=</strong> est l'identifiant du champ côté serveur.",
  "required sans valeur": "Exactement — <strong>required</strong> est un attribut booléen ! Il n'a pas besoin de valeur. Sa seule présence suffit : <code>required</code> est plus propre que <code>required='true'</code>.",
  "pourquoi for":         "L'attribut <strong>for=</strong> du label crée un lien vers un input via son <strong>id=</strong>. Quand tu cliques sur le label, le navigateur place le curseur dans le champ lié. C'est aussi utile pour l'accessibilité !",
  "label sans for":       "Un label sans for= fonctionne visuellement, mais il n'est plus lié à l'input. Tu perds le clic automatique ET l'accessibilité pour les lecteurs d'écran. Toujours mettre for= !",
  "quand utiliser email": "Utilise <strong>type='email'</strong> quand tu veux forcer la présence d'un @. Le navigateur bloque l'envoi automatiquement si le format est invalide — validation gratuite sans JavaScript !",
  "autres types input":   "Il en existe plein ! <strong>date</strong> (calendrier), <strong>file</strong> (upload), <strong>checkbox</strong> (case à cocher), <strong>range</strong> (curseur), <strong>color</strong> (sélecteur de couleur)… Chacun adapte l'interface au contexte.",
  "bouton sans type":     "Attention ! Si tu ne précises pas <strong>type='button'</strong> ou <strong>type='submit'</strong>, par défaut un bouton dans un formulaire agit TOUJOURS comme un submit. Ça peut causer des rechargements surprises !",
  "input vs button":      "On créait avant des boutons avec <strong>&lt;input type='submit'&gt;</strong>. Aujourd'hui, on préfère <strong>&lt;button&gt;</strong> car on peut y rajouter des icônes ou d'autres balises HTML à l'intérieur !",
}

const WILD_QUESTIONS = [
  "Et si <strong>&lt;form&gt;</strong> n'existait pas — comment tu enverrais tes données ? (~_~)",
  "Pourquoi le <strong>name=</strong> est-il obligatoire côté serveur ? Que se passe-t-il si deux inputs partagent le même name ? (o_O)",
  "Si tu devais expliquer <strong>&lt;input&gt;</strong> à un enfant de 6 ans sans aucun mot technique — tu dirais quoi ? (*_*)",
  "Pourquoi <strong>type='password'</strong> masque les caractères ? Qui est protégé — l'utilisateur ou le serveur ? (-_-)",
  "Imagine le formulaire d'inscription de ton lycée — quelles balises HTML utiliserais-tu exactement ? (~_~)",
]

const CHIPS_PER_CONCEPT = {
  1: [
    { label: "C'est quoi action= ?", msg: "c'est quoi action" },
    { label: "GET vs POST ?",         msg: "get vs post" },
    { label: "Analogie [~]",          msg: "analogie" },
    { label: "J'ai pas compris",      msg: "j'ai pas compris" },
    { label: "~_~ Question folle",    msg: "question folle", wild: true },
  ],
  2: [
    { label: "C'est quoi name= ?",    msg: "c'est quoi name" },
    { label: "required sans valeur ?",msg: "required sans valeur" },
    { label: "J'ai pas compris",      msg: "j'ai pas compris" },
    { label: "~_~ Question folle",    msg: "question folle", wild: true },
  ],
  3: [
    { label: "Quand utiliser email ?",msg: "quand utiliser email" },
    { label: "Autres types ?",        msg: "autres types input" },
    { label: "J'ai pas compris",      msg: "j'ai pas compris" },
    { label: "~_~ Question folle",    msg: "question folle", wild: true },
  ],
  4: [
    { label: "Pourquoi for= ?",       msg: "pourquoi for" },
    { label: "label sans for ?",      msg: "label sans for" },
    { label: "J'ai pas compris",      msg: "j'ai pas compris" },
    { label: "~_~ Question folle",    msg: "question folle", wild: true },
  ],
  5: [
    { label: "Bouton sans type ?",    msg: "bouton sans type" },
    { label: "input vs button ?",     msg: "input vs button" },
    { label: "J'ai pas compris",      msg: "j'ai pas compris" },
    { label: "~_~ Question folle",    msg: "question folle", wild: true },
  ],
}

const CONCEPT_MSGS = {
  1: "Concept 1 — la balise <strong>&lt;form&gt;</strong>. C'est le conteneur de tout formulaire. Clique sur <strong>action=</strong> et <strong>method=</strong> dans le code pour voir leur rôle !",
  2: "Concept 2 — <strong>&lt;input&gt;</strong>. C'est le champ de saisie. Explore ses attributs et clique sur Pratiquer !",
  3: "Concept 3 — <strong>type=</strong>. L'attribut qui change tout. Clique sur chaque type pour voir comment le champ se transforme.",
  4: "Concept 4 — <strong>&lt;label&gt;</strong>. Une étiquette pour chaque champ. Clique sur le mot « Ton prénom : » dans le rendu — observe la magie !",
  5: "Concept 5 — <strong>&lt;button&gt;</strong>. Le grand final ! Choisis le bon type pour enfin valider notre formulaire.",
}

const DOT_LABELS = ['&lt;form&gt;', '&lt;input&gt;', 'type=', '&lt;label&gt;', '&lt;button&gt;']

/* ══════════════════════════════════════════════════════════════
   UTILS
══════════════════════════════════════════════════════════════ */
function norm(s) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
}

/* ══════════════════════════════════════════════════════════════
   SOUS-COMPOSANTS — Blocs de code
══════════════════════════════════════════════════════════════ */
function CodeBlock({ fileName, children }) {
  return (
    <div className="fnd-code-block">
      <div className="fnd-code-topbar">
        <span className="fnd-cb-dot" style={{ background: '#ff5f57' }} />
        <span className="fnd-cb-dot" style={{ background: '#febc2e' }} />
        <span className="fnd-cb-dot" style={{ background: '#28c840' }} />
        <span className="fnd-cb-lbl">{fileName}</span>
      </div>
      <div className="fnd-code-body">{children}</div>
    </div>
  )
}

function CodeLine({ hl, hlType = 'teal', onClick, indent, annotation, children }) {
  const hlClass = hl ? (hlType === 'violet' ? 'hl-v' : 'hl') : ''
  return (
    <motion.div
      className={`fnd-cl ${onClick ? 'clickable' : ''} ${hlClass}`}
      style={indent ? { paddingLeft: '18px' } : undefined}
      onClick={onClick}
      animate={hl ? { x: [0, 2, 0] } : { x: 0 }}
      transition={{ duration: 0.25 }}
    >
      {children}
      <AnimatePresence>
        {annotation && hl && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            className={`fnd-ann ${hlType === 'violet' ? 'v' : 't'}`}
          >
            {annotation}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* Spans de couleur syntaxique */
const Ct = ({ c }) => <span className="fnd-ct">{c}</span>
const Ca = ({ c }) => <span className="fnd-ca">{c}</span>
const Cv = ({ c }) => <span className="fnd-cv">{c}</span>
const Cc = ({ c }) => <span className="fnd-cc">{c}</span>
const Cw = ({ c }) => <span className="fnd-cw">{c}</span>

/* ══════════════════════════════════════════════════════════════
   SOUS-COMPOSANT — TopBar
══════════════════════════════════════════════════════════════ */
function FoundationsLocalProgress({ current, solved, onNavigate }) {
  return (
    <div className="fnd-local-progress-wrap" style={{ marginTop: '28px', padding: '16px 24px', background: 'rgba(0,0,0,0.15)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <nav className="fnd-pdots" style={{ justifyContent: 'center' }}>
        {DOT_LABELS.map((label, i) => {
          const n = i + 1
          const isDone = solved[n]
          const isActive = n === current
          const isLocked = n > current && !isDone
          return (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {i > 0 && <span className="fnd-pd-arrow" style={{ opacity: 0.5 }}>›</span>}
              <button
                className={`fnd-pdot${isDone && !isActive ? ' done' : ''}${isActive ? ' active' : ''}${isLocked ? ' locked' : ''}`}
                onClick={() => !isLocked && onNavigate(n)}
                disabled={isLocked}
              >
                <span className="fnd-pd-circle">
                  {isDone && !isActive ? '✓' : n}
                </span>
                <span
                  className="fnd-pd-label"
                  dangerouslySetInnerHTML={{ __html: label }}
                />
              </button>
            </div>
          )
        })}
      </nav>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   SOUS-COMPOSANT — Section défi (verrouillée / déverrouillée)
══════════════════════════════════════════════════════════════ */
function ChallengeSection({ visible, explored, onReveal, children }) {
  if (!visible) {
    return (
      <motion.div
        className={`fnd-challenge-lock${explored ? ' explored' : ''}`}
        onClick={onReveal}
        whileHover={{ scale: 1.008 }}
        whileTap={{ scale: 0.995 }}
      >
        <span className="fnd-lock-icon" style={{display:"flex", alignItems:"center", justifyContent:"center"}}>{explored ? <FiUnlock size={48} color="var(--teal)" /> : <FiLock size={48} color="rgba(255,255,255,0.2)" />}</span>
        {explored
          ? <><strong>Tu as exploré le code !</strong> Clique ici pour relever le défi.</>
          : <>Explore le code ci-dessus — puis clique ici pour débloquer le défi !</>
        }
      </motion.div>
    )
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="fnd-cz-card"
    >
      {children}
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════════
   SOUS-COMPOSANT — Options QCM
══════════════════════════════════════════════════════════════ */
function McqOptions({ options, selectedIdx, onSelect }) {
  return (
    <div className="fnd-mcq">
      {options.map(({ label, correct }, i) => {
        let cls = ''
        if (selectedIdx !== null) {
          if (correct) cls = 'ok'
          else if (i === selectedIdx) cls = 'err'
        }
        return (
          <motion.button
            key={i}
            className={`fnd-mopt ${cls}`}
            onClick={() => selectedIdx === null && onSelect(i, correct)}
            disabled={selectedIdx !== null}
            whileHover={selectedIdx === null ? { x: 3 } : {}}
            animate={cls === 'err' ? { x: [0, -5, 5, -3, 3, 0] } : {}}
            transition={{ duration: 0.35 }}
          >
            <span className="fnd-mk">{String.fromCharCode(65 + i)}</span>
            <span dangerouslySetInnerHTML={{ __html: label }} />
          </motion.button>
        )
      })}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
══════════════════════════════════════════════════════════════ */
export default function FoundationsPage({ user }) {
  const navigate = useNavigate()

  /* ── Navigation entre concepts ── */
  const allTrue = { 1: true, 2: true, 3: true, 4: true, 5: true }
  const allFalse = { 1: false, 2: false, 3: false, 4: false, 5: false }
  const [current, setCurrent] = useState(1)
  const [solved, setSolved] = useState(user?.isAdmin ? { ...allTrue } : { ...allFalse })
  const [explored, setExplored] = useState(user?.isAdmin ? { ...allTrue } : { ...allFalse })
  const [challengeVisible, setChallengeVisible] = useState(user?.isAdmin ? { ...allTrue } : { ...allFalse })
  const [xp, setXp] = useState(0)
  const [xpNotif, setXpNotif] = useState(null)
  const [showCelebration, setShowCelebration] = useState(false)

  /* ── Concept 1 — Nouvelle Pratique ── */
  const [hlForm, setHlForm] = useState(null)
  const [c1PracticePhase, setC1PracticePhase] = useState(false)
  const [c1PracticeCode, setC1PracticeCode] = useState('')
  const [showC1Joke, setShowC1Joke] = useState(false)
  const [c1JokeFeedback, setC1JokeFeedback] = useState(null)
  const [showFormAnalogy, setShowFormAnalogy] = useState(false)
  const analogyDialogRef = useRef(0) // 0=off 1=asked 2=explaining 3=asked_understood 4=done
  const [showInputAnalogy, setShowInputAnalogy] = useState(false)
  const inputAnalogyDialogRef = useRef(0) // 0=off 1=asked 2=explaining 3=asked_understood 4=done
  const [showTypeAnalogy, setShowTypeAnalogy] = useState(false)
  const typeAnalogyDialogRef = useRef(0) // 0=off 1=asked 2=explaining 3=asked_understood 4=done

  /* ── Concept 2 — <input> ── */
  const [inputLessonStage, setInputLessonStage] = useState(0) // 0=idle, 1=typed(wow), 2=erased(pouff), 3=retyped(continue), 4=attributes
  const [userCodeInput, setUserCodeInput] = useState('')
  const [hlAttr, setHlAttr] = useState(null)
  const [liveReq, setLiveReq] = useState(false)
  const [livePH, setLivePH] = useState('Ton prénom')
  const c2ChevronWarned = useRef(false)
  const [c2MCQ, setC2MCQ] = useState({ selected: null })
  const [c2Feedback, setC2Feedback] = useState(null)
  const [c2Unlock, setC2Unlock] = useState(false)
  const [c2PracticePhase, setC2PracticePhase] = useState(false)
  const [c2PracticeCode, setC2PracticeCode] = useState('')
  const [c2AttrExplored, setC2AttrExplored] = useState(new Set())
  const [c2PracticeType, setC2PracticeType] = useState('text')
  const [c2PracticePH, setC2PracticePH] = useState('')
  const [c2PracticeName, setC2PracticeName] = useState('')
  const [c2PracticeReq, setC2PracticeReq] = useState(false)
  const c2PracticeWarned = useRef(false)

  /* ── Concept 3 — <label> ── */
  const [labelClicked, setLabelClicked] = useState(false)
  const [c3MCQ, setC3MCQ] = useState({ selected: null })
  const [c3Feedback, setC3Feedback] = useState(null)
  const [c3Unlock, setC3Unlock] = useState(false)
  const lp3Ref = useRef(null)
  const [c3LabelPracticePhase, setC3LabelPracticePhase] = useState(false)
  const [c3LabelCode, setC3LabelCode] = useState('<label>\n  \n</label>')
  const [c3LabelStage, setC3LabelStage] = useState(0)

  /* ── Concept 3 et 4 (fusion / échange) ── */
  const [activeType, setActiveType] = useState('text')
  const [typeHint, setTypeHint] = useState('Texte normal visible')
  const [c4Blank, setC4Blank] = useState('')
  const [c4Status, setC4Status] = useState('')
  const [c4Feedback, setC4Feedback] = useState(null)
  const [c4Unlock, setC4Unlock] = useState(false)
  const [c4PracticePhase, setC4PracticePhase] = useState(false)
  const [c4PracticeCode, setC4PracticeCode] = useState('type="password"')
  const [c4AttrExplored, setC4AttrExplored] = useState(new Set())
  const c4LiveWarned = useRef(new Set())

  /* ── Concept 5 — select + textarea ── */
  const [c5MCQ, setC5MCQ] = useState({ selected: null })
  const [c5Feedback, setC5Feedback] = useState(null)
  const [c5ButtonPracticePhase, setC5ButtonPracticePhase] = useState(false)
  const [c5ButtonCode, setC5ButtonCode] = useState('<button>\n  \n</button>')
  const [c5ButtonStage, setC5ButtonStage] = useState(0)

  /* ── Chat ── */
  const [messages, setMessages] = useState([
    { type: 'sys', html: 'Phase 2 démarrée ✓' },
    {
      type: 'bot',
      html: `Hey <strong>${user?.name || 'toi'}</strong> ! 👋<br><br>Je suis <strong>CodeBot</strong>, ton prof HTML. Je suis là pour t'aider à chaque étape.<br><br>Commence par explorer le concept à gauche — clique sur les éléments du code — puis pose tes questions ici !`,
    },
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [isDeepThinking, setIsDeepThinking] = useState(false)

  const msgsRef    = useRef(null)
  const challengeRef = useRef(null)

  /* ── Auto-scroll chat ── */
  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight
  }, [messages, chatLoading])

  /* ── Ajouter XP avec notif flottante ── */
  const addXP = useCallback((amount) => {
    setXp(prev => prev + amount)
    setXpNotif(`+${amount} XP`)
    setTimeout(() => setXpNotif(null), 1800)
  }, [])

  /* ── Marquer concept comme exploré ── */
  const markExplored = useCallback((n) => {
    setExplored(prev => prev[n] ? prev : { ...prev, [n]: true })
  }, [])

  /* ── Ajouter message au chat ── */
  const addMsg = useCallback((type, html, delay = 0) => {
    setTimeout(() => {
      setMessages(prev => [...prev, { type, html }])
    }, delay)
  }, [])

  /* ── Envoi chat (local-first, fallback API) ── */
  const handleChatSend = useCallback(async (text) => {
    const trimmed = text.trim()
    if (!trimmed || chatLoading) return
    addMsg('usr', trimmed)
    setChatInput('')

    /* ── Dialogue Analogie Restaurant (Concept 1) ── */
    if (analogyDialogRef.current > 0 && analogyDialogRef.current < 4) {
      const kd = trimmed.toLowerCase()
      const isOui = kd.includes('oui') || kd === 'ok' || kd === 'yes'
      const isNon = kd.includes('non') || kd === 'no' || kd === 'nope'

      if (analogyDialogRef.current === 1) {
        if (isOui) {
          analogyDialogRef.current = 2
          setChatLoading(true)
          ANALOGY_PARTS.forEach((part, i) => addMsg('bot', part, 900 + i * 1600))
          setTimeout(() => setChatLoading(false), 900 + (ANALOGY_PARTS.length - 1) * 1600 + 400)
          setTimeout(() => { analogyDialogRef.current = 3 }, 900 + ANALOGY_PARTS.length * 1600)
          return
        }
        if (isNon) {
          analogyDialogRef.current = 0
          setChatLoading(true)
          await new Promise(r => setTimeout(r, 800))
          setChatLoading(false)
          addMsg('bot', "Pas de souci ! Continue d'explorer le code à gauche quand tu veux. (^_^)")
          return
        }
      }

      if (analogyDialogRef.current === 3) {
        if (isOui) {
          analogyDialogRef.current = 4
          addXP(15)
          setChatLoading(true)
          await new Promise(r => setTimeout(r, 800))
          setChatLoading(false)
          addMsg('bot', "Parfait ! (+15 XP) Tu viens de saisir la mécanique fondamentale des formulaires HTML. (^_^)<br><br>Continue sur le code à gauche — clique sur <strong>action=</strong> pour aller encore plus loin !")
          return
        }
        if (isNon) {
          analogyDialogRef.current = 3
          setChatLoading(true)
          await new Promise(r => setTimeout(r, 900))
          setChatLoading(false)
          addMsg('bot', ANALOGY_ALT)
          return
        }
      }
    }

    /* ── Dialogue Analogie Enveloppe (Concept 2) ── */
    if (inputAnalogyDialogRef.current > 0 && inputAnalogyDialogRef.current < 4) {
      const kd = trimmed.toLowerCase()
      const isOui = kd.includes('oui') || kd === 'ok' || kd === 'yes'
      const isNon = kd.includes('non') || kd === 'no' || kd === 'nope'

      if (inputAnalogyDialogRef.current === 1) {
        if (isOui) {
          inputAnalogyDialogRef.current = 2
          setChatLoading(true)
          ANALOGY_C2_PARTS.forEach((part, i) => addMsg('bot', part, 900 + i * 1600))
          setTimeout(() => setChatLoading(false), 900 + (ANALOGY_C2_PARTS.length - 1) * 1600 + 400)
          setTimeout(() => { inputAnalogyDialogRef.current = 3 }, 900 + ANALOGY_C2_PARTS.length * 1600)
          return
        }
        if (isNon) {
          inputAnalogyDialogRef.current = 0
          setChatLoading(true)
          await new Promise(r => setTimeout(r, 800))
          setChatLoading(false)
          addMsg('bot', "Pas de souci ! Continue d'explorer le code à gauche quand tu veux. (^_^)")
          return
        }
      }

      if (inputAnalogyDialogRef.current === 3) {
        if (isOui) {
          inputAnalogyDialogRef.current = 4
          addXP(15)
          setChatLoading(true)
          await new Promise(r => setTimeout(r, 800))
          setChatLoading(false)
          addMsg('bot', "Parfait ! (+15 XP) Tu as compris pourquoi un <code>&lt;input&gt;</code> doit toujours vivre à l'intérieur d'un <code>&lt;form&gt;</code>. (^_^)<br><br>Continue — clique sur les attributs ci-dessous pour découvrir leurs superpouvoirs !")
          return
        }
        if (isNon) {
          inputAnalogyDialogRef.current = 3
          setChatLoading(true)
          await new Promise(r => setTimeout(r, 900))
          setChatLoading(false)
          addMsg('bot', ANALOGY_C2_ALT)
          return
        }
      }
    }

    /* ── Dialogue Analogie Ustensiles (Concept 3) ── */
    if (typeAnalogyDialogRef.current > 0 && typeAnalogyDialogRef.current < 4) {
      const kd = trimmed.toLowerCase()
      const isOui = kd.includes('oui') || kd === 'ok' || kd === 'yes'
      const isNon = kd.includes('non') || kd === 'no' || kd === 'nope'

      if (typeAnalogyDialogRef.current === 1) {
        if (isOui) {
          typeAnalogyDialogRef.current = 2
          setChatLoading(true)
          ANALOGY_C3_PARTS.forEach((part, i) => addMsg('bot', part, 900 + i * 1600))
          setTimeout(() => setChatLoading(false), 900 + (ANALOGY_C3_PARTS.length - 1) * 1600 + 400)
          setTimeout(() => { typeAnalogyDialogRef.current = 3 }, 900 + ANALOGY_C3_PARTS.length * 1600)
          return
        }
        if (isNon) {
          typeAnalogyDialogRef.current = 0
          setChatLoading(true)
          await new Promise(r => setTimeout(r, 800))
          setChatLoading(false)
          addMsg('bot', "Pas de souci ! Clique sur les types dans les onglets à gauche pour explorer. (^_^)")
          return
        }
      }

      if (typeAnalogyDialogRef.current === 3) {
        if (isOui) {
          typeAnalogyDialogRef.current = 4
          addXP(15)
          setChatLoading(true)
          await new Promise(r => setTimeout(r, 800))
          setChatLoading(false)
          addMsg('bot', "Excellent ! (+15 XP) Tu maîtrises maintenant l'attribut <code>type=</code> — le chef cuisinier des formulaires ! (^_^)<br><br>Clique sur les onglets et essaie le bouton <strong>Pratiquer</strong> pour chaque type !")
          return
        }
        if (isNon) {
          typeAnalogyDialogRef.current = 3
          setChatLoading(true)
          await new Promise(r => setTimeout(r, 900))
          setChatLoading(false)
          addMsg('bot', ANALOGY_C3_ALT)
          return
        }
      }
    }

    if (isDeepThinking) {
      setChatLoading(true)
      setTimeout(() => {
        addMsg('bot', `<div style="margin-bottom:8px;font-size:11px;color:rgba(255,255,255,0.5);display:flex;align-items:center;gap:4px;"><span style="color:var(--amb)">✨ Mode Réfléchi</span> activé</div><p style="margin:0">Cette question très fine sera bientôt envoyée directement à mon modèle LLM étendu ! J'analyserai ton code en profondeur. Reviens très vite pour la connexion API.</p>`)
        setChatLoading(false)
      }, 1500)
      return
    }

    const k = norm(trimmed)
    const isWild = k.includes('folle') || k.includes('wild')

    let localReply = LOCAL_REPLIES[k]
    if (!localReply && !isWild) {
      for (const key in LOCAL_REPLIES) {
        if (k.includes(norm(key))) { localReply = LOCAL_REPLIES[key]; break }
      }
    }
    if (isWild || (!localReply && k.includes('question'))) {
      localReply = WILD_QUESTIONS[Math.floor(Math.random() * WILD_QUESTIONS.length)]
    }

    if (localReply) {
      setChatLoading(true)
      await new Promise(r => setTimeout(r, 750))
      setChatLoading(false)
      addMsg('bot', localReply)
      return
    }

    // Fallback API
    setChatLoading(true)
    try {
      await new Promise(r => setTimeout(r, 600))
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: trimmed }),
      })
      const data = await res.json()
      addMsg('bot', data.response || "Continue d'explorer les concepts à gauche — clique sur les éléments du code !")
    } catch {
      addMsg('bot', "Je n'ai pas accès au serveur là — mais continue d'explorer les concepts ! (*_*)")
    }
    setChatLoading(false)
  }, [chatLoading, addMsg, isDeepThinking, addXP])

  /* ── INTERACTIONS — Concept 2 (Boucle Chat Temps Réel) ── */
  useEffect(() => {
    if (current === 2 && inputLessonStage === 0) {
      addMsg('bot', "On passe au champ de saisie !<br/><br/><strong>Défi :</strong> Tape le mot <code>&lt;input&gt;</code> à l'intérieur de la balise form en bas pour faire apparaître le champ magiquement dans l'écran de Rendu !", 500);
    }
  }, [current, inputLessonStage, addMsg]);

  const handleUserCodeChange = (e) => {
    const val = e.target.value;
    setUserCodeInput(val);
    const hasFullInput = val.toLowerCase().includes('<input') || val.toLowerCase().includes('<input>');
    const hasWordOnly = val.toLowerCase().includes('input');
    
    setInputLessonStage(prev => {
        if (prev === 0) {
            if (hasFullInput) {
                addMsg('bot', "✨ <strong>WOW ! Il est apparu !</strong><br/><br/>Tu vois comment ton code 'allume' l'écran en temps réel ?<br/><br/>🔥 <strong>Défi (Étape 2) :</strong> Essaie d'effacer complètement le mot de la zone de code pour voir ce qui se passe !");
                return 1;
            } else if (hasWordOnly && !val.includes('<') && !c2ChevronWarned.current) {
                addMsg('bot', "⚠️ Oups ! N'oublie pas les chevrons <code>&lt;</code> et <code>&gt;</code> pour entourer le mot <code>input</code> ! Une balise HTML doit toujours être encadrée.");
                c2ChevronWarned.current = true;
            }
        }
        if (prev === 1 && val.trim() === '') {
            addMsg('bot', "💨 <strong>POUF ! Disparu !</strong><br/><br/>Sans cette balise, le navigateur ne sait plus quoi afficher.<br/><br/>⚡ <strong>Défi (Étape 3) :</strong> Refais-le vite apparaître en le re-tapant, et on passera à la suite !");
            return 2;
        }
        if (prev === 2 && hasFullInput) {
            addMsg('bot', "🏆 <strong>Bravo, la Force est avec toi !</strong><br/><br/>Tu as maintenant le pouvoir de créer et détruire des éléments HTML.<br/><br/>Clique sur le bouton <strong>'Poursuivre la séance'</strong> en bas pour découvrir ses super-attributs !");
            return 3;
        }
        return prev;
    });
  }

  /* ── Navigation entre concepts ── */
  const showConcept = useCallback((n, sendMsg = true) => {
    setCurrent(n)
    document.querySelector('.fnd-content')?.scrollTo({ top: 0, behavior: 'smooth' })
    if (sendMsg && CONCEPT_MSGS[n]) addMsg('bot', CONCEPT_MSGS[n], 200)
  }, [addMsg])

  /* ── Déverrouiller concept suivant ── */
  const unlockNext = useCallback((next) => {
    const prev = next - 1
    setSolved(s => ({ ...s, [prev]: true }))
    addMsg('sys', `Concept ${prev} validé ! (^_^)`)
    addMsg('bot', `Bien joué ! Concept ${prev} maîtrisé. Passe au suivant →`, 250)
    setTimeout(() => showConcept(next, true), 500)
  }, [addMsg, showConcept])

  /* ── Déverrouiller section défi ── */
  const revealChallenge = useCallback((n) => {
    setChallengeVisible(p => ({ ...p, [n]: true }))
    if (!explored[n]) addMsg('bot', 'Défi débloqué ! Réponds à la question ci-dessous.', 100)
    setTimeout(() => challengeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 150)
  }, [explored, addMsg])

  /* ════════════════════════════════════════
     INTERACTIONS — Concept 1
  ════════════════════════════════════════ */
  const handleHlForm = (attr) => {
    setHlForm(attr)
    markExplored(1)
    const hints = {
      action: "<strong>action=</strong> — c'est l'URL où les données sont envoyées. Comme l'adresse de la cuisine au restaurant !",
      method: "<strong>method=</strong> — <strong>POST</strong> envoie les données de façon sécurisée (cachées). <strong>GET</strong> les met dans l'URL (visibles). Pour un formulaire d'inscription : toujours POST !",
    }
    addMsg('bot', hints[attr], 100)
  }

  const handleC1PracticeSubmit = () => {
    const val = c1PracticeCode.trim().toLowerCase()
    
    if (val.includes('<form') && val.includes('</form>')) {
      setShowC1Joke(true)
      setC1JokeFeedback(null)
      if (!solved[1]) {
        addXP(30)
      }
      markExplored(1)
      addMsg('bot', 'Bravo ! Tu viens de créer ta première boîte vide ! Regarde le résultat à gauche.', 100)
    } else {
      setShowC1Joke(false)
      setC1JokeFeedback(null) // On supprime intentionnellement tout retour visuel passif

      // Analyse prédictive / pédagogique de l'erreur (pour le bot)
      const escCode = c1PracticeCode.replace(/</g, '&lt;').replace(/>/g, '&gt;').substring(0, 30)
      
      if (!val) {
        addMsg('bot', "Hé ! Tu n'as rien écrit ! (^_^) La boîte est carrément inexistante. Essaie de taper <code>&lt;form&gt;&lt;/form&gt;</code>.", 100)
      } else if (val.includes('from')) {
        addMsg('bot', `Oups ! Tu as écrit ` + (escCode ? `<code>${escCode}</code>` : '') + `. Tu as tapé "from" au lieu de "form" ! C'est une erreur classique (et très compréhensible). Corrige-la.`, 100)
      } else if (val.includes('form') && !val.includes('<')) {
        addMsg('bot', `Tu as écrit <code>${escCode}</code>. C'est le bon mot ("form"), mais il manque les petits chevrons magiques <strong>&lt; &gt;</strong> pour que le navigateur comprenne que c'est une balise HTML valide !`, 100)
      } else if (val.includes('<form') && !val.includes('</form>')) {
        addMsg('bot', `Bien joué pour l'ouverture... mais tu as écrit <code>${escCode}</code>, et tu as oublié de refermer ta balise ! Ton code laisse la boîte en plan (ouverte). Ajoute le <strong>&lt;/form&gt;</strong> à la fin.`, 100)
      } else {
        addMsg('bot', `Hmm, tu as tapé <code>${escCode}</code>. Ce n'est pas ce que le navigateur attend. Repense à l'analogie de la boîte à construire. Ouvre-la avec <strong>&lt;form&gt;</strong> puis ferme-la bien avec <strong>&lt;/form&gt;</strong> !`, 100)
      }
    }
  }

  /* ════════════════════════════════════════
     INTERACTIONS — Concept 2
  ════════════════════════════════════════ */
  const handleHlAttr = (attr) => {
    setHlAttr(attr)
    markExplored(2)
    setC2AttrExplored(prev => new Set([...prev, attr]))
    if (attr === 'placeholder') setLivePH('placeholder= ce texte guide l\'utilisateur')
    if (attr === 'required') setLiveReq(true)
    if (attr === 'type') setLivePH('Champ de type TEXT')
    const hints = {
      type:        "<strong>type=</strong> définit le comportement du champ : 'text' = texte libre, 'email' = vérifie le @, 'password' = masque les caractères.",
      name:        "<strong>name=</strong> est l'identifiant côté serveur. C'est comme un badge : le serveur utilise ce nom pour retrouver la valeur saisie.",
      placeholder: "<strong>placeholder=</strong> affiche un texte grisé d'aide. Il disparaît dès que l'utilisateur commence à taper.",
      required:    "<strong>required</strong> est un attribut booléen — pas de valeur nécessaire. Sa seule présence rend le champ obligatoire.",
    }
    addMsg('bot', hints[attr], 100)
  }

  const handleC2PracticeChange = (e) => {
    const val = e.target.value;
    setC2PracticeCode(val);
    const lower = val.toLowerCase();

    // Detect type
    const typeMatch = lower.match(/type\s*=\s*["']?(\w+)["']?/);
    if (typeMatch) {
      const t = typeMatch[1];
      setC2PracticeType(t);
      if (!c2PracticeWarned.current || true) {
        if (t === 'password' && !c2PracticeWarned.current) {
          addMsg('bot', "<strong>Les points apparaissent !</strong> Le type <code>password</code> masque automatiquement ce que l'utilisateur tape. Essaie aussi <code>email</code> ou <code>date</code> !");
          c2PracticeWarned.current = true;
        }
      }
    } else {
      setC2PracticeType('text');
    }

    // Detect placeholder
    const phMatch = val.match(/placeholder\s*=\s*["']([^"']*)["']?/);
    setC2PracticePH(phMatch ? phMatch[1] : '');

    // Detect name
    const nameMatch = val.match(/name\s*=\s*["']([^"']*)["']?/);
    setC2PracticeName(nameMatch ? nameMatch[1] : '');

    // Detect required
    setC2PracticeReq(lower.includes('required'));
  }

  const handleC2MCQ = (idx, correct) => {
    if (c2MCQ.selected !== null) return
    setC2MCQ({ selected: idx })
    if (correct) {
      setC2Feedback({ ok: true, text: '(^_^) Exactement ! <strong>required</strong> rend le champ obligatoire — sa seule présence suffit.' })
      if (!solved[2]) addXP(15)
      setC2Unlock(true)
    } else {
      setC2Feedback({ ok: false, text: '(-_-) Presque ! C\'est <strong>required</strong> — un attribut booléen qui ne nécessite pas de valeur.' })
    }
  }

  /* ════════════════════════════════════════
     INTERACTIONS — Concept 3 (Label)
  ════════════════════════════════════════ */
  const handleLabelClick = () => {
    const textMatch = c3LabelCode.match(/<label(.*?)>([^<]+)<\/label>/is);
    const attrs = textMatch ? textMatch[1].toLowerCase() : '';
    const forMatch = attrs.match(/for\s*=\s*["']([^"']+)["']/i);
    const forAttr = forMatch ? forMatch[1] : null;

    if (!labelClicked && forAttr === 'prenom') {
      setLabelClicked(true)
      addMsg('bot', 'Tu vois ? Le curseur a sauté automatiquement dans le champ ! C\'est la magie du <strong>for=</strong> et <strong>id=</strong> liés. 🎯', 200)
    }
    lp3Ref.current?.focus()
  }

  const handleC3LabelPracticeChange = (e) => {
    const val = e.target.value;
    setC3LabelCode(val);
    
    if (c3LabelStage === 0) {
      const textMatch = val.match(/<label(.*?)>([^<]+)<\/label>/is);
      if (textMatch && textMatch[2].trim().length > 1) {
        // Did they already put 'for' ?
        const attrs = textMatch[1].toLowerCase();
        const forMatch = attrs.match(/for\s*=\s*["']([^"']+)["']/i);
        if (forMatch && forMatch[1] === 'prenom') {
          setC3LabelStage(2);
          addMsg('bot', "Woaw ! Tu as tout fait d'un coup ! L'attribut magique <code>for=\"prenom\"</code> est là. Clique sur ton étiquette dans le Rendu en Direct pour tester le lien ! 🎯", 100);
          markExplored(4);
          if (!solved[4]) addXP(20);
          setC3Unlock(true);
        } else {
          setC3LabelStage(1);
          addMsg('bot', "Oui ! Tu as tapé le texte au bon endroit entre les balises, c'est bien. Mais pour moi, un label qui n'est relié à rien, c'est un label fantôme : il n'apparaît pas dans le Rendu en Direct ! Tu dois obligatoirement ajouter l'attribut <code>for=\"...\"</code> pour l'injecter au-dessus du champ.", 100);
        }
      }
    } else if (c3LabelStage === 1) {
      const matchFor = val.match(/for\s*=\s*["']([^"']+)["']/i);
      if (matchFor && matchFor[1] === 'prenom') {
        setC3LabelStage(2);
        addMsg('bot', "BINGO ! L'attribut magique <code>for=\"prenom\"</code> est là. Ton label est maintenant officiellement soudé à l'input. Clique sur le mot dans le rendu et regarde comment le curseur saute dans la case ! 🎯", 100);
        markExplored(4);
        if (!solved[4]) addXP(20);
        setC3Unlock(true);
      }
    }
  }

  const handleC3MCQ = (idx, correct) => {
    if (c3MCQ.selected !== null) return
    setC3MCQ({ selected: idx })
    if (correct) {
      setC3Feedback({ ok: true, text: '(^_^) Parfait ! <strong>for=</strong> dans le label doit avoir la même valeur que <strong>id=</strong> dans l\'input.' })
      if (!solved[3]) addXP(15)
      setC3Unlock(true)
    } else {
      setC3Feedback({ ok: false, text: '(-_-) Non — c\'est <strong>for=</strong>. Il doit correspondre à l\'id= de l\'input pour créer le lien.' })
    }
  }

  /* ════════════════════════════════════════
     INTERACTIONS — Concept 4
  ════════════════════════════════════════ */
  const TYPE_INFO = {
    text:     { hint: 'Texte normal visible',       bot: "<strong>type='text'</strong> — C'est le champ classique ! Texte libre, idéal pour un prénom, une adresse ou une recherche. L'utilisateur peut y taper absolument n'importe quoi." },
    password: { hint: 'Texte masqué avec des ●',    bot: "<strong>type='password'</strong> — Regarde bien ! Chaque caractère tapé est transformé en ●. C'est crucial pour la sécurité, personne ne peut lire par-dessus ton épaule !" },
    email:    { hint: "Vérifie la présence d'un @",bot: "<strong>type='email'</strong> — Le navigateur va automatiquement bloquer l'envoi du formulaire si l'utilisateur oublie de mettre un @ dans son texte. Une validation gratuite sans JavaScript !" },
    number:   { hint: 'Accepte uniquement les chiffres', bot: "<strong>type='number'</strong> — Essaye de taper des lettres : le champ les refuse net ! Il n'accepte que les nombres, et ajoute même de petites flèches (spinners) pour incrémenter." },
  }

  const handleSwitchType = (type) => {
    setActiveType(type)
    setTypeHint(TYPE_INFO[type].hint)
    addMsg('bot', TYPE_INFO[type].bot, 100)
    setC4AttrExplored(prev => new Set([...prev, type]))
  }

  const checkC4 = () => {
    const val = c4Blank.trim().toLowerCase()
    if (val === 'password') {
      setC4Status('ok')
      setC4Feedback({ ok: true, text: '(^_^) Parfait ! type="password" masque les caractères avec des ●.' })
      if (!solved[4]) addXP(20)
      setC4Unlock(true)
    } else {
      setC4Status('err')
      setC4Feedback({ ok: false, text: '(-_-) Pas tout à fait — pense au type qui masque les caractères avec des points ●●●.' })
    }
  }

  const handleC4PracticeChange = (e) => {
    const val = e.target.value;
    setC4PracticeCode(val);
    const lower = val.toLowerCase();
    const typeMatch = lower.match(/type\s*=\s*["']?(\w+)["']?/);
    if (typeMatch && TYPE_INFO[typeMatch[1]]) {
      setActiveType(typeMatch[1]);
      setTypeHint(TYPE_INFO[typeMatch[1]].hint);
    } else if (typeMatch) {
      setActiveType(typeMatch[1]);
      setTypeHint('Type personnalisé actif');
    } else {
      setActiveType('text');
      setTypeHint('Texte normal visible');
    }
  }

  const handleC4LiveChange = () => {
    if (c4LiveWarned.current.has(activeType)) return;

    c4LiveWarned.current.add(activeType);

    if (activeType === 'text') {
      addMsg('bot', "Hé ! Tu as vu ? Ce que tu as saisi dans <strong>type='text'</strong> s'affiche tout à fait normalement, c'est le comportement classique.", 100);
    } else if (activeType === 'password') {
      addMsg('bot', "Incroyable non ? Tu as vu ? La saisie s'est transformée instantanément en petits points <code>●●●</code> pour te protéger car c'est <strong>type='password'</strong> !", 100);
    } else if (activeType === 'email') {
      addMsg('bot', "Tu testes le champ <strong>type='email'</strong> ! Essaye de le valider sans mettre de '@', tu verras que le navigateur te forcera à le corriger automatiquement. Magique !", 100);
    } else if (activeType === 'number') {
      addMsg('bot', "Bien joué ! As-tu remarqué que tu ne pouvais taper <strong>que</strong> des chiffres dans <strong>type='number'</strong> ? Les lettres sont bloquées !", 100);
    }
  }

  /* ════════════════════════════════════════
     INTERACTIONS — Concept 5
  ════════════════════════════════════════ */
  const handleC5MCQ = (idx, correct) => {
    if (c5MCQ.selected !== null) return
    setC5MCQ({ selected: idx })
    if (correct) {
      setC5Feedback({ ok: true, text: '(^_^) Bravo ! <strong>&lt;textarea&gt;</strong> est la balise pour les grands champs de texte multi-lignes.' })
      if (!solved[5]) addXP(25)
      setSolved(s => ({ ...s, 5: true }))
      addMsg('bot', '\(^o^)/ Fondations HTML terminées ! Tu connais maintenant toutes les bases pour construire un formulaire HTML complet. La phase 3 — Explorer — t\'attend !', 400)
      setTimeout(() => setShowCelebration(true), 700)
    } else {
      setC5Feedback({ ok: false, text: '(-_-) Non — pour un grand champ multi-lignes, c\'est <strong>&lt;textarea&gt;</strong>.' })
    }
  }

  const handleC5ButtonPracticeChange = (e) => {
    const val = e.target.value;
    setC5ButtonCode(val);

    if (c5ButtonStage === 0) {
      const match = val.match(/<button(.*?)>([^<]+)<\/button>/is);
      if (match && match[2].trim().length > 1) {
        const attrs = match[1].toLowerCase();
        const typeMatch = attrs.match(/type\s*=\s*["']([^"']+)["']/i);
        if (typeMatch && typeMatch[1] === 'submit') {
          setC5ButtonStage(2);
          addMsg('bot', "Woaw ! Directement parfait ! ⭐ L'attribut <code>type=\"submit\"</code> donne à ton bouton le super-pouvoir d'envoyer le formulaire. Va vite cliquer sur ton bouton dans le Rendu en Direct !", 100);
          markExplored(5);
        } else {
          setC5ButtonStage(1);
          addMsg('bot', "Joli bouton ! Il est bien visible à l'écran dans le Rendu Direct. Par contre, sans lui préciser son rôle (son <code>type=\"...\"</code>), le navigateur ne saura pas quoi faire si on clique dessus. Il te manque l'attribut fondamental pour expédier les données !", 100);
        }
      }
    } else if (c5ButtonStage === 1) {
      const matchFor = val.match(/type\s*=\s*["']([^"']+)["']/i);
      if (matchFor && matchFor[1] === 'submit') {
        setC5ButtonStage(2);
        addMsg('bot', "PARFAIT ! ⭐ L'attribut <code>type=\"submit\"</code> donne à ton bouton le super-pouvoir d'envoyer le formulaire. Va vite cliquer sur ton bouton dans le Rendu en Direct !", 100);
        markExplored(5);
      }
    }
  }

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */
  const extractButtonData = () => {
    const code = c5ButtonCode || '';
    const textMatch = code.match(/<button(.*?)>([^<]+)<\/button>/is);
    const attrs = textMatch ? textMatch[1].toLowerCase() : '';
    const typeMatch = attrs.match(/type\s*=\s*["']([^"']+)["']/i);
    return {
      text: textMatch && textMatch[2] ? textMatch[2].trim() : '',
      typeAttr: typeMatch ? typeMatch[1] : null,
      isValid: !!textMatch
    };
  }
  const buttonData = c5ButtonPracticePhase ? extractButtonData() : { typeAttr: 'submit', text: 'Envoyer le formulaire', isValid: true };

  const extractLabelData = () => {
    const code = c3LabelCode || '';
    const textMatch = code.match(/<label(.*?)>([^<]+)<\/label>/is);
    const attrs = textMatch ? textMatch[1].toLowerCase() : '';
    const forMatch = attrs.match(/for\s*=\s*["']([^"']+)["']/i);
    return {
      text: textMatch && textMatch[2] ? textMatch[2].trim() : '',
      forAttr: forMatch ? forMatch[1] : null
    };
  }
  const labelData = c3LabelPracticePhase ? extractLabelData() : { forAttr: 'prenom', text: 'Ton prénom :' };

  const currentChips = CHIPS_PER_CONCEPT[current] || []

  return (
    <div className="fnd-app">

      {/* Notif XP flottante */}
      <AnimatePresence>
        {xpNotif && (
          <motion.div
            key="xpn"
            className="fnd-xp-notif"
            initial={{ opacity: 0, y: 20, scale: 0.7 }}
            animate={{ opacity: 1, y: -10, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.85 }}
            transition={{ duration: 0.4 }}
          >
            {xpNotif}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TopBar ── */}
      <TopBar
        user={user}
        currentStep={2}
        completedSteps={[1]}
      />

      {/* ── Zone de contenu (colonne gauche, scrollable) ── */}
      <div className="fnd-content">

        {/* Hero compact */}
        <div className="fnd-hero">
          <div className="fnd-hero-inner">
            <div className="fnd-hero-badge">
              <span className="fnd-hero-dot" />
              Phase 2 · Fondations HTML
            </div>
            <div className="fnd-hero-title">
              Super <em>{user?.name || 'toi'}</em> — on construit (^_^)
            </div>
            <div className="fnd-hero-sub">
              5 concepts, 5 défis. <strong>Un seul à la fois</strong> — explore le code, relève le défi, passe au suivant.
            </div>
            <FoundationsLocalProgress 
              current={current} 
              solved={solved} 
              onNavigate={(n) => showConcept(n, true)} 
            />
          </div>
        </div>

        {/* Concepts — transition animée */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          >

            {/* ══════════════════════════════════════
                CONCEPT 1 — <form>
            ══════════════════════════════════════ */}
            {current === 1 && (
              <div className="fnd-cp">
                <div className="fnd-cp-card">
                  <div className="fnd-cp-head">
                    <div className="fnd-cp-num n1">1</div>
                    <div className="fnd-cp-info">
                      <div className="fnd-cp-eyebrow">CONCEPT 1 / 5</div>
                      <div className="fnd-cp-title">
                        La balise <code className="t">&lt;form&gt;</code> — Le conteneur
                      </div>
                    </div>
                  </div>

                  <div className="fnd-cp-explain">
                    <p className="fnd-exp-p">
                      Tout formulaire HTML commence par <code className="fnd-ic t">&lt;form&gt;</code> et se termine par <code className="fnd-ic c">&lt;/form&gt;</code>. C'est le <strong>conteneur qui regroupe tous les champs</strong>.
                    </p>
                    <div className="fnd-analogy">
                      <div className="fnd-an-ico"><FiCoffee size={24} color="var(--vio)" /></div>
                      <div className="fnd-an-txt">
                        <strong>Analogie</strong> — C'est comme le <strong>plateau du serveur au restaurant</strong>. Sans plateau, impossible de transporter tous les plats en cuisine !
                      </div>
                    </div>
                    
                    <div style={{ marginTop: '12px', textAlign: 'center' }}>
                      <button
                        className="fnd-btn-hint"
                        onClick={() => {
                          const next = !showFormAnalogy
                          setShowFormAnalogy(next)
                          if (next && analogyDialogRef.current === 0) {
                            analogyDialogRef.current = 1
                            addMsg('bot', "Tu vois cette image ? (^_^) Tu veux que je t'explique l'analogie étape par étape ? Tape <strong>oui</strong> ou <strong>non</strong> !", 500)
                          }
                        }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', color: '#ddd', fontSize: '13px', cursor: 'pointer' }}
                      >
                        <FiEye /> {showFormAnalogy ? "Masquer l'image" : "Voir l'analogie en image"}
                      </button>
                    </div>
                    
                    <AnimatePresence>
                      {showFormAnalogy && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{ overflow: 'hidden', marginTop: '12px', borderRadius: '8px' }}
                        >
                          <img src="/images/image%20analogie%20form%20.jpeg" alt="Analogie Formulaire" style={{ width: '100%', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="fnd-cp-code">
                    {!c1PracticePhase ? (
                      <>
                        <div className="fnd-code-tip fnd-hl-syntax" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', borderLeft: '3px solid var(--teal)' }}>
                          <span className="fnd-tip-dot" />
                          <strong>Syntaxe :</strong> Clique sur <strong>action=</strong> ou <strong>method=</strong> pour voir leur rôle
                        </div>
                        <CodeBlock fileName="FORMULAIRE.HTML">
                          <CodeLine><Ct c="&lt;form" /></CodeLine>
                          <CodeLine
                            indent hl={hlForm === 'action'} hlType="teal"
                            onClick={() => handleHlForm('action')}
                            annotation="URL de destination"
                          >
                            <Ca c='action=' /><Cv c='"inscription.php"' />
                          </CodeLine>
                          <CodeLine
                            indent hl={hlForm === 'method'} hlType="violet"
                            onClick={() => handleHlForm('method')}
                            annotation="Mode d'envoi"
                          >
                            <Ca c='method=' /><Cv c='"post"' />
                          </CodeLine>
                          <CodeLine><Ct c="&gt;" /></CodeLine>
                          <CodeLine indent><Cc c="/* tes champs ici */" /></CodeLine>
                          <CodeLine><Ct c="&lt;/form&gt;" /></CodeLine>
                        </CodeBlock>
                        <div style={{ marginTop: '24px', textAlign: 'center' }}>
                          <button 
                            className="fnd-btn-check" 
                            style={{ padding: '12px 24px', fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                            onClick={() => {
                              setC1PracticePhase(true)
                              addMsg('bot', "C'est à toi ! Crée ton tout premier formulaire. Tape les balises d'ouverture et de fermeture.", 100)
                              setTimeout(() => challengeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 150)
                            }}
                          >
                            <FiPlay /> Pratiquer pour mieux comprendre
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="fnd-practice-zone" style={{ background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '16px' }}>
                        <div style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '16px', fontSize: '14px' }}>
                          Tape ta balise <code>&lt;form&gt;</code> et sa balise de fermeture <code>&lt;/form&gt;</code> ci-dessous :
                        </div>
                        <textarea
                          className="fnd-mini-editor"
                          value={c1PracticeCode}
                          onChange={e => {
                            setC1PracticeCode(e.target.value)
                            setShowC1Joke(false)
                            setC1JokeFeedback(null)
                          }}
                          placeholder="Tape ton code ici..."
                          spellCheck={false}
                          style={{
                            width: '100%',
                            height: '100px',
                            background: '#1e1e1e',
                            color: '#d4d4d4',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            padding: '16px',
                            fontFamily: 'monospace',
                            fontSize: '15px',
                            resize: 'none',
                            marginBottom: '16px'
                          }}
                        />
                        <button 
                          className="fnd-btn-check" 
                          onClick={handleC1PracticeSubmit}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                          <FiEye /> Visualiser
                        </button>

                        <AnimatePresence>
                          {showC1Joke && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              className="fnd-joke-box"
                              style={{
                                marginTop: '24px',
                                background: '#ececec',
                                border: '3px dashed #999',
                                borderRadius: '12px',
                                padding: '32px',
                                textAlign: 'center',
                                color: '#333'
                              }}
                            >
                              <div style={{ marginBottom: '16px' }}><FiBox size={64} color="#888" /></div>
                              <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px', color: '#111' }}>
                                Tada ! Je suis un formulaire.
                              </div>
                              <div style={{ fontSize: '15px', color: '#555', lineHeight: '1.5' }}>
                                Mais... je suis vide ! (T_T)<br/><br/>
                                Le navigateur sait que j'existe grâce à tes balises, mais un formulaire seul est juste une "boîte invisible".<br/>
                                Il me faut des <strong>champs</strong> à l'intérieur pour être utile !
                              </div>
                              <button 
                                className="fnd-unlock-btn"
                                style={{ marginTop: '24px', background: '#333', color: 'white' }}
                                onClick={() => unlockNext(2)}
                              >
                                Découvrir les champs (Concept Suivant) →
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
                {/* Zone ciblée ref pour le scroll automatique */}
                <div ref={challengeRef} style={{ height: 1 }}></div>
              </div>
            )}

            {/* ══════════════════════════════════════
                CONCEPT 2 — <input>
            ══════════════════════════════════════ */}
            {current === 2 && (
              <div className="fnd-cp">
                <div className="fnd-cp-card">
                  <div className="fnd-cp-head">
                    <div className="fnd-cp-num n2">2</div>
                    <div className="fnd-cp-info">
                      <div className="fnd-cp-eyebrow">CONCEPT 2 / 5</div>
                      <div className="fnd-cp-title">
                        L'élément <code className="v">&lt;input&gt;</code> — Le champ de saisie
                      </div>
                    </div>
                  </div>

                  <div className="fnd-cp-explain">
                    <p className="fnd-exp-p">
                      Après avoir vu l'importance de <code className="fnd-ic t">&lt;form&gt;</code>, on aborde la balise <code className="fnd-ic v">&lt;input&gt;</code>. Elle est indispensable car elle permet à ton utilisateur de <strong>saisir des informations</strong> (comme du texte, un mot de passe ou une date). Sans <code className="v">input</code>, impossible de te répondre !
                    </p>
                    
                    {/* L'Analogie */}
                    <motion.div 
                        className="fnd-analogy-box"
                        style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid var(--teal)', marginBottom: '20px' }}
                    >
                        <strong>🧠 L'Analogie :</strong> Si <code className="t">&lt;form&gt;</code> est une grosse enveloppe postale, alors <code className="v">&lt;input&gt;</code> représente les <strong>lignes pointillées</strong> sur lesquelles l'utilisateur doit écrire son adresse et son nom. Et n'oublie pas la règle d'or : On écrit toujours l'adresse <em>sur</em> l'enveloppe, donc un <code className="v">&lt;input&gt;</code> doit toujours être créé <strong>à l'intérieur</strong> de <code className="t">&lt;form&gt;</code> !
                    </motion.div>
                    
                    {/* Bouton analogie image + image révélée */}
                    <div style={{ marginBottom: '20px' }}>
                      <motion.button
                        className="fnd-analogy-btn"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          if (inputAnalogyDialogRef.current === 0) {
                            inputAnalogyDialogRef.current = 1
                            addMsg('bot', "Je vois que tu veux visualiser l'analogie de l'enveloppe ! (^_^)<br><br>Tu veux que je t'explique comment <code>&lt;input&gt;</code> fonctionne avec l'image — <strong>oui</strong> ou <strong>non</strong> ?")
                          }
                          setShowInputAnalogy(v => !v)
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.4)',
                          color: '#c4b5fd', borderRadius: '10px', padding: '9px 16px',
                          cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                        }}
                      >
                        <FiEye size={15} />
                        {showInputAnalogy ? 'Masquer l\'analogie en image' : 'Visualiser l\'analogie en image'}
                      </motion.button>

                      <AnimatePresence>
                        {showInputAnalogy && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            style={{ overflow: 'hidden', borderRadius: '12px' }}
                          >
                            <img
                              src="/images/image%20analogie%202.jpeg"
                              alt="Analogie enveloppe — input"
                              style={{
                                width: '100%', borderRadius: '12px',
                                border: '1px solid rgba(124,58,237,0.3)',
                                boxShadow: '0 8px 32px rgba(124,58,237,0.2)',
                                display: 'block',
                              }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Le Bouton de Validation de Séance */}
                    {inputLessonStage >= 1 && inputLessonStage < 4 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        style={{ marginTop: '20px', padding: '16px', background: 'rgba(40,200,64,0.1)', border: '1px solid var(--gre)', borderRadius: '12px' }}
                      >
                        <button 
                            className="fnd-btn" 
                            style={{ background: 'var(--gre)', color: '#000', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', width: '100%', boxShadow: '0 0 10px rgba(40,200,64,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '15px' }}
                            onClick={() => {
                                setInputLessonStage(4);
                                addMsg('bot', "Magnifique ! Je t'ai affiché ses <strong>super-attributs</strong> en bas. L'attribut <code>type</code> permet de transformer l'input en mot de passe ou en calendrier. Essaie-les tous !");
                            }}
                        >
                            <FiPlay size={16} /> Poursuivre la séance
                        </button>
                      </motion.div>
                    )}

                    {inputLessonStage === 4 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        style={{ marginTop: '24px' }}
                      >
                        <p className="fnd-exp-p">Bien jou&#233; ! L&#39;input que tu as cr&#233;&#233; &#233;tait simplifi&#233; pour te montrer l&#39;effet. En r&#233;alit&#233;, un <code className="v">&lt;input&gt;</code> a besoin d&#39;<strong>attributs</strong> pour &#234;tre vraiment utile. Clique sur chacun pour comprendre :</p>
                        <div className="fnd-attr-list">
                          {[
                            { key: 'type',        badge: 't', desc: 'Le type de champ (texte, email\u2026)' },
                            { key: 'name',        badge: 'v', desc: "L'identifiant du champ c\u00f4t\u00e9 serveur" },
                            { key: 'placeholder', badge: 'a', desc: "Le texte d'aide gris\u00e9 \u00e0 l'int\u00e9rieur" },
                            { key: 'required',    badge: 'c', desc: 'Rend le champ obligatoire' },
                          ].map(({ key, badge, desc }) => {
                            const isExplored = c2AttrExplored.has(key);
                            const canPractice = c2AttrExplored.size >= 3;
                            return (
                              <motion.div
                                key={key}
                                className={`fnd-attr-item${badge === 'v' ? ' hi-v' : ''}${hlAttr === key ? ' hi' : ''}${isExplored ? ' explored' : ''}`}
                                onClick={() => handleHlAttr(key)}
                                style={{ display: 'flex', alignItems: 'center' }}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <span className={`fnd-ai-badge ${badge}`}>{key}</span>
                                <span className="fnd-ai-desc" style={{ flex: 1 }}>{desc}</span>
                                
                                {isExplored && (
                                  <div style={{ marginLeft: '12px', display: 'flex', alignItems: 'center' }}>
                                    {canPractice ? (
                                      <motion.button 
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setC2PracticePhase(true);
                                          let code = '';
                                          let msg = '';
                                          if (key === 'type') {
                                            code = 'type="password"';
                                            msg = "<strong>Mode Pratique — type :</strong> J'ai pré-rempli avec <code>type=\"password\"</code>. Essaie de taper dans le champ ! Modifie-le par <code>color</code> ou <code>date</code>.";
                                            setC2PracticeType('password'); setC2PracticeName(''); setC2PracticePH(''); setC2PracticeReq(false);
                                          } else if (key === 'name') {
                                            code = 'name="identifiant"';
                                            msg = "<strong>Mode Pratique — name :</strong> J'ai ajouté <code>name=\"identifiant\"</code>. Regarde sous l'input : tu vois que le serveur sait maintenant la variable associée à la valeur tapée !";
                                            setC2PracticeType('text'); setC2PracticeName('identifiant'); setC2PracticePH(''); setC2PracticeReq(false);
                                          } else if (key === 'placeholder') {
                                            code = 'placeholder="Ex: Superman"';
                                            msg = "<strong>Mode Pratique — placeholder :</strong> Le texte grisé apparaît ! Dès que tu tapes, il disparaît. Pratique non ?";
                                            setC2PracticeType('text'); setC2PracticeName(''); setC2PracticePH('Ex: Superman'); setC2PracticeReq(false);
                                          } else if (key === 'required') {
                                            code = 'required';
                                            msg = "<strong>Mode Pratique — required :</strong> Clique sur le bouton 'Simuler l'envoi' en laissant le champ vide. Tu verras l'alerte du navigateur te bloquer !";
                                            setC2PracticeType('text'); setC2PracticeName(''); setC2PracticePH(''); setC2PracticeReq(true);
                                          }
                                          setC2PracticeCode(code);
                                          addMsg('bot', msg, 100);
                                          setTimeout(() => document.querySelector('.fnd-practice-zone-attr')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
                                        }}
                                        style={{ 
                                          background: 'var(--gre)', color: '#000', border: 'none', 
                                          padding: '5px 12px', borderRadius: '12px', fontSize: '12px',
                                          fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                                          boxShadow: '0 0 10px rgba(40,200,64,0.3)'
                                        }}
                                      >
                                        <FiPlay size={12} /> Pratiquer
                                      </motion.button>
                                    ) : (
                                      <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }} title="Lis d'abord 3 attributs">
                                        <FiLock size={12} /> <span style={{ fontSize: '10px' }}>Bloqué</span>
                                      </span>
                                    )}
                                  </div>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>

                        {/* Indication Pratique Débloquée */}
                        {c2AttrExplored.size >= 3 && !c2PracticePhase && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            style={{ marginTop: '20px', padding: '16px', background: 'rgba(40,200,64,0.08)', border: '1px solid var(--gre)', borderRadius: '12px', textAlign: 'center' }}
                          >
                            <p className="fnd-exp-p" style={{ marginBottom: '0', color: 'var(--gre)' }}>
                              <FiUnlock size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                              <strong>Pratique débloquée !</strong> Clique sur le bouton <span style={{ background: 'var(--gre)', color: '#000', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>&gt; Pratiquer</span> à côté de l'attribut que tu veux tester.
                            </p>
                          </motion.div>
                        )}

                        {/* PHASE 2 : L'Atelier Pratique Ciblée */}
                        {c2PracticePhase && (
                          <motion.div
                            className="fnd-practice-zone-attr"
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                            style={{ marginTop: '24px' }}
                          >
                            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px' }}>
                              <div style={{ fontFamily: 'monospace', fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>MON-INPUT.HTML</div>
                              <div style={{ fontFamily: 'monospace', fontSize: '14px', color: 'var(--teal)' }}>&lt;form&gt;</div>
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', paddingLeft: '18px', margin: '8px 0' }}>
                                <span style={{ fontFamily: 'monospace', fontSize: '14px', color: 'var(--teal)', whiteSpace: 'nowrap' }}>&lt;input </span>
                                <input
                                  type="text"
                                  value={c2PracticeCode}
                                  onChange={handleC2PracticeChange}
                                  placeholder={'type="text" ...'}
                                  style={{
                                    background: 'rgba(0,0,0,0.4)', color: '#a5f3fc', border: '1px solid rgba(255,255,255,0.15)',
                                    padding: '6px 10px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '14px', flex: 1, outline: 'none',
                                    minWidth: 0
                                  }}
                                />
                                <span style={{ fontFamily: 'monospace', fontSize: '14px', color: 'var(--teal)', whiteSpace: 'nowrap' }}>/&gt;</span>
                              </div>
                              <div style={{ fontFamily: 'monospace', fontSize: '14px', color: 'var(--teal)' }}>&lt;/form&gt;</div>
                            </div>

                            {/* Rendu en Direct de la Pratique */}
                            <div style={{ marginTop: '16px', border: '2px dashed rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px', minHeight: '80px', position: 'relative' }}>
                              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gre)' }} />RENDU DE TA PRATIQUE</div>
                              <motion.div
                                key={c2PracticeType + c2PracticePH + c2PracticeReq}
                                initial={{ opacity: 0, scale: 0.98, x: -10 }} animate={{ opacity: 1, scale: 1, x: 0 }}
                                transition={{ duration: 0.4, type: "spring" }}
                              >
                                <input
                                  id="live-practice-input"
                                  type={c2PracticeType}
                                  placeholder={c2PracticePH || ''}
                                  required={c2PracticeReq}
                                  className="fnd-live-inp"
                                  style={{ width: '100%', marginBottom: c2PracticeReq ? '12px' : '0' }}
                                />
                                {c2PracticeName && (
                                  <div style={{ marginTop: '8px', fontSize: '11px', color: 'rgba(255,255,255,0.4)', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                                    <FiFolder size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Côté Serveur, ta valeur sera rangée dans : <code style={{ color: 'var(--amb)', fontSize: '12px', padding: '2px 4px', background: 'rgba(255,165,0,0.1)' }}>{c2PracticeName}</code>
                                  </div>
                                )}
                                {c2PracticeReq && (
                                  <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ fontSize: '12px', color: 'var(--red, #ff5f57)', fontWeight: '500' }}>
                                      <FiLock size={12} style={{ marginRight: '4px' }} /> Contrainte ajoutée : ce champ est obligatoire !
                                    </div>
                                    <button 
                                      style={{ alignSelf: 'flex-start', background: 'rgba(255,60,60,0.2)', color: '#ffaaaa', border: '1px solid rgba(255,60,60,0.4)', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                                      onClick={() => {
                                        const inputLive = document.getElementById('live-practice-input');
                                        if (inputLive) {
                                          if (!inputLive.value) {
                                            inputLive.reportValidity();
                                          } else {
                                            alert("Le formulaire est valide !");
                                          }
                                        }
                                      }}
                                    >
                                      Simuler l'envoi du formulaire
                                    </button>
                                  </div>
                                )}
                              </motion.div>
                            </div>

                            <motion.div initial={{opacity:0, y: 10}} animate={{opacity:1, y: 0}} style={{ marginTop: '24px', textAlign: 'center' }}>
                              <button
                                className="fnd-unlock-btn"
                                onClick={() => unlockNext(3)}
                              >
                                J'ai compris ! Passer à l'exercice suivant →
                              </button>
                            </motion.div>

                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </div>

                  {inputLessonStage < 4 && (
                    <div className="fnd-cp-code">
                      <CodeBlock fileName="PRATIQUE.HTML">
                        <CodeLine><Ct c="&lt;form&gt;" /></CodeLine>
                        
                        {/* L'ÉDITEUR INTERACTIF */}
                        <div style={{ paddingLeft: '18px', margin: '8px 0' }}>
                          <input 
                            type="text" 
                            value={userCodeInput} 
                            onChange={handleUserCodeChange} 
                            placeholder={inputLessonStage === 2 ? "Retape ici..." : "Tape <input> ici..."} 
                            style={{ 
                              background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', 
                              padding: '8px 12px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '14px', width: '200px', outline: 'none'
                            }} 
                            autoFocus
                          />
                        </div>

                        <CodeLine><Ct c="&lt;/form&gt;" /></CodeLine>
                      </CodeBlock>

                      <div className="fnd-lp-box">
                        <div className="fnd-lp-hdr"><span className="fnd-lp-dot" />RENDU EN DIRECT</div>
                        
                        <div style={{ border: '2px dashed rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                          <AnimatePresence mode="wait">
                              {(inputLessonStage === 0 || inputLessonStage === 2) ? (
                                <motion.span 
                                  key="empty"
                                  initial={{ opacity: 0, scale: 0.8 }} 
                                  animate={{ opacity: 1, scale: 1 }} 
                                  exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
                                  transition={{ duration: 0.3 }}
                                  style={{ opacity: 0.3, fontSize: '13px', position: 'absolute' }}
                                >
                                  {inputLessonStage === 0 ? "Le formulaire est vide... Tape la balise au-dessus !" : "Oh non ! Le champ est parti dans une autre dimension..."}
                                </motion.span>
                              ) : (
                                <motion.input
                                  key="rendered-input"
                                  initial={{ scale: 0, opacity: 0, y: 30 }}
                                  animate={{ scale: 1, opacity: 1, y: 0 }}
                                  exit={{ scale: 0, opacity: 0, y: -30, filter: 'blur(10px)' }}
                                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                  type="text"
                                  className="fnd-live-inp"
                                  style={{ margin: 0, position: 'absolute' }}
                                />
                              )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════
                CONCEPT 3 — type=
            ══════════════════════════════════════ */}
            {current === 3 && (
              <div className="fnd-cp">
                <div className="fnd-cp-card">
                  <div className="fnd-cp-head">
                    <div className="fnd-cp-num n3">3</div>
                    <div className="fnd-cp-info">
                      <div className="fnd-cp-eyebrow">CONCEPT 3 / 5</div>
                      <div className="fnd-cp-title">
                        L'attribut <code className="c">type=</code> — Chaque champ a son rôle
                      </div>
                    </div>
                  </div>

                  <div className="fnd-cp-explain">
                    <p className="fnd-exp-p">
                      L'attribut <code className="fnd-ic c">type</code> change complètement le <strong>comportement du champ</strong>. Clique sur chaque type pour voir le résultat en direct.
                    </p>
                    <div className="fnd-analogy">
                      <div className="fnd-an-ico"><FiTool size={24} color="var(--vio)" /></div>
                      <div className="fnd-an-txt">
                        <strong>Analogie</strong> — C'est comme des <strong>ustensiles différents</strong> en cuisine. Une fourchette pour les pâtes, une cuillère pour la soupe — chaque outil a son usage !
                      </div>
                    </div>

                    {/* Bouton analogie image + image révélée */}
                    <div style={{ marginBottom: '20px' }}>
                      <motion.button
                        className="fnd-analogy-btn"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          if (typeAnalogyDialogRef.current === 0) {
                            typeAnalogyDialogRef.current = 1
                            addMsg('bot', "Tu veux visualiser l'analogie des ustensiles ! (^_^)<br><br>Tu veux que je t'explique comment <code>type=</code> change le comportement avec l'image — <strong>oui</strong> ou <strong>non</strong> ?")
                          }
                          setShowTypeAnalogy(v => !v)
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.35)',
                          color: '#fdba74', borderRadius: '10px', padding: '9px 16px',
                          cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                        }}
                      >
                        <FiEye size={15} />
                        {showTypeAnalogy ? "Masquer l'analogie en image" : "Visualiser l'analogie en image"}
                      </motion.button>

                      <AnimatePresence>
                        {showTypeAnalogy && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            style={{ overflow: 'hidden', borderRadius: '12px' }}
                          >
                            <img
                              src="/images/image%20analogie%203.jpeg"
                              alt="Analogie ustensiles — type="
                              style={{
                                width: '100%', borderRadius: '12px',
                                border: '1px solid rgba(251,146,60,0.3)',
                                boxShadow: '0 8px 32px rgba(251,146,60,0.15)',
                                display: 'block',
                              }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="fnd-cp-code">
                    <div className="fnd-type-tabs" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      {['text', 'password', 'email', 'number'].map(t => {
                        const isExplored = c4AttrExplored.has(t);
                        return (
                          <div key={t} style={{ display: 'inline-flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                            <button
                              className={`fnd-ttab${activeType === t ? ' on' : ''}`}
                              onClick={() => { handleSwitchType(t); markExplored(3); }}
                            >
                              {t}
                            </button>
                            {isExplored && !c4PracticePhase && (
                              <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => {
                                  setC4PracticePhase(true);
                                  setC4PracticeCode(`type="${t}"`);
                                  addMsg('bot', `<strong>Mode Pratique — type="${t}" :</strong> C'est à toi ! Modifie la syntaxe ci-dessous (ex: mets <code>type="color"</code> ou <code>type="date"</code>) et observe ce qui se cache sous l'onglet RÉSULTAT EN DIRECT !`, 100);
                                  setTimeout(() => document.querySelector('.fnd-practice-zone-attr')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
                                }}
                                style={{
                                  background: 'var(--gre)', color: '#000', border: 'none',
                                  padding: '4px 8px', borderRadius: '8px', fontSize: '10px',
                                  fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                                  boxShadow: '0 0 10px rgba(40,200,64,0.3)'
                                }}
                              >
                                <FiPlay size={10} /> Pratiquer
                              </motion.button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {!c4PracticePhase ? (
                      <CodeBlock fileName="SYNTAXE">
                        <CodeLine><Ct c="&lt;input" /></CodeLine>
                        <CodeLine indent><Ca c='type=' /><Cv c={`"${activeType}"`} /></CodeLine>
                        <CodeLine indent><Ca c='placeholder=' /><Cv c='"Essaie de taper..."' /></CodeLine>
                        <CodeLine><Ct c="/&gt;" /></CodeLine>
                      </CodeBlock>
                    ) : (
                      <motion.div
                        className="fnd-practice-zone-attr"
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        style={{ marginTop: '16px', marginBottom: '16px' }}
                      >
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px' }}>
                          <div style={{ fontFamily: 'monospace', fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>ÉDITEUR EN TEMPS RÉEL (SYNTAXE)</div>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', margin: '8px 0' }}>
                            <span style={{ fontFamily: 'monospace', fontSize: '14px', color: 'var(--teal)', whiteSpace: 'nowrap' }}>&lt;input </span>
                            <input
                              type="text"
                              value={c4PracticeCode}
                              onChange={handleC4PracticeChange}
                              style={{
                                background: 'rgba(0,0,0,0.4)', color: '#a5f3fc', border: '1px solid rgba(255,255,255,0.15)',
                                padding: '6px 10px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '14px', flex: 1, outline: 'none',
                                minWidth: 0
                              }}
                            />
                            <span style={{ fontFamily: 'monospace', fontSize: '14px', color: 'var(--teal)', whiteSpace: 'nowrap' }}>/&gt;</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div className="fnd-lp-box">
                      <div className="fnd-lp-hdr"><span className="fnd-lp-dot" />RÉSULTAT EN DIRECT</div>
                      <input
                        key={activeType}
                        type={activeType}
                        className="fnd-live-inp"
                        placeholder="Essaie de taper..."
                        onChange={handleC4LiveChange}
                      />
                      <motion.div
                        key={typeHint}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="fnd-type-pill"
                      >
                        (^_^) {typeHint}
                      </motion.div>
                    </div>
                  </div>
                </div>

                <div ref={challengeRef}>
                  <ChallengeSection
                    visible={challengeVisible[3]}
                    explored={explored[3]}
                    onReveal={() => revealChallenge(3)}
                  >
                    <div className="fnd-cz-hd">
                      <div className="fnd-cz-ico"><FiZap size={22} color="var(--amb)" /></div>
                      <div className="fnd-cz-ttl">Mini-défi — Complète le code</div>
                    </div>
                    <p className="fnd-cz-sub">Tu veux un champ mot de passe qui masque les caractères. Quel type ?</p>
                    <div className="fnd-fitb" style={{ fontSize: '12.5px' }}>
                      <Ct c="&lt;input" /> <Ca c='type=' /><Cv c='"' />
                      <input
                        className={`fnd-blank ${c4Status}`}
                        placeholder="???" style={{ width: 82 }}
                        value={c4Blank}
                        onChange={e => setC4Blank(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && checkC4()}
                      />
                      <Cv c='"' /> <Ct c="/&gt;" />
                    </div>
                    <div className="fnd-fitb-actions">
                      <button className="fnd-btn-check" onClick={checkC4}>Vérifier ✓</button>
                      <button className="fnd-btn-hint" onClick={() => addMsg('bot', 'Indice : ce type cache les caractères avec des points ●●●. C\'est un mot anglais qui commence par <strong>p</strong>… pense à la sécurité !')}>Indice (*_*)</button>
                    </div>
                    <AnimatePresence>
                      {c4Feedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className={`fnd-cz-fb ${c4Feedback.ok ? 'ok' : 'nope'}`}
                          dangerouslySetInnerHTML={{ __html: c4Feedback.text }}
                        />
                      )}
                    </AnimatePresence>
                    {c4Unlock && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                        className="fnd-unlock-btn"
                        onClick={() => { setSolved(prev => ({...prev, 3: true})); unlockNext(4); }}
                      >
                        Concept suivant : le &lt;label&gt; →
                      </motion.button>
                    )}
                  </ChallengeSection>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════
                CONCEPT 4 — <label>
            ══════════════════════════════════════ */}
            {current === 4 && (
              <div className="fnd-cp">
                <div className="fnd-cp-card">
                  <div className="fnd-cp-head">
                    <div className="fnd-cp-num n1">4</div>
                    <div className="fnd-cp-info">
                      <div className="fnd-cp-eyebrow">CONCEPT 4 / 5</div>
                      <div className="fnd-cp-title">
                        La balise <code className="t">&lt;label&gt;</code> — L'étiquette
                      </div>
                    </div>
                  </div>

                  <div className="fnd-cp-explain">
                    <p className="fnd-exp-p">
                      Le <code className="fnd-ic t">&lt;label&gt;</code> donne un <strong>nom visible</strong> à chaque champ. Quand on clique dessus, le curseur saute automatiquement dans le champ lié !
                    </p>
                    <div className="fnd-analogy">
                      <div className="fnd-an-ico"><FiFolder size={24} color="var(--vio)" /></div>
                      <div className="fnd-an-txt">
                        <strong>Analogie</strong> — C'est comme les <strong>étiquettes sur les tiroirs</strong>. Sans étiquette, impossible de savoir où ranger chaque chose !
                      </div>
                    </div>
                  </div>

                  <div className="fnd-cp-code">
                    {!c3LabelPracticePhase ? (
                      <>
                        <div className="fnd-code-tip" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div><span className="fnd-tip-dot" /> Clique sur le label dans le rendu — le curseur saute dans le champ !</div>
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => {
                              setC3LabelPracticePhase(true);
                              addMsg('bot', "<strong>A toi de jouer :</strong> J'ai caché l'étiquette. Essaie d'en recréer une avec la balise <code>&lt;label&gt;</code> et relie-la avec <code>for</code> !", 100);
                              setTimeout(() => document.querySelector('.fnd-practice-zone-attr')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
                            }}
                            style={{
                              background: 'var(--amb)', color: '#000', border: 'none',
                              padding: '5px 12px', borderRadius: '12px', fontSize: '11px',
                              fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                              boxShadow: '0 0 10px rgba(240,152,24,0.3)'
                            }}
                          >
                            <FiPlay size={12} /> Pratiquer
                          </motion.button>
                        </div>
                        <CodeBlock fileName="SYNTAXE">
                          <CodeLine><Ct c="&lt;label" /> <Ca c='for=' /><Cv c='"prenom"' /><Ct c="&gt;" /></CodeLine>
                          <CodeLine indent><Cw c="Ton prénom :" /></CodeLine>
                          <CodeLine><Ct c="&lt;/label&gt;" /></CodeLine>
                          <CodeLine>&nbsp;</CodeLine>
                          <CodeLine><Ct c="&lt;input" /></CodeLine>
                          <CodeLine indent><Ca c='id=' /><Cv c='"prenom"' /></CodeLine>
                          <CodeLine indent><Ca c='type=' /><Cv c='"text"' /></CodeLine>
                          <CodeLine><Ct c="/&gt;" /></CodeLine>
                        </CodeBlock>
                      </>
                    ) : (
                      <motion.div
                        className="fnd-practice-zone-attr"
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        style={{ marginBottom: '16px' }}
                      >
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px' }}>
                          <div style={{ fontFamily: 'monospace', fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>ÉDITEUR EN TEMPS RÉEL (SYNTAXE)</div>
                          
                          <textarea
                            value={c3LabelCode}
                            onChange={handleC3LabelPracticeChange}
                            placeholder="<label>...</label>"
                            style={{
                              width: '100%', height: '70px',
                              background: 'rgba(0,0,0,0.4)', color: '#a5f3fc', border: '1px solid rgba(255,255,255,0.15)',
                              padding: '10px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '14px', resize: 'vertical', outline: 'none',
                              marginBottom: '8px'
                            }}
                          />

                          <div style={{ fontFamily: 'monospace', fontSize: '14px', color: 'var(--teal)' }}>
                            <div style={{ color: 'rgba(255,255,255,0.3)' }}>&lt;!-- Champ rattaché --&gt;</div>
                            &lt;input id="prenom" type="text" /&gt;
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div className="fnd-lp-box">
                      <div className="fnd-lp-hdr"><span className="fnd-lp-dot" />{!c3LabelPracticePhase ? 'CLIQUE SUR LE LABEL' : 'RÉSULTAT EN DIRECT'}</div>
                      {!c3LabelPracticePhase ? (
                        <label
                          htmlFor="lp3-field"
                          className={`fnd-demo-label${labelClicked ? ' clicked' : ''}`}
                          onClick={() => {
                            handleLabelClick();
                            markExplored(4);
                          }}
                        >
                          Ton prénom :
                        </label>
                      ) : (
                        (labelData?.text && labelData?.forAttr === 'prenom') ? (
                          <label
                            htmlFor="lp3-field"
                            className={`fnd-demo-label${labelClicked ? ' clicked' : ''}`}
                            onClick={() => {
                              handleLabelClick();
                            }}
                          >
                            {labelData.text}
                          </label>
                        ) : null
                      )}
                      
                      <input
                        id="lp3-field"
                        ref={lp3Ref}
                        type="text"
                        className="fnd-live-inp"
                        placeholder="Clique sur le label pour activer ce champ…"
                      />
                      <AnimatePresence>
                        {labelClicked && (
                          <motion.div
                            initial={{ opacity: 0, y: 4, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className="fnd-label-badge"
                          >
                            (*_*) Magie ! Le curseur a sauté automatiquement !
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <div ref={challengeRef}>
                  <ChallengeSection
                    visible={challengeVisible[4]}
                    explored={explored[4]}
                    onReveal={() => revealChallenge(4)}
                  >
                    <div className="fnd-cz-hd">
                      <div className="fnd-cz-ico"><FiZap size={22} color="var(--amb)" /></div>
                      <div className="fnd-cz-ttl">Mini-défi — QCM</div>
                    </div>
                    <p className="fnd-cz-sub">
                      Quel attribut du &lt;label&gt; doit avoir la même valeur que <code className="fnd-ic t">id</code> de l'input pour les lier ?
                    </p>
                    <McqOptions
                      options={[
                        { label: 'name',  correct: false },
                        { label: 'for',   correct: true  },
                        { label: 'class', correct: false },
                      ]}
                      selectedIdx={c3MCQ.selected}
                      onSelect={(idx, correct) => {
                        handleC3MCQ(idx, correct);
                      }}
                    />
                    <AnimatePresence>
                      {c3Feedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className={`fnd-cz-fb ${c3Feedback.ok ? 'ok' : 'nope'}`}
                          dangerouslySetInnerHTML={{ __html: c3Feedback.text }}
                        />
                      )}
                    </AnimatePresence>
                    {c3Unlock && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                        className="fnd-unlock-btn"
                        onClick={() => { setSolved(prev => ({...prev, 4: true})); unlockNext(5); }}
                      >
                        Dernier concept : le &lt;button&gt; →
                      </motion.button>
                    )}
                  </ChallengeSection>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════
                CONCEPT 5 — <button>
            ══════════════════════════════════════ */}
            {current === 5 && (
              <div className="fnd-cp">
                <div className="fnd-cp-card">
                  <div className="fnd-cp-head">
                    <div className="fnd-cp-num n2">5</div>
                    <div className="fnd-cp-info">
                      <div className="fnd-cp-eyebrow">CONCEPT 5 / 5 · DERNIER !</div>
                      <div className="fnd-cp-title">
                        <code className="t">&lt;button&gt;</code> — Le clou du spectacle
                      </div>
                    </div>
                  </div>

                  <div className="fnd-cp-explain">
                    <p className="fnd-exp-p">
                      Un formulaire a toujours besoin d'un <strong>bouton d'envoi</strong>. L'attribut le plus important ici, c'est <code className="fnd-ic t">type="submit"</code> !
                    </p>
                    <div className="fnd-analogy">
                      <div className="fnd-an-ico"><FiSend size={24} color="var(--vio)" /></div>
                      <div className="fnd-an-txt">
                        <strong>Analogie</strong> — C'est comme le <strong>timbre sur ton enveloppe</strong>. Sans lui, impossible de poster la lettre au serveur !
                      </div>
                    </div>
                  </div>

                  <div className="fnd-cp-code">
                    {!c5ButtonPracticePhase ? (
                      <>
                        <div className="fnd-code-tip" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div><span className="fnd-tip-dot" /> Analyse bien le code, puis passe à la pratique !</div>
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => {
                              setC5ButtonPracticePhase(true);
                              addMsg('bot', "<strong>A toi de jouer :</strong> J'ai retiré le bouton d'envoi. Utilise la balise <code>&lt;button&gt;</code> pour en récréer un, et n'oublie pas le bon <code>type</code> !", 100);
                              setTimeout(() => document.querySelector('.fnd-practice-zone-attr')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
                            }}
                            style={{
                              background: 'var(--vio)', color: 'white', border: 'none',
                              padding: '5px 12px', borderRadius: '12px', fontSize: '11px',
                              fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                              boxShadow: '0 0 10px rgba(123,111,248,0.4)'
                            }}
                          >
                            <FiPlay size={12} /> Pratiquer
                          </motion.button>
                        </div>
                        <CodeBlock fileName="SYNTAXE">
                          <CodeLine><Ct c="&lt;button" /> <Ca c='type=' /><Cv c='"submit"' /><Ct c="&gt;" /></CodeLine>
                          <CodeLine indent><Cw c="Envoyer le formulaire" /></CodeLine>
                          <CodeLine><Ct c="&lt;/button&gt;" /></CodeLine>
                        </CodeBlock>
                      </>
                    ) : (
                      <motion.div
                        className="fnd-practice-zone-attr"
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        style={{ marginBottom: '16px' }}
                      >
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px' }}>
                          <div style={{ fontFamily: 'monospace', fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>ÉDITEUR EN TEMPS RÉEL (SYNTAXE)</div>
                          
                          <div style={{ fontFamily: 'monospace', fontSize: '14px', color: 'var(--teal)' }}>
                            <div style={{ color: 'rgba(255,255,255,0.3)' }}>&lt;!-- Code du formulaire --&gt;</div>
                            &lt;form&gt;
                            <div style={{ paddingLeft: '18px', color: 'rgba(255,255,255,0.3)' }}>... champs ...</div>
                          </div>

                          <textarea
                            value={c5ButtonCode}
                            onChange={handleC5ButtonPracticeChange}
                            placeholder="<button>...</button>"
                            style={{
                              width: '100%', height: '70px',
                              background: 'rgba(0,0,0,0.4)', color: '#a5f3fc', border: '1px solid rgba(255,255,255,0.15)',
                              padding: '10px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '14px', resize: 'vertical', outline: 'none',
                              margin: '8px 0', marginLeft: '18px', width: 'calc(100% - 18px)'
                            }}
                          />

                          <div style={{ fontFamily: 'monospace', fontSize: '14px', color: 'var(--teal)' }}>
                            &lt;/form&gt;
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div className="fnd-preview-box">
                      <span className="fnd-fp-lbl">{!c5ButtonPracticePhase ? "Rendu du Bouton d'Envoi :" : 'RÉSULTAT EN DIRECT'}</span>
                      {!c5ButtonPracticePhase ? (
                        <button 
                          className="fnd-live-btn"
                          onClick={() => {
                            alert("Pouf ! Les données partent vers le serveur (si on avait un vrai serveur !)");
                            markExplored(5);
                          }}
                          style={{
                            background: 'var(--vio)', color: 'white', border: 'none', padding: '12px 24px', 
                            borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px'
                          }}
                        >
                          Envoyer le formulaire
                        </button>
                      ) : (
                        buttonData.isValid ? (
                          <button 
                            className="fnd-live-btn"
                            onClick={() => {
                              if (buttonData.typeAttr === 'submit') {
                                alert("Pouf ! Le formulaire vient d'être soumis ! ✅");
                                markExplored(5);
                              } else {
                                alert("Rien ne se passe ! (-_-)\nLe navigateur te dit : 'Désolé, mais sans type=\"submit\", ce bouton ne sert pas à envoyer un formulaire.'");
                              }
                            }}
                            style={{
                              background: buttonData.typeAttr === 'submit' ? 'var(--vio)' : '#444', 
                              color: 'white', border: 'none', padding: '12px 24px', 
                              borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px',
                              transition: 'background 0.3s'
                            }}
                          >
                            {buttonData.text || 'Bouton vide'}
                          </button>
                        ) : (
                          <div style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', padding: '12px' }}>
                            Pas de balise bouton complète détectée...
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div ref={challengeRef}>
                  <ChallengeSection
                    visible={challengeVisible[5]}
                    explored={explored[5]}
                    onReveal={() => revealChallenge(5)}
                  >
                    <div className="fnd-cz-hd">
                      <div className="fnd-cz-ico"><FiAward size={22} color="var(--amb)" /></div>
                      <div className="fnd-cz-ttl">Défi final — Le bon type</div>
                    </div>
                    <p className="fnd-cz-sub">Pour envoyer les données au serveur, quel "type" doit avoir notre bouton ?</p>
                    <McqOptions
                      options={[
                        { label: 'type="button"', correct: false },
                        { label: 'type="send"',   correct: false },
                        { label: 'type="submit"', correct: true  },
                      ]}
                      selectedIdx={c5MCQ?.selected ?? null}
                      onSelect={(idx, correct) => {
                        handleC5MCQ(idx, correct);
                      }}
                    />
                    <AnimatePresence>
                      {c5Feedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className={`fnd-cz-fb ${c5Feedback.ok ? 'ok' : 'nope'}`}
                          dangerouslySetInnerHTML={{ __html: c5Feedback.text }}
                        />
                      )}
                    </AnimatePresence>
                    {solved[5] && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                        className="fnd-unlock-btn final"
                        onClick={() => navigate('/mini-project')}
                      >
                        \(^_^)/ Continuer vers l'Explorer !
                      </motion.button>
                    )}
                  </ChallengeSection>
                </div>
                {/* Carte de célébration */}
                <AnimatePresence>
                  {showCelebration && (
                    <motion.div
                      className="fnd-cel-card"
                      initial={{ opacity: 0, scale: 0.82, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.15 }}
                    >
                      <div className="fnd-cel-confetti">
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="fnd-confetti-dot"
                            style={{
                              left: `${8 + i * 8}%`,
                              background: ['#18c97a', '#7b6ff8', '#f05848', '#e09818', '#0cb4d4'][i % 5],
                            }}
                            animate={{ y: [0, -40 - Math.random() * 30, 80], opacity: [1, 1, 0] }}
                            transition={{ duration: 1.5 + Math.random() * 0.8, delay: i * 0.07, ease: 'easeOut' }}
                          />
                        ))}
                      </div>
                      <span className="fnd-cel-emoji" style={{display:"inline-flex"}}><FiAward size={48} color="var(--amb)" /></span>
                      <div className="fnd-cel-title">Fondations HTML maîtrisées !</div>
                      <div className="fnd-cel-sub">
                        Tu connais maintenant <strong>&lt;form&gt;</strong>, <strong>&lt;input&gt;</strong>,{' '}
                        <strong>&lt;label&gt;</strong>, les <strong>types</strong>,{' '}
                        <strong>&lt;select&gt;</strong> et <strong>&lt;textarea&gt;</strong>.<br /><br />
                        Phase 3 — Explorer — t'attend !
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Panneau chat (colonne droite, sombre) ── */}
      <div className="fnd-chat">
        <div className="fnd-chat-hd">
          <div className="fnd-bot-av"><FiCpu size={24} /></div>
          <div>
            <div className="fnd-bot-nm">CodeBot</div>
            <div className="fnd-bot-st">Fondations HTML</div>
          </div>
          <div className="fnd-chat-status">
            <span className="fnd-st-dot" />En ligne
          </div>
        </div>

        <div className="fnd-msgs" ref={msgsRef}>
          {messages.map((msg, i) => {
            if (msg.type === 'sys') {
              return <div key={i} className="fnd-bbl sys">{msg.html}</div>
            }
            return (
              <div key={i} className={`fnd-mg${msg.type === 'usr' ? ' usr-align' : ''}`}>
                <div className={`fnd-ms${msg.type === 'usr' ? ' usr' : ''}`}>
                  {msg.type === 'bot' ? <><span><FiCpu style={{marginRight:4}}/></span> CodeBot</> : user?.name || 'Toi'}
                </div>
                <div
                  className={`fnd-bbl ${msg.type}`}
                  dangerouslySetInnerHTML={{ __html: msg.html }}
                />
              </div>
            )
          })}
          {chatLoading && (
            <div className="fnd-typing-bbl">
              <div className="fnd-ty" /><div className="fnd-ty" /><div className="fnd-ty" />
            </div>
          )}
        </div>

        <div className="fnd-chips">
          {currentChips.map(({ label, msg, wild }) => (
            <button
              key={label}
              className={`fnd-chip${wild ? ' wild' : ''}`}
              onClick={() => handleChatSend(msg)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="fnd-cinwrap" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <button 
            className={`fnd-deep-toggle ${isDeepThinking ? 'on' : ''}`}
            onClick={() => setIsDeepThinking(!isDeepThinking)}
            title={isDeepThinking ? "Désactiver la réflexion avancée" : "Activer la réflexion avancée (LLM)"}
          >
            <FiStar size={13} style={{ fill: isDeepThinking ? 'currentColor' : 'none' }} /> 
            Mode Réfléchi
          </button>
          <div className="fnd-cin-inner">
            <textarea
              className="fnd-cin"
              placeholder="Pose une question complexe (Ex: Pourquoi HTML ?)"
              rows={1}
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleChatSend(chatInput)
                }
              }}
            />
            <button
              className={`fnd-sndbtn ${chatInput.trim() ? 'active' : ''} ${isDeepThinking ? 'deep' : ''}`}
              onClick={() => handleChatSend(chatInput)}
              title="Envoyer à l'IA"
            >
              <FiSend size={20} className="fnd-send-ico" />
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
