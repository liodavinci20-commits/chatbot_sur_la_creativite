import sys

with open(r'c:\Users\SOP TECH\Desktop\chatbot_creativite\frontend\src\index.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Fix for scroll expansion
# We find .fnd-chat{ and add min-height:0; overflow:hidden;
css = css.replace('.fnd-chat{', '.fnd-chat{min-height:0;overflow:hidden;')
# We also do the same for .fnd-content so it doesn't stretch the grid
css = css.replace('.fnd-content{', '.fnd-content{min-height:0;')

with open(r'c:\Users\SOP TECH\Desktop\chatbot_creativite\frontend\src\index.css', 'w', encoding='utf-8') as fw:
    fw.write(css)

print("Fixed chat layout stretching issue.")
