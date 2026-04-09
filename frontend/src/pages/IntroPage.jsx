// IntroPage.jsx — Page Découvrir (Phase 1) — New design matching codebot_decouvrir_final.html
// Structured as a multi-phase interactive discovery experience
import { useState, useRef, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiVolume2, FiVolumeX, FiSquare } from 'react-icons/fi'
import AppShell from '../components/AppShell'
import ChatPanel2 from '../components/ChatPanel2'

// ── Réponses locales pour le chat panel ──
const CHAT_RESPONSES = {
    "c'est quoi un formulaire ?": "(^_^) Un formulaire HTML, c'est une zone interactive sur une page web qui te permet de saisir et d'envoyer des informations. Tu en remplis plusieurs chaque jour : connexion Instagram, recherche Google, commande en ligne... On va découvrir ça ensemble !",
    "j'ai pas compris": "Pas de souci (^_^) ! Pense à la dernière fois que tu t'es connecté à une appli. Tu as tapé ton pseudo, ton mot de passe, tu as cliqué 'Se connecter'... Tout ça = un formulaire HTML. On vit dedans sans le voir.",
    "j'ai pas compris :-/": "Pas de souci (^_^) ! Pense à la dernière fois que tu t'es connecté à une appli. Tu as tapé ton pseudo, ton mot de passe, tu as cliqué 'Se connecter'... Tout ça = un formulaire HTML. On vit dedans sans le voir.",
    "aide moi": "(^_^) Bien sûr ! Tu es sur la Phase 1. Commence par cocher les interfaces qui te semblent familières. Ensuite on remplira un vrai formulaire ensemble — et tu verras exactement à quoi ça sert.",
    "c'est quoi html ?": "HTML, c'est le langage qui décrit la structure de toutes les pages web. Si une page web était une maison, HTML serait les murs et les portes. Les formulaires, ce sont les boîtes aux lettres — elles reçoivent et envoient des infos ! (^_^)",
}

const WILD_QUESTIONS = [
    "Et si tu devais inventer un formulaire pour lire les rêves — quels champs tu mettrais ? (~_~)",
    "Pourquoi les formulaires web ont-ils presque toujours un champ 'mot de passe' selon toi ? (o_O)",
    "Si un formulaire pouvait te parler, que te dirait-il quand tu laisses un champ vide ? (*_*)",
    "Imagine un monde sans formulaires HTML — comment tu créerais un compte sur une appli ? (-_-)",
]

const CHAT_CHIPS = [
    { label: "C'est quoi un formulaire ?", text: "c'est quoi un formulaire ?" },
    { label: "J'ai pas compris :-/", text: "j'ai pas compris :-/" },
    { label: '~_~ Question folle', text: 'question folle', wild: true },
    { label: 'Aide-moi', text: 'aide moi' },
]

// ── Audio Helper ──
const speakText = (htmlText) => {
    if (!('speechSynthesis' in window)) return
    const cleanText = htmlText.replace(/<[^>]+>/g, '').replace(/\(.*?_.*?\)/g, '')
    window.speechSynthesis.cancel()
    const msg = new SpeechSynthesisUtterance(cleanText)
    msg.lang = 'fr-FR'
    msg.rate = 1.05
    msg.pitch = 1.1
    const voices = window.speechSynthesis.getVoices()
    const frVoice = voices.find(v => v.lang.startsWith('fr') && v.name.includes('Google')) ||
        voices.find(v => v.lang.startsWith('fr'))
    if (frVoice) msg.voice = frVoice
    window.speechSynthesis.speak(msg)
}

// ── SVG App Cards ──
function InstagramCard() {
    return (
        <svg viewBox="0 0 200 155" xmlns="http://www.w3.org/2000/svg" width="100%">
            <defs>
                <linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f09433" /><stop offset="30%" stopColor="#e6683c" />
                    <stop offset="55%" stopColor="#dc2743" /><stop offset="80%" stopColor="#cc2366" />
                    <stop offset="100%" stopColor="#bc1888" />
                </linearGradient>
            </defs>
            <rect width="200" height="155" fill="url(#ig)" />
            <rect x="0" y="0" width="200" height="155" fill="rgba(0,0,0,.15)" />
            <rect x="55" y="10" width="90" height="135" rx="14" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.15)" strokeWidth=".5" />
            <rect x="80" y="28" width="40" height="40" rx="10" fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="2" />
            <circle cx="100" cy="48" r="10" fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="2" />
            <circle cx="113" cy="36" r="2.5" fill="rgba(255,255,255,.85)" />
            <rect className="field-input" x="65" y="80" width="70" height="12" rx="6" fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.25)" strokeWidth=".5" />
            <text className="ui-text" x="100" y="90" textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="6.5" fill="rgba(255,255,255,.7)">Nom d'utilisateur</text>
            <text className="code-elem" x="100" y="89" textAnchor="middle" fontSize="5.5" fill="#1DB97A" fontFamily="JetBrains Mono" fontWeight="800">&lt;input type="text"&gt;</text>
            <rect className="field-input" x="65" y="97" width="70" height="12" rx="6" fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.25)" strokeWidth=".5" />
            <text className="ui-text" x="100" y="107" textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="6.5" fill="rgba(255,255,255,.7)">Mot de passe</text>
            <text className="code-elem" x="100" y="106" textAnchor="middle" fontSize="5.5" fill="#1DB97A" fontFamily="JetBrains Mono" fontWeight="800">&lt;input type="password"&gt;</text>
            <rect x="67" y="114" width="66" height="12" rx="6" fill="rgba(255,255,255,.35)" />
            <text x="100" y="123.5" textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="7" fill="#c13584" fontWeight="800">Se connecter</text>
            <text x="100" y="140" textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="8" fill="rgba(255,255,255,.9)" fontWeight="800">Instagram</text>
        </svg>
    )
}

