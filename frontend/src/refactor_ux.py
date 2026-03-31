import re

with open(r'c:\Users\SOP TECH\Desktop\chatbot_creativite\frontend\src\pages\FoundationsPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import TopBar
if "import TopBar" not in content:
    content = content.replace("import { useNavigate } from 'react-router-dom'", "import { useNavigate } from 'react-router-dom'\nimport TopBar from '../components/TopBar'")

# 2. Replace FoundationsTopBar definition
old_topbar_def = """function FoundationsTopBar({ current, solved, user, xp, onNavigate }) {
  return (
    <div className="fnd-tb">
      <div className="fnd-brand">
        <div className="fnd-bmark">&lt;/&gt;</div>
        <span>CodeBot</span>
      </div>

      <nav className="fnd-pdots">
        {DOT_LABELS.map((label, i) => {
          const n = i + 1
          const isDone = solved[n]
          const isActive = n === current
          const isLocked = n > current && !isDone
          return (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {i > 0 && <span className="fnd-pd-arrow">›</span>}
              <button
                className={`fnd-pdot${isDone && !isActive ? ' done' : ''}${isActive ? ' active' : ''}${isLocked ? ' locked' : ''}`}
                onClick={() => !isLocked && onNavigate(n)}
                disabled={isLocked}
              >
                <span className="fnd-pd-circle">
                  {isDone && !isActive ? '✓' : n}
                </span>
                <span
                  className="fnd-pd-label"
                  dangerouslySetInnerHTML={{ __html: label }}
                />
              </button>
            </div>
          )
        })}
      </nav>

      <div className="fnd-tb-right">
        <div className="fnd-xp-pill">
          <span className="fnd-xp-n">{xp}</span>
          <span className="fnd-xp-lbl">XP</span>
        </div>
        <div className="fnd-av">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      </div>
    </div>
  )
}"""

new_local_prog_def = """function FoundationsLocalProgress({ current, solved, onNavigate }) {
  return (
    <div className="fnd-local-progress-wrap" style={{ marginTop: '28px', padding: '16px 24px', background: 'rgba(0,0,0,0.15)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <nav className="fnd-pdots" style={{ justifyContent: 'center' }}>
        {DOT_LABELS.map((label, i) => {
          const n = i + 1
          const isDone = solved[n]
          const isActive = n === current
          const isLocked = n > current && !isDone
          return (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {i > 0 && <span className="fnd-pd-arrow" style={{ opacity: 0.5 }}>›</span>}
              <button
                className={`fnd-pdot${isDone && !isActive ? ' done' : ''}${isActive ? ' active' : ''}${isLocked ? ' locked' : ''}`}
                onClick={() => !isLocked && onNavigate(n)}
                disabled={isLocked}
              >
                <span className="fnd-pd-circle">
                  {isDone && !isActive ? '✓' : n}
                </span>
                <span
                  className="fnd-pd-label"
                  dangerouslySetInnerHTML={{ __html: label }}
                />
              </button>
            </div>
          )
        })}
      </nav>
    </div>
  )
}"""

content = content.replace(old_topbar_def, new_local_prog_def)

# 3. Replace the usage of FoundationsTopBar
old_topbar_usage = """      {/* ── TopBar ── */}
      <FoundationsTopBar
        current={current}
        solved={solved}
        user={user}
        xp={xp}
        onNavigate={(n) => showConcept(n, true)}
      />"""

new_topbar_usage = """      {/* ── TopBar ── */}
      <TopBar user={user} currentStep={2} completedSteps={[1]} />"""

content = content.replace(old_topbar_usage, new_topbar_usage)

# 4. Inject FoundationsLocalProgress below hero-sub
old_hero_sub = """            <div className="fnd-hero-sub">
              5 concepts, 5 défis. <strong>Un seul à la fois</strong> — explore le code, relève le défi, passe au suivant.
            </div>
          </div>
        </div>"""

new_hero_sub = """            <div className="fnd-hero-sub">
              5 concepts, 5 défis. <strong>Un seul à la fois</strong> — explore le code, relève le défi, passe au suivant.
            </div>
            
            <FoundationsLocalProgress 
              current={current} 
              solved={solved} 
              onNavigate={(n) => showConcept(n, true)} 
            />
          </div>
        </div>"""

content = content.replace(old_hero_sub, new_hero_sub)

with open(r'c:\Users\SOP TECH\Desktop\chatbot_creativite\frontend\src\pages\FoundationsPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("UX Refactoring complete!")
