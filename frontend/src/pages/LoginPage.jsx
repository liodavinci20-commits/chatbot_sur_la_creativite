import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiOutlineUser, HiOutlineAcademicCap, HiOutlineArrowRight, HiOutlineExclamationTriangle, HiOutlineLightBulb, HiOutlineCpuChip } from 'react-icons/hi2'

export default function LoginPage({ onLogin }) {
    const [name, setName] = useState('')
    const [classe, setClasse] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name.trim() || !classe) {
            setError('Remplis tous les champs !')
            return
        }

        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim(), classe })
            })
            const data = await res.json()

            if (data.success) {
                onLogin({ name: data.name, classe: data.classe })
                navigate('/intro')
            } else {
                setError(data.error || 'Erreur de connexion')
            }
        } catch {
            setError('Erreur de connexion au serveur')
        }
        setLoading(false)
    }

    return (
        <div className="login-page">
            {/* Particules animées */}
            <div className="particles">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${3 + Math.random() * 5}px`,
                            height: `${3 + Math.random() * 5}px`,
                        }}
                        animate={{
                            y: [0, -60 - Math.random() * 100, 0],
                            x: [0, (Math.random() - 0.5) * 80, 0],
                            opacity: [0.15, 0.5, 0.15],
                            scale: [1, 1.4, 1],
                        }}
                        transition={{
                            duration: 10 + Math.random() * 10,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: Math.random() * 5,
                        }}
                    />
                ))}
            </div>

            <motion.div
                className="login-container"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                {/* Header */}
                <div className="login-header">
                    <motion.div
                        className="robot-avatar"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <HiOutlineCpuChip />
                    </motion.div>
                    <h1>Code<span className="accent">Bot</span></h1>
                    <p className="subtitle">Ton assistant pour apprendre les formulaires HTML</p>
                </div>

                {/* Form */}
                <motion.form
                    className="login-form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    {error && (
                        <motion.div
                            className="error-msg"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <HiOutlineExclamationTriangle /> {error}
                        </motion.div>
                    )}

                    <div className="form-group">
                        <label><HiOutlineUser /> Ton nom</label>
                        <input
                            type="text"
                            placeholder="Ex: Kenfack, Ngoupeyou..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="off"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label><HiOutlineAcademicCap /> Ta classe</label>
                        <select value={classe} onChange={(e) => setClasse(e.target.value)}>
                            <option value="" disabled>Choisis ta classe</option>
                            <option value="Seconde C">Seconde C</option>
                            <option value="Seconde D">Seconde D</option>
                            <option value="Première C">Première C</option>
                            <option value="Première D">Première D</option>
                            <option value="Terminale C">Terminale C</option>
                            <option value="Terminale D">Terminale D</option>
                        </select>
                    </div>

                    <motion.button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? (
                            <span className="loading-dots">Connexion en cours</span>
                        ) : (
                            <>
                                <span>Commencer l'aventure</span>
                                <HiOutlineArrowRight />
                            </>
                        )}
                    </motion.button>
                </motion.form>

                {/* Hint */}
                <motion.div
                    className="login-hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                >
                    <span className="hint-icon"><HiOutlineLightBulb /></span>
                    <p>
                        Tu viens de remplir ton <strong>premier formulaire HTML</strong> !
                        Tout ce que tu vas apprendre aujourd'hui, c'est comment créer ça toi-même.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    )
}
