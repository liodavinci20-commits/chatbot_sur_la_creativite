import { motion } from 'framer-motion'
import { HiOutlineTrophy, HiOutlineCheckCircle, HiOutlineRocketLaunch } from 'react-icons/hi2'

const COLORS = ['#667eea', '#764ba2', '#43e97b', '#f093fb', '#4facfe', '#fee140', '#f5576c']

function Confetti({ count = 80 }) {
    const pieces = [...Array(count)].map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 5 + Math.random() * 8,
        delay: Math.random() * 2,
        duration: 2.5 + Math.random() * 2,
        rotation: Math.random() * 720,
        isCircle: Math.random() > 0.5,
    }))

    return (
        <div className="confetti-layer">
            {pieces.map((p) => (
                <motion.div
                    key={p.id}
                    className="confetti-piece"
                    style={{
                        left: `${p.x}%`,
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        borderRadius: p.isCircle ? '50%' : '2px',
                    }}
                    initial={{ y: '-10vh', rotate: 0, opacity: 1 }}
                    animate={{ y: '110vh', rotate: p.rotation, opacity: 0 }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        ease: 'linear',
                    }}
                />
            ))}
        </div>
    )
}

export default function Celebration({ name, onClose }) {
    return (
        <motion.div
            className="celebration-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Confetti />

            <motion.div
                className="celebration-card"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.3 }}
            >
                <motion.div
                    className="trophy"
                    animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.15, 1] }}
                    transition={{ duration: 1, delay: 0.8 }}
                >
                    <HiOutlineTrophy />
                </motion.div>

                <h2>FÉLICITATIONS !</h2>
                <p>
                    <strong>{name}</strong>, tu as terminé tout le parcours !
                </p>
                <p className="sub">
                    Tu maîtrises maintenant les formulaires HTML et tu as montré une créativité incroyable !
                </p>

                <div className="skills-list">
                    {['Zones de saisie', 'Cases à cocher', 'Boutons radio', 'Listes déroulantes', 'Boutons cliquables'].map((skill, i) => (
                        <motion.div
                            key={skill}
                            className="skill-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 + i * 0.15 }}
                        >
                            <HiOutlineCheckCircle /> {skill}
                        </motion.div>
                    ))}
                </div>

                <motion.button
                    className="btn-primary"
                    onClick={onClose}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                >
                    Continue à créer <HiOutlineRocketLaunch />
                </motion.button>
            </motion.div>
        </motion.div>
    )
}
