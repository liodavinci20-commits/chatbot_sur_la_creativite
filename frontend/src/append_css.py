import re

with open(r'c:\Users\SOP TECH\Desktop\chatbot_creativite\prototype lione\codebot_fondations_v3.html', 'r', encoding='utf-8') as f:
    html = f.read()

css_match = re.search(r'<style>(.*?)</style>', html, re.DOTALL)
css = css_match.group(1)

# Grab the root variables and change :root to .fnd-app
css = re.sub(r':root', '.fnd-app', css, count=1)

# Remove the html, body reset
css = re.sub(r'html,body\s*\{.*?\}', '', css, flags=re.DOTALL)
css = re.sub(r'\*\{.*?\}', '', css, flags=re.DOTALL)


FND_CLASSES = {
    'app', 'tb', 'brand', 'bmark', 'pdots', 'pd-arrow', 'pdot', 'pd-circle', 'pd-label', 
    'tb-right', 'xp-pill', 'xp-n', 'xp-lbl', 'av', 'content', 'hero', 'hero-inner', 
    'hero-badge', 'hero-dot', 'hero-title', 'hero-sub', 'cp', 'cp-card', 'cp-head', 
    'cp-num', 'cp-info', 'cp-eyebrow', 'cp-title', 'cp-explain', 'exp-p', 'analogy', 
    'an-ico', 'an-txt', 'attr-list', 'attr-item', 'ai-badge', 'ai-desc', 'cp-code', 
    'code-tip', 'tip-dot', 'code-block', 'code-topbar', 'cb-dot', 'cb-lbl', 'code-body', 
    'cl', 'ann', 'cz-card', 'cz-hd', 'cz-ico', 'cz-ttl', 'cz-sub', 'fitb', 'blank', 
    'fitb-actions', 'btn-check', 'btn-hint', 'cz-fb', 'mcq', 'mopt', 'mk', 'unlock-btn', 
    'lp-box', 'lp-hdr', 'lp-dot', 'live-inp', 'lp-hint', 'type-tabs', 'ttab', 'type-pill', 
    'preview-box', 'fp-lbl', 'fp-sel', 'fp-ta', 'cel-card', 'cel-confetti', 'cel-emoji', 
    'cel-title', 'cel-sub', 'chat', 'chat-hd', 'bot-av', 'bot-nm', 'bot-st', 'chat-status', 
    'st-dot', 'msgs', 'mg', 'ms', 'bbl', 'typing-bbl', 'ty', 'chips', 'chip', 'cinwrap', 
    'cin', 'sndbtn', 'xp-notif', 'challenge-lock', 'lock-icon', 'ct', 'ca', 'cv', 'cc', 'cw',
    'cp-challenge'
}

RENAMES = {'prog-dots': 'pdots', 'concept-panel': 'cp'}

def replace_class(m):
    prefix = m.group(1)
    cls = m.group(2)
    if cls in RENAMES:
        cls = RENAMES[cls]
    if cls in FND_CLASSES:
        return f"{prefix}.fnd-{cls}"
    return f"{prefix}.{cls}"

css = re.sub(r'(^|[\s,>+~:]+)\.([a-zA-Z_-][a-zA-Z0-9_-]*)', replace_class, css)
css = css.replace('#confetti-cvs', '.fnd-confetti-cvs')
css += "\n.fnd-mg.usr-align { align-items: flex-end; }\n"

css_to_append = "\n\n/* ==================================================== */\n/* FOUNDATIONS PAGE CSS (v3 prototype) */\n/* ==================================================== */\n" + css

with open(r'c:\Users\SOP TECH\Desktop\chatbot_creativite\frontend\src\index.css', 'r', encoding='utf-8') as f2:
    idx = f2.read()

idx = idx.split('/* FOUNDATIONS PAGE CSS (v3 prototype) */')[0].strip()
idx += css_to_append

with open(r'c:\Users\SOP TECH\Desktop\chatbot_creativite\frontend\src\index.css', 'w', encoding='utf-8') as f3:
    f3.write(idx)

print("Appended CSS with scoped .fnd-app variables.")
