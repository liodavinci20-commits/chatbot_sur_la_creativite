import { useState, useEffect } from 'react'
import Lottie from 'lottie-react'
import { motion } from 'framer-motion'

export default function TeacherAvatar({ loading = false }) {
    const [animationData, setAnimationData] = useState(null)

    useEffect(() => {
        // Animation d'un enseignant (Lottie)
        fetch('https://assets2.lottiefiles.com/packages/lf20_swnrn2oy.json')
            .then(res => res.json())
            .then(data => setAnimationData(data))
            .catch(() => { })
    }, [])

    return (
        <motion.div
            className="teacher-avatar-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            {animationData ? (
                <Lottie
                    animationData={animationData}
                    loop={true}
                    style={{ width: '100%', maxWidth: 200 }}
                />
            ) : (
                <div className="teacher-avatar-placeholder">
                    🎓
                </div>
            )}
            {loading && (
                <motion.div
                    className="teacher-thinking"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <span className="thinking-bubble">💭 Je réfléchis...</span>
                </motion.div>
            )}
        </motion.div>
    )
}
