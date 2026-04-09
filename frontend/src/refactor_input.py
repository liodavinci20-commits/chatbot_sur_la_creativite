import re
import os

base_dir = r"c:\Users\SOP TECH\Desktop\chatbot_creativite\frontend\src"
file_path = os.path.join(base_dir, "pages", "FoundationsPage.jsx")

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Inject state
state_injection = """  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasTypedInput, setHasTypedInput] = useState(false)
  const [userCodeInput, setUserCodeInput] = useState('')"""
  
text = re.sub(r'  const \[messages, setMessages\] = useState\(\[\]\)\n  const \[loading, setLoading\] = useState\(false\)', state_injection, text)


# 2. Add an effect to auto-detect <input> being typed
effect_injection = """  const handleUserCodeChange = (e) => {
    const val = e.target.value;
    setUserCodeInput(val);
    if (val.toLowerCase().includes('<input') || val.toLowerCase().includes('input')) {
      setHasTypedInput(true);
    }
  }

  const sendMessage = async (text, isSystem = false) => {"""

text = text.replace('  const sendMessage = async (text, isSystem = false) => {', effect_injection)


# 3. Replace the block for CONCEPT 2
old_pattern = r'            \{\/\* ══════════════════════════════════════\n                CONCEPT 2 — <input>\n            ══════════════════════════════════════ \*\/\}\n            \{current === 2 && \(\n              <div className="fnd-cp">.*?              </div>\n            \)\}'

new_block = """            {/* ══════════════════════════════════════
                CONCEPT 2 — <input>
            ══════════════════════════════════════ */}
            {current === 2 && (
              <div className="fnd-cp">
                <div className="fnd-cp-card">
                  <div className="fnd-cp-head">
                    <div className="fnd-cp-num n2">2</div>
                    <div className="fnd-cp-info">
                      <div className="fnd-cp-eyebrow">CONCEPT 2 / 5</div>
                      <div className="fnd-cp-title">
                        L'élément <code className="v">&lt;input&gt;</code> — Le champ de saisie
                      </div>
                    </div>
                  </div>

                  <div className="fnd-cp-explain">
                    <p className="fnd-exp-p">
                      Après avoir vu l'importance de <code className="fnd-ic t">&lt;form&gt;</code>, on aborde la balise <code className="fnd-ic v">&lt;input&gt;</code>. Elle est indispensable car elle permet à ton utilisateur de <strong>saisir des informations</strong> (comme du texte, un mot de passe ou une date). Sans <code className="v">input</code>, impossible de te répondre !
                    </p>
                    
                    {/* L'Analogie */}
                    <motion.div 
                        className="fnd-analogy-box"
                        style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid var(--teal)', marginBottom: '20px' }}
                    >
                        <strong>🧠 L'Analogie :</strong> Si <code className="t">&lt;form&gt;</code> est une grosse enveloppe postale, alors <code className="v">&lt;input&gt;</code> représente les <strong>lignes pointillées</strong> sur lesquelles l'utilisateur doit écrire son adresse et son nom. Et n'oublie pas la règle d'or : On écrit toujours l'adresse <em>sur</em> l'enveloppe, donc un <code className="v">&lt;input&gt;</code> doit toujours être créé <strong>à l'intérieur</strong> de <code className="t">&lt;form&gt;</code> !
                    </motion.div>
                    
                    {!hasTypedInput && (
                      <motion.div 
                        className="fnd-interactive-prompt"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,189,46,0.1)', border: '1px dashed var(--amb)', borderRadius: '12px' }}
                      >
                        <strong style={{color: 'var(--amb)'}}>🛠️ À toi de jouer (Pratique) :</strong> Tape le mot <code>&lt;input&gt;</code> à l'intérieur de la balise form pour faire apparaître le champ magiquement dans l'écran de Rendu Direct !
                      </motion.div>
                    )}

                    {hasTypedInput && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        style={{ marginTop: '24px' }}
                      >
                        <p className="fnd-exp-p">Bravo ! Le champ est apparu dans le Rendu. L'input possède plusieurs <strong>attributs puissants</strong> pour modifier son comportement. Clique dessus :</p>
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
                      {!hasTypedInput ? (
                        <div style={{ paddingLeft: '18px', margin: '8px 0' }}>
                          <input 
                            type="text" 
                            value={userCodeInput} 
                            onChange={handleUserCodeChange} 
                            placeholder="Tape <input> ici..." 
                            style={{ 
                              background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', 
                              padding: '8px 12px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '14px', width: '200px', outline: 'none'
                            }} 
                            autoFocus
                          />
                        </div>
                      ) : (
                        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}}>
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
                        </motion.div>
                      )}

                      <CodeLine><Ct c="&lt;/form&gt;" /></CodeLine>
                    </CodeBlock>

                    <div className="fnd-lp-box">
                      <div className="fnd-lp-hdr"><span className="fnd-lp-dot" />RENDU EN DIRECT</div>
                      
                      <div style={{ border: '2px dashed rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {!hasTypedInput ? (
                          <span style={{ opacity: 0.3, fontSize: '13px' }}>Le formulaire est vide... Tape la balise au-dessus !</span>
                        ) : (
                          <motion.input
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            type="text"
                            className="fnd-live-inp"
                            placeholder={livePH}
                            required={liveReq}
                            style={{ margin: 0 }}
                          />
                        )}
                      </div>

                      {hasTypedInput && (
                        <div className="fnd-lp-hint">
                          {hlAttr
                            ? { type: 'type="text" — champ texte normal', name: 'name= — indispensable pour que le serveur reçoive les données !', placeholder: 'Le placeholder disparaît quand tu tapes !', required: 'required activé ! Essaie de valider un formulaire avec ce champ vide.' }[hlAttr]
                            : '(^_^) Clique sur un attribut pour voir ce qu\'il fait'
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}"""

# Re-escape the text for regex matching safety
text = re.sub(old_pattern, lambda m: new_block, text, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Redesign input step completed successfully with Analogy block.")
