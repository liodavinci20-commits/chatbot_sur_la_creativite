// LoginPage.jsx — Split-screen dark design, multi-step form
// Reproducing the codebot_login.html prototype in React
import { useState, useEffect, useMemo, useCallback } from 'react'
import { API_BASE_URL } from '../config'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// ── Password strength checker ──
function getPasswordStrength(pwd) {
    let s = 0
    if (pwd.length >= 6) s = 1
    if (pwd.length >= 8 && /[A-Z]/.test(pwd)) s = 2
    if (pwd.length >= 10 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) s = 3
    return s || 1
}

// ── Particle generator component ──
function LoginParticles() {
    const particles = useMemo(() => {
        const colors = ['rgba(29,185,122,', 'rgba(124,111,247,', 'rgba(14,165,196,']
        return Array.from({ length: 18 }, (_, i) => {
            const size = Math.random() * 3 + 1.5
            const color = colors[Math.floor(Math.random() * colors.length)]
            const opacity = Math.random() * 0.5 + 0.2
            return {
                id: i,
                size,
                left: `${Math.random() * 100}%`,
                color: `${color}${opacity})`,
                duration: `${Math.random() * 12 + 8}s`,
                delay: `${Math.random() * 12}s`,
                glow: `0 0 ${size * 3}px ${color}.6)`,
            }
        })
    }, [])

    return (
        <div className="login-particles">
            {particles.map(p => (
                <div
                    key={p.id}
                    className="login-particle"
                    style={{
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        left: p.left,
                        background: p.color,
                        animationDuration: p.duration,
                        animationDelay: p.delay,
                        boxShadow: p.glow,
                    }}
                />
            ))}
        </div>
    )
}

// ── Toast notification ──
function Toast({ message, show }) {
    return (
        <div className={`login-toast ${show ? 'show' : ''}`}>
            <span className="login-toast-icon">(^_^)</span>
            <span>{message}</span>
        </div>
    )
}

