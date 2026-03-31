// TopBar.jsx — Barre supérieure partagée (brand + stepper + avatar)

const STEPS = [
    { label: 'Découvrir', num: 1 },
    { label: 'Fondations', num: 2 },
    { label: 'Explorer', num: 3 },
    { label: 'Évaluer', num: 4 },
    { label: 'Créer', num: 5 },
]

export default function TopBar({ user, currentStep = 1, completedSteps = [] }) {
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
                            <span className={`v2-step ${cls}`}>
                                <span className="v2-sn">{isDone ? '✓' : step.num}</span>
                                {step.label}
                            </span>
                        </span>
                    )
                })}
            </div>
            <div className="v2-top-right">
                <div className="v2-vsep" />
                <div className="v2-avatar">{initials}</div>
                <span className="v2-av-name">{user?.name || 'Élève'}</span>
            </div>
        </div>
    )
}
