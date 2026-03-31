import sys

with open(r'c:\Users\SOP TECH\Desktop\chatbot_creativite\frontend\src\index.css', 'r', encoding='utf-8') as f:
    css = f.read()

parts = css.split('/* FOUNDATIONS PAGE CSS (v3 prototype) */')
if len(parts) > 1:
    fnd_css = parts[1]
    
    # 1. fnd-cp is flex
    fnd_css = fnd_css.replace('.fnd-cp{display:none;', '.fnd-cp{display:flex;')
    
    # 2. fnd-ann is inline-flex  
    fnd_css = fnd_css.replace('.fnd-ann{display:none;', '.fnd-ann{display:inline-flex;')
    
    # 3. fnd-cz-fb
    fnd_css = fnd_css.replace('display:none;', '/* display:none handled by React */')
    
    css = parts[0] + '/* FOUNDATIONS PAGE CSS (v3 prototype) */' + fnd_css
    
    with open(r'c:\Users\SOP TECH\Desktop\chatbot_creativite\frontend\src\index.css', 'w', encoding='utf-8') as fw:
        fw.write(css)
    print("Fixed display:none issues in Foundations CSS.")
else:
    print("Could not find the Foundations CSS section.")
