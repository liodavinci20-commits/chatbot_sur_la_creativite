import { useState, useRef, useEffect, useCallback } from 'react'
import { API_BASE_URL } from '../config'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCpu, FiSend, FiLock, FiUnlock, FiStar, FiZap, FiTool, FiFolder, FiCoffee, FiAlignLeft, FiAward } from 'react-icons/fi'


/* ══════════════════════════════════════════════════════════════
   DONNÉES LOCALES — Réponses offline-first, API en fallback
══════════════════════════════════════════════════════════════ */
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
  "select vs input":      "<strong>&lt;select&gt;</strong> impose un choix parmi des options prédéfinies — l'utilisateur ne peut pas inventer. <strong>&lt;input&gt;</strong> laisse taper librement. Utilise select quand la liste est fermée !",
  "textarea vs input":    "<strong>&lt;textarea&gt;</strong> = plusieurs lignes, redimensionnable, parfait pour les messages longs. <strong>&lt;input type='text'&gt;</strong> = une seule ligne. Même concept, taille différente !",
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
    { label: "Pourquoi for= ?",       msg: "pourquoi for" },
    { label: "label sans for ?",      msg: "label sans for" },
    { label: "J'ai pas compris",      msg: "j'ai pas compris" },
    { label: "~_~ Question folle",    msg: "question folle", wild: true },
  ],
  4: [
    { label: "Quand utiliser email ?",msg: "quand utiliser email" },
    { label: "Autres types ?",        msg: "autres types input" },
    { label: "J'ai pas compris",      msg: "j'ai pas compris" },
    { label: "~_~ Question folle",    msg: "question folle", wild: true },
  ],
  5: [
    { label: "select vs input ?",     msg: "select vs input" },
    { label: "textarea vs input ?",   msg: "textarea vs input" },
    { label: "J'ai pas compris",      msg: "j'ai pas compris" },
    { label: "~_~ Question folle",    msg: "question folle", wild: true },
  ],
}

const CONCEPT_MSGS = {
  1: "Concept 1 — la balise <strong>&lt;form&gt;</strong>. C'est le conteneur de tout formulaire. Clique sur <strong>action=</strong> et <strong>method=</strong> dans le code pour voir leur rôle !",
  2: "Concept 2 — <strong>&lt;input&gt;</strong>. C'est le champ de saisie. Il a 4 attributs importants — explore-les tous dans la liste à gauche !",
  3: "Concept 3 — <strong>&lt;label&gt;</strong>. Une étiquette pour chaque champ. Clique sur le label « Ton prénom : » dans le rendu — observe la magie !",
  4: "Concept 4 — <strong>type=</strong>. Clique sur chaque type pour voir comment le champ se transforme. Essaie 'password' — regarde ce qui arrive à ce que tu tapes !",
  5: "Dernier concept ! <strong>&lt;select&gt;</strong> et <strong>&lt;textarea&gt;</strong>. Interagis avec les deux prévisualisations, puis relève le défi final !",
}

