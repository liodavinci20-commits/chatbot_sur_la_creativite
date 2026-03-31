import re

with open(r'c:\Users\SOP TECH\Desktop\chatbot_creativite\frontend\src\pages\FoundationsPage.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add TopBar import if missing
if "import TopBar" not in text:
    text = text.replace("import { useNavigate } from 'react-router-dom'", "import { useNavigate } from 'react-router-dom'\nimport TopBar from '../components/TopBar'")

# 2. Extract DOT_LABELS mapping and replace FoundationsTopBar
# Using regex to match from function FoundationsTopBar to the end of its block
tb_pattern = r'function FoundationsTopBar\(\{.*?return \(\n\s*<div className="fnd-tb">.*?</div>\n\s*\)\n\}'
match = re.search(tb_pattern, text, re.DOTALL)

if match:
    new_local_prog = """function FoundationsLocalProgress({ current, solved, onNavigate }) {
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
    text = text.replace(match.group(0), new_local_prog)

# 3. Replace usage
usage_pattern = r'\{\s*/\*\s*── TopBar ──\s*\*/\s*\}.*?<FoundationsTopBar[^>]*/>'
match2 = re.search(usage_pattern, text, re.DOTALL)
if match2:
    text = text.replace(match2.group(0), '{/* ── TopBar ── */}\n      <TopBar user={user} currentStep={2} completedSteps={[1]} />')

# 4. Inject
inject_pattern = r'(<div className="fnd-hero-sub">.*?</div>\n\s*</div>\n\s*</div>)'
match3 = re.search(inject_pattern, text, re.DOTALL)
if match3:
    original_hero = match3.group(1)
    # The end of hero is:
    # </div> (hero-inner)
    # </div> (hero)
    new_hero = original_hero.replace('</div>\n        </div>', """  <FoundationsLocalProgress 
              current={current} 
              solved={solved} 
              onNavigate={(n) => showConcept(n, true)} 
            />
          </div>
        </div>""")
    text = text.replace(original_hero, new_hero)


with open(r'c:\Users\SOP TECH\Desktop\chatbot_creativite\frontend\src\pages\FoundationsPage.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("UX Refactoring complete!")
