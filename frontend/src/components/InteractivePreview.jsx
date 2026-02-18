import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineEye, HiOutlineCheckCircle, HiOutlineSparkles } from 'react-icons/hi2'

/* ═══════════════════════════════════════════
   Preview : Zones de saisie
   ═══════════════════════════════════════════ */
function ZonesSaisiePreview() {
    const [nom, setNom] = useState('')
    const [mdp, setMdp] = useState('')
    const [message, setMessage] = useState('')

    return (
        <div className="preview-fields">
            <h4 className="preview-subtitle">📝 Essaie les 3 types de zones de saisie :</h4>

            <div className="preview-field-group">
                <label className="preview-label">
                    <span className="label-tag">&lt;input type="text"&gt;</span>
                    Ton nom
                </label>
                <input
                    type="text"
                    className="preview-input"
                    placeholder="Tape ton nom ici..."
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                />
                {nom && <span className="preview-feedback">✨ Tu as tapé : <strong>{nom}</strong></span>}
            </div>

            <div className="preview-field-group">
                <label className="preview-label">
                    <span className="label-tag password">&lt;input type="password"&gt;</span>
                    Mot de passe
                </label>
                <input
                    type="password"
                    className="preview-input password"
                    placeholder="Tape un mot de passe..."
                    value={mdp}
                    onChange={(e) => setMdp(e.target.value)}
                />
                {mdp && <span className="preview-feedback">🔒 Tu vois ? Le texte est masqué ! ({mdp.length} caractères)</span>}
            </div>

            <div className="preview-field-group">
                <label className="preview-label">
                    <span className="label-tag textarea">&lt;textarea&gt;</span>
                    Message long
                </label>
                <textarea
                    className="preview-textarea"
                    placeholder="Écris un long message ici... Tu peux faire plusieurs lignes !"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                {message && <span className="preview-feedback">📝 {message.length} caractères — tu peux écrire autant que tu veux !</span>}
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════
   Preview : Cases à cocher
   ═══════════════════════════════════════════ */
function CasesACocherPreview() {
    const [checked, setChecked] = useState({})

    const options = [
        { name: 'football', label: '⚽ Football', emoji: '⚽' },
        { name: 'lecture', label: '📚 Lecture', emoji: '📚' },
        { name: 'jeux', label: '🎮 Jeux vidéo', emoji: '🎮' },
        { name: 'musique', label: '🎵 Musique', emoji: '🎵' },
        { name: 'dessin', label: '🎨 Dessin', emoji: '🎨' },
    ]

    const toggle = (name) => {
        setChecked(prev => ({ ...prev, [name]: !prev[name] }))
    }

    const count = Object.values(checked).filter(Boolean).length

    return (
        <div className="preview-fields">
            <h4 className="preview-subtitle">☑️ Coche tes activités préférées (tu peux en cocher PLUSIEURS) :</h4>

            <div className="preview-checkbox-grid">
                {options.map(opt => (
                    <label key={opt.name} className={`preview-checkbox-card ${checked[opt.name] ? 'checked' : ''}`}>
                        <input
                            type="checkbox"
                            checked={!!checked[opt.name]}
                            onChange={() => toggle(opt.name)}
                        />
                        <span className="checkbox-visual">{checked[opt.name] ? '✅' : '⬜'}</span>
                        <span className="checkbox-label">{opt.label}</span>
                    </label>
                ))}
            </div>

            {count > 0 && (
                <span className="preview-feedback success">
                    🎉 Tu as coché {count} activité{count > 1 ? 's' : ''} ! Avec les checkbox, tu peux en choisir autant que tu veux !
                </span>
            )}
        </div>
    )
}

/* ═══════════════════════════════════════════
   Preview : Boutons radio
   ═══════════════════════════════════════════ */
function BoutonsRadioPreview() {
    const [ville, setVille] = useState('')

    const villes = [
        { value: 'douala', label: '🏙️ Douala' },
        { value: 'yaounde', label: '🏛️ Yaoundé' },
        { value: 'bafoussam', label: '⛰️ Bafoussam' },
        { value: 'garoua', label: '🌅 Garoua' },
    ]

    return (
        <div className="preview-fields">
            <h4 className="preview-subtitle">🔘 Sélectionne ta ville (un SEUL choix possible) :</h4>

            <div className="preview-radio-grid">
                {villes.map(v => (
                    <label key={v.value} className={`preview-radio-card ${ville === v.value ? 'selected' : ''}`}>
                        <input
                            type="radio"
                            name="ville-preview"
                            value={v.value}
                            checked={ville === v.value}
                            onChange={(e) => setVille(e.target.value)}
                        />
                        <span className="radio-visual">{ville === v.value ? '🔵' : '⚪'}</span>
                        <span className="radio-label">{v.label}</span>
                    </label>
                ))}
            </div>

            {ville && (
                <span className="preview-feedback">
                    👆 Tu as choisi <strong>{villes.find(v => v.value === ville)?.label}</strong> — remarque que l'ancien choix se décoche automatiquement !
                </span>
            )}
        </div>
    )
}

/* ═══════════════════════════════════════════
   Preview : Listes déroulantes
   ═══════════════════════════════════════════ */
function ListesDeroulantesPreview() {
    const [classe, setClasse] = useState('')
    const [pays, setPays] = useState('')

    return (
        <div className="preview-fields">
            <h4 className="preview-subtitle">📋 Ouvre les listes et sélectionne une option :</h4>

            <div className="preview-field-group">
                <label className="preview-label">
                    <span className="label-tag select">&lt;select&gt;</span>
                    Ta classe
                </label>
                <select
                    className="preview-select"
                    value={classe}
                    onChange={(e) => setClasse(e.target.value)}
                >
                    <option value="">-- Choisis ta classe --</option>
                    <option value="seconde">Seconde</option>
                    <option value="premiere">Première</option>
                    <option value="terminale">Terminale</option>
                </select>
                {classe && <span className="preview-feedback">📋 Tu es en <strong>{classe}</strong> ! La liste reste compacte, même avec plein d'options.</span>}
            </div>

            <div className="preview-field-group">
                <label className="preview-label">
                    <span className="label-tag select">&lt;select&gt;</span>
                    Ton pays
                </label>
                <select
                    className="preview-select"
                    value={pays}
                    onChange={(e) => setPays(e.target.value)}
                >
                    <option value="">-- Choisis ton pays --</option>
                    <option value="cameroun">🇨🇲 Cameroun</option>
                    <option value="senegal">🇸🇳 Sénégal</option>
                    <option value="cote_ivoire">🇨🇮 Côte d'Ivoire</option>
                    <option value="congo">🇨🇬 Congo</option>
                    <option value="gabon">🇬🇦 Gabon</option>
                </select>
                {pays && <span className="preview-feedback">🌍 Imagine avec 54 pays ! La liste déroulante garde tout bien rangé.</span>}
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════
   Preview : Boutons cliquables
   ═══════════════════════════════════════════ */
function BoutonsCliquablesPreview() {
    const [formData, setFormData] = useState({ nom: '', email: '' })
    const [submitted, setSubmitted] = useState(false)
    const [resetCount, setResetCount] = useState(0)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (formData.nom || formData.email) {
            setSubmitted(true)
            setTimeout(() => setSubmitted(false), 3000)
        }
    }

    const handleReset = () => {
        setFormData({ nom: '', email: '' })
        setSubmitted(false)
        setResetCount(prev => prev + 1)
    }

    return (
        <div className="preview-fields">
            <h4 className="preview-subtitle">🔲 Remplis le mini-formulaire puis teste les boutons :</h4>

            <form onSubmit={handleSubmit} className="preview-mini-form">
                <div className="preview-field-group compact">
                    <input
                        type="text"
                        className="preview-input"
                        placeholder="Ton nom..."
                        value={formData.nom}
                        onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                    />
                </div>
                <div className="preview-field-group compact">
                    <input
                        type="text"
                        className="preview-input"
                        placeholder="Ton email..."
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                </div>

                <div className="preview-buttons-row">
                    <motion.button
                        type="submit"
                        className="preview-btn submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        🚀 Envoyer (submit)
                    </motion.button>
                    <motion.button
                        type="button"
                        className="preview-btn reset"
                        onClick={handleReset}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        ❌ Annuler (reset)
                    </motion.button>
                </div>
            </form>

            {submitted && (
                <motion.span
                    className="preview-feedback success"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    📨 Formulaire envoyé ! En vrai, les données iraient au serveur.
                </motion.span>
            )}

            {resetCount > 0 && !submitted && (
                <span className="preview-feedback">
                    🔄 Tu as cliqué sur Annuler {resetCount} fois — tout est effacé à chaque fois !
                </span>
            )}
        </div>
    )
}

/* ═══════════════════════════════════════════
   Map des previews par topic ID
   ═══════════════════════════════════════════ */
const TOPIC_PREVIEWS = {
    zones_saisie: ZonesSaisiePreview,
    cases_cocher: CasesACocherPreview,
    boutons_radio: BoutonsRadioPreview,
    listes_deroulantes: ListesDeroulantesPreview,
    boutons_cliquables: BoutonsCliquablesPreview,
}

export { TOPIC_PREVIEWS }

export default function InteractivePreview({ topicId, onReadyForQuiz }) {
    const PreviewComponent = TOPIC_PREVIEWS[topicId]
    if (!PreviewComponent) return null

    return (
        <motion.div
            className="interactive-preview"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <div className="preview-header">
                <HiOutlineSparkles className="preview-header-icon" />
                <span>Essaie par toi-même ! Manipule les éléments ci-dessous.</span>
            </div>

            <PreviewComponent />

            <motion.button
                className="btn-ready-quiz"
                onClick={onReadyForQuiz}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
            >
                <HiOutlineCheckCircle />
                J'ai compris ! Passe au quiz 🎯
            </motion.button>
        </motion.div>
    )
}