// ── Main LoginPage component ──
export default function LoginPage({ onLogin }) {
    const navigate = useNavigate()

    // ── Step management ──
    const [step, setStep] = useState(1)
    const [mode, setMode] = useState('register') // 'register' or 'login'

    // ── Step 1: Identity ──
    const [prenom, setPrenom] = useState('')
    const [nom, setNom] = useState('')
    const [classe, setClasse] = useState('')
    const [etablissement, setEtablissement] = useState('')

    // ── Step 2: Account ──
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [showPwd, setShowPwd] = useState(false)

    // ── Login mode ──
    const [loginEmail, setLoginEmail] = useState('')
    const [loginPwd, setLoginPwd] = useState('')

    // ── General ──
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [toastMsg, setToastMsg] = useState('')
    const [toastShow, setToastShow] = useState(false)

    // ── Title/subtitle per step ──
    const stepTitles = ['', 'Content de te voir !', 'Crée ton accès', 'Tout est prêt (^_^)']
    const stepSubs = ['', "Entre tes informations pour commencer l'aventure.", 'Choisis un email et un mot de passe sécurisé.', 'Ton profil CodeBot est prêt.']

    // ── Toast helper ──
    const showToast = useCallback((msg) => {
        setToastMsg(msg)
        setToastShow(true)
        setTimeout(() => setToastShow(false), 3200)
    }, [])

    // ── Auto-toast on load ──
    useEffect(() => {
        const timer = setTimeout(() => showToast('Bienvenue sur CodeBot — Apprendre autrement.'), 1400)
        return () => clearTimeout(timer)
    }, [showToast])

    // ── Step 1 validation ──
    const step1Ok = prenom.trim() && nom.trim() && classe && etablissement.trim()

    // ── Step 2 validation ──
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length === 0
    const pwdMatch = password === password2 || password2.length === 0
    const step2Ok = emailValid && email.length > 0 && password.length >= 6 && pwdMatch && password2.length > 0

    // ── Login mode validation ──
    const loginOk = loginEmail.trim() && loginPwd.length >= 4

    // ── Password strength ──
    const pwdStr = password.length > 0 ? getPasswordStrength(password) : 0
    const pwdColors = ['rgba(240,98,74,.7)', 'rgba(232,160,32,.8)', 'rgba(29,185,122,.8)']
    const pwdLabels = [['(-_-) Trop court', 'rgba(240,98,74,.8)'], ['(~_~) Moyen', 'rgba(232,160,32,.9)'], ['(^_^) Solide !', 'rgba(29,185,122,.9)']]

    // ── Navigation between steps ──
    const goStep = (n) => {
        setStep(n)
        setError('')
    }

    // ── Register handler ──
    const handleRegister = async () => {
        if (!step2Ok) return
        setLoading(true)
        setError('')

        try {
            const res = await fetch(`${API_BASE_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    prenom: prenom.trim(),
                    nom: nom.trim(),
                    classe,
                    etablissement: etablissement.trim(),
                    email: email.trim(),
                    password,
                })
            })
            const data = await res.json()

            if (data.success) {
                onLogin({ name: data.name, classe: data.classe, prenom: data.prenom })
                goStep(3)
                showToast('Compte créé avec succès !')
            } else {
                setError(data.error || 'Erreur lors de la création du compte')
            }
        } catch {
            setError('Erreur de connexion au serveur')
        }
        setLoading(false)
    }

    // ── Login handler ──
    const handleLogin = async () => {
        if (!loginOk) return
        setLoading(true)
        setError('')

        try {
            const res = await fetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    email: loginEmail.trim(),
                    password: loginPwd,
                })
            })
            const data = await res.json()

            if (data.success) {
                onLogin({ name: data.name, classe: data.classe })
                goStep(3)
                showToast('Ravi de te revoir !')
            } else {
                setError(data.error || 'Erreur de connexion')
            }
        } catch {
            setError('Erreur de connexion au serveur')
        }
        setLoading(false)
    }

    // ── Enter app ──
    const enterApp = () => {
        showToast(`Chargement de ta session, ${prenom || 'toi'}...`)
        setTimeout(() => navigate('/intro', { replace: true }), 1200)
    }

    // ── Switch to login mode ──
    const switchToLogin = () => {
        setMode('login')
        setStep(2)
    }

    // ── Switch to register mode ──
    const switchToRegister = () => {
        setMode('register')
        setStep(1)
    }

    return (
        <>
            {/* ── BACKGROUND ── */}
            <div className="login-bg">
                <div className="login-bg-grid" />
                <div className="login-bg-glow1" />
                <div className="login-bg-glow2" />
                <div className="login-bg-glow3" />
                <LoginParticles />
                <div className="login-bg-scanline" />
            </div>

            {/* ── PAGE LAYOUT ── */}
            <div className="login-page">
                {/* ── LEFT PANEL — Hero ── */}
                <div className="login-left">
                    {/* Brand */}
                    <div className="login-brand">
                        <div className="login-brand-mark">&lt;/&gt;</div>
                        <div>
                            <div className="login-brand-name">Code<span>Bot</span></div>
                            <div className="login-brand-tag">PLATEFORME ÉDUCATIVE</div>
                        </div>
                    </div>

                    {/* Hero text */}
                    <div className="login-hero-content">
                        <div className="login-hero-eyebrow">
                            <div className="login-hero-eyebrow-dot" />
                            Apprentissage nouvelle génération
                        </div>
                        <div className="login-hero-title">
                            <span className="line1">Apprends à coder</span>
                            <span className="line2"><span className="g1t">différemment.</span></span>
                            <span className="line2"><span className="g2t">Vraiment.</span></span>
                        </div>
                        <div className="login-hero-sub">
                            Pas de cours magistraux. Pas de texte à recopier.<br />
                            <strong>Tu découvres, tu expérimentes, tu crées</strong> — accompagné par un chatbot qui te guide sans jamais te donner les réponses.
                        </div>
                    </div>

                    {/* Features */}
                    <div className="login-features">
                        <div className="login-feat">
                            <div className="login-feat-icon t">[?]</div>
                            <div>
                                <div className="login-feat-title">Apprentissage socratique</div>
                                <div className="login-feat-sub">Le bot questionne, toi tu découvres (^_^)</div>
                            </div>
                        </div>
                        <div className="login-feat">
                            <div className="login-feat-icon v">( o )</div>
                            <div>
                                <div className="login-feat-title">Visualisation en temps réel</div>
                                <div className="login-feat-sub">Vois immédiatement ce que ton code produit</div>
                            </div>
                        </div>
                        <div className="login-feat">
                            <div className="login-feat-icon c">[*]</div>
                            <div>
                                <div className="login-feat-title">Défis créatifs contextuels</div>
                                <div className="login-feat-sub">Crée des projets qui te ressemblent</div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="login-stats">
                        <div>
                            <div className="login-stat-n">5</div>
                            <div className="login-stat-l">PHASES</div>
                        </div>
                        <div className="login-stat-sep" />
                        <div>
                            <div className="login-stat-n">20+</div>
                            <div className="login-stat-l">ACTIVITÉS</div>
                        </div>
                        <div className="login-stat-sep" />
                        <div>
                            <div className="login-stat-n">100%</div>
                            <div className="login-stat-l">INTERACTIF</div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT PANEL — Form ── */}
                <div className="login-right">
                    <div className="login-form-card">
                        <div className="login-form-card-bg" />
                        <div className="login-form-card-glow" />
                        <div className="login-form-inner">


                            {/* Bot avatar */}
                            <div className="login-form-bot">
                                <div className="login-form-bot-eyes">^_^</div>
                                <div className="login-form-bot-mouth">hello</div>
                                <div className="login-form-bot-pulse" />
                            </div>

                            {/* Header — dynamic */}
                            <div className="login-form-hd">
                                <div className="login-form-title">
                                    {mode === 'login' && step === 2
                                        ? 'Content de te revoir !'
                                        : stepTitles[step]}
                                </div>
                                <div className="login-form-sub">
                                    {mode === 'login' && step === 2
                                        ? "Connecte-toi pour reprendre là où tu t'es arrêté."
                                        : stepSubs[step]}
                                </div>
                            </div>

                            {/* Step indicator */}
                            {step < 3 && (
                                <div className="login-step-ind">
                                    <div className={`login-si-dot ${step === 1 ? 'active' : step > 1 ? 'done' : ''}`} />
                                    <div className={`login-si-dot ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`} />
                                    <div className={`login-si-dot ${step === 3 ? 'active' : ''}`} />
                                </div>
                            )}

                            {/* ═══ STEP 1 — Identity ═══ */}
                            <AnimatePresence mode="wait">
                                {step === 1 && mode === 'register' && (
                                    <motion.div
                                        key="step1"
                                        className="login-step-panel on"
                                        initial={{ opacity: 0, x: 16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -16 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="login-two-col">
                                            <div className="login-field">
                                                <div className="login-field-label">
                                                    <div className="login-field-label-dot" />Prénom
                                                </div>
                                                <div className="login-field-wrap">
                                                    <input
                                                        className="login-field-input"
                                                        placeholder="Ton prénom..."
                                                        value={prenom}
                                                        onChange={e => setPrenom(e.target.value)}
                                                        autoComplete="given-name"
                                                        autoFocus
                                                    />
                                                    <span className="login-field-icon">[_]</span>
                                                </div>
                                            </div>
                                            <div className="login-field">
                                                <div className="login-field-label">
                                                    <div className="login-field-label-dot" />Nom
                                                </div>
                                                <div className="login-field-wrap">
                                                    <input
                                                        className="login-field-input"
                                                        placeholder="Ton nom..."
                                                        value={nom}
                                                        onChange={e => setNom(e.target.value)}
                                                        autoComplete="family-name"
                                                    />
                                                    <span className="login-field-icon">[_]</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="login-field">
                                            <div className="login-field-label">
                                                <div className="login-field-label-dot" />Classe
                                            </div>
                                            <div className="login-field-wrap">
                                                <select
                                                    className="login-field-select"
                                                    value={classe}
                                                    onChange={e => setClasse(e.target.value)}
                                                >
                                                    <option value="">Sélectionne ta classe...</option>
                                                    <option>6ème</option>
                                                    <option>5ème</option>
                                                    <option>4ème</option>
                                                    <option>3ème</option>
                                                    <option>Seconde</option>
                                                    <option>Première</option>
                                                    <option>Terminale</option>
                                                    <option>BTS / IUT</option>
                                                    <option>Autre</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="login-field">
                                            <div className="login-field-label">
                                                <div className="login-field-label-dot" />Établissement
                                            </div>
                                            <div className="login-field-wrap">
                                                <input
                                                    className="login-field-input"
                                                    placeholder="Nom de ton lycée / collège..."
                                                    value={etablissement}
                                                    onChange={e => setEtablissement(e.target.value)}
                                                />
                                                <span className="login-field-icon">[^]</span>
                                            </div>
                                        </div>

                                        <button
                                            className="login-submit-btn"
                                            disabled={!step1Ok}
                                            onClick={() => goStep(2)}
                                        >
                                            Continuer &nbsp;›
                                        </button>
                                    </motion.div>
                                )}

                                {/* ═══ STEP 2 — Account (Register) ═══ */}
                                {step === 2 && mode === 'register' && (
                                    <motion.div
                                        key="step2-register"
                                        className="login-step-panel on"
                                        initial={{ opacity: 0, x: 16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -16 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <button className="login-back-link" onClick={() => goStep(1)}>
                                            ‹ Retour
                                        </button>

                                        <div className="login-field">
                                            <div className="login-field-label">
                                                <div className="login-field-label-dot" />Adresse email
                                            </div>
                                            <div className="login-field-wrap">
                                                <input
                                                    className={`login-field-input ${!emailValid && email.length > 0 ? 'error' : ''}`}
                                                    type="email"
                                                    placeholder="ton@email.com"
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                    autoComplete="email"
                                                />
                                                <span className="login-field-icon">(@)</span>
                                            </div>
                                            {!emailValid && email.length > 0 && (
                                                <div className="login-err-msg show">Format d'email invalide (-_-)</div>
                                            )}
                                        </div>

                                        <div className="login-field">
                                            <div className="login-field-label">
                                                <div className="login-field-label-dot" />Mot de passe
                                            </div>
                                            <div className="login-field-wrap">
                                                <input
                                                    className="login-field-input"
                                                    type={showPwd ? 'text' : 'password'}
                                                    placeholder="Minimum 6 caractères..."
                                                    value={password}
                                                    onChange={e => setPassword(e.target.value)}
                                                    autoComplete="new-password"
                                                />
                                                <span
                                                    className="login-field-icon"
                                                    style={{ cursor: 'pointer', pointerEvents: 'all' }}
                                                    onClick={() => setShowPwd(!showPwd)}
                                                >
                                                    {showPwd ? '[-]' : '[o]'}
                                                </span>
                                            </div>
                                            {/* Password strength bar */}
                                            {password.length > 0 && (
                                                <div style={{ marginTop: 8 }}>
                                                    <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                                                        {[0, 1, 2].map(i => (
                                                            <div
                                                                key={i}
                                                                className="login-pwd-bar"
                                                                style={{ background: i < pwdStr ? pwdColors[pwdStr - 1] : undefined }}
                                                            />
                                                        ))}
                                                    </div>
                                                    <div style={{ fontSize: '10.5px', fontWeight: 600, color: pwdLabels[pwdStr - 1]?.[1] }}>
                                                        {pwdLabels[pwdStr - 1]?.[0]}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="login-field">
                                            <div className="login-field-label">
                                                <div className="login-field-label-dot" />Confirmer le mot de passe
                                            </div>
                                            <div className="login-field-wrap">
                                                <input
                                                    className={`login-field-input ${!pwdMatch && password2.length > 0 ? 'error' : ''}`}
                                                    type="password"
                                                    placeholder="Répète ton mot de passe..."
                                                    value={password2}
                                                    onChange={e => setPassword2(e.target.value)}
                                                    autoComplete="new-password"
                                                />
                                                <span className="login-field-icon">[=]</span>
                                            </div>
                                            {!pwdMatch && password2.length > 0 && (
                                                <div className="login-err-msg show">Les mots de passe ne correspondent pas (-_-)</div>
                                            )}
                                        </div>

                                        {error && <div className="login-err-msg show">{error}</div>}

                                        <button
                                            className="login-submit-btn"
                                            disabled={!step2Ok || loading}
                                            onClick={handleRegister}
                                        >
                                            {loading ? 'Création en cours...' : 'Créer mon compte ›'}
                                        </button>

                                        <div className="login-divider">
                                            <div className="login-divider-line" />
                                            <div className="login-divider-txt">déjà inscrit ?</div>
                                            <div className="login-divider-line" />
                                        </div>

                                        <button className="login-sec-btn" onClick={switchToLogin}>
                                            Se connecter à mon compte
                                        </button>
                                    </motion.div>
                                )}

                                {/* ═══ STEP 2 — Login mode ═══ */}
                                {step === 2 && mode === 'login' && (
                                    <motion.div
                                        key="step2-login"
                                        className="login-step-panel on"
                                        initial={{ opacity: 0, x: 16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -16 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <button className="login-back-link" onClick={switchToRegister}>
                                            ‹ Retour
                                        </button>

                                        <div className="login-field">
                                            <div className="login-field-label">
                                                <div className="login-field-label-dot" />Adresse email
                                            </div>
                                            <div className="login-field-wrap">
                                                <input
                                                    className="login-field-input"
                                                    type="email"
                                                    placeholder="ton@email.com"
                                                    value={loginEmail}
                                                    onChange={e => setLoginEmail(e.target.value)}
                                                    autoFocus
                                                />
                                                <span className="login-field-icon">(@)</span>
                                            </div>
                                        </div>

                                        <div className="login-field">
                                            <div className="login-field-label">
                                                <div className="login-field-label-dot" />Mot de passe
                                            </div>
                                            <div className="login-field-wrap">
                                                <input
                                                    className="login-field-input"
                                                    type="password"
                                                    placeholder="Ton mot de passe..."
                                                    value={loginPwd}
                                                    onChange={e => setLoginPwd(e.target.value)}
                                                />
                                                <span className="login-field-icon">[o]</span>
                                            </div>
                                        </div>

                                        {error && <div className="login-err-msg show">{error}</div>}

                                        <button
                                            className="login-submit-btn"
                                            disabled={!loginOk || loading}
                                            onClick={handleLogin}
                                        >
                                            {loading ? 'Connexion...' : 'Se connecter (^_^)'}
                                        </button>

                                        <div className="login-divider">
                                            <div className="login-divider-line" />
                                            <div className="login-divider-txt">pas encore inscrit ?</div>
                                            <div className="login-divider-line" />
                                        </div>

                                        <button className="login-sec-btn" onClick={switchToRegister}>
                                            Créer un compte
                                        </button>
                                    </motion.div>
                                )}

                                {/* ═══ STEP 3 — Success ═══ */}
                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        className="login-step-panel on"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
                                        style={{ textAlign: 'center', padding: '20px 0' }}
                                    >
                                        <div className="login-success-icon">(^_^)</div>
                                        <div className="login-success-title">Bienvenue dans CodeBot !</div>
                                        <div className="login-success-sub">
                                            Ton profil est créé. La Phase 1 t'attend — on commence par découvrir les formulaires HTML. Prêt ?
                                        </div>

                                        {/* Progress ring */}
                                        <svg className="login-progress-ring" viewBox="0 0 40 40">
                                            <defs>
                                                <linearGradient id="loginPrGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#1DB97A" />
                                                    <stop offset="100%" stopColor="#0ea5c4" />
                                                </linearGradient>
                                            </defs>
                                            <circle className="login-pr-bg" cx="20" cy="20" r="16" />
                                            <circle className="login-pr-fill" cx="20" cy="20" r="16" />
                                        </svg>

                                        <button
                                            className="login-submit-btn"
                                            style={{ marginTop: 20 }}
                                            onClick={enterApp}
                                        >
                                            Commencer l'aventure (^_^)
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Bottom note */}
                            {step < 3 && (
                                <div className="login-bottom-note">
                                    En créant un compte, tu acceptes nos{' '}
                                    <a href="#">conditions d'utilisation</a> et notre{' '}
                                    <a href="#">politique de confidentialité</a>.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast */}
            <Toast message={toastMsg} show={toastShow} />
        </>
    )
}