function TikTokCard() {
    return (
        <svg viewBox="0 0 200 155" xmlns="http://www.w3.org/2000/svg" width="100%">
            <rect width="200" height="155" fill="#010101" />
            <rect x="55" y="10" width="90" height="135" rx="14" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth=".5" />
            <text x="100" y="45" textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="22" fill="white" fontWeight="900">TikTok</text>
            <rect x="18" y="18" width="8" height="8" rx="2" fill="#fe2c55" opacity=".9" />
            <rect x="174" y="18" width="8" height="8" rx="2" fill="#25f4ee" opacity=".9" />
            <rect className="field-input" x="66" y="58" width="68" height="13" rx="6.5" fill="#2a2a2a" stroke="#3a3a3a" strokeWidth=".5" />
            <text className="ui-text" x="100" y="68" textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="6.5" fill="#666">Téléphone / Email</text>
            <text className="code-elem" x="100" y="67" textAnchor="middle" fontSize="5.5" fill="#1DB97A" fontFamily="JetBrains Mono" fontWeight="800">&lt;input type="email"&gt;</text>
            <rect className="field-input" x="66" y="76" width="68" height="13" rx="6.5" fill="#2a2a2a" stroke="#3a3a3a" strokeWidth=".5" />
            <text className="ui-text" x="100" y="86" textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="6.5" fill="#666">Mot de passe</text>
            <text className="code-elem" x="100" y="85" textAnchor="middle" fontSize="5.5" fill="#1DB97A" fontFamily="JetBrains Mono" fontWeight="800">&lt;input type="password"&gt;</text>
            <rect x="68" y="95" width="64" height="13" rx="6.5" fill="#fe2c55" />
            <text x="100" y="105" textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="7" fill="white" fontWeight="800">Connexion</text>
            <line x1="70" y1="115" x2="90" y2="115" stroke="#333" strokeWidth=".5" />
            <text x="100" y="119" textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="7" fill="#555">ou</text>
            <line x1="110" y1="115" x2="130" y2="115" stroke="#333" strokeWidth=".5" />
            <rect x="68" y="122" width="28" height="10" rx="5" fill="#1877f2" />
            <rect x="100" y="122" width="28" height="10" rx="5" fill="#1a1a1a" stroke="#333" strokeWidth=".5" />
            <text x="82" y="130" textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="6" fill="white">Facebook</text>
            <text x="114" y="130" textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="6" fill="#555">Google</text>
            <text x="100" y="148" textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="6.5" fill="#444">Pas encore de compte ? S'inscrire</text>
        </svg>
    )
}

