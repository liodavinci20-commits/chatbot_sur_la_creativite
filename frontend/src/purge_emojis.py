import re

with open(r'c:\Users\SOP TECH\Desktop\chatbot_creativite\frontend\src\pages\FoundationsPage.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Dictionary of replacements:
# Emoji -> Text Emoticon
replacements = {
    '🤖': '(^_^)',
    '🔒': '[ - ]',
    '✨': '(*_*)',
    '🏆': '\\(^o^)/',
    '🍽️': '[~]',
    '⚡': '[!?]',
    '🔧': '[+]',
    '🍜': '[=]',
    '🗂️': '[#]',
    '📦': '[]',
    '💡': '(*_*)',
    '🎉': '\\(^_^)/',
    '🚀': '>>',
    '🌟': '(*_*)',
    '🔥': '(>_<)',
    '👌': '(^.^)',
    '👍': '(^_^)',
}

# The analogy and other specific icon spots look like: <div className="fnd-an-ico">🔧</div>
# We can just replace all occurrences of the emojis.

for emoji, emoticon in replacements.items():
    text = text.replace(emoji, emoticon)

with open(r'c:\Users\SOP TECH\Desktop\chatbot_creativite\frontend\src\pages\FoundationsPage.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Emojipedia purged successfully!")
