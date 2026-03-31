// JourneySidebar.jsx — Sidebar timeline des 5 phases + carte élève

const PHASES = [
    { num: 1, name: 'Découvrir', sub: '(^_^) En cours' },
    { num: 2, name: 'Fondations HTML', sub: 'Balises et structure' },
    { num: 3, name: 'Explorer', sub: '5 rubriques pratiques' },
    { num: 4, name: 'Évaluer', sub: 'Quiz et feedback' },
    { num: 5, name: 'Créer', sub: 'Défi final complet' },
]

export default function JourneySidebar({ user, currentPhase = 1, xp = 0, streak = 0, completedPhases = [] }) {
    const initials = (user?.name || 'U')
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    const displayName = user?.name
        ? user.name.split(' ').map((w, i) => i === 0 ? w : w[0] + '.').join(' ')
        : 'Élève'

    return (
        <div className="v2-sidebar">
            <div className="v2-sb-main">
                <div className="v2-sb-label">Parcours</div>
                {PHASES.map((phase) => {
                    const isDone = completedPhases.includes(phase.num)
                    const isOn = phase.num === currentPhase
                    const stateClass = isDone ? 'done' : isOn ? 'on' : 'off'
                    const subText = isDone
                        ? '✓ Terminé'
                        : isOn
                            ? phase.sub
                            : phase.sub

                    return (
                        <div className="v2-ji" key={phase.num}>
                            <div className={`v2-jic ${stateClass}`}>
                                {isDone ? '✓' : phase.num}
                            </div>
                            <div className="v2-jib">
                                <div className={`v2-jitn ${stateClass}`}>{phase.name}</div>
                                <div className={`v2-jisg ${stateClass}`}>{subText}</div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="v2-sb-foot">
                <div className="v2-st-card">
                    <div className="v2-st-row">
                        <div className="v2-st-av">{initials}</div>
                        <div>
                            <div className="v2-st-name">{displayName}</div>
                            <div className="v2-st-class">{user?.classe || 'Classe'} · Informatique</div>
                        </div>
                    </div>
                    <div className="v2-st-stats">
                        <div className="v2-st-stat">
                            <div className="v2-st-stat-n">{xp}</div>
                            <div className="v2-st-stat-l">XP</div>
                        </div>
                        <div className="v2-st-stat">
                            <div className="v2-st-stat-n">{currentPhase}</div>
                            <div className="v2-st-stat-l">ÉTAPE</div>
                        </div>
                        <div className="v2-st-stat">
                            <div className="v2-st-stat-n">{streak}</div>
                            <div className="v2-st-stat-l">SÉRIE</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
