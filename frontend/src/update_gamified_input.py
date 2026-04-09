import re
import os

base_dir = r"c:\Users\SOP TECH\Desktop\chatbot_creativite\frontend\src"
file_path = os.path.join(base_dir, "pages", "FoundationsPage.jsx")

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update State
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

new_state = """  /* ── Concept 2 — <input> ── */
  const [inputLessonStage, setInputLessonStage] = useState(0) // 0=idle, 1=typed(wow), 2=erased(pouff), 3=retyped(continue), 4=attributes
  const [userCodeInput, setUserCodeInput] = useState('')
  const [hlAttr, setHlAttr] = useState(null)
  const [liveReq, setLiveReq] = useState(false)
  const [livePH, setLivePH] = useState('Ton prénom')

  const handleUserCodeChange = (e) => {
    const val = e.target.value;
    setUserCodeInput(val);
    const hasInput = val.toLowerCase().includes('<input') || val.toLowerCase().includes('input');
    
    setInputLessonStage(prev => {
        if (prev === 0 && hasInput) return 1;
        if (prev === 1 && val.trim() === '') return 2;
        if (prev === 2 && hasInput) return 3;
        return prev;
    });
  }"""

text = text.replace(old_state, new_state)


# 2. Update UI block for CONCEPT 2
old_pattern = r"                    \{\/\* L'Analogie \*\/\}.*?                    <\/div>\n                  <\/div>\n                <\/div>\n              <\/div>\n            \)\}"

