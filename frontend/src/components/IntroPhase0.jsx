// IntroPhase0.jsx — Séquence interactive d'ancrage pédagogique
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const APPS = [
  {
    id: 'instagram', name: 'Instagram', emoji: '📸',
    color: '#e1306c',
    bg: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    label: 'Se connecter',
  },
  {
    id: 'tiktok', name: 'TikTok', emoji: '🎵',
    color: '#fe2c55',
    bg: 'linear-gradient(135deg, #010101 0%, #2a2a2a 100%)',
    label: 'Connexion',
  },
  {
    id: 'whatsapp', name: 'WhatsApp', emoji: '💬',
    color: '#25d366',
    bg: 'linear-gradient(135deg, #075e54 0%, #128c7e 100%)',
    label: 'Continuer',
  },
  {
    id: 'facebook', name: 'Facebook', emoji: '👥',
    color: '#1877f2',
    bg: 'linear-gradient(135deg, #1877f2 0%, #0c4aad 100%)',
    label: 'Se connecter',
  },
]

// ─── Smartphone 3D + formulaire d'inscription ────────────────────────────────
function LoginAnimation({ app, onDone }) {
  const [animStep,   setAnimStep]   = useState(0)
  const [prenomText, setPrenomText] = useState('')
  const [emailText,  setEmailText]  = useState('')
  const [passText,   setPassText]   = useState('')
  const [confText,   setConfText]   = useState('')
  const [showTags,   setShowTags]   = useState(false)

  const PRENOM = 'Liodavinci'
  const EMAIL  = 'liodavinci@gmail.com'

  useEffect(() => {
    const t = []
    t.push(setTimeout(() => setAnimStep(1), 900))
    t.push(setTimeout(() => {
      let i = 0
      const iv = setInterval(() => {
        if (i < PRENOM.length) { i++; setPrenomText(PRENOM.slice(0, i)) }
        else { clearInterval(iv); setAnimStep(2) }
      }, 85)
    }, 1300))
    t.push(setTimeout(() => {
      let i = 0
      const iv = setInterval(() => {
        if (i < EMAIL.length) { i++; setEmailText(EMAIL.slice(0, i)) }
        else { clearInterval(iv); setAnimStep(3) }
      }, 52)
    }, 3000))
    t.push(setTimeout(() => {
      let i = 0
      const iv = setInterval(() => {
        if (i < 8) { i++; setPassText('•'.repeat(i)) }
        else { clearInterval(iv); setAnimStep(4) }
      }, 100)
    }, 5400))
    t.push(setTimeout(() => {
      let i = 0
      const iv = setInterval(() => {
        if (i < 8) { i++; setConfText('•'.repeat(i)) }
        else { clearInterval(iv); setAnimStep(5) }
      }, 100)
    }, 6600))
    t.push(setTimeout(() => setAnimStep(6), 7800))
    t.push(setTimeout(() => { setShowTags(true); setAnimStep(7) }, 8500))
    t.push(setTimeout(() => onDone(), 11000))
    return () => t.forEach(clearTimeout)
  }, [])

  const tag = (txt, delay = 0) => (
    <motion.div
      initial={{ opacity: 0, y: -4, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay }}
      style={{
        position: 'absolute', top: -17, right: 0,
        background: '#0a0a12', color: app.color,
        fontSize: 8, fontFamily: "'JetBrains Mono',monospace",
        fontWeight: 700, padding: '2px 6px', borderRadius: 4,
        border: `1px solid ${app.color}45`, whiteSpace: 'nowrap', zIndex: 10,
      }}
    >{txt}</motion.div>
  )

  const field = (active) => ({
    border: `1.5px solid ${active ? app.color : '#eaeaea'}`,
    borderRadius: 7, padding: '6px 8px',
    fontSize: 10.5, fontFamily: 'Outfit,sans-serif', color: '#333',
    minHeight: 28, background: active ? `${app.color}0a` : '#f9f9f9',
    transition: 'all 0.3s',
    boxShadow: active ? `0 0 0 2.5px ${app.color}20` : 'none',
  })

  const cursor = (active) => active ? (
    <span style={{ display:'inline-block', width:1.5, height:10, background:app.color, marginLeft:1, verticalAlign:'middle', animation:'cursor-blink 0.65s infinite' }} />
  ) : null

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
      style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, padding:'6px 0 20px' }}
    >
      <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}
        style={{ fontSize:11.5, color:'rgba(255,255,255,0.5)', fontFamily:'Outfit,sans-serif', textAlign:'center', letterSpacing:'0.07em', textTransform:'uppercase' }}
      >
        Ta première inscription sur {app.name}…
      </motion.div>

      {/* ── Smartphone 3D CSS ── */}
      <motion.div
        initial={{ rotateY:-38, rotateX:14, y:70, opacity:0, scale:0.82 }}
        animate={{ rotateY:0,   rotateX:0,  y:0,  opacity:1, scale:1   }}
        transition={{ duration:1, type:'spring', stiffness:65, damping:13 }}
        style={{
          transformPerspective: 1100,
          width: 195,
          background: 'linear-gradient(160deg, #2e2e46 0%, #18182a 100%)',
          borderRadius: 34, padding: 7,
          boxShadow: `22px 22px 55px rgba(0,0,0,0.7), -3px -3px 14px rgba(255,255,255,0.05), inset 0 0 0 0.5px rgba(255,255,255,0.08), 5px 5px 0px #0d0d1a`,
          position: 'relative',
        }}
      >
        {/* Boutons latéraux */}
        <div style={{ position:'absolute', left:-4, top:75,  width:4, height:22, background:'#222238', borderRadius:'2px 0 0 2px' }}/>
        <div style={{ position:'absolute', left:-4, top:105, width:4, height:22, background:'#222238', borderRadius:'2px 0 0 2px' }}/>
        <div style={{ position:'absolute', right:-4, top:90, width:4, height:34, background:'#222238', borderRadius:'0 2px 2px 0' }}/>

        {/* Écran */}
        <div style={{ width:'100%', background:'#fff', borderRadius:28, overflow:'hidden', height:400, display:'flex', flexDirection:'column' }}>
          {/* Encoche */}
          <div style={{ height:22, background:'#fff', display:'flex', alignItems:'flex-start', justifyContent:'center', flexShrink:0 }}>
            <div style={{ width:68, height:15, background:'#18182a', borderRadius:'0 0 10px 10px' }}/>
          </div>
          {/* Header app */}
          <div style={{ background:app.bg, padding:'10px 12px 8px', textAlign:'center', flexShrink:0 }}>
            <div style={{ fontSize:16 }}>{app.emoji}</div>
            <div style={{ color:'#fff', fontWeight:800, fontSize:12, fontFamily:'Outfit,sans-serif' }}>Créer un compte</div>
          </div>
          {/* Formulaire d'inscription */}
          <div style={{ padding:'9px 10px', flex:1, display:'flex', flexDirection:'column', gap:7, overflow:'hidden' }}>
            {/* Prénom */}
            <div style={{ position:'relative' }}>
              <div style={field(animStep === 1)}>
                {prenomText || <span style={{ color:'#ccc' }}>Prénom</span>}
                {cursor(animStep === 1 && !prenomText)}
              </div>
              {showTags && tag('<input type="text">',  0)}
            </div>
            {/* Email */}
            <div style={{ position:'relative' }}>
              <div style={field(animStep === 2)}>
                {emailText || <span style={{ color:'#ccc' }}>Adresse email</span>}
                {cursor(animStep === 2 && !emailText)}
              </div>
              {showTags && tag('<input type="email">', 0.12)}
            </div>
            {/* Mot de passe */}
            <div style={{ position:'relative' }}>
              <div style={{ ...field(animStep === 3), letterSpacing: passText ? '3px' : 0 }}>
                {passText || <span style={{ color:'#ccc', letterSpacing:0 }}>Mot de passe</span>}
              </div>
              {showTags && tag('<input type="password">', 0.24)}
            </div>
            {/* Confirmer */}
            <div style={{ position:'relative' }}>
              <div style={{ ...field(animStep === 4), letterSpacing: confText ? '3px' : 0 }}>
                {confText || <span style={{ color:'#ccc', letterSpacing:0 }}>Confirmer</span>}
              </div>
            </div>
            {/* Bouton S'inscrire */}
            <div style={{ position:'relative' }}>
              <motion.div
                animate={animStep >= 5 ? { scale:[1, 0.93, 1.05, 1], boxShadow:[`0 2px 8px ${app.color}30`,`0 6px 22px ${app.color}70`,`0 2px 8px ${app.color}30`] } : {}}
                transition={{ duration:0.5 }}
                style={{ background: animStep >= 4 ? app.color : '#d0d0d0', color:'#fff', borderRadius:7, padding:'9px', textAlign:'center', fontSize:11.5, fontWeight:800, fontFamily:'Outfit,sans-serif', transition:'background 0.4s' }}
              >
                {animStep >= 6 ? '✓ Compte créé !' : "S'inscrire"}
              </motion.div>
              {showTags && tag('<input type="submit">', 0.35)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Révélation */}
      <AnimatePresence>
        {showTags && (
          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }}
            style={{ textAlign:'center', fontSize:13, color:app.color, fontFamily:'Outfit,sans-serif', fontWeight:800, padding:'8px 18px', borderRadius:10, background:`${app.color}15`, border:`1px solid ${app.color}35` }}
          >
            ✨ Ce formulaire que tu viens de remplir — c'est du HTML !
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Quiz formulaire (mise en abyme) ─────────────────────────────────────────
function QuizForm({ app, onAnswer }) {
  const [selected,  setSelected]  = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const options = [
    { key: 'A', text: "Un document papier à remplir pour une administration", correct: false },
    { key: 'B', text: "Une zone interactive sur une page web qui permet de collecter des informations", correct: true },
    { key: 'C', text: "Un programme qui calcule automatiquement des résultats", correct: false },
  ]

  const handleSubmit = () => {
    if (!selected || submitted) return
    setSubmitted(true)
    const opt = options.find(o => o.key === selected)
    setTimeout(() => onAnswer(opt.correct), 500)
  }

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '20px', boxShadow: '0 6px 28px rgba(0,0,0,0.10)', border: '1px solid #eee' }}>
      {/* En-tête façon formulaire */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${app.color}, ${app.color}aa)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
          📋
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#aaa', fontFamily: 'Outfit,sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Formulaire de compréhension</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', fontFamily: 'Outfit,sans-serif' }}>
            Suite à cette expérience, comment définirais-tu un formulaire HTML ?
          </div>
        </div>
      </div>

      {/* Options radio */}
      {options.map((opt) => {
        const isSelected = selected === opt.key
        return (
          <label
            key={opt.key}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '10px 12px', marginBottom: 8, borderRadius: 10,
              border: `1.5px solid ${isSelected ? app.color : '#e8e8e8'}`,
              background: isSelected ? `${app.color}0e` : '#fafafa',
              cursor: submitted ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
            onClick={() => !submitted && setSelected(opt.key)}
          >
            <input
              type="radio" name="quiz-def" value={opt.key}
              checked={isSelected} onChange={() => {}}
              style={{ marginTop: 2, accentColor: app.color, cursor: 'pointer' }}
            />
            <span style={{ fontSize: 12, fontFamily: 'Outfit,sans-serif', color: '#333', lineHeight: 1.5 }}>
              <strong style={{ color: app.color }}>{opt.key}.</strong>{'  '}{opt.text}
            </span>
          </label>
        )
      })}

      {/* Bouton submit */}
      <motion.button
        onClick={handleSubmit}
        disabled={!selected || submitted}
        whileHover={selected && !submitted ? { scale: 1.02 } : {}}
        whileTap={selected && !submitted ? { scale: 0.97 } : {}}
        style={{
          marginTop: 6, width: '100%', padding: '12px',
          background: selected && !submitted ? app.color : '#e0e0e0',
          color: '#fff', border: 'none', borderRadius: 10,
          fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 13,
          cursor: selected && !submitted ? 'pointer' : 'not-allowed',
          transition: 'background 0.25s',
        }}
      >
        {submitted ? '✓ Réponse envoyée' : 'Valider ma réponse'}
      </motion.button>

      {/* Petit label HTML en bas */}
      <div style={{ marginTop: 8, textAlign: 'right', fontSize: 9, color: '#bbb', fontFamily: 'JetBrains Mono,monospace' }}>
        {'<input type="radio"> + <input type="submit">'}
      </div>
    </div>
  )
}

