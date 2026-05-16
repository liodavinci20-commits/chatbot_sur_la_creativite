// TopBar.jsx — Barre supérieure partagée (brand + stepper + avatar)
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../config'

const STEPS = [
    { label: 'Découvrir',  num: 1, route: '/intro'       },
    { label: 'Fondations', num: 2, route: '/foundations'  },
    { label: 'Hub',        num: 3, route: '/hub'          },
]

export default function TopBar({ user, currentStep = 1, completedSteps = [] }) {
    const navigate = useNavigate()
    const [showMenu, setShowMenu] = useState(false)

    const handleLogout = async () => {
        try { await fetch(`${API_BASE_URL}/api/logout`, { method: 'POST', credentials: 'include' }) } catch (_) {}
        navigate('/')
    }

    const initials = (user?.name || 'U')
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    return (
        <div className="v2-topbar">
            <div className="v2-brand">
                <div className="v2-brand-mark">&lt;/&gt;</div>
                CodeBot
            </div>
            <div className="v2-vsep" />
            <div className="v2-stepper">
                {STEPS.map((step, i) => {
                    const isDone = completedSteps.includes(step.num)
                    const isActive = step.num === currentStep
                    const cls = isDone ? 'done' : isActive ? 'active' : ''
                    return (
                        <span key={step.num} style={{ display: 'flex', alignItems: 'center' }}>
                            {i > 0 && <span className="v2-sarr">›</span>}
                            <span
                                className={`v2-step ${cls}`}
                                onClick={isDone ? () => navigate(step.route) : undefined}
                                title={isDone ? `Retourner à : ${step.label}` : undefined}
                                style={isDone ? {
                                    cursor: 'pointer',
                                    textDecoration: 'underline dotted',
                                    textUnderlineOffset: '3px',
                                } : {}}
                            >
                                <span className="v2-sn">{isDone ? '✓' : step.num}</span>
                                {step.label}
                            </span>
                        </span>
                    )
                })}
            </div>
            <div className="v2-top-right" style={{ position: 'relative' }}>
                <div className="v2-vsep" />
                <div className="v2-avatar">{initials}</div>
                <span className="v2-av-name">{user?.name || 'Élève'}</span>
                <button
                    onClick={() => setShowMenu(m => !m)}
                    style={{
                        background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)',
                        cursor: 'pointer', fontSize: 13, padding: '2px 4px', lineHeight: 1,
                    }}
                    title="Options"
                >▾</button>
                {showMenu && (
                    <div style={{
                        position: 'absolute', top: '110%', right: 0,
                        background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 10, padding: '6px 0', minWidth: 150,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.4)', zIndex: 999,
                    }}>
                        <button
                            onClick={handleLogout}
                            style={{
                                width: '100%', background: 'none', border: 'none',
                                color: '#ff6b6b', fontFamily: 'Outfit,sans-serif',
                                fontSize: 13, fontWeight: 600, padding: '8px 16px',
                                textAlign: 'left', cursor: 'pointer',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,107,0.1)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                            ⏏ Se déconnecter
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
