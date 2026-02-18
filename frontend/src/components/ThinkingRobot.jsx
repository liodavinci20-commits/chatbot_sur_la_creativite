import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function ThinkingRobot({ state = 'idle', size = 120 }) {
    // state: 'idle' | 'thinking' | 'speaking'

    const [blink, setBlink] = useState(false)

    // Clignement des yeux aléatoire
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setBlink(true)
            setTimeout(() => setBlink(false), 150)
        }, 3000 + Math.random() * 2000)
        return () => clearInterval(blinkInterval)
    }, [])

    const bounceVariant = {
        idle: { y: [0, -5, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
        thinking: { y: [0, -2, 0], transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" } },
        speaking: { y: [0, -3, 0], transition: { duration: 0.3, repeat: Infinity } }
    }

    const mouthVariant = {
        idle: { scaleY: 1 },
        thinking: { scaleY: 0.5, transition: { duration: 0.5 } },
        speaking: { scaleY: [0.5, 1.2, 0.5], transition: { duration: 0.2, repeat: Infinity } }
    }

    return (
        <div style={{ position: 'relative', width: size, height: size }}>
            <motion.svg
                viewBox="0 0 200 200"
                width="100%"
                height="100%"
                animate={state}
                variants={bounceVariant}
            >
                {/* Antenne */}
                <line x1="100" y1="50" x2="100" y2="30" stroke="#6C757D" strokeWidth="4" />
                <circle cx="100" cy="25" r="6" fill={state === 'thinking' ? '#FFBB00' : '#FF5252'}>
                    {state === 'thinking' && (
                        <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
                    )}
                </circle>

                {/* Tête */}
                <rect x="50" y="50" width="100" height="80" rx="15" fill="#4A4E69" />
                <rect x="55" y="55" width="90" height="70" rx="10" fill="#22223B" opacity="0.3" />

                {/* Yeux */}
                <motion.g animate={{ scaleY: blink ? 0.1 : 1 }} transition={{ duration: 0.1 }}>
                    <circle cx="80" cy="85" r="8" fill="#4CC9F0" />
                    <circle cx="120" cy="85" r="8" fill="#4CC9F0" />
                </motion.g>

                {/* Bouche */}
                <motion.rect
                    x="85" y="110" width="30" height="6" rx="3"
                    fill="white"
                    variants={mouthVariant}
                />

                {/* Corps (suggestions) */}
                <path d="M70 130 L130 130 L140 180 L60 180 Z" fill="#9A8C98" />
            </motion.svg>

            {/* Bulle de pensée (visible seulement si state === 'thinking') */}
            {state === 'thinking' && (
                <motion.div
                    style={{
                        position: 'absolute',
                        top: -10,
                        right: 0,
                        background: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                        fontSize: '20px'
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                >
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1] }}
                    >
                        ...
                    </motion.span>
                </motion.div>
            )}
        </div>
    )
}