// ─── Test de reconnaissance ───────────────────────────────────────────────────
function RecognitionTest({ onDone }) {
  const [checked, setChecked] = useState(new Set())

  const toggle = (id) => {
    setChecked(prev => {
      const s = new Set(prev)
      s.has(id) ? s.delete(id) : s.add(id)
      return s
    })
  }

  const ScreenCard = ({ id, label, children }) => {
    const isChecked = checked.has(id)
    return (
      <div
        onClick={() => toggle(id)}
        style={{
          border: `2px solid ${isChecked ? '#1DB97A' : '#e8e8e8'}`,
          borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
          position: 'relative', background: '#fff', transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: isChecked ? '0 4px 16px rgba(29,185,122,0.20)' : '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        {/* Checkbox overlay */}
        <div style={{
          position: 'absolute', top: 6, right: 6, width: 18, height: 18, zIndex: 2,
          background: isChecked ? '#1DB97A' : '#fff',
          border: `2px solid ${isChecked ? '#1DB97A' : '#ccc'}`,
          borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}>
          {isChecked && <span style={{ color:'#fff', fontSize:11, fontWeight:900, lineHeight:1 }}>✓</span>}
        </div>
        {/* App label */}
        <div style={{ background:'#f5f5f5', padding:'5px 8px 4px', fontSize:8, fontWeight:700, color:'#666', fontFamily:'Outfit,sans-serif', borderBottom:'1px solid #eee' }}>
          {label}
        </div>
        {children}
      </div>
    )
  }

  const inputStyle = { border:'none', outline:'none', width:'100%', fontSize:9, background:'transparent', pointerEvents:'none' }
  const fld = (extra={}) => ({ border:'1px solid #ddd', borderRadius:5, padding:'4px 7px', marginBottom:5, fontSize:9, fontFamily:'Outfit,sans-serif', ...extra })
  const lbl = { fontSize:9, color:'#999', fontFamily:'Outfit,sans-serif', marginBottom:2 }

  return (
    <motion.div
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      style={{ background:'#fff', borderRadius:16, padding:'20px', boxShadow:'0 6px 28px rgba(0,0,0,0.10)', border:'1px solid #eee', marginTop:24 }}
    >
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:15, fontWeight:800, color:'#1a1a2e', fontFamily:'Outfit,sans-serif', marginBottom:4 }}>🔍 Test de reconnaissance</div>
        <div style={{ fontSize:12, color:'#555', fontFamily:'Outfit,sans-serif', marginBottom:2 }}>
          Parmi ces trois écrans, coche ceux dont tu t'es réellement servi <strong>cette semaine</strong>.
        </div>
        <div style={{ fontSize:11, color:'#aaa', fontFamily:'Outfit,sans-serif', fontStyle:'italic' }}>
          Faisons un test rapide. Il n'y a aucun piège.
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10, marginBottom:16 }}>
        {/* Écran 1 : connexion générique */}
        <ScreenCard id="generic" label="Application">
          <div style={{ padding:'8px 8px 10px', display:'flex', flexDirection:'column' }}>
            <div style={lbl}>Nom d'utilisateur</div>
            <div style={fld()}><input type="text" readOnly style={inputStyle} /></div>
            <div style={lbl}>Mot de passe</div>
            <div style={fld()}><input type="password" readOnly style={inputStyle} /></div>
            <div style={{ background:'#4a90d9', color:'#fff', borderRadius:5, padding:'5px', textAlign:'center', fontSize:9, fontFamily:'Outfit,sans-serif', fontWeight:700 }}>
              Se connecter
            </div>
          </div>
        </ScreenCard>

        {/* Écran 2 : Instagram / TikTok */}
        <ScreenCard id="social" label="Instagram · TikTok">
          <div style={{ padding:'7px 8px 10px', display:'flex', flexDirection:'column' }}>
            <div style={lbl}>Téléphone / Email</div>
            <div style={fld()}><input type="email" readOnly style={inputStyle} /></div>
            <div style={lbl}>Mot de passe</div>
            <div style={fld()}><input type="password" readOnly style={inputStyle} /></div>
            <div style={{ background:'linear-gradient(135deg,#f09433,#dc2743,#bc1888)', color:'#fff', borderRadius:5, padding:'4px', textAlign:'center', fontSize:9, fontFamily:'Outfit,sans-serif', fontWeight:700, marginBottom:5 }}>
              Connexion
            </div>
            <div style={{ textAlign:'center', fontSize:7.5, color:'#bbb', fontFamily:'Outfit,sans-serif', marginBottom:4 }}>ou</div>
            <div style={{ display:'flex', gap:4, marginBottom:5 }}>
              <div style={{ flex:1, border:'1px solid #ddd', borderRadius:4, padding:'3px', textAlign:'center', fontSize:7.5, fontFamily:'Outfit,sans-serif' }}>Facebook</div>
              <div style={{ flex:1, border:'1px solid #ddd', borderRadius:4, padding:'3px', textAlign:'center', fontSize:7.5, fontFamily:'Outfit,sans-serif' }}>Google</div>
            </div>
            <div style={{ textAlign:'center', fontSize:7.5, color:'#888', fontFamily:'Outfit,sans-serif' }}>
              Pas encore de compte ? <span style={{ color:'#dc2743' }}>S'inscrire</span>
            </div>
          </div>
        </ScreenCard>

        {/* Écran 3 : WhatsApp sondage */}
        <ScreenCard id="whatsapp" label="WhatsApp">
          <div style={{ display:'flex', flexDirection:'column' }}>
            <div style={{ background:'#075e54', padding:'7px 9px' }}>
              <div style={{ color:'#fff', fontWeight:700, fontSize:9, fontFamily:'Outfit,sans-serif' }}>Groupe Terminale S</div>
              <div style={{ color:'rgba(255,255,255,0.6)', fontSize:7.5, fontFamily:'Outfit,sans-serif' }}>276 membres</div>
            </div>
            <div style={{ padding:'7px 8px 10px' }}>
              <div style={{ background:'#e9fbe5', borderRadius:7, padding:'6px 7px' }}>
                <div style={{ fontSize:7.5, color:'#075e54', fontWeight:800, fontFamily:'Outfit,sans-serif', marginBottom:3 }}>SONDAGE</div>
                <div style={{ fontSize:8.5, color:'#333', fontFamily:'Outfit,sans-serif', marginBottom:5 }}>Soirée révisions vendredi ?</div>
                {[
                  { val:'oui',   label:'Oui ! Je suis là 😊' },
                  { val:'non',   label:'Non, autre jour' },
                  { val:'maybe', label:'Peut-être...' },
                ].map(opt => (
                  <label key={opt.val} style={{ display:'flex', alignItems:'center', gap:5, marginBottom:4, cursor:'default', pointerEvents:'none' }}>
                    <input type="radio" name="wa-poll-display" readOnly style={{ accentColor:'#25d366' }} />
                    <span style={{ fontSize:8, fontFamily:'Outfit,sans-serif', color:'#333' }}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </ScreenCard>
      </div>

      <motion.button
        onClick={onDone}
        whileHover={{ scale:1.02 }}
        whileTap={{ scale:0.97 }}
        style={{
          width:'100%', padding:'13px',
          background:'linear-gradient(135deg, #1DB97A, #0ea5c4)',
          color:'#fff', border:'none', borderRadius:10,
          fontFamily:'Outfit,sans-serif', fontWeight:800, fontSize:13,
          cursor:'pointer',
        }}
      >
        Compris ! Je veux voir comment ça marche ›
      </motion.button>
    </motion.div>
  )
}

// ─── Composant principal Phase 0 ─────────────────────────────────────────────
export default function IntroPhase0({ user, onComplete, addChatMsg, addBotResponse, onRegisterHandler }) {
  const [step, setStep]               = useState('select')
  const [selectedApp, setSelectedApp] = useState(null)
  const [quizAttempt, setQuizAttempt] = useState(0)
  const [showContinue, setShowContinue] = useState(false)
  const stepRef           = useRef('select')
  const appRef            = useRef(null)
  const memoryAttemptsRef = useRef(0)

  const normalize = (str) => str.toLowerCase()
    .replace(/[éèêë]/g, 'e').replace(/[àâä]/g, 'a')
    .replace(/[ùûü]/g, 'u').replace(/[ôö]/g, 'o')
    .replace(/[îï]/g, 'i').replace(/ç/g, 'c')

  const isRegistrationKeyword = (text) => {
    const n = normalize(text)
    return ['inscri', 'creer', 'cree', 'compte', 'register', 'enregistr', 'signup', 'sign up'].some(kw => n.includes(kw))
  }

  const app = APPS.find(a => a.id === selectedApp)

  // Met à jour les refs à chaque changement d'état
  useEffect(() => { stepRef.current = step },         [step])
  useEffect(() => { appRef.current  = selectedApp },  [selectedApp])

  // ── Handler enregistré auprès d'IntroPage : reçoit les messages de ChatPanel2 ──
  useEffect(() => {
    const handler = (text) => {
      const currentStep = stepRef.current
      const currentApp  = APPS.find(a => a.id === appRef.current)

      if (currentStep === 'select') {
        addBotResponse(`😊 Commence par cliquer sur l'application que tu utilises le plus ci-dessus !`)
        return
      }

      if (currentStep === 'asked' && currentApp) {
        setStep('responded')
        setTimeout(() => {
          addBotResponse(
            `Pour <em>${text}</em>… c'est exactement ça ! 🌟<br><br>La toute première fois que tu as eu à utiliser <strong>${currentApp.name}</strong>, il y avait quelque chose de <strong>crucial</strong> que tu devais faire avant d'accéder à quoi que ce soit — peux-tu me dire ce que c'était ?`
          )
          setTimeout(() => setStep('memory'), 700)
        }, 400)
        return
      }

      if (currentStep === 'memory') {
        if (isRegistrationKeyword(text)) {
          addBotResponse(`Bien ! 🎉 Tu devais <strong>t'inscrire</strong> — et pour ça, tu as rempli quelque chose de très précis. Tu peux voir exactement ce que tu as eu à faire la première fois… 👀`)
          setTimeout(() => {
            setStep('anim')
            addChatMsg({ type: 'system', text: '🎬 Regarde bien…' })
          }, 1300)
        } else {
          memoryAttemptsRef.current += 1
          const attempt = memoryAttemptsRef.current
          if (attempt === 1) {
            addBotResponse(`Tu es dans la bonne voie ! 😊 Pense à ce moment où l'app ne te connaissait pas encore — la toute première fois que tu l'as lancée. Qu'est-ce que tu as dû faire pour qu'elle te reconnaisse ?`)
          } else if (attempt === 2) {
            addBotResponse(`Presque ! 😊 Tu as dû entrer des informations sur toi — ton prénom, un email, un mot de passe… On appelle ça comment ?`)
          } else {
            addBotResponse(`C'est le moment où tu as créé ton compte — on dit qu'on s'est <strong>ins…</strong> ? 😊`)
          }
        }
        return
      }

      if (currentStep === 'anim') {
        addBotResponse(`😊 Regarde l'animation — elle se termine dans quelques secondes !`)
        return
      }

      if (currentStep === 'quiz') {
        addBotResponse(`😊 Réponds au formulaire ci-dessus — clique sur ta réponse puis sur "Valider" !`)
        return
      }

      addBotResponse(`😊 Clique sur le bouton pour commencer l'apprentissage !`)
    }

    onRegisterHandler?.(handler)
    return () => onRegisterHandler?.(null)
  }, [addBotResponse, onRegisterHandler])

  // Sélection d'une app
  const handleAppClick = (appId) => {
    const chosen = APPS.find(a => a.id === appId)
    memoryAttemptsRef.current = 0
    setSelectedApp(appId)
    setStep('asked')
    addChatMsg({ type: 'system', text: `${chosen.emoji} ${chosen.name} sélectionné` })
    setTimeout(() => {
      addBotResponse(`Hey ! Tu utilises <strong>${chosen.name}</strong> — dis-moi dans le chat, tu t'en sers pour quoi exactement dans ta vie de tous les jours ? 😊`)
    }, 300)
  }

  // Animation terminée → quiz
  const handleAnimDone = () => {
    setStep('quiz')
    addChatMsg({ type: 'system', text: '📋 Question de compréhension' })
    setTimeout(() => {
      addBotResponse(
        `Tu viens de voir du <strong>HTML</strong> en action ! 💎<br><br>D'après ce que tu viens de vivre sur <strong>${app?.name}</strong> — comment définirais-tu un formulaire HTML ? 👇`
      )
    }, 400)
  }

  // Réponse au quiz
  const handleQuizAnswer = (isCorrect) => {
    if (isCorrect) {
      addBotResponse(`✨ <strong>Exactement !</strong> Tu as trouvé la définition par l'expérience. Voici la définition officielle :`)
      setTimeout(() => {
        addBotResponse(
          `Un <strong>formulaire HTML</strong> est une zone de saisie interactive sur une page web qui permet de <strong>collecter des informations</strong> auprès des utilisateurs.<br><br>Il peut contenir des champs texte, des cases à cocher, des boutons radio, des menus déroulants et des boutons d'envoi.<br><br>Chaque app que tu utilises — <strong>${app?.name}</strong>, Instagram, TikTok — les utilise pour te connecter, t'inscrire et interagir. Et maintenant, <strong>tu vas apprendre à les créer toi-même.</strong> 💎`
        )
        setTimeout(() => setShowContinue(true), 1200)
      }, 1800)
    } else {
      addBotResponse(
        `Pas encore ! 😊 Souviens-toi de ce que tu viens de voir sur <strong>${app?.name}</strong> — des champs à remplir (prénom, email, mot de passe) directement sur une <strong>page web</strong>. Ce n'est pas du papier, ça ne calcule rien — ça <em>collecte</em> des infos. Réessaie ! 👇`
      )
      setTimeout(() => setQuizAttempt(k => k + 1), 2800)
    }
  }

  return (
    <div style={{ padding: '24px 0 40px' }}>

      {/* ── Sélection de l'app ── */}
      <AnimatePresence mode="wait">
        {step === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              fontSize: 22, fontWeight: 900,
              background: 'linear-gradient(135deg, #1DB97A, #0ea5c4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              fontFamily: 'Outfit,sans-serif', marginBottom: 8, lineHeight: 1.3,
            }}>
              C'est laquelle ton app préférée ? 🎮
            </div>
            <div style={{
              fontSize: 14, color: '#444', fontFamily: 'Outfit,sans-serif',
              marginBottom: 28, fontWeight: 500, lineHeight: 1.5,
            }}>
              Celle que tu ouvres dès que tu as 5 minutes libres —<br />
              <strong style={{ color: '#1DB97A' }}>tape dessus !</strong> Tu vas voir quelque chose de dingue 👇
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, maxWidth: 340, margin: '0 auto' }}>
              {APPS.map(a => (
                <motion.button
                  key={a.id}
                  onClick={() => handleAppClick(a.id)}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: a.bg, border: 'none', borderRadius: 20,
                    padding: '26px 16px', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                    boxShadow: `0 8px 28px ${a.color}45`,
                  }}
                >
                  <span style={{ fontSize: 34 }}>{a.emoji}</span>
                  <span style={{ color: '#fff', fontWeight: 800, fontSize: 15, fontFamily: 'Outfit,sans-serif' }}>
                    {a.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Indication "réponds dans le chat" ── */}
      <AnimatePresence>
        {step === 'asked' && app && (
          <motion.div
            key="asked"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              marginTop: 20, display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px', borderRadius: 12,
              background: `${app.color}12`,
              border: `1px solid ${app.color}35`,
            }}
          >
            <span style={{ fontSize: 20 }}>{app.emoji}</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: 'Outfit,sans-serif' }}>
              App choisie : <strong style={{ color: '#fff' }}>{app.name}</strong>
              <span style={{ display: 'block', marginTop: 3, color: `${app.color}`, fontWeight: 600 }}>
                👇 Réponds à CodeBot dans le chat à droite
              </span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bouton mémoire ── */}
      <AnimatePresence>
        {step === 'memory' && app && (
          <motion.div
            key="memory"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ marginTop: 24, textAlign: 'center' }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 20px', borderRadius: 14,
              background: `${app.color}12`, border: `1px dashed ${app.color}55`,
            }}>
              <span style={{ fontSize: 20 }}>💬</span>
              <span style={{ fontSize: 13, fontFamily: 'Outfit,sans-serif', color: 'rgba(255,255,255,0.75)' }}>
                Réponds à CodeBot dans le chat →
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Animation de connexion ── */}
      <AnimatePresence>
        {step === 'anim' && app && (
          <motion.div key="anim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LoginAnimation app={app} onDone={handleAnimDone} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Quiz formulaire ── */}
      <AnimatePresence>
        {step === 'quiz' && app && !showContinue && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ marginTop: 24 }}
          >
            <QuizForm key={quizAttempt} app={app} onAnswer={handleQuizAnswer} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bouton Foundations ── */}
      <AnimatePresence>
        {showContinue && (
          <motion.div
            key="continue"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: 28, textAlign: 'center' }}
          >
            <motion.button
              onClick={onComplete}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                background: 'linear-gradient(135deg, #1DB97A, #0ea5c4)',
                color: '#fff', border: 'none', borderRadius: 16,
                padding: '16px 44px', fontFamily: 'Outfit,sans-serif',
                fontWeight: 800, fontSize: 15, cursor: 'pointer',
                boxShadow: '0 8px 28px rgba(29,185,122,0.45)',
              }}
            >
              Commencer l'apprentissage ⚡
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
