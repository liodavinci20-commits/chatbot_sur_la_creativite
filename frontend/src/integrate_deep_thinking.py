import re

jsx_path = r'c:\Users\SOP TECH\Desktop\chatbot_creativite\frontend\src\pages\FoundationsPage.jsx'
with open(jsx_path, 'r', encoding='utf-8') as f:
    jsx_text = f.read()

# 1. State
state_old = "const [chatLoading, setChatLoading] = useState(false)"
state_new = "const [chatLoading, setChatLoading] = useState(false)\n  const [isDeepThinking, setIsDeepThinking] = useState(false)"
if "const [isDeepThinking" not in jsx_text:
    jsx_text = jsx_text.replace(state_old, state_new)

# 2. Logic
logic_old = """  const handleChatSend = useCallback(async (text) => {
    const trimmed = text.trim()
    if (!trimmed || chatLoading) return
    addMsg('usr', trimmed)
    setChatInput('')"""

logic_new = """  const handleChatSend = useCallback(async (text) => {
    const trimmed = text.trim()
    if (!trimmed || chatLoading) return
    addMsg('usr', trimmed)
    setChatInput('')

    if (isDeepThinking) {
      setChatLoading(true)
      setTimeout(() => {
        addMsg('bot', '<div style="margin-bottom:8px;font-size:11px;color:rgba(255,255,255,0.5);display:flex;align-items:center;gap:4px;"><span style="color:var(--amb)">✨ Mode Réfléchi</span> activé</div><p style="margin:0">Cette question très fine sera bientôt envoyée directement à mon modèle LLM étendu ! J\'analyserai ton code en profondeur. Reviens très vite pour la connexion API.</p>')
        setChatLoading(false)
      }, 1500)
      return
    }"""
if "if (isDeepThinking) {" not in jsx_text:
    jsx_text = jsx_text.replace(logic_old, logic_new)

# Update useCallback deps
deps_old = "}, [chatLoading, addMsg])"
deps_new = "}, [chatLoading, addMsg, isDeepThinking])"
jsx_text = jsx_text.replace(deps_old, deps_new, 1) # Only first match inside handleChatSend

# 3. JSX
jsx_target_old = """        <div className="fnd-cinwrap">
          <div className="fnd-cin-inner">"""

jsx_target_new = """        <div className="fnd-cinwrap" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <button 
            className={`fnd-deep-toggle ${isDeepThinking ? 'on' : ''}`}
            onClick={() => setIsDeepThinking(!isDeepThinking)}
            title={isDeepThinking ? "Désactiver la réflexion avancée" : "Activer la réflexion avancée (LLM)"}
          >
            <FiStar size={13} style={{ fill: isDeepThinking ? 'currentColor' : 'none' }} /> 
            Mode Réfléchi
          </button>
          <div className="fnd-cin-inner">"""

if "fnd-deep-toggle" not in jsx_text:
    jsx_text = jsx_text.replace(jsx_target_old, jsx_target_new)
    
# Button class
btn_old = "className={`fnd-sndbtn ${chatInput.trim() ? 'active' : ''}`}"
btn_new = "className={`fnd-sndbtn ${chatInput.trim() ? 'active' : ''} ${isDeepThinking ? 'deep' : ''}`}"
if "deep' : ''" not in jsx_text:
    jsx_text = jsx_text.replace(btn_old, btn_new)

with open(jsx_path, 'w', encoding='utf-8') as f:
    f.write(jsx_text)

# 4. CSS
css_path = r'c:\Users\SOP TECH\Desktop\chatbot_creativite\frontend\src\index.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css_text = f.read()

new_css = """
/* --- DEEP THINKING TOGGLE --- */
.fnd-deep-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 11.5px;
  font-family: 'Outfit', sans-serif;
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 12px;
  align-self: flex-start;
  font-weight: 500;
}
.fnd-deep-toggle:hover {
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.8);
}
.fnd-deep-toggle.on {
  background: rgba(240,88,72,0.1);
  border-color: rgba(240,152,56,0.3);
  color: var(--amb);
  box-shadow: 0 0 16px rgba(240,152,56,0.15);
}

.fnd-sndbtn.active.deep {
  background: var(--g3);
  box-shadow: 0 4px 20px rgba(240,88,72,0.3);
}
.fnd-sndbtn.active.deep:hover {
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 6px 28px rgba(240,88,72,0.45);
}
"""

if ".fnd-deep-toggle" not in css_text:
    css_text += new_css
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css_text)

print("Deep Thinking toggle and logic integrated successfully!")