function WhatsAppCard() {
    return (
        <svg viewBox="0 0 200 155" xmlns="http://www.w3.org/2000/svg" width="100%">
            <defs>
                <linearGradient id="wa" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#075e54" /><stop offset="100%" stopColor="#1a9e8f" />
                </linearGradient>
            </defs>
            <rect width="200" height="155" fill="#e5ddd5" />
            <rect x="32" y="20" width="136" height="115" rx="10" fill="white" />
            <rect x="32" y="20" width="136" height="24" rx="10" fill="url(#wa)" />
            <rect x="32" y="32" width="136" height="12" fill="url(#wa)" />
            <circle cx="50" cy="32" r="10" fill="rgba(255,255,255,.2)" />
            <text x="64" y="29" fontFamily="Outfit,sans-serif" fontSize="7" fill="white" fontWeight="700">Groupe Terminale S</text>
            <text x="64" y="38" fontFamily="Outfit,sans-serif" fontSize="6" fill="rgba(255,255,255,.7)">276 membres</text>
            <rect x="40" y="50" width="120" height="75" rx="8" fill="#dcf8c6" />
            <text x="100" y="63" textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="7.5" fill="#075e54" fontWeight="800">SONDAGE</text>
            <text x="100" y="74" textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="7" fill="#333">Soirée révisions vendredi ?</text>
            <rect className="ui-text" x="46" y="79" width="108" height="13" rx="6.5" fill="#25d366" opacity=".15" />
            <circle className="field-input" cx="56" cy="85.5" r="4" fill="none" stroke="#25d366" strokeWidth="1.5" />
            <circle className="ui-text" cx="56" cy="85.5" r="2" fill="#25d366" />
            <text className="ui-text" x="64" y="89" fontFamily="Outfit,sans-serif" fontSize="6.5" fill="#333">Oui ! Je suis là (^_^)</text>
            <text className="code-elem" x="100" y="88" textAnchor="middle" fontSize="5.5" fill="#1DB97A" fontFamily="JetBrains Mono" fontWeight="800">&lt;input type="radio" value="oui"&gt;</text>
            <rect className="ui-text" x="46" y="96" width="108" height="13" rx="6.5" fill="white" stroke="#ddd" strokeWidth=".5" />
            <circle className="field-input" cx="56" cy="102.5" r="4" fill="none" stroke="#999" strokeWidth="1.5" />
            <text className="ui-text" x="64" y="106" fontFamily="Outfit,sans-serif" fontSize="6.5" fill="#666">Non, autre jour</text>
            <text className="code-elem" x="100" y="105" textAnchor="middle" fontSize="5.5" fill="#1DB97A" fontFamily="JetBrains Mono" fontWeight="800">&lt;input type="radio" value="non"&gt;</text>
            <rect className="ui-text" x="46" y="113" width="108" height="13" rx="6.5" fill="white" stroke="#ddd" strokeWidth=".5" />
            <circle className="field-input" cx="56" cy="119.5" r="4" fill="none" stroke="#999" strokeWidth="1.5" />
            <text className="ui-text" x="64" y="123" fontFamily="Outfit,sans-serif" fontSize="6.5" fill="#666">Peut-être...</text>
            <text className="code-elem" x="100" y="122" textAnchor="middle" fontSize="5.5" fill="#1DB97A" fontFamily="JetBrains Mono" fontWeight="800">&lt;input type="radio" value="maybe"&gt;</text>
            <text x="100" y="145" textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="7.5" fill="#075e54" fontWeight="700">WhatsApp</text>
        </svg>
    )
}

