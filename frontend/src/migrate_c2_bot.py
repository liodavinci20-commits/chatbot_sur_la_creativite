import re
import os

base_dir = r"c:\Users\SOP TECH\Desktop\chatbot_creativite\frontend\src"
file_path = os.path.join(base_dir, "pages", "FoundationsPage.jsx")

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update State block (remove old handler, add ref)
old_state = """  /* ── Concept 2 — <input> ── */
  const [hasTypedInput, setHasTypedInput] = useState(false)
  const [showAttributes, setShowAttributes] = useState(false)
  const [userCodeInput, setUserCodeInput] = useState('')
  const [hlAttr, setHlAttr] = useState(null)
  const [liveReq, setLiveReq] = useState(false)
  const [livePH, setLivePH] = useState('Ton prénom')

  const handleUserCodeChange = (e) => {
    const val = e.target.value;
    setUserCodeInput(val);
    if (val.toLowerCase().includes('<input') || val.toLowerCase().includes('input')) {
      setHasTypedInput(true);
    }
  }"""

# Actually, the current file contains the `inputLessonStage` state setup from earlier!
# Let's cleanly replace the CURRENT state.
current_state_pattern = r"  \/\* ── Concept 2 — <input> ── \*\/\n  const \[hasTypedInput.*?  \}\n"
# Wait, currently the file has:
"""
  /* ── Concept 2 — <input> ── */
  const [hasTypedInput, setHasTypedInput] = useState(false)
  const [showAttributes, setShowAttributes] = useState(false)
  const [userCodeInput, setUserCodeInput] = useState('')
  const [hlAttr, setHlAttr] = useState(null)
  const [liveReq, setLiveReq] = useState(false)
  const [livePH, setLivePH] = useState('Ton prénom')

  const handleUserCodeChange = (e) => { ... }
"""
# No, wait, in previous steps I added `inputLessonStage` via python!
# Let's match the `inputLessonStage` block.
c2_state_pattern = r"  \/\* ── Concept 2 — <input> ── \*\/\n  const \[inputLessonStage, setInputLessonStage\].*?  \}"

new_state = """  /* ── Concept 2 — <input> ── */
  const [inputLessonStage, setInputLessonStage] = useState(0) // 0=idle, 1=typed(wow), 2=erased(pouff), 3=retyped(continue), 4=attributes
  const [userCodeInput, setUserCodeInput] = useState('')
  const [hlAttr, setHlAttr] = useState(null)
  const [liveReq, setLiveReq] = useState(false)
  const [livePH, setLivePH] = useState('Ton prénom')
  const c2ChevronWarned = useRef(false)
"""

text = re.sub(c2_state_pattern, new_state, text, flags=re.DOTALL)


# 2. Inject `handleUserCodeChange` and the initial ChatBot ping BELOW `addMsg`.
# addMsg is around line 396: `}, [chatLoading, addMsg, isDeepThinking])`
injection_point = "  /* ── Navigation entre concepts ── */"

new_handler = """  /* ── INTERACTIONS — Concept 2 (Boucle Chat Temps Réel) ── */
  useEffect(() => {
    if (current === 2 && inputLessonStage === 0) {
      addMsg('bot', "On passe au champ de saisie !<br/><br/>**Défi :** Tape le mot <code>&lt;input&gt;</code> à l'intérieur de la balise form en bas pour faire apparaître le champ magiquement dans l'écran de Rendu !", 500);
    }
  }, [current, inputLessonStage, addMsg]);

  const handleUserCodeChange = (e) => {
    const val = e.target.value;
    setUserCodeInput(val);
    const hasFullInput = val.toLowerCase().includes('<input') || val.toLowerCase().includes('<input>');
    const hasWordOnly = val.toLowerCase().includes('input');
    
    setInputLessonStage(prev => {
        if (prev === 0) {
            if (hasFullInput) {
                addMsg('bot', "✨ **WOW ! Il est apparu !**<br/><br/>Tu vois comment ton code 'allume' l'écran en temps réel ?<br/><br/>🔥 **Défi (Étape 2) :** Essaie d'effacer complètement le mot de la zone de code pour voir ce qui se passe !");
                return 1;
            } else if (hasWordOnly && !val.includes('<') && !c2ChevronWarned.current) {
                addMsg('bot', "⚠️ Oups ! N'oublie pas les chevrons `<` et `>` pour entourer le mot `input` ! Une balise HTML doit toujours être encadrée.");
                c2ChevronWarned.current = true;
            }
        }
        if (prev === 1 && val.trim() === '') {
            addMsg('bot', "💨 **POUF ! Disparu !**<br/><br/>Sans cette balise, le navigateur ne sait plus quoi afficher.<br/><br/>⚡ **Défi (Étape 3) :** Refais-le vite apparaître en le re-tapant, et on passera à la suite !");
            return 2;
        }
        if (prev === 2 && hasFullInput) {
            addMsg('bot', "🏆 **Bravo, la Force est avec toi !**<br/><br/>Tu as maintenant le pouvoir de créer et détruire des éléments HTML.<br/><br/>Clique sur le bouton **'Poursuivre la séance'** en bas pour découvrir ses super-attributs !");
            return 3;
        }
        return prev;
    });
  }

  /* ── Navigation entre concepts ── */"""

text = text.replace("  /* ── Navigation entre concepts ── */", new_handler, 1)


# 3. Clean up the UI blocks in Concept 2.
ui_pattern = r"                    \{\/\* Les Consignes Interactives Dynamiques \*\/\}\n                    \{inputLessonStage === 0 && \(.*?\n                    \{inputLessonStage === 4 && \("

new_ui = """                    {/* Le Bouton de Validation de Séance */}
                    {inputLessonStage === 3 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        style={{ marginTop: '20px', padding: '16px', background: 'rgba(40,200,64,0.1)', border: '1px solid var(--gre)', borderRadius: '12px' }}
                      >
                        <button 
                            className="fnd-btn" 
                            style={{ background: 'var(--gre)', color: '#000', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', width: '100%', boxShadow: '0 0 10px rgba(40,200,64,0.5)' }}
                            onClick={() => {
                                setInputLessonStage(4);
                                addMsg('bot', "Magnifique ! Je t'ai affiché ses **super-attributs** en bas. L'attribut `type` permet de transformer l'input en mot de passe ou en calendrier. Essaie-les tous !");
                            }}
                        >
                            🚀 Poursuivre la séance d'apprentissage !
                        </button>
                      </motion.div>
                    )}

                    {inputLessonStage === 4 && ("""

text = re.sub(ui_pattern, new_ui, text, flags=re.DOTALL)


with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("C2 ChatBot Migration complete!")
