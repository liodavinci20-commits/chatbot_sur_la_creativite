// LoginPage.jsx — Split-screen dark design, simplified login/register
// Login-first approach with simple registration
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

    // ── Mode: 'login' (default) or 'register' ──
    const [mode, setMode] = useState('login')

    // ── Shared form fields (used by both login & register) ──
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPwd, setShowPwd] = useState(false)

    // ── Register-only fields ──
    const [prenom, setPrenom] = useState('')
    const [nom, setNom] = useState('')

    // ── General ──
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [toastMsg, setToastMsg] = useState('')
    const [toastShow, setToastShow] = useState(false)

    // ── Toast helper ──
    const showToast = useCallback((msg) => {
        setToastMsg(msg)
        setToastShow(true)
        setTimeout(() => setToastShow(false), 3200)
    }, [])

    // ── Auto-toast on load ──
    useEffect(() => {
        const timer = setTimeout(() => showToast('Bienvenue — Libère ta créativité.'), 1400)
        return () => clearTimeout(timer)
    }, [showToast])

    // ── Validation ──
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length === 0
    const loginOk = emailValid && email.length > 0 && password.length >= 4
    const registerOk = emailValid && email.length > 0 && password.length >= 6 && prenom.trim() && nom.trim()

    // ── Password strength ──
    const pwdStr = password.length > 0 ? getPasswordStrength(password) : 0
    const pwdColors = ['rgba(240,98,74,.7)', 'rgba(232,160,32,.8)', 'rgba(29,185,122,.8)']
    const pwdLabels = [['(-_-) Trop court', 'rgba(240,98,74,.8)'], ['(~_~) Moyen', 'rgba(232,160,32,.9)'], ['(^_^) Solide !', 'rgba(29,185,122,.9)']]

    // ── Register handler ──
    const handleRegister = async () => {
        if (!registerOk) return
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
                    email: email.trim(),
                    password,
                })
            })
            const data = await res.json()

            if (data.success) {
                // Switch to login mode — email & password are already filled (shared state)
                showToast('Compte créé ! Connecte-toi maintenant (^_^)')
                setMode('login')
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

        // ── Secret Admin Detection ──
        if (email.trim().toLowerCase() === 'admin@admin.com' && password === 'creabot2024') {
            onLogin({ name: 'Admin Dev', isAdmin: true })
            showToast('🔧 Mode Développeur activé')
            setTimeout(() => navigate('/intro', { replace: true }), 800)
            return
        }

        setLoading(true)
        setError('')

        try {
            const res = await fetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    email: email.trim(),
                    password,
                })
            })
            const data = await res.json()

            if (data.success) {
                onLogin({ name: data.name, classe: data.classe })
                showToast('Ravi de te revoir !')
                setTimeout(() => navigate('/intro', { replace: true }), 1200)
            } else {
                setError(data.error || 'Erreur de connexion')
            }
        } catch {
            setError('Erreur de connexion au serveur')
        }
        setLoading(false)
    }

    // ── Guest mode handler (no backend) ──
    const handleGuest = () => {
        onLogin({ name: 'Invité', isGuest: true })
        showToast('Bienvenue en mode découverte !')
        setTimeout(() => navigate('/intro', { replace: true }), 800)
    }

    // ── Switch modes ──
    const switchToRegister = () => {
        setMode('register')
        setError('')
    }

    const switchToLogin = () => {
        setMode('login')
        setError('')
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
                            <div className="login-brand-name">Créa<span>Bot</span></div>
                            <div className="login-brand-tag">PLATEFORME CRÉATIVE</div>
                        </div>
                    </div>

                    {/* Hero text */}
                    <div className="login-hero-content">
                        <div className="login-hero-eyebrow">
                            <div className="login-hero-eyebrow-dot" />
                            Créativité nouvelle génération
                        </div>
                        <div className="login-hero-title">
                            <span className="line1">Booste ta créativité</span>
                            <span className="line2"><span className="g1t">autrement.</span></span>
                            <span className="line2"><span className="g2t">Vraiment.</span></span>
                        </div>
                        <div className="login-hero-sub">
                            Pas de limites. Pas de jugement.<br />
                            <strong>Tu imagines, tu explores, tu crées</strong> — accompagné par un chatbot qui stimule ton imagination sans jamais brider tes idées.
                        </div>
                    </div>

                    {/* Features */}
                    <div className="login-features">
                        <div className="login-feat">
                            <div className="login-feat-icon t">[?]</div>
                            <div>
                                <div className="login-feat-title">Questionnement créatif</div>
                                <div className="login-feat-sub">Le bot te questionne, toi tu inventes (^_^)</div>
                            </div>
                        </div>
                        <div className="login-feat">
                            <div className="login-feat-icon v">( o )</div>
                            <div>
                                <div className="login-feat-title">Inspiration en temps réel</div>
                                <div className="login-feat-sub">Des idées qui naissent au fil de tes échanges</div>
                            </div>
                        </div>
                        <div className="login-feat">
                            <div className="login-feat-icon c">[*]</div>
                            <div>
                                <div className="login-feat-title">Défis créatifs personnalisés</div>
                                <div className="login-feat-sub">Des challenges qui stimulent ton imagination</div>
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
                            <div className="login-stat-l">CRÉATIF</div>
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
                                    {mode === 'login'
                                        ? 'Content de te revoir !'
                                        : 'Rejoins l\'aventure !'}
                                </div>
                                <div className="login-form-sub">
                                    {mode === 'login'
                                        ? 'Connecte-toi pour reprendre là où tu t\'es arrêté.'
                                        : 'Crée ton compte en quelques secondes.'}
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {/* ═══ LOGIN MODE (default) ═══ */}
                                {mode === 'login' && (
                                    <motion.div
                                        key="login-form"
                                        className="login-step-panel on"
                                        initial={{ opacity: 0, x: 16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -16 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="login-field">
                                            <div className="login-field-label">
                                                <div className="login-field-label-dot" />Adresse email
                                            </div>
                                            <div className="login-field-wrap">
                                                <input
                                                    className="login-field-input"
                                                    type="email"
                                                    placeholder="ton@email.com"
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                    autoComplete="email"
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
                                                    type={showPwd ? 'text' : 'password'}
                                                    placeholder="Ton mot de passe..."
                                                    value={password}
                                                    onChange={e => setPassword(e.target.value)}
                                                    autoComplete="current-password"
                                                />
                                                <span
                                                    className="login-field-icon"
                                                    style={{ cursor: 'pointer', pointerEvents: 'all' }}
                                                    onClick={() => setShowPwd(!showPwd)}
                                                >
                                                    {showPwd ? '[-]' : '[o]'}
                                                </span>
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

                                        <button className="login-guest-btn" onClick={handleGuest}>
                                            👤 Accéder en mode invité
                                        </button>
                                    </motion.div>
                                )}

                                {/* ═══ REGISTER MODE ═══ */}
                                {mode === 'register' && (
                                    <motion.div
                                        key="register-form"
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

                                        {error && <div className="login-err-msg show">{error}</div>}

                                        <button
                                            className="login-submit-btn"
                                            disabled={!registerOk || loading}
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
                            </AnimatePresence>

                            {/* Bottom note */}
                            <div className="login-bottom-note">
                                En créant un compte, tu acceptes nos{' '}
                                <a href="#">conditions d'utilisation</a> et notre{' '}
                                <a href="#">politique de confidentialité</a>.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast */}
            <Toast message={toastMsg} show={toastShow} />
        </>
    )
}
