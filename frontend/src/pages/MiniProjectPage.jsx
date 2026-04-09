import React, { useState, useEffect, useRef } from 'react'
import * as Motion from 'framer-motion'
const { motion, AnimatePresence } = Motion
import { FiSend, FiDownload, FiCheckCircle, FiLock, FiGlobe, FiSun, FiMoon, FiArrowRight } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import html2pdf from 'html2pdf.js'
import '../index.css' 

export default function MiniProjectPage({ user }) {
  const navigate = useNavigate()
  
  // ── Stats / Progression ──
  const [dialogStep, setDialogStep] = useState(user?.isAdmin ? 3 : 0)
  const [theme, setTheme] = useState('')
  const [formName, setFormName] = useState('')
  const [projectCode, setProjectCode] = useState('')
  
  const [exportReady, setExportReady] = useState(false)
  const [mistakes, setMistakes] = useState(new Set())
  const [dayMode, setDayMode] = useState(false)
  const liveFeedbackSent = useRef(new Set())

  // ── Chat ──
  const [messages, setMessages] = useState([
    { type: 'sys', html: 'Mode Projet Libre ✓' },
    {
      type: 'bot',
      id: 'welcome',
      html: `Bravo d'être arrivé jusqu'ici <strong>${user?.name || 'toi'}</strong> ! 🎉<br><br>Il est temps de créer ton tout premier formulaire complet à partir de zéro.<br><br>👉 <strong>Dans quelle activité aimerais-tu utiliser ce formulaire ?</strong> (ex: Inscription au club de foot, Commande de pizza, Tournoi d'échecs...)`,
    },
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const msgsRef = useRef(null)

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight
    }
  }, [messages, chatLoading])

  const addMsg = (type, html, delay = 0) => {
    if (delay > 0) {
      setTimeout(() => {
        setMessages(prev => [...prev, { type, html, id: Date.now() + Math.random() }])
      }, delay)
    } else {
      setMessages(prev => [...prev, { type, html, id: Date.now() + Math.random() }])
    }
  }

  const handleChatSubmit = (e) => {
    e.preventDefault()
    if (!chatInput.trim() || chatLoading) return
    
    addMsg('user', chatInput)
    const userVal = chatInput
    setChatInput('')
    setChatLoading(true)

    setTimeout(() => {
      setChatLoading(false)
      processBotResponse(userVal)
    }, 800)
  }

  const processBotResponse = (input) => {
    if (dialogStep === 0) {
      setTheme(input)
      setDialogStep(1)
      addMsg('bot', `Excellent choix ! Un formulaire pour : <strong>${input}</strong>, ça va être super !<br><br>👉 <strong>Quel "nom" (attribut <code>name</code>) technique vas-tu donner à ce formulaire dans le code ?</strong> (ex: <em>club_foot</em>, écris-le de préférence sans espace)`)
    } else if (dialogStep === 1) {
      const formattedName = input.replace(/\s+/g, '_').toLowerCase()
      setFormName(formattedName)
      setDialogStep(2)
      addMsg('bot', `Parfait, ce sera notre balise maîtresse : <code>&lt;form name="${formattedName}"&gt;</code>.<br><br>Dernière question de préparation :<br>👉 <strong>Quelles informations vas-tu demander aux gens ?</strong> Cite-m'en deux ou trois. (ex: prénom, email, âge...)`)
    } else if (dialogStep === 2) {
      setDialogStep(3)
      setProjectCode(`<!-- Formulaire : ${theme} -->\n<form name="${formName}">\n\n  \n\n</form>`)
      addMsg('bot', `C'est noté ! Je retiens que tu veux demander : ${input}.<br><br>🔓 <strong>L'Espace de Travail à droite est débloqué !</strong><br><br>À toi de coder ! Utilise <code>&lt;label&gt;</code>, <code>&lt;input&gt;</code> et un bouton d'envoi pour recréer tes champs. N'oublie pas les attributs vitaux qu'on a vus ensemble ! L'aperçu s'affichera en direct.`)
    }
  }

  const handleCodeChange = (e) => {
    const code = e.target.value
    setProjectCode(code)
    
    // Analyses très simples en Regex pour donner l'impression que le bot lit le code
    const hasLabel = /<label/i.test(code)
    const hasFor = /for=/i.test(code)
    if (hasLabel && !hasFor) {
       if (!liveFeedbackSent.current.has('no_for')) {
         addMsg('bot', "⚠️ Attention, tu as créé une balise <code>&lt;label&gt;</code> mais il manque l'attribut de liaison <code>for=\"...\"</code> ! Le navigateur affichera le texte mais ne saura pas à qui il appartient.")
         liveFeedbackSent.current.add('no_for')
         setMistakes(p => new Set([...p, 'A pensé au &lt;label&gt; mais a d\'abord oublié de le lier avec "for="']))
       }
    }

    const hasInput = /<input/i.test(code)
    const hasId = /id=/i.test(code)
    if (hasInput && !hasId) {
       if (!liveFeedbackSent.current.has('no_id')) {
         addMsg('bot', "⚠️ Un <code>&lt;input&gt;</code> est apparu ! Super. Mais as-tu pensé à lui donner une identité unique avec <code>id=\"...\"</code> pour que l'étiquette s'y accroche ?")
         liveFeedbackSent.current.add('no_id')
         setMistakes(p => new Set([...p, 'Oubli de l\'attribt "id=" dans un &lt;input&gt; au début']))
       }
    }

    const hasBtn = /<button/i.test(code)
    const hasSubmit = /type=["']submit["']/i.test(code)
    if (hasBtn && hasSubmit) {
      if (!liveFeedbackSent.current.has('good_submit')) {
         addMsg('bot', "✨ Génial, je vois un bouton d'envoi valide avec `type=\"submit\"` ! Une fois que tu as posé tous tes champs, clique dessus dans le Rendu Direct pour finaliser l'exercice.")
         liveFeedbackSent.current.add('good_submit')
      }
    } else if (hasBtn && !hasSubmit) {
       if (!liveFeedbackSent.current.has('no_submit')) {
         addMsg('bot', "⚠️ Le bouton est là, mais il n'a pas son pouvoir magique... Pense à lui donner le rôle de soumission !")
         liveFeedbackSent.current.add('no_submit')
         setMistakes(p => new Set([...p, 'A inséré le bouton d\'envoi sans préciser type="submit"']))
       }
    }
  }

  const handlePreviewSubmit = (e) => {
    e.preventDefault() 
    
    if (!exportReady) {
      setExportReady(true)
      
      let bilan = "🎉 <strong>FÉLICITATIONS ! Ton formulaire est validé !</strong><br><br>"
      if (mistakes.size > 0) {
        bilan += "📝 <strong>Petit Bilan pour la prochaine fois :</strong><ul>"
        mistakes.forEach(m => {
          bilan += `<li style="margin-left:20px;list-style-type:disc;">${m}</li>`
        })
        bilan += "</ul>C'est de ces petites hésitations qu'on apprend le plus !<br><br>"
      } else {
        bilan += "Aucune erreur d'inattention au démarrage, tu as un vrai regard de pro sur la syntaxe HTML ! 🏆<br><br>"
      }
      bilan += "Tu peux maintenant imprimer ton travail pour le garder en portfolio. Clique sur <strong>Télécharger mon Formulaire</strong> en haut du Rendu Direct !"
      
      addMsg('bot', bilan, 500)
    }
  }

  const downloadPDF = async () => {
    const element = document.getElementById('pdf-export-zone')
    element.style.background = '#ffffff'
    element.style.color = '#000000'
    element.style.padding = '40px'
    
    const opt = {
      margin:       10,
      filename:     `${formName || 'Mini_Projet_Formulaire'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }
    
    try {
      await html2pdf().set(opt).from(element).save()
    } catch(err){
      console.error(err)
    } finally {
      element.style.padding = '0' // On reset le padding (il est appliqué dans un conteneur externe en UI normale)
    }
  }

  return (
    <div className="fnd-app">
      {/* ────────────────────────────────────────────────────────
          COLONNE GAUCHE — LE CHAT CODEBOT
      ──────────────────────────────────────────────────────── */}
      <div className="fnd-chat-col">
        <div className="fnd-chat-hdr">
          <div className="fnd-ch-avt">CB</div>
          <div>
            <div className="fnd-ch-name">CodeBot</div>
            <div className="fnd-ch-stat">🟢 En ligne — Mode Projet</div>
          </div>
        </div>

        <div className="fnd-chat-msgs" ref={msgsRef}>
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`fnd-msg-row ${m.type}`}
              >
                {m.type === 'bot' && <div className="fnd-msg-avt">CB</div>}
                {m.type === 'sys' ? (
                  <div className="fnd-msg-sys">{m.html}</div>
                ) : (
                  <div className="fnd-msg-bubble" dangerouslySetInnerHTML={{ __html: m.html }} />
                )}
                {m.type === 'user' && <div className="fnd-msg-avt u">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>}
              </motion.div>
            ))}
            {chatLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fnd-msg-row bot">
                <div className="fnd-msg-avt">CB</div>
                <div className="fnd-typing"><span>.</span><span>.</span><span>.</span></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <form className="fnd-chat-inp-ar" onSubmit={handleChatSubmit} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.5)' }}>
          <input
            type="text"
            className="fnd-chat-inp"
            placeholder={dialogStep < 3 ? "Réponds d'abord à CodeBot..." : "Communique avec le bot..."}
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            disabled={chatLoading}
          />
          <button type="submit" className="fnd-chat-send" disabled={!chatInput.trim() || chatLoading}>
            <FiSend size={18} />
          </button>
        </form>
      </div>

      {/* ────────────────────────────────────────────────────────
          COLONNE DROITE — L'ESPACE DE TRAVAIL (CODE + RENDU)
      ──────────────────────────────────────────────────────── */}
      <div className={`fnd-content-col${dayMode ? ' day' : ''}`} style={{ padding: '0 32px' }}>
        <div className="fnd-top-hd">
          <div className="fnd-hd-left">
            <h1 className="fnd-ti-main">Mon Mini-Projet <span style={{color:'var(--amb)', textShadow: '0 0 15px rgba(255, 189, 46, 0.4)'}}>HTML</span></h1>
            <div className="fnd-ti-sub">Crée, vérifie, et imprime ton formulaire comme un pro.</div>
          </div>
          <button
            className="mp-mode-toggle"
            onClick={() => setDayMode(d => !d)}
            title={dayMode ? 'Passer en mode nuit' : 'Passer en mode jour'}
          >
            {dayMode ? <FiMoon size={14} /> : <FiSun size={14} />}
            {dayMode ? 'Nuit' : 'Jour'}
          </button>
        </div>

        {dialogStep < 3 ? (
          /* ── ECRAN DE VERROUILLAGE (GLASSMORPHISM) ── */
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(circle at center, rgba(123,111,248,0.15) 0%, transparent 70%)',
              zIndex: 0
            }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, type: 'spring' }}
              style={{
                position: 'relative', zIndex: 1,
                textAlign: 'center', maxWidth: '450px',
                background: dayMode ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.03)',
                border: dayMode ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                padding: '48px 40px', borderRadius: '24px',
                boxShadow: dayMode
                  ? '0 30px 60px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)'
                  : '0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                display: 'flex', flexDirection: 'column', alignItems: 'center'
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div style={{
                  background: 'rgba(123,111,248,0.1)', padding: '24px',
                  borderRadius: '50%', marginBottom: '24px', border: '1px solid rgba(123,111,248,0.2)'
                }}>
                  <FiLock size={48} color="var(--vio)" style={{ filter: 'drop-shadow(0 0 15px rgba(123,111,248,0.6))' }} />
                </div>
              </motion.div>
              <h2 style={{
                fontSize: '28px', margin: '0 0 16px', fontWeight: '800', letterSpacing: '-0.5px',
                backgroundImage: dayMode
                  ? 'linear-gradient(to bottom right, #1a1a2e, #0369a1)'
                  : 'linear-gradient(to bottom right, #ffffff, #a5f3fc)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                Laboratoire Verrouillé
              </h2>
              <p style={{ color: dayMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)', lineHeight: 1.6, fontSize: '15px', margin: 0 }}>
                Discute d'abord avec <strong>CodeBot</strong> pour définir les caractéristiques de ton formulaire. L'IDE pro s'ouvrira de lui-même.
              </p>
            </motion.div>
          </div>
        ) : (
          /* ── LE WORKSPACE DEBLOQUÉ ── */
          <motion.div 
            className="fnd-workspace"
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ display: 'flex', flexDirection: 'column', gap: '32px', flex: 1, minHeight: 0, overflowY: 'auto', paddingBottom: '40px' }}
          >
            {/* L'Éditeur Pro (Style macOS) */}
            <div style={{ flexShrink: 0, borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 30px rgba(94, 234, 212, 0.05)' }}>
              <div style={{ background: '#1e1e1e', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56', boxShadow: '0 0 5px rgba(255,95,86,0.5)' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e', boxShadow: '0 0 5px rgba(255,189,46,0.5)' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f', boxShadow: '0 0 5px rgba(39,201,63,0.5)' }} />
                <code style={{ marginLeft: '16px', color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: '500', letterSpacing: '0.5px' }}>index.html — Éditeur Temps Réel</code>
              </div>
              <textarea
                value={projectCode}
                onChange={handleCodeChange}
                spellCheck={false}
                style={{
                  width: '100%',
                  height: '240px',
                  backgroundColor: '#0d1117',
                  color: '#5eead4',
                  border: 'none',
                  padding: '24px',
                  fontFamily: '"Fira Code", monospace',
                  fontSize: '15px',
                  lineHeight: '1.6',
                  resize: 'vertical',
                  outline: 'none',
                  boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)'
                }}
              />
            </div>

            {/* Le Navigateur Web (Aperçu) */}
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.3)', background: '#f8fafc', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}>
              <div style={{ background: '#e2e8f0', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #cbd5e1' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                   <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#94a3b8' }} />
                   <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#94a3b8' }} />
                   <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#94a3b8' }} />
                </div>
                <div style={{ flex: 1, background: '#ffffff', borderRadius: '6px', padding: '6px 12px', color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)' }}>
                  <FiGlobe /> <span>https://{formName || 'localhost'}.codebot.app</span>
                </div>
                {exportReady && (
                  <AnimatePresence>
                    <motion.button 
                      initial={{ scale: 0.8, opacity: 0, x: 20 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(182, 36, 255, 0.6)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={downloadPDF}
                      className="premium-export-btn"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: 'linear-gradient(135deg, var(--vio) 0%, #b624ff 100%)', color: 'white', fontWeight: 'bold',
                        border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(123,111,248,0.4)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px'
                      }}
                    >
                      <FiDownload size={16} /> Transformer en PDF
                    </motion.button>
                  </AnimatePresence>
                )}
              </div>
              
              <div 
                style={{ 
                  background: '#f8fafc',
                  padding: '32px',
                  display: 'flex',
                  justifyContent: 'center',
                  minHeight: '300px'
                }}
              >
                <div 
                  id="pdf-export-zone"
                  onSubmitCapture={handlePreviewSubmit}
                  style={{
                    color: '#1e293b', // Texte sombre pour le mode "feuille blanche"
                    width: '100%',
                    maxWidth: '650px',
                    padding: '40px',
                    background: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.02)',
                    fontFamily: '"Inter", sans-serif'
                  }}
                >
                  <div style={{ textAlign: 'center', marginBottom: '32px', paddingBottom: '16px', position: 'relative' }}>
                    <div style={{ position: 'absolute', bottom: 0, left: '20%', right: '20%', height: '2px', background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)' }} />
                    <h2 style={{ margin: 0, color: '#0f172a', fontSize: '28px', fontWeight: '800' }}>{theme ? `📝 ${theme}` : 'Formulaire'}</h2>
                    {user?.name && <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Créé par {user.name}</p>}
                  </div>
                  
                  {/* Injection du code HTML de l'élève */}
                  <div className="pdf-form-injection" dangerouslySetInnerHTML={{ __html: projectCode }} />
                  
                  {/* Filigrane de réussite officiel */}
                  {exportReady && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', damping: 12 }}
                      style={{ 
                        marginTop: '48px', textAlign: 'center', color: '#10b981', fontSize: '12px', fontWeight: 'bold', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '8px', border: '1px dashed #10b981'
                      }}
                    >
                      <FiCheckCircle size={18} /> EXERCICE CODEBOT VALIDÉ OFFICIELLEMENT
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
            
            {exportReady && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
                style={{ alignSelf: 'center', width: '100%', maxWidth: '420px', marginTop: '8px', marginBottom: '32px' }}
              >
                <motion.button
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/hub')}
                  style={{
                    width: '100%',
                    padding: '18px 24px',
                    background: 'linear-gradient(135deg, #7b6ff8 0%, #18c97a 100%)',
                    border: 'none',
                    borderRadius: '18px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    boxShadow: '0 8px 32px rgba(123,111,248,0.35), 0 2px 8px rgba(24,201,122,0.2)',
                  }}
                >
                  <FiArrowRight size={22} color="rgba(255,255,255,0.9)" />
                  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '16px', fontWeight: '800', color: '#fff', letterSpacing: '-0.3px' }}>
                      Approfondir mes connaissances
                    </span>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', fontWeight: '500', marginTop: '1px' }}>
                      Découvrir la suite du parcours →
                    </span>
                  </span>
                </motion.button>
              </motion.div>
            )}

          </motion.div>
        )}
      </div>
    </div>
  )
}
