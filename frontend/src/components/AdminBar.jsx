// AdminBar.jsx — Barre flottante de navigation pour le mode développeur
// N'apparaît que si user.isAdmin === true
import { useNavigate, useLocation } from 'react-router-dom'

const PAGES = [
    { path: '/intro', label: 'Intro', icon: '[>]' },
    { path: '/foundations', label: 'Fondations', icon: '[=]' },
    { path: '/hub', label: 'Hub', icon: '[o]' },
    { path: '/mini-project', label: 'Mini-Projet', icon: '[^]' },
]

export default function AdminBar({ onLogout }) {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <div className="admin-bar">
            <div className="admin-bar-label">
                <span className="admin-bar-dot" />
                MODE DEV
            </div>
            <div className="admin-bar-pages">
                {PAGES.map(p => (
                    <button
                        key={p.path}
                        className={`admin-bar-btn${location.pathname === p.path ? ' active' : ''}`}
                        onClick={() => navigate(p.path)}
                    >
                        <span className="admin-bar-ico">{p.icon}</span>
                        <span className="admin-bar-lbl">{p.label}</span>
                    </button>
                ))}
            </div>
            <button className="admin-bar-logout" onClick={onLogout}>
                Quitter x
            </button>
        </div>
    )
}