// ── Main IntroPage ──
export default function IntroPage({ user }) {
    const navigate = useNavigate()
    const scrollRef = useRef(null)
    const voiceModeRef = useRef(false)

    // ── State ──
    const [phase, setPhase] = useState(1)
    const [selected, setSelected] = useState(user?.isAdmin ? new Set([0, 1, 2]) : new Set())
    const [xp, setXp] = useState(0)
    const [formDone, setFormDone] = useState(!!user?.isAdmin)
    const [mcqDone, setMcqDone] = useState(!!user?.isAdmin)
    const [defRevealed, setDefRevealed] = useState(!!user?.isAdmin)
    const [ctaVisible, setCtaVisible] = useState(!!user?.isAdmin)
    const [activeTab, setActiveTab] = useState('mine')
    const [voiceMode, setVoiceMode] = useState(false)
    const [formReady, setFormReady] = useState(false)

    // Form fields
    const [fPrenom, setFPrenom] = useState('')
    const [fClasse, setFClasse] = useState('')
    const [fNiveau, setFNiveau] = useState('')
    const [fInterets, setFInterets] = useState([])
    const [fDispo, setFDispo] = useState('')
    const [fEmail, setFEmail] = useState('')
    const [formSubmitted, setFormSubmitted] = useState(false)

    // MCQ
    const [mcqAnswer, setMcqAnswer] = useState(null)

    // Chat
    const [chatMessages, setChatMessages] = useState([
        { type: 'system', text: `Bienvenue ${user?.name || 'toi'} ! (^_^)` },
        { type: 'bot', html: `Salut ${user?.name || 'toi'} ! Pas de cours aujourd'hui.<br><br>Commence par regarder ces 3 interfaces — et coche celles qui te semblent familières. Pas de bonne ou mauvaise réponse. (^_^)` },
    ])
    const [chatLoading, setChatLoading] = useState(false)

    // ── Helpers ──
    const addXP = useCallback((n) => setXp(prev => prev + n), [])

    const addChatMsg = useCallback((msg) => {
        setChatMessages(prev => [...prev, msg])
    }, [])

    const addBotResponse = useCallback((text, isSoc = false) => {
        setChatLoading(true)
        setTimeout(() => {
            setChatLoading(false)
            addChatMsg({ type: isSoc ? 'soc' : 'bot', html: text })
            if (voiceModeRef.current) speakText(text)
        }, 900)
    }, [addChatMsg])

    const handleChatSend = useCallback((text) => {
        addChatMsg({ type: 'user', text })
        const key = text.toLowerCase()
        const isFolle = key.includes('folle')
        let response = CHAT_RESPONSES[key]
        if (isFolle || !response) {
            response = WILD_QUESTIONS[Math.floor(Math.random() * WILD_QUESTIONS.length)]
        }
        addBotResponse(response || "Très bonne observation ! Continue d'explorer (^_^)", isFolle)
    }, [addChatMsg, addBotResponse])

    // ── Voice toggle ──
    const toggleVoice = () => {
        const next = !voiceModeRef.current
        voiceModeRef.current = next
        setVoiceMode(next)
        if (!next) window.speechSynthesis.cancel()
    }
    const stopVoice = () => window.speechSynthesis.cancel()

    // ── Field click explanations ──
    const handleFieldClick = (field) => {
        const explanations = {
            prenom:   `(^_^) Ton prénom — tu l'as tapé dans le premier champ ! En HTML c'est un <code>&lt;input type="text"&gt;</code>. Cette balise accepte n'importe quel texte. C'est la plus courante sur tout le web.`,
            classe:   `Ta classe — encore un <code>&lt;input type="text"&gt;</code>. Même balise, contenu différent. Le formulaire reçoit juste du texte, il ne sait pas si c'est un prénom ou une classe !`,
            niveau:   `Tu as choisi ton niveau avec un bouton rond. En HTML c'est un <code>&lt;input type="radio"&gt;</code>. Les boutons radio autorisent un seul choix parmi plusieurs — essaie : tu ne peux pas cocher deux niveaux à la fois.`,
            interets: `Tes centres d'intérêts — les cases à cocher s'appellent <code>&lt;input type="checkbox"&gt;</code>. Contrairement aux radio, tu peux en cocher plusieurs. C'est pour ça que les deux existent !`,
            dispo:    `Ta disponibilité vient d'une liste déroulante : c'est une balise <code>&lt;select&gt;</code> avec des <code>&lt;option&gt;</code> à l'intérieur. Pratique quand les choix sont connus à l'avance.`,
            email:    `Ton email — c'est un <code>&lt;input type="email"&gt;</code>, un type spécial ! Il vérifie automatiquement le format et bloque si tu oublies le "@". C'est le navigateur qui fait ce contrôle, pas toi !`,
        }
        addBotResponse(explanations[field] || '(^_^) Bonne exploration !')
    }

    // ── Phase Navigation ──
    const goPhase = (n) => {
        setPhase(n)
        setFormReady(false)
        if (scrollRef.current) scrollRef.current.scrollTop = 0
        if (n === 2) {
            addChatMsg({ type: 'system', text: 'Activité 2 — Situation réelle' })
            addBotResponse("(^_^) Bien joué ! Maintenant, je vais te mettre dans une vraie situation. Lis bien ce que je t'envoie...")
            setTimeout(() => {
                addBotResponse("C'est lundi matin. Tu arrives au lycée et tu vois une affiche : le Club Informatique ouvre ses inscriptions en ligne. Tu sors ton téléphone... et tu tombes sur quelque chose. Regarde.")
                setTimeout(() => setFormReady(true), 1000)
            }, 1800)
        }
    }

    // ── Phase 1: App card selection ──
    const handlePick = (n) => {
        setSelected(prev => {
            const next = new Set(prev)
            const wasSelected = next.has(n)
            if (wasSelected) { next.delete(n); addXP(-10) }
            else { next.add(n); addXP(10) }

            if (next.size === 1 && !wasSelected) {
                addBotResponse("(^_^) Parfait. Tu viens de t'identifier, de chercher ou de voter. Mais as-tu remarqué ce qui se passe \"en dessous\" quand tu appuies sur le bouton ? Regarde les zones lumineuses.")
            }
            if (next.size === 2 && !wasSelected) {
                addBotResponse("(^_^) S'inscrire, voter, répondre... As-tu remarqué le point commun visuel entre toutes ces actions ?")
            }
            if (next.size === 3 && !wasSelected) {
                addBotResponse("(?_?) Un sans faute ! Ces 3 écrans n'ont pourtant rien à voir visuellement, et pourtant, ils cachent exactement la même technologie de base.", true)
            }
            return next
        })
    }

    // ── Phase 2: Form ──
    const handleFormSubmit = () => {
        setFormSubmitted(true)
        addXP(20)
        addBotResponse("(^_^) Tu viens d'envoyer tes informations ! Dans une vraie page, elles partiraient vers un serveur. Maintenant une petite question — à toi de jouer.")
    }

    const handleInteretToggle = (val) => {
        setFInterets(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])
    }

    // ── MCQ ──
    const handleMCQ = (idx, correct) => {
        if (mcqDone) return
        setMcqDone(true)
        setMcqAnswer({ idx, correct })
        if (correct) {
            addXP(30)
            setTimeout(() => setDefRevealed(true), 600)
            addBotResponse("(^_^) Exactement ! Un formulaire HTML est bien une zone interactive de collecte d'informations. Tu viens de découvrir la définition par l'expérience — c'est la meilleure façon d'apprendre.")
        } else {
            setTimeout(() => setDefRevealed(true), 1200)
            addBotResponse("Pas tout à fait ! (-_-) Regarde la réponse B — un formulaire HTML est une zone <em>interactive sur le web</em>. Ce n'est pas du papier, et ce n'est pas un programme qui calcule. Regarde maintenant la définition complète !")
        }
    }

    // ── Unlock CTA ──
    const handleUnlockCTA = () => {
        setCtaVisible(true)
        addXP(20)
        addChatMsg({ type: 'system', text: `(^_^) Phase 1 complète ! +${xp + 20} XP` })
        addBotResponse(`(^_^) Félicitations ${user?.name || 'toi'} ! Tu as :<br>• Reconnu des formulaires dans ta vie quotidienne<br>• Rempli un vrai formulaire interactif<br>• Trouvé toi-même la définition<br>• Visualisé d'autres exemples<br><br>Tu es prêt pour la Phase 2 — les Fondations HTML !`)
    }

    const handleCelebrate = () => {
        addBotResponse("(^_^) C'est parti pour les Fondations HTML ! Tu vas voir les balises une par une — avec des visualisations et des défis. La magie commence maintenant !")
        setTimeout(() => navigate('/foundations'), 1500)
    }

    // Tab switch
    const handleTabSwitch = (name) => {
        setActiveTab(name)
        if (name === 'others') {
            addBotResponse("(^_^) Tu vois — recherche Google, Uber Eats, formulaire de contact... Même principe partout ! Dans les prochaines phases tu apprendras à construire ça toi-même.")
        }
    }

    // ── Render ──
    return (
        <AppShell
            user={user}
            currentStep={1}
            completedSteps={[]}
            chatContent={
                <ChatPanel2
                    messages={chatMessages}
                    loading={chatLoading}
                    phaseLabel="Phase Découverte"
                    userName={user?.name || 'Élève'}
                    chips={CHAT_CHIPS}
                    onSend={handleChatSend}
                />
            }
        >
            {/* ═══ HERO ═══ */}
            <div className="disc-hero">
                <div className="disc-hero-bg" />
                <div className="disc-hero-glow1" />
                <div className="disc-hero-glow2" />
                <div className="disc-hero-inner">
                    <div className="disc-hero-top">
                        <div className="disc-hero-phase">
                            <div className="disc-hero-phase-dot" />Phase 1 · Découvrir
                        </div>
                        <div className="disc-hero-xp">XP <span className="disc-hero-xp-n">{xp}</span></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                                onClick={toggleVoice}
                                title={voiceMode ? 'Désactiver la voix' : 'Activer la voix'}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '9px 18px', borderRadius: '24px',
                                    border: voiceMode
                                        ? '1.5px solid rgba(29,185,122,0.5)'
                                        : '1.5px solid rgba(255,255,255,0.12)',
                                    background: voiceMode
                                        ? 'linear-gradient(135deg, rgba(29,185,122,0.18), rgba(14,165,196,0.12))'
                                        : 'rgba(255,255,255,0.05)',
                                    color: voiceMode ? '#1DB97A' : 'rgba(255,255,255,0.55)',
                                    fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                                    fontFamily: 'Outfit, sans-serif',
                                    boxShadow: voiceMode ? '0 0 16px rgba(29,185,122,0.25)' : 'none',
                                    transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                                    outline: 'none', whiteSpace: 'nowrap',
                                }}
                            >
                                {voiceMode
                                    ? <><FiVolume2 size={16} /> Voix activée</>
                                    : <><FiVolumeX size={16} /> Activer la voix</>
                                }
                            </button>
                            {voiceMode && (
                                <button
                                    onClick={stopVoice}
                                    title="Arrêter la lecture en cours"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '7px',
                                        padding: '9px 16px', borderRadius: '24px',
                                        border: '1.5px solid rgba(240,88,72,0.4)',
                                        background: 'rgba(240,88,72,0.1)',
                                        color: '#f05848',
                                        fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                                        fontFamily: 'Outfit, sans-serif',
                                        transition: 'all 0.2s', outline: 'none',
                                    }}
                                >
                                    <FiSquare size={14} /> Stop
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="disc-hero-body">
                        <div className="disc-hero-txt">
                            <div className="disc-hero-eyebrow">(^_^) Salut {user?.name || 'toi'} — content de te voir !</div>
                            <div className="disc-hero-title">
                                Tu l'utilises déjà.<br />
                                <span className="disc-g1t">Sans le savoir.</span>
                            </div>
                            <div className="disc-hero-sub">
                                TikTok, Instagram, WhatsApp... chaque fois que tu tapes, tu cliques, tu envoies — tu utilises la <strong>même technologie cachée</strong>. Aujourd'hui tu vas découvrir laquelle, et surtout : <strong>apprendre à la recréer toi-même.</strong>
                            </div>
                            {/* Progress dots */}
                            <div className="disc-hero-dots">
                                <div className={`disc-pdot ${phase === 1 ? 'active' : phase > 1 ? 'done' : ''}`} />
                                <div className={`disc-pdot ${phase === 2 ? 'active' : phase > 2 ? 'done' : ''}`} />
                                <div className={`disc-pdot ${defRevealed ? 'active' : ''}`} />
                                <div className={`disc-pdot ${ctaVisible ? 'active' : ''}`} />
                            </div>
                        </div>
                        <div className="disc-bot-card">
                            <div className="disc-bc-eyes">^_^</div>
                            <div className="disc-bc-mouth">hello</div>
                            <div className="disc-bc-dot" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="disc-scroll" ref={scrollRef}>
                {/* ═══ PHASE 1 — App Recognition ═══ */}
                {phase === 1 && (
                    <div className="disc-phase">
                        <div className="disc-p1-q">
                            Test de reconnaissance :<br />
                            Parmi ces trois écrans, coche ceux dont tu t'es <span className="disc-g2t">réellement servi cette semaine.</span>
                        </div>
                        <div className="disc-p1-sub">Faisons un test rapide. Il n'y a aucun piège.</div>

                        <div className={`disc-app-grid ${selected.size > 0 ? 'show-fields' : ''}`}>
                            {[
                                { id: 1, Card: InstagramCard },
                                { id: 2, Card: TikTokCard },
                                { id: 3, Card: WhatsAppCard },
                            ].map(({ id, Card }) => (
                                <div
                                    key={id}
                                    className={`disc-acard ${selected.has(id) ? 'sel' : ''}`}
                                    onClick={() => handlePick(id)}
                                >
                                    <div className="disc-acard-scanner" />
                                    <div className="disc-acard-check">{selected.has(id) ? '✓' : ''}</div>
                                    <Card />
                                </div>
                            ))}
                        </div>

                        {/* Reveal banner */}
                        {selected.size > 0 && (
                            <div className="disc-reveal-banner">
                                <div className="disc-rb-face">
                                    {selected.size === 3 ? '(!)' : '(^)'}
                                </div>
                                <div className="disc-rb-txt">
                                    {selected.size < 3 ? (
                                        <>
                                            <span className="disc-rb-eyebrow">BONNE PIOCHE !</span>
                                            Tu as reconnu {selected.size} interface{selected.size > 1 ? 's' : ''}. Regarde bien les zones vertes — tu vois ce qu'elles ont en commun ? Coche les autres pour découvrir le secret complet.
                                        </>
                                    ) : (
                                        <>
                                            <span className="disc-rb-eyebrow">(!) SECRET DEBLOQUE</span>
                                            3 apps, 3 styles complètement différents... <strong>mais une seule et même technologie sous le capot.</strong> Ces champs que tu remplis chaque jour ? C'est du HTML. Et aujourd'hui, tu vas apprendre à les construire toi-même.
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="disc-p1-next">
                            <button
                                className={`disc-nbtn ${selected.size === 0 ? 'off' : ''}`}
                                onClick={() => goPhase(2)}
                                disabled={selected.size === 0}
                            >
                                Compris ! Je veux voir comment ça marche &nbsp;›
                            </button>
                        </div>
                    </div>
                )}

                {/* ═══ PHASE 2 — Form + MCQ + Definition ═══ */}
                {phase === 2 && (
                    <div className="disc-phase">
                        {!formReady && (
                            <div className="disc-situation-intro" style={{ textAlign: 'center', opacity: 0.7 }}>
                                (^_^) Le bot prépare la situation...
                            </div>
                        )}

                        {/* Browser mockup — apparaît après que le bot ait posé le décor */}
                        {formReady && (<div className="disc-browser-wrap">
                            <div className="disc-browser-bar">
                                <div className="disc-b-dots">
                                    <div className="disc-b-dot" style={{ background: '#ff6058' }} />
                                    <div className="disc-b-dot" style={{ background: '#febc2e' }} />
                                    <div className="disc-b-dot" style={{ background: '#28c840' }} />
                                </div>
                                <div className="disc-b-url">lycee-mendel.edu/club-info/inscription</div>
                            </div>
                            <div className="disc-browser-content">
                                <div className="disc-form-card">
                                    <div className="disc-fc-head">
                                        <div className="disc-fc-head-icon">[+]</div>
                                        <div className="disc-fc-head-txt">
                                            <p>Inscription — Club Informatique</p>
                                            <span>Lycée Mendel · Année 2024–2025</span>
                                        </div>
                                    </div>
                                    <div className="disc-fc-body">
                                        <div className="disc-fc-field">
                                            <label>Prénom</label>
                                            <input className="disc-fc-input" placeholder="Ton prénom..." value={fPrenom} onChange={e => setFPrenom(e.target.value)} />
                                        </div>
                                        <div className="disc-fc-field">
                                            <label>Classe</label>
                                            <input className="disc-fc-input" placeholder="Ex: 2nde B..." value={fClasse} onChange={e => setFClasse(e.target.value)} />
                                        </div>
                                        <div className="disc-fc-field full">
                                            <label>Ton niveau en informatique</label>
                                            <div className="disc-radio-opts">
                                                {['Débutant', 'Intermédiaire', 'Expert'].map(niv => (
                                                    <label className="disc-ropt" key={niv}>
                                                        <input type="radio" name="niv" value={niv} checked={fNiveau === niv} onChange={() => setFNiveau(niv)} />
                                                        {niv}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="disc-fc-field full">
                                            <label>Ce qui t'intéresse (plusieurs choix)</label>
                                            <div className="disc-check-opts">
                                                {['Sites web', 'Jeux vidéo', 'Robotique', 'Intelligence artificielle'].map(item => (
                                                    <label className="disc-copt" key={item}>
                                                        <input type="checkbox" checked={fInterets.includes(item)} onChange={() => handleInteretToggle(item)} />
                                                        {item}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="disc-fc-field">
                                            <label>Disponibilité</label>
                                            <select className="disc-fc-select" value={fDispo} onChange={e => setFDispo(e.target.value)}>
                                                <option value="">Choisir un jour...</option>
                                                <option>Lundi soir</option>
                                                <option>Mercredi après-midi</option>
                                                <option>Vendredi soir</option>
                                                <option>Samedi matin</option>
                                            </select>
                                        </div>
                                        <div className="disc-fc-field">
                                            <label>Email</label>
                                            <input className="disc-fc-input" type="email" placeholder="ton@email.com" value={fEmail} onChange={e => setFEmail(e.target.value)} />
                                        </div>
                                        <button className="disc-fc-submit" onClick={handleFormSubmit}>
                                            Envoyer mon inscription (^_^)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>)}

                        {/* MCQ Zone */}
                        {formSubmitted && (
                            <div className="disc-mcq-zone">
                                <div className="disc-mcq-q">Après cette expérience — <span className="disc-g2t">comment définirais-tu un formulaire ?</span></div>
                                <div className="disc-mcq-opts">
                                    {[
                                        { key: 'A', text: "Un document papier à remplir pour une administration", correct: false },
                                        { key: 'B', text: "Une zone interactive sur une page web permettant de collecter des informations", correct: true },
                                        { key: 'C', text: "Un programme qui calcule automatiquement des résultats", correct: false },
                                    ].map((opt, idx) => {
                                        let cls = 'disc-mopt'
                                        if (mcqAnswer) {
                                            if (mcqAnswer.idx === idx && mcqAnswer.correct) cls += ' correct'
                                            else if (mcqAnswer.idx === idx && !mcqAnswer.correct) cls += ' wrong'
                                            else if (opt.correct && mcqDone) cls += ' correct'
                                        }
                                        return (
                                            <button
                                                key={opt.key}
                                                className={cls}
                                                onClick={() => handleMCQ(idx, opt.correct)}
                                                disabled={mcqDone}
                                            >
                                                <div className="disc-mkey">{opt.key}</div>
                                                {opt.text}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Definition reveal */}
                        {defRevealed && (
                            <div className="disc-def-reveal">
                                <div className="disc-def-banner">
                                    <div className="disc-def-glow" />
                                    <div className="disc-def-label">DÉFINITION OFFICIELLE — RÉVÉLÉE PAR L'EXPÉRIENCE</div>
                                    <div className="disc-def-txt">
                                        Un <span className="disc-hl">formulaire HTML</span> est un espace de saisie permettant de <span className="disc-hl2">collecter des informations</span> auprès des utilisateurs. Il peut contenir des champs texte, des cases à cocher, des boutons radio, des menus déroulants et des boutons d'envoi.
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="disc-tabs-wrap">
                                    <div className="disc-tabs-nav">
                                        <button className={`disc-tab-btn ${activeTab === 'mine' ? 'on' : ''}`} onClick={() => handleTabSwitch('mine')}>Ce que tu as rempli</button>
                                        <button className={`disc-tab-btn ${activeTab === 'others' ? 'on' : ''}`} onClick={() => handleTabSwitch('others')}>D'autres formulaires</button>
                                    </div>

                                    {activeTab === 'mine' && (
                                        <div className="disc-tab-pane">
                                            <div className="disc-data-card">
                                                <div className="disc-dc-head">
                                                    <div className="disc-dc-av">{(fPrenom || '?')[0].toUpperCase()}</div>
                                                    <div>
                                                        <div className="disc-dc-name">{fPrenom || '—'}</div>
                                                        <div className="disc-dc-role">Candidat · Club Informatique 2024</div>
                                                    </div>
                                                </div>
                                                <div className="disc-dc-rows">
                                                    <div className="disc-dc-row disc-dc-row--click" onClick={() => handleFieldClick('prenom')} title="Clique pour en savoir plus">
                                                        <span className="disc-dc-key">Prénom</span><span className="disc-dc-val">{fPrenom || '—'}</span><span className="disc-dc-hint">(^)</span>
                                                    </div>
                                                    <div className="disc-dc-row disc-dc-row--click" onClick={() => handleFieldClick('classe')} title="Clique pour en savoir plus">
                                                        <span className="disc-dc-key">Classe</span><span className="disc-dc-val">{fClasse || '—'}</span><span className="disc-dc-hint">(^)</span>
                                                    </div>
                                                    <div className="disc-dc-row disc-dc-row--click" onClick={() => handleFieldClick('niveau')} title="Clique pour en savoir plus">
                                                        <span className="disc-dc-key">Niveau</span><span className="disc-dc-val disc-g1t">{fNiveau || '—'}</span><span className="disc-dc-hint">(^)</span>
                                                    </div>
                                                    <div className="disc-dc-row disc-dc-row--click" onClick={() => handleFieldClick('interets')} title="Clique pour en savoir plus">
                                                        <span className="disc-dc-key">Intérêts</span><span className="disc-dc-val" style={{ fontSize: '11px' }}>{fInterets.length > 0 ? fInterets.join(', ') : '—'}</span><span className="disc-dc-hint">(^)</span>
                                                    </div>
                                                    <div className="disc-dc-row disc-dc-row--click" onClick={() => handleFieldClick('dispo')} title="Clique pour en savoir plus">
                                                        <span className="disc-dc-key">Disponibilité</span><span className="disc-dc-val">{fDispo || '—'}</span><span className="disc-dc-hint">(^)</span>
                                                    </div>
                                                    <div className="disc-dc-row disc-dc-row--click" onClick={() => handleFieldClick('email')} title="Clique pour en savoir plus">
                                                        <span className="disc-dc-key">Email</span><span className="disc-dc-val" style={{ color: 'var(--teal-dark)' }}>{fEmail || '—'}</span><span className="disc-dc-hint">(^)</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="disc-info-note teal">
                                                <strong>(^_^) Clique sur chaque ligne</strong> pour découvrir la balise HTML qui se cache derrière chaque information que tu as remplie !
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'others' && (
                                        <div className="disc-tab-pane">
                                            <div className="disc-other-grid">
                                                <div className="disc-of-card">
                                                    <svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg" width="100%">
                                                        <rect width="160" height="100" fill="white" />
                                                        <text x="80" y="22" textAnchor="middle" fontFamily="Arial" fontSize="14" fontWeight="700">
                                                            <tspan fill="#4285f4">G</tspan><tspan fill="#ea4335">o</tspan><tspan fill="#fbbc05">o</tspan><tspan fill="#4285f4">g</tspan><tspan fill="#34a853">l</tspan><tspan fill="#ea4335">e</tspan>
                                                        </text>
                                                        <rect x="20" y="30" width="120" height="22" rx="11" fill="white" stroke="#ddd" strokeWidth="1" />
                                                        <text x="45" y="45" fontFamily="Arial" fontSize="8" fill="#999">Rechercher...</text>
                                                    </svg>
                                                    <div className="disc-of-label">Recherche Google</div>
                                                </div>
                                                <div className="disc-of-card">
                                                    <svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg" width="100%">
                                                        <rect width="160" height="100" fill="#1c1c1c" />
                                                        <text x="80" y="20" textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="13" fill="white" fontWeight="900">Uber Eats</text>
                                                        <rect x="12" y="26" width="136" height="14" rx="7" fill="#2d2d2d" />
                                                        <text x="80" y="37" textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="7" fill="#666">Adresse de livraison...</text>
                                                        <rect x="12" y="81" width="136" height="12" rx="6" fill="#06C167" />
                                                        <text x="80" y="90.5" textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="7" fill="white" fontWeight="800">Passer commande</text>
                                                    </svg>
                                                    <div className="disc-of-label">Commande Uber Eats</div>
                                                </div>
                                                <div className="disc-of-card">
                                                    <svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg" width="100%">
                                                        <rect width="160" height="100" fill="#f8f9fa" />
                                                        <text x="80" y="16" textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="9" fill="#333" fontWeight="800">Nous contacter</text>
                                                        <text x="16" y="28" fontFamily="Outfit,sans-serif" fontSize="7" fill="#999">Nom</text>
                                                        <rect x="12" y="30" width="136" height="11" rx="5.5" fill="white" stroke="#ddd" strokeWidth=".5" />
                                                        <text x="16" y="50" fontFamily="Outfit,sans-serif" fontSize="7" fill="#999">Email</text>
                                                        <rect x="12" y="52" width="136" height="11" rx="5.5" fill="white" stroke="#ddd" strokeWidth=".5" />
                                                        <text x="16" y="70" fontFamily="Outfit,sans-serif" fontSize="7" fill="#999">Message</text>
                                                        <rect x="12" y="72" width="136" height="18" rx="5.5" fill="white" stroke="#ddd" strokeWidth=".5" />
                                                    </svg>
                                                    <div className="disc-of-label">Formulaire de contact</div>
                                                </div>
                                            </div>
                                            <div className="disc-info-note viola">
                                                <strong>(^_^) Tu les reconnais ?</strong> Recherche, commande, contact... Ce sont tous des formulaires HTML. Même principe, contextes différents.
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                                    <button className="disc-nbtn" onClick={handleUnlockCTA}>(^_^) J'ai tout compris — on continue !</button>
                                </div>
                            </div>
                        )}

                        {/* CTA Final */}
                        {ctaVisible && (
                            <div className="disc-cta-section">
                                <div className="disc-cta-card" onClick={handleCelebrate}>
                                    <div className="disc-cta-icon">[→]</div>
                                    <div className="disc-cta-txt">
                                        <p>C'est compris, on passe aux Fondations !</p>
                                        <span>Tu vas maintenant apprendre les balises HTML une par une (^_^)</span>
                                    </div>
                                    <div className="disc-cta-arr">›</div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppShell>
    )
}
