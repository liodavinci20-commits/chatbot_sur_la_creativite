import re

# 1. Update FoundationsPage.jsx
jsx_path = r'c:\Users\SOP TECH\Desktop\chatbot_creativite\frontend\src\pages\FoundationsPage.jsx'
with open(jsx_path, 'r', encoding='utf-8') as f:
    jsx_text = f.read()

# Make sure FiSend is imported
if 'FiSend' not in jsx_text:
    jsx_text = jsx_text.replace("import { FiCpu,", "import { FiCpu, FiSend,")

old_jsx = """        <div className="fnd-cinwrap">
          <textarea
            className="fnd-cin"
            placeholder="Pose ta question à CodeBot…"
            rows={1}
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleChatSend(chatInput)
              }
            }}
          />
          <button
            className="fnd-sndbtn"
            onClick={() => handleChatSend(chatInput)}
            title="Envoyer"
          >
            ↑
          </button>
        </div>"""

new_jsx = """        <div className="fnd-cinwrap">
          <div className="fnd-cin-inner">
            <textarea
              className="fnd-cin"
              placeholder="Pose une question complexe (Ex: Pourquoi HTML ?)"
              rows={1}
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleChatSend(chatInput)
                }
              }}
            />
            <button
              className={`fnd-sndbtn ${chatInput.trim() ? 'active' : ''}`}
              onClick={() => handleChatSend(chatInput)}
              title="Envoyer à l'IA"
            >
              <FiSend size={20} className="fnd-send-ico" />
            </button>
          </div>
        </div>"""

jsx_text = jsx_text.replace(old_jsx, new_jsx)

with open(jsx_path, 'w', encoding='utf-8') as f:
    f.write(jsx_text)

# 2. Update index.css
css_path = r'c:\Users\SOP TECH\Desktop\chatbot_creativite\frontend\src\index.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css_text = f.read()

old_cinwrap_css = """.fnd-cinwrap{
  padding:10px 12px;border-top:1px solid rgba(255,255,255,.055);
  background:var(--ink3);display:flex;gap:7px;align-items:flex-end;flex-shrink:0;
}
.fnd-cin{
  flex:1;padding:9px 12px;border-radius:11px;border:1px solid rgba(255,255,255,.09);
  background:rgba(255,255,255,.045);color:rgba(255,255,255,.92);font-size:12px;
  font-family:'Outfit',sans-serif;outline:none;resize:none;min-height:36px;max-height:72px;
  line-height:1.5;transition:all .18s;
}
.fnd-cin:focus{border-color:rgba(24,201,122,.4);background:rgba(24,201,122,.04)}
.fnd-cin::placeholder{color:rgba(255,255,255,.18)}
.fnd-sndbtn{
  width:34px;height:34px;border-radius:10px;background:var(--g1);border:none;
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  color:#fff;font-size:15px;flex-shrink:0;transition:all .18s;
  box-shadow:0 2px 10px rgba(24,201,122,.35);
}
.fnd-sndbtn:hover{box-shadow:0 4px 16px rgba(24,201,122,.5);transform:translateY(-1px)}"""

new_cinwrap_css = """.fnd-cinwrap {
  padding: 16px 20px;
  background: var(--ink2);
  border-top: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
  position: relative;
}
.fnd-cinwrap::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(123,111,248,0.5), transparent);
  opacity: 0.5;
}
.fnd-cin-inner {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  padding: 4px 6px 4px 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fnd-cin-inner:focus-within {
  border-color: rgba(123, 111, 248, 0.4);
  background: rgba(123, 111, 248, 0.04);
  box-shadow: 0 4px 24px rgba(123, 111, 248, 0.15);
}
.fnd-cin {
  flex: 1;
  padding: 12px 0;
  background: transparent;
  color: #fff;
  font-size: 13.5px;
  font-family: 'Outfit', sans-serif;
  outline: none;
  border: none;
  resize: none;
  min-height: 44px;
  max-height: 120px;
  line-height: 1.5;
}
.fnd-cin::placeholder {
  color: rgba(255,255,255,0.3);
  font-weight: 300;
}
.fnd-sndbtn {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: rgba(255,255,255,0.05);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.4);
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  margin-bottom: 2px;
}
.fnd-sndbtn.active {
  background: var(--g2);
  color: #fff;
  box-shadow: 0 4px 20px rgba(123, 111, 248, 0.4);
}
.fnd-sndbtn.active:hover {
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 6px 28px rgba(123, 111, 248, 0.6);
}
.fnd-send-ico {
  transform: translateX(-1px) translateY(1px);
  transition: transform 0.2s;
}
.fnd-sndbtn.active:hover .fnd-send-ico {
  transform: translateX(1px) translateY(-1px);
}"""

if old_cinwrap_css in css_text:
    css_text = css_text.replace(old_cinwrap_css, new_cinwrap_css)
else:
    # Fallback to regex replacement if exact whitespace mismatch
    import re
    css_text = re.sub(r'\.fnd-cinwrap\{.*?(?=\/\*|\.fnd-xp-notif)', new_cinwrap_css + '\n', css_text, flags=re.DOTALL)

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css_text)

print("Redesign complete.")
