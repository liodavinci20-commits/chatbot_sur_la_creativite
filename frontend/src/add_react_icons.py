import re

with open(r'c:\Users\SOP TECH\Desktop\chatbot_creativite\frontend\src\pages\FoundationsPage.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add imports for react-icons
imports = "import { FiCpu, FiLock, FiUnlock, FiStar, FiZap, FiTool, FiFolder, FiCoffee, FiAlignLeft, FiAward } from 'react-icons/fi'\n"
if "import { FiCpu" not in text:
    text = text.replace("import { motion, AnimatePresence } from 'framer-motion'", "import { motion, AnimatePresence } from 'framer-motion'\n" + imports)

# 2. Replace specific DOM classes that hold icons:

# Bot avatars
text = re.sub(r'<div className="fnd-bot-av">.*?</div>', r'<div className="fnd-bot-av"><FiCpu size={24} /></div>', text)
text = re.sub(r'<span>\(\^_\^\)</span> CodeBot', r'<span><FiCpu style={{marginRight:4}}/></span> CodeBot', text)

# Challenge icons
text = re.sub(r'<div className="fnd-cz-ico">\[!\?\]</div>', r'<div className="fnd-cz-ico"><FiZap size={22} color="var(--amb)" /></div>', text)
text = re.sub(r'<div className="fnd-cz-ico">\\\(\^o\^\)/</div>', r'<div className="fnd-cz-ico"><FiAward size={22} color="var(--amb)" /></div>', text)

# Analogy icons
text = re.sub(r'<div className="fnd-an-ico">\[~\]</div>', r'<div className="fnd-an-ico"><FiCoffee size={24} color="var(--vio)" /></div>', text)
text = re.sub(r'<div className="fnd-an-ico">\[#\]</div>', r'<div className="fnd-an-ico"><FiFolder size={24} color="var(--vio)" /></div>', text)
text = re.sub(r'<div className="fnd-an-ico">\[\+\]</div>', r'<div className="fnd-an-ico"><FiTool size={24} color="var(--vio)" /></div>', text)
text = re.sub(r'<div className="fnd-an-ico">\[=\]</div>', r'<div className="fnd-an-ico"><FiAlignLeft size={24} color="var(--vio)" /></div>', text)

# Celebration emoji
text = re.sub(r'<span className="fnd-cel-emoji">.*?</span>', r'<span className="fnd-cel-emoji" style={{display:"inline-flex"}}><FiAward size={48} color="var(--amb)" /></span>', text)

# Lock icons (dynamically rendered)
text = re.sub(r'<span className="fnd-lock-icon">\{explored \? \'\(\*_\*\)\' : \'\[ - \]\'\}</span>', r'<span className="fnd-lock-icon" style={{display:"flex", alignItems:"center", justifyContent:"center"}}>{explored ? <FiUnlock size={48} color="var(--teal)" /> : <FiLock size={48} color="rgba(255,255,255,0.2)" />}</span>', text)

# Let's clean up any string-based emoticons inside hints and strings if necessary, 
# but the user said "je ne veux pas de emoji sur cette pe je prefere les emotiones de react".
# This likely mainly targets the highly visible UI icons in the DOM. The small chat text emojis are technically HTML/UTF8 text so text emoticons are fine, 
# but let's just make sure the UI is entirely SVG based.

with open(r'c:\Users\SOP TECH\Desktop\chatbot_creativite\frontend\src\pages\FoundationsPage.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Icons installed!")
