import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Lottie from 'lottie-react'
import { HiOutlineEye, HiOutlineXMark, HiOutlineArrowRight, HiOutlineQuestionMarkCircle, HiOutlineLightBulb } from 'react-icons/hi2'
import helloAnimation from '../assets/animations/hello-robot.json'
import ThinkingRobot from '../components/ThinkingRobot'

// SVG du menu de restaurant
function MenuSVG() {
    return (
        <svg viewBox="0 0 280 360" className="menu-svg" xmlns="http://www.w3.org/2000/svg">
            {/* Fond de la carte */}
            <rect x="0" y="0" width="280" height="360" rx="16" fill="#FFF8F0" stroke="#E8D5B7" strokeWidth="2" />
            <rect x="0" y="0" width="280" height="60" rx="16" fill="#8B4513" />
            <rect x="0" y="16" width="280" height="44" fill="#8B4513" />

            {/* Titre */}
            <text x="140" y="38" textAnchor="middle" fill="#FFF8F0" fontSize="18" fontWeight="bold" fontFamily="serif">🍽️ MENU DU JOUR</text>

            {/* Section Entrées - comme les Radio buttons */}
            <text x="20" y="85" fill="#8B4513" fontSize="13" fontWeight="bold">ENTRÉE (1 seul choix) 🔘</text>
            <circle cx="30" cy="105" r="6" fill="none" stroke="#D4A574" strokeWidth="2" />
            <circle cx="30" cy="105" r="3" fill="#D4A574" />
            <text x="45" y="109" fill="#5D3A1A" fontSize="11">Salade César</text>
            <circle cx="30" cy="128" r="6" fill="none" stroke="#D4A574" strokeWidth="2" />
            <text x="45" y="132" fill="#5D3A1A" fontSize="11">Soupe du jour</text>
            <circle cx="30" cy="151" r="6" fill="none" stroke="#D4A574" strokeWidth="2" />
            <text x="45" y="155" fill="#5D3A1A" fontSize="11">Bruschetta</text>

            {/* Section Accompagnements - comme les Checkboxes */}
            <text x="20" y="185" fill="#8B4513" fontSize="13" fontWeight="bold">ACCOMPAGNEMENTS (plusieurs) ☑️</text>
            <rect x="24" y="195" width="14" height="14" rx="3" fill="none" stroke="#D4A574" strokeWidth="2" />
            <text x="24" y="207" fill="#D4A574" fontSize="12" fontWeight="bold">✓</text>
            <text x="45" y="207" fill="#5D3A1A" fontSize="11">Frites</text>
            <rect x="24" y="218" width="14" height="14" rx="3" fill="none" stroke="#D4A574" strokeWidth="2" />
            <text x="24" y="230" fill="#D4A574" fontSize="12" fontWeight="bold">✓</text>
            <text x="45" y="230" fill="#5D3A1A" fontSize="11">Légumes grillés</text>
            <rect x="24" y="241" width="14" height="14" rx="3" fill="none" stroke="#D4A574" strokeWidth="2" />
            <text x="45" y="253" fill="#5D3A1A" fontSize="11">Riz basmati</text>

            {/* Section Boisson - comme un Select */}
            <text x="20" y="283" fill="#8B4513" fontSize="13" fontWeight="bold">BOISSON (liste) 📋</text>
            <rect x="24" y="292" width="200" height="28" rx="6" fill="#FFF" stroke="#D4A574" strokeWidth="1.5" />
            <text x="32" y="310" fill="#5D3A1A" fontSize="11">Jus d'orange ▾</text>

            {/* Section Demande spéciale - comme un Textarea */}
            <text x="20" y="340" fill="#8B4513" fontSize="13" fontWeight="bold">DEMANDE SPÉCIALE ✏️</text>
            <rect x="24" y="345" width="232" height="5" rx="2" fill="#F5EDE0" stroke="#D4A574" strokeWidth="1" />
        </svg>
    )
}