const DOT_LABELS = ['&lt;form&gt;', '&lt;input&gt;', '&lt;label&gt;', 'type=', '&lt;select&gt;']

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
  const [current, setCurrent] = useState(1)
  const [solved, setSolved] = useState({ 1: false, 2: false, 3: false, 4: false, 5: false })
  const [explored, setExplored] = useState({ 1: false, 2: false, 3: false, 4: false, 5: false })
  const [challengeVisible, setChallengeVisible] = useState({ 1: false, 2: false, 3: false, 4: false, 5: false })
  const [xp, setXp] = useState(0)
  const [xpNotif, setXpNotif] = useState(null)
  const [showCelebration, setShowCelebration] = useState(false)

  /* ── Concept 1 — <form> ── */
  const [hlForm, setHlForm] = useState(null)           // 'action' | 'method'
  const [c1Blanks, setC1Blanks] = useState({ a: '', b: '', c: '' })
  const [c1Status, setC1Status] = useState({ a: '', b: '', c: '' })
  const [c1Feedback, setC1Feedback] = useState(null)
  const [c1Unlock, setC1Unlock] = useState(false)

  /* ── Concept 2 — <input> ── */
  const [hlAttr, setHlAttr] = useState(null)
  const [liveReq, setLiveReq] = useState(false)
  const [livePH, setLivePH] = useState('Ton prénom')
  const [c2MCQ, setC2MCQ] = useState({ selected: null })
  const [c2Feedback, setC2Feedback] = useState(null)
  const [c2Unlock, setC2Unlock] = useState(false)

  /* ── Concept 3 — <label> ── */
  const [labelClicked, setLabelClicked] = useState(false)
  const [c3MCQ, setC3MCQ] = useState({ selected: null })
  const [c3Feedback, setC3Feedback] = useState(null)
  const [c3Unlock, setC3Unlock] = useState(false)
  const lp3Ref = useRef(null)

  /* ── Concept 4 — type= ── */
  const [activeType, setActiveType] = useState('text')
  const [typeHint, setTypeHint] = useState('Texte normal visible')
  const [c4Blank, setC4Blank] = useState('')
  const [c4Status, setC4Status] = useState('')
  const [c4Feedback, setC4Feedback] = useState(null)
  const [c4Unlock, setC4Unlock] = useState(false)

  /* ── Concept 5 — select + textarea ── */
  const [c5MCQ, setC5MCQ] = useState({ selected: null })
  const [c5Feedback, setC5Feedback] = useState(null)

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
  }, [chatLoading, addMsg, isDeepThinking])

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

  const checkC1 = () => {
    const a = c1Blanks.a.trim().toLowerCase()
    const b = c1Blanks.b.trim().toLowerCase()
    const c = c1Blanks.c.trim().toLowerCase()
    const ok = a === 'form' && b === 'post' && c === 'form'
    setC1Status({ a: a === 'form' ? 'ok' : 'err', b: b === 'post' ? 'ok' : 'err', c: c === 'form' ? 'ok' : 'err' })
    if (ok) {
      setC1Feedback({ ok: true, text: '(^_^) Parfait ! form + post + /form — ta balise est complète et valide !' })
      if (!solved[1]) addXP(20)
      setC1Unlock(true)
    } else {
      setC1Feedback({ ok: false, text: '(-_-) Pas tout à fait… La balise s\'appelle "form", et le mode sécurisé c\'est "post".' })
    }
  }

  /* ════════════════════════════════════════
     INTERACTIONS — Concept 2
  ════════════════════════════════════════ */
  const handleHlAttr = (attr) => {
    setHlAttr(attr)
    markExplored(2)
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
     INTERACTIONS — Concept 3
  ════════════════════════════════════════ */
  const handleLabelClick = () => {
    if (!labelClicked) {
      setLabelClicked(true)
      markExplored(3)
      addMsg('bot', 'Tu vois ? Le curseur a sauté automatiquement dans le champ ! C\'est la magie du <strong>for=</strong> et <strong>id=</strong> liés. 🎯', 200)
    }
    lp3Ref.current?.focus()
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
    text:     { hint: 'Texte normal visible',       bot: "type='text' — texte libre, l'utilisateur peut taper n'importe quoi !" },
    password: { hint: 'Texte masqué avec des ●',    bot: "type='password' — regarde ! Chaque caractère devient un ●. Parfait pour les mots de passe." },
    email:    { hint: 'Vérifie la présence d\'un @',bot: "type='email' — essaie de soumettre un formulaire sans le @, le navigateur bloque automatiquement !" },
    number:   { hint: 'Accepte uniquement les chiffres', bot: "type='number' — seuls les chiffres passent. Les flèches permettent d'incrémenter la valeur." },
  }

  const handleSwitchType = (type) => {
    setActiveType(type)
    setTypeHint(TYPE_INFO[type].hint)
    addMsg('bot', TYPE_INFO[type].bot, 100)
    markExplored(4)
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

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */
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
                  </div>

                  <div className="fnd-cp-code">
                    <div className="fnd-code-tip">
                      <span className="fnd-tip-dot" />
                      Clique sur <strong>action=</strong> ou <strong>method=</strong> pour voir leur rôle
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
                  </div>
                </div>

                <div ref={challengeRef}>
                  <ChallengeSection
                    visible={challengeVisible[1]}
                    explored={explored[1]}
                    onReveal={() => revealChallenge(1)}
                  >
                    <div className="fnd-cz-hd">
                      <div className="fnd-cz-ico"><FiZap size={22} color="var(--amb)" /></div>
                      <div className="fnd-cz-ttl">Mini-défi — Complète le code</div>
                    </div>
                    <p className="fnd-cz-sub">Remplis les blancs pour créer une balise form valide qui envoie les données en mode POST.</p>
                    <div className="fnd-fitb">
                      <Ct c="&lt;" />
                      <input
                        className={`fnd-blank ${c1Status.a}`}
                        placeholder="???" style={{ width: 48 }}
                        value={c1Blanks.a}
                        onChange={e => setC1Blanks(p => ({ ...p, a: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && checkC1()}
                      />
                      <Ca c=" action=" /><Cv c='"/"' />
                      <Ca c=" method=" /><Cv c='"' />
                      <input
                        className={`fnd-blank ${c1Status.b}`}
                        placeholder="???" style={{ width: 44 }}
                        value={c1Blanks.b}
                        onChange={e => setC1Blanks(p => ({ ...p, b: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && checkC1()}
                      />
                      <Cv c='"' /><Ct c="&gt;" /><br />
                      <span style={{ paddingLeft: 18 }}><Cc c="/* contenu */" /></span><br />
                      <Ct c="&lt;/" />
                      <input
                        className={`fnd-blank ${c1Status.c}`}
                        placeholder="???" style={{ width: 48 }}
                        value={c1Blanks.c}
                        onChange={e => setC1Blanks(p => ({ ...p, c: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && checkC1()}
                      />
                      <Ct c="&gt;" />
                    </div>
                    <div className="fnd-fitb-actions">
                      <button className="fnd-btn-check" onClick={checkC1}>Vérifier ✓</button>
                      <button className="fnd-btn-hint" onClick={() => addMsg('bot', 'Indice : la balise s\'appelle simplement <strong>form</strong>. Et pour envoyer de façon sécurisée — sans données dans l\'URL — c\'est <strong>post</strong>.')}>Indice (*_*)</button>
                    </div>
                    <AnimatePresence>
                      {c1Feedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className={`fnd-cz-fb ${c1Feedback.ok ? 'ok' : 'nope'}`}
                          dangerouslySetInnerHTML={{ __html: c1Feedback.text }}
                        />
                      )}
                    </AnimatePresence>
                    {c1Unlock && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                        className="fnd-unlock-btn"
                        onClick={() => unlockNext(2)}
                      >
                        Concept suivant : &lt;input&gt; →
                      </motion.button>
                    )}
                  </ChallengeSection>
                </div>
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
                      L'élément <code className="fnd-ic v">&lt;input&gt;</code> crée les <strong>champs à remplir</strong>. Il a plusieurs attributs importants — clique sur chacun pour voir son effet en direct.
                    </p>
                    <div className="fnd-attr-list">
                      {[
                        { key: 'type',        badge: 't', desc: 'Le type de champ (texte, email…)' },
                        { key: 'name',        badge: 'v', desc: "L'identifiant du champ côté serveur" },
                        { key: 'placeholder', badge: 'a', desc: "Le texte d'aide grisé à l'intérieur" },
                        { key: 'required',    badge: 'c', desc: 'Rend le champ obligatoire' },
                      ].map(({ key, badge, desc }) => (
                        <motion.div
                          key={key}
                          className={`fnd-attr-item${badge === 'v' ? ' hi-v' : ''}${hlAttr === key ? ' hi' : ''}`}
                          onClick={() => handleHlAttr(key)}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className={`fnd-ai-badge ${badge}`}>{key}</span>
                          <span className="fnd-ai-desc">{desc}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="fnd-cp-code">
                    <CodeBlock fileName="INPUT.HTML">
                      <CodeLine><Ct c="&lt;input" /></CodeLine>
                      <CodeLine indent hl={hlAttr === 'type'} hlType="teal" onClick={() => handleHlAttr('type')} annotation="Type de champ">
                        <Ca c='type=' /><Cv c='"text"' />
                      </CodeLine>
                      <CodeLine indent hl={hlAttr === 'name'} hlType="violet" onClick={() => handleHlAttr('name')} annotation="Identifiant">
                        <Ca c='name=' /><Cv c='"prenom"' />
                      </CodeLine>
                      <CodeLine indent hl={hlAttr === 'placeholder'} hlType="teal" onClick={() => handleHlAttr('placeholder')} annotation="Texte d'aide">
                        <Ca c='placeholder=' /><Cv c='"Ton prénom"' />
                      </CodeLine>
                      <CodeLine indent hl={hlAttr === 'required'} hlType="violet" onClick={() => handleHlAttr('required')} annotation="Obligatoire !">
                        <Ca c='required' />
                      </CodeLine>
                      <CodeLine><Ct c="/&gt;" /></CodeLine>
                    </CodeBlock>
                    <div className="fnd-lp-box">
                      <div className="fnd-lp-hdr"><span className="fnd-lp-dot" />RENDU EN DIRECT</div>
                      <input
                        type="text"
                        className="fnd-live-inp"
                        placeholder={livePH}
                        required={liveReq}
                      />
                      <div className="fnd-lp-hint">
                        {hlAttr
                          ? { type: 'type="text" — champ texte normal', name: 'name= — indispensable pour que le serveur reçoive les données !', placeholder: 'Le placeholder disparaît quand tu tapes !', required: 'required activé ! Essaie de valider un formulaire avec ce champ vide.' }[hlAttr]
                          : '(^_^) Clique sur un attribut pour voir ce qu\'il fait'
                        }
                      </div>
                    </div>
                  </div>
                </div>

                <div ref={challengeRef}>
                  <ChallengeSection
                    visible={challengeVisible[2]}
                    explored={explored[2]}
                    onReveal={() => revealChallenge(2)}
                  >
                    <div className="fnd-cz-hd">
                      <div className="fnd-cz-ico"><FiZap size={22} color="var(--amb)" /></div>
                      <div className="fnd-cz-ttl">Mini-défi — QCM</div>
                    </div>
                    <p className="fnd-cz-sub">Quel attribut de &lt;input&gt; rend un champ obligatoire ?</p>
                    <McqOptions
                      options={[
                        { label: 'placeholder', correct: false },
                        { label: 'name',        correct: false },
                        { label: 'required',    correct: true  },
                      ]}
                      selectedIdx={c2MCQ.selected}
                      onSelect={handleC2MCQ}
                    />
                    <AnimatePresence>
                      {c2Feedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className={`fnd-cz-fb ${c2Feedback.ok ? 'ok' : 'nope'}`}
                          dangerouslySetInnerHTML={{ __html: c2Feedback.text }}
                        />
                      )}
                    </AnimatePresence>
                    {c2Unlock && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                        className="fnd-unlock-btn"
                        onClick={() => unlockNext(3)}
                      >
                        Concept suivant : &lt;label&gt; →
                      </motion.button>
                    )}
                  </ChallengeSection>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════
                CONCEPT 3 — <label>
            ══════════════════════════════════════ */}
            {current === 3 && (
              <div className="fnd-cp">
                <div className="fnd-cp-card">
                  <div className="fnd-cp-head">
                    <div className="fnd-cp-num n1">3</div>
                    <div className="fnd-cp-info">
                      <div className="fnd-cp-eyebrow">CONCEPT 3 / 5</div>
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
                    <div className="fnd-code-tip">
                      <span className="fnd-tip-dot" />
                      Clique sur le label dans le rendu — le curseur saute dans le champ !
                    </div>
                    <CodeBlock fileName="LABEL.HTML">
                      <CodeLine><Ct c="&lt;label" /> <Ca c='for=' /><Cv c='"prenom"' /><Ct c="&gt;" /></CodeLine>
                      <CodeLine indent><Cw c="Ton prénom :" /></CodeLine>
                      <CodeLine><Ct c="&lt;/label&gt;" /></CodeLine>
                      <CodeLine>&nbsp;</CodeLine>
                      <CodeLine><Ct c="&lt;input" /></CodeLine>
                      <CodeLine indent><Ca c='id=' /><Cv c='"prenom"' /></CodeLine>
                      <CodeLine indent><Ca c='type=' /><Cv c='"text"' /></CodeLine>
                      <CodeLine><Ct c="/&gt;" /></CodeLine>
                    </CodeBlock>
                    <div className="fnd-lp-box">
                      <div className="fnd-lp-hdr"><span className="fnd-lp-dot" />CLIQUE SUR LE LABEL</div>
                      <label
                        htmlFor="lp3-field"
                        className={`fnd-demo-label${labelClicked ? ' clicked' : ''}`}
                        onClick={handleLabelClick}
                      >
                        Ton prénom :
                      </label>
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
                    visible={challengeVisible[3]}
                    explored={explored[3]}
                    onReveal={() => revealChallenge(3)}
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
                      onSelect={handleC3MCQ}
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
                        onClick={() => unlockNext(4)}
                      >
                        Concept suivant : les types d'input →
                      </motion.button>
                    )}
                  </ChallengeSection>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════
                CONCEPT 4 — type=
            ══════════════════════════════════════ */}
            {current === 4 && (
              <div className="fnd-cp">
                <div className="fnd-cp-card">
                  <div className="fnd-cp-head">
                    <div className="fnd-cp-num n3">4</div>
                    <div className="fnd-cp-info">
                      <div className="fnd-cp-eyebrow">CONCEPT 4 / 5</div>
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
                  </div>

                  <div className="fnd-cp-code">
                    <div className="fnd-type-tabs">
                      {['text', 'password', 'email', 'number'].map(t => (
                        <button
                          key={t}
                          className={`fnd-ttab${activeType === t ? ' on' : ''}`}
                          onClick={() => handleSwitchType(t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <CodeBlock fileName="TYPES.HTML">
                      <CodeLine><Ct c="&lt;input" /></CodeLine>
                      <CodeLine indent><Ca c='type=' /><Cv c={`"${activeType}"`} /></CodeLine>
                      <CodeLine indent><Ca c='placeholder=' /><Cv c='"Essaie de taper..."' /></CodeLine>
                      <CodeLine><Ct c="/&gt;" /></CodeLine>
                    </CodeBlock>
                    <div className="fnd-lp-box">
                      <div className="fnd-lp-hdr"><span className="fnd-lp-dot" />RÉSULTAT EN DIRECT</div>
                      <input
                        key={activeType}
                        type={activeType}
                        className="fnd-live-inp"
                        placeholder="Essaie de taper..."
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
                    visible={challengeVisible[4]}
                    explored={explored[4]}
                    onReveal={() => revealChallenge(4)}
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
                      <button className="fnd-btn-hint" onClick={() => addMsg('bot', 'Indice : ce type cache les caractères avec des points ●●●. C\'est un mot anglais qui commence par <strong>P</strong>… pense à la sécurité !')}>Indice (*_*)</button>
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
                        onClick={() => unlockNext(5)}
                      >
                        &lt;select&gt; et &lt;textarea&gt; →
                      </motion.button>
                    )}
                  </ChallengeSection>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════
                CONCEPT 5 — select + textarea
            ══════════════════════════════════════ */}
            {current === 5 && (
              <div className="fnd-cp">
                <div className="fnd-cp-card">
                  <div className="fnd-cp-head">
                    <div className="fnd-cp-num n2">5</div>
                    <div className="fnd-cp-info">
                      <div className="fnd-cp-eyebrow">CONCEPT 5 / 5 · DERNIER !</div>
                      <div className="fnd-cp-title">
                        <code className="t">&lt;select&gt;</code> et <code className="v">&lt;textarea&gt;</code>
                      </div>
                    </div>
                  </div>

                  <div className="fnd-cp-explain">
                    <p className="fnd-exp-p">
                      <code className="fnd-ic t">&lt;select&gt;</code> crée une <strong>liste déroulante</strong>. <code className="fnd-ic v">&lt;textarea&gt;</code> offre une <strong>grande zone de texte</strong> pour les messages longs.
                    </p>
                    <div className="fnd-analogy">
                      <div className="fnd-an-ico"><FiAlignLeft size={24} color="var(--vio)" /></div>
                      <div className="fnd-an-txt">
                        <strong>&lt;select&gt;</strong> = le menu du restaurant — tu choisis parmi ce qui est proposé. <strong>&lt;textarea&gt;</strong> = une page blanche — tu écris ce que tu veux !
                      </div>
                    </div>
                  </div>

                  <div className="fnd-cp-code">
                    <div className="fnd-preview-box">
                      <span className="fnd-fp-lbl">&lt;select&gt; — Liste déroulante :</span>
                      <select className="fnd-fp-sel" onChange={() => markExplored(5)}>
                        <option>Choisir ta classe…</option>
                        <option>Seconde</option>
                        <option>Première</option>
                        <option>Terminale</option>
                      </select>
                      <span className="fnd-fp-lbl">&lt;textarea&gt; — Zone de texte libre :</span>
                      <textarea className="fnd-fp-ta" placeholder="Écris ton message ici…" onChange={() => markExplored(5)} />
                    </div>
                    <CodeBlock fileName="SELECT-TEXTAREA.HTML">
                      <CodeLine><Ct c="&lt;select" /> <Ca c='name=' /><Cv c='"classe"' /><Ct c="&gt;" /></CodeLine>
                      <CodeLine indent><Ct c="&lt;option&gt;" /><Cw c="Seconde" /><Ct c="&lt;/option&gt;" /></CodeLine>
                      <CodeLine><Ct c="&lt;/select&gt;" /></CodeLine>
                      <CodeLine>&nbsp;</CodeLine>
                      <CodeLine><Ct c="&lt;textarea" /> <Ca c='rows=' /><Cv c='"4"' /></CodeLine>
                      <CodeLine indent><Ca c='placeholder=' /><Cv c='"Ton message..."' /></CodeLine>
                      <CodeLine><Ct c="&gt;&lt;/textarea&gt;" /></CodeLine>
                    </CodeBlock>
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
                      <div className="fnd-cz-ttl">Défi final — Pour les champs multi-lignes ?</div>
                    </div>
                    <p className="fnd-cz-sub">Pour un grand champ de texte libre (commentaire, message long), quelle balise utilise-t-on ?</p>
                    <McqOptions
                      options={[
                        { label: '&lt;input type="text"&gt;', correct: false },
                        { label: '&lt;select&gt;',            correct: false },
                        { label: '&lt;textarea&gt;',          correct: true  },
                      ]}
                      selectedIdx={c5MCQ.selected}
                      onSelect={handleC5MCQ}
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
                        onClick={() => navigate('/hub')}
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