new_block = """                    {/* L'Analogie */}
                    <motion.div 
                        className="fnd-analogy-box"
                        style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid var(--teal)', marginBottom: '20px' }}
                    >
                        <strong>🧠 L'Analogie :</strong> Si <code className="t">&lt;form&gt;</code> est une grosse enveloppe postale, alors <code className="v">&lt;input&gt;</code> représente les <strong>lignes pointillées</strong> sur lesquelles l'utilisateur doit écrire son adresse et son nom. Et n'oublie pas la règle d'or : On écrit toujours l'adresse <em>sur</em> l'enveloppe, donc un <code className="v">&lt;input&gt;</code> doit toujours être créé <strong>à l'intérieur</strong> de <code className="t">&lt;form&gt;</code> !
                    </motion.div>
                    
                    {/* Les Consignes Interactives Dynamiques */}
                    {inputLessonStage === 0 && (
                      <motion.div 
                        className="fnd-interactive-prompt"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,189,46,0.1)', border: '1px dashed var(--amb)', borderRadius: '12px' }}
                      >
                        <strong style={{color: 'var(--amb)'}}>🛠️ À toi de jouer (Étape 1) :</strong> Tape le mot <code>&lt;input&gt;</code> à l'intérieur de la balise form en bas pour faire apparaître le champ magiquement dans l'écran de Rendu !
                      </motion.div>
                    )}

                    {inputLessonStage === 1 && (
                      <motion.div 
                        className="fnd-interactive-prompt"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{ marginTop: '20px', padding: '16px', background: 'rgba(40,200,64,0.1)', border: '1px dashed var(--gre)', borderRadius: '12px' }}
                      >
                        <strong style={{color: 'var(--gre)'}}>✨ WOW ! Il est apparu !</strong><br/>
                        Tu vois comment ton code "allume" l'écran ?<br/>
                        <strong style={{color: '#fff'}}>🔥 Défi (Étape 2) :</strong> Efface complètement le mot de la zone de code pour voir ce qui se passe !
                      </motion.div>
                    )}

                    {inputLessonStage === 2 && (
                      <motion.div 
                        className="fnd-interactive-prompt"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,95,87,0.1)', border: '1px dashed var(--red)', borderRadius: '12px' }}
                      >
                        <strong style={{color: 'var(--red)'}}>💨 POUF ! Disparu !</strong><br/>
                        Sans ce mot, le navigateur ne sait plus quoi afficher.<br/>
                        <strong style={{color: '#fff'}}>⚡ Défi (Étape 3) :</strong> Refais-le vite apparaître en le re-tapant, et on passera à la suite !
                      </motion.div>
                    )}

                    {inputLessonStage === 3 && (
                      <motion.div 
                        className="fnd-interactive-prompt"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        style={{ marginTop: '20px', padding: '16px', background: 'rgba(40,200,64,0.1)', border: '1px solid var(--gre)', borderRadius: '12px' }}
                      >
                        <strong style={{color: 'var(--gre)'}}>🏆 Bravo, tu as le pouvoir !</strong><br/>
                        Tu comprends maintenant le "Temps-Réel". 
                        <br/>
                        <button 
                            className="fnd-btn" 
                            style={{ background: 'var(--gre)', color: '#000', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px', boxShadow: '0 0 10px rgba(40,200,64,0.5)' }}
                            onClick={() => setInputLessonStage(4)}
                        >
                            Poursuivre la séance ! 🚀
                        </button>
                      </motion.div>
                    )}

                    {inputLessonStage === 4 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        style={{ marginTop: '24px' }}
                      >
                        <p className="fnd-exp-p">L'input possède plusieurs <strong>attributs puissants</strong> pour le transformer et l'améliorer. Clique sur chacun d'eux :</p>
                        <div className="fnd-attr-list">
                          {[
                            { key: 'type',        badge: 't', desc: 'Le type de champ (texte, email…)' },
                            { key: 'name',        badge: 'v', desc: "L'identifiant du champ côté serveur" },
                            { key: 'placeholder', badge: 'a', desc: "Le texte d'aide grisé à l'intérieur" },
                            { key: 'required',    badge: 'c', desc: 'Rend le champ obligatoire' },
                          ].map(({ key, badge, desc }) => (
                            <motion.div
                              key={key}
                              className={`fnd-attr-item${badge === 'v' ? ' hi-v' : ''}${hlAttr === key ? ' hi' : ''}`}
                              onClick={() => handleHlAttr(key)}
                              whileHover={{ x: 4 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span className={`fnd-ai-badge ${badge}`}>{key}</span>
                              <span className="fnd-ai-desc">{desc}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="fnd-cp-code">
                    <CodeBlock fileName="PRATIQUE.HTML">
                      <CodeLine><Ct c="&lt;form&gt;" /></CodeLine>
                      
                      {/* L'ÉDITEUR INTERACTIF */}
                      {inputLessonStage < 4 ? (
                        <div style={{ paddingLeft: '18px', margin: '8px 0' }}>
                          <input 
                            type="text" 
                            value={userCodeInput} 
                            onChange={handleUserCodeChange} 
                            placeholder={inputLessonStage === 2 ? "Retape ici..." : "Tape <input> ici..."} 
                            style={{ 
                              background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', 
                              padding: '8px 12px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '14px', width: '200px', outline: 'none'
                            }} 
                            autoFocus
                          />
                        </div>
                      ) : (
                        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}}>
                           <>
                            <CodeLine><Ct c="  &lt;input" /></CodeLine>
                            <CodeLine indent hl={hlAttr === 'type'} hlType="teal" onClick={() => handleHlAttr('type')} annotation="Type de champ">
                              <span style={{paddingLeft:'18px'}}><Ca c='type=' /><Cv c='"text"' /></span>
                            </CodeLine>
                            <CodeLine indent hl={hlAttr === 'name'} hlType="violet" onClick={() => handleHlAttr('name')} annotation="Identifiant">
                              <span style={{paddingLeft:'18px'}}><Ca c='name=' /><Cv c='"prenom"' /></span>
                            </CodeLine>
                            <CodeLine indent hl={hlAttr === 'placeholder'} hlType="teal" onClick={() => handleHlAttr('placeholder')} annotation="Texte d'aide">
                              <span style={{paddingLeft:'18px'}}><Ca c='placeholder=' /><Cv c='"Ton prénom"' /></span>
                            </CodeLine>
                            <CodeLine indent hl={hlAttr === 'required'} hlType="violet" onClick={() => handleHlAttr('required')} annotation="Obligatoire !">
                              <span style={{paddingLeft:'18px'}}><Ca c='required' /></span>
                            </CodeLine>
                            <CodeLine><span style={{paddingLeft:'18px'}}><Ct c="/&gt;" /></span></CodeLine>
                           </>
                        </motion.div>
                      )}

                      <CodeLine><Ct c="&lt;/form&gt;" /></CodeLine>
                    </CodeBlock>

                    <div className="fnd-lp-box">
                      <div className="fnd-lp-hdr"><span className="fnd-lp-dot" />RENDU EN DIRECT</div>
                      
                      <div style={{ border: '2px dashed rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                        <AnimatePresence mode="wait">
                            {(inputLessonStage === 0 || inputLessonStage === 2) ? (
                              <motion.span 
                                key="empty"
                                initial={{ opacity: 0, scale: 0.8 }} 
                                animate={{ opacity: 1, scale: 1 }} 
                                exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
                                transition={{ duration: 0.3 }}
                                style={{ opacity: 0.3, fontSize: '13px', position: 'absolute' }}
                              >
                                {inputLessonStage === 0 ? "Le formulaire est vide... Tape la balise au-dessus !" : "Oh non ! Le champ est parti dans une autre dimension..."}
                              </motion.span>
                            ) : (
                              <motion.input
                                key="rendered-input"
                                initial={{ scale: 0, opacity: 0, y: 30 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0, opacity: 0, y: -30, filter: 'blur(10px)' }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                type="text"
                                className="fnd-live-inp"
                                placeholder={livePH}
                                required={liveReq}
                                style={{ margin: 0, position: 'absolute' }}
                              />
                            )}
                        </AnimatePresence>
                      </div>

                      {inputLessonStage === 4 && (
                        <div className="fnd-lp-hint">
                          {hlAttr
                            ? { type: 'type="text" — champ texte normal', name: 'name= — indispensable pour que le serveur reçoive les données !', placeholder: 'Le placeholder disparaît quand tu tapes !', required: 'required activé ! Essaie de valider un formulaire avec ce champ vide.' }[hlAttr]
                            : "(^_^) Clique sur un attribut pour voir ce qu'il fait"
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}"""

text = re.sub(old_pattern, lambda m: new_block, text, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Gamified Loop implemented successfully!")