export default function IntroPage({ user }) {
    const [showPopup, setShowPopup] = useState(false)
    const [showSimpleExplanation, setShowSimpleExplanation] = useState(false)
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState(null)
    const [robotState, setRobotState] = useState('idle')
    const navigate = useNavigate()

    const handleAsk = async (e) => {
        e.preventDefault()
        if (!question.trim()) return

        setRobotState('thinking')
        setAnswer(null)

        try {
            // Simulation de délai pour l'animation
            await new Promise(r => setTimeout(r, 1500))

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ message: question })
            })
            const data = await res.json()

            setAnswer(data.response)
            setRobotState('speaking')

            // Revenir à idle après avoir parlé
            setTimeout(() => setRobotState('idle'), 5000)

        } catch (err) {
            console.error(err)
            setAnswer("Oups, je n'arrive pas à réfléchir... Réessaie plus tard ! 🤯")
            setRobotState('idle')
        }
    }

    const handleContinue = () => {
        navigate('/foundations')
    }

    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
    }

    const stagger = {
        visible: { transition: { staggerChildren: 0.15 } }
    }

    return (
        <div className="intro-page">
            {/* Particules de fond */}
            <div className="particles">
                {[...Array(10)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${3 + Math.random() * 4}px`,
                            height: `${3 + Math.random() * 4}px`,
                        }}
                        animate={{
                            y: [0, -40 - Math.random() * 60, 0],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: 8 + Math.random() * 8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: Math.random() * 4,
                        }}
                    />
                ))}
            </div>

            <div className="intro-content">
                {/* ═══════════════════════════════════════
                   SECTION 1 — Accueil animé
                   ═══════════════════════════════════════ */}
                <motion.section
                    className="intro-section intro-welcome"
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                >
                    <div className="intro-welcome-inner">
                        <div className="lottie-container">
                            <Lottie
                                animationData={helloAnimation}
                                loop={true}
                                style={{ width: '100%', maxWidth: 260 }}
                            />
                        </div>
                        <div className="intro-welcome-text">
                            <motion.h1
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5, duration: 0.7 }}
                            >
                                Salut <span className="accent">{user?.name || 'toi'}</span> ! 👋
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8, duration: 0.7 }}
                            >
                                Avant de commencer, cherchons d'abord à savoir...
                            </motion.p>
                            <motion.h2
                                className="intro-question"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.2, duration: 0.6 }}
                            >
                                Qu'est-ce qu'un <span className="highlight">formulaire</span> ?
                            </motion.h2>
                        </div>
                    </div>
                </motion.section>

                {/* ═══════════════════════════════════════
                   SECTION 2 — Définition + bouton Visualiser
                   ═══════════════════════════════════════ */}
                <motion.section
                    className="intro-section intro-definition"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={fadeUp}
                >
                    <div className="definition-card">
                        <div className="definition-icon">📖</div>
                        <motion.p
                            className="definition-text"
                            variants={fadeUp}
                        >
                            Un <strong>formulaire</strong> est un espace de saisie qui permet de
                            <strong> collecter des informations</strong> auprès d'un utilisateur.
                            Il peut contenir différents types de champs, tels que des
                            <strong> zones de texte</strong>, des <strong>cases à cocher</strong> ou
                            des <strong>menus déroulants</strong>, pour faciliter la saisie et
                            l'organisation des données.
                        </motion.p>
                        <motion.p className="definition-cta" variants={fadeUp}>
                            Pour visualiser, clique sur le bouton ci-dessous 👇
                        </motion.p>
                        <motion.button
                            className="btn-visualize"
                            onClick={() => setShowPopup(true)}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            variants={fadeUp}
                        >
                            <HiOutlineEye /> Visualiser un exemple
                        </motion.button>
                    </div>

                    {/* Bouton "J'ai pas compris" */}
                    <motion.button
                        className="btn-not-understood"
                        onClick={() => setShowSimpleExplanation(!showSimpleExplanation)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        variants={fadeUp}
                    >
                        <HiOutlineQuestionMarkCircle />
                        {showSimpleExplanation ? "OK merci, j'ai compris !" : "J'ai pas compris 🤔"}
                    </motion.button>

                    <AnimatePresence>
                        {showSimpleExplanation && (
                            <motion.div
                                className="simple-explanation"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <HiOutlineLightBulb className="bulb-icon" />
                                <div>
                                    <p><strong>En plus simple :</strong></p>
                                    <p>
                                        Tu connais quand tu crées un compte sur Instagram ou TikTok ?
                                        On te demande ton <strong>nom</strong>, ton <strong>e-mail</strong>,
                                        ton <strong>mot de passe</strong>... 📱
                                    </p>
                                    <p>
                                        Eh bien, <strong>tout ça c'est un formulaire !</strong> C'est
                                        juste une page web avec des cases à remplir pour envoyer des
                                        informations. Et toi, tu vas apprendre à <strong>créer ça
                                            toi-même</strong> avec du code HTML ! 💻
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.section>

                {/* ═══════════════════════════════════════
                   SECTION 3 — Analogie du restaurant
                   ═══════════════════════════════════════ */}
                <motion.section
                    className="intro-section intro-analogy"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={fadeUp}
                >
                    <motion.h2 className="analogy-title" variants={fadeUp}>
                        🍽️ Un formulaire, c'est comme un <span className="highlight">menu de restaurant</span> !
                    </motion.h2>

                    <div className="analogy-content">
                        <div className="analogy-text">
                            <motion.p variants={fadeUp}>
                                Tout comme un menu permet au client de <strong>choisir ce qu'il souhaite
                                    manger</strong> parmi différentes options (entrée, plat, dessert, boisson),
                                un formulaire permet à l'utilisateur de <strong>fournir des informations</strong> dans
                                différents champs.
                            </motion.p>

                            <motion.div className="analogy-mapping" variants={stagger}>
                                <motion.div className="mapping-item" variants={fadeUp}>
                                    <span className="mapping-menu">🔘 Entrée (1 seul choix)</span>
                                    <span className="mapping-arrow">→</span>
                                    <span className="mapping-form">Boutons radio</span>
                                </motion.div>
                                <motion.div className="mapping-item" variants={fadeUp}>
                                    <span className="mapping-menu">☑️ Accompagnements (plusieurs)</span>
                                    <span className="mapping-arrow">→</span>
                                    <span className="mapping-form">Cases à cocher</span>
                                </motion.div>
                                <motion.div className="mapping-item" variants={fadeUp}>
                                    <span className="mapping-menu">📋 Boisson (liste déroulante)</span>
                                    <span className="mapping-arrow">→</span>
                                    <span className="mapping-form">Menu déroulant (select)</span>
                                </motion.div>
                                <motion.div className="mapping-item" variants={fadeUp}>
                                    <span className="mapping-menu">✏️ Demande spéciale</span>
                                    <span className="mapping-arrow">→</span>
                                    <span className="mapping-form">Zone de texte</span>
                                </motion.div>
                            </motion.div>
                        </div>

                        <motion.div
                            className="analogy-image"
                            variants={fadeUp}
                        >
                            <MenuSVG />
                        </motion.div>
                    </div>
                </motion.section>

                {/* ═══════════════════════════════════════
                   SECTION Q&A — Pose une question
                   ═══════════════════════════════════════ */}
                <motion.section
                    className="intro-section intro-qa"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={fadeUp}
                >
                    <div className="qa-container">
                        <div className="qa-robot">
                            <ThinkingRobot state={robotState} />
                        </div>
                        <div className="qa-content">
                            <h3>Une question ? Demande à CodeBot ! 🤖</h3>
                            <p>Essaie : "C'est quoi un formulaire ?", "Qui l'a inventé ?", "À quoi ça sert ?"</p>

                            <form onSubmit={handleAsk} className="qa-form">
                                <input
                                    type="text"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="Pose ta question ici..."
                                    disabled={robotState !== 'idle'}
                                />
                                <button type="submit" disabled={robotState !== 'idle' || !question.trim()}>
                                    {robotState === 'thinking' ? '...' : 'Demander'}
                                </button>
                            </form>

                            <AnimatePresence>
                                {answer && (
                                    <motion.div
                                        className="qa-answer"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                    >
                                        <div className="qa-bubble">
                                            {answer.split('\n').map((line, i) => (
                                                <p key={i}>{line}</p>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.section>

                {/* ═══════════════════════════════════════
                   SECTION 4 — CTA final
                   ═══════════════════════════════════════ */}
                <motion.section
                    className="intro-section intro-cta"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={fadeUp}
                >
                    <motion.div className="cta-card" variants={fadeUp}>
                        <h2>Prêt à apprendre ? 🚀</h2>
                        <p>
                            Maintenant que tu sais ce qu'est un formulaire, on va apprendre
                            à en <strong>créer un toi-même</strong> avec du code HTML !
                        </p>
                        <motion.button
                            className="btn-start"
                            onClick={handleContinue}
                            whileHover={{ scale: 1.05, y: -3 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>C'est compris, on commence !</span>
                            <HiOutlineArrowRight />
                        </motion.button>
                    </motion.div>
                </motion.section>
            </div>

            {/* ═══════════════════════════════════════
               POPUP — Exemple de formulaire
               ═══════════════════════════════════════ */}
            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        className="popup-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowPopup(false)}
                    >
                        <motion.div
                            className="popup-content"
                            initial={{ opacity: 0, scale: 0.85, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.85, y: 30 }}
                            transition={{ duration: 0.35 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="popup-close" onClick={() => setShowPopup(false)}>
                                <HiOutlineXMark />
                            </button>
                            <h3>📋 Exemple de formulaire</h3>
                            <p className="popup-desc">
                                Voici à quoi ressemble un formulaire sur un site web :
                            </p>
                            <div className="popup-image-wrap">
                                <img
                                    src="/images/formulaire exemple.jpeg"
                                    alt="Exemple de formulaire HTML"
                                />
                            </div>
                            <p className="popup-note">
                                👆 Tu vois les champs à remplir ? C'est exactement ce que tu vas
                                apprendre à créer !
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
