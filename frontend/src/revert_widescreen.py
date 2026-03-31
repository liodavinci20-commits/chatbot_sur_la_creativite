import os

base_dir = r"c:\Users\SOP TECH\Desktop\chatbot_creativite\frontend\src"

# ==================================
# 1. Restore TopicsSidebar.jsx (Vertical)
# ==================================
sidebar_path = os.path.join(base_dir, "components", "TopicsSidebar.jsx")
sidebar_content = """import { motion } from 'framer-motion'
import { HiOutlineBookOpen, HiOutlineCheckCircle, HiOutlineLockClosed, HiOutlineLockOpen, HiOutlineTrophy, HiOutlineSparkles } from 'react-icons/hi2'
import { TbForms, TbCheckbox, TbCircleDot, TbListDetails, TbClick } from 'react-icons/tb'

const TOPIC_ICONS = {
    zones_saisie: TbForms,
    cases_cocher: TbCheckbox,
    boutons_radio: TbCircleDot,
    listes_deroulantes: TbListDetails,
    boutons_cliquables: TbClick,
}

export default function TopicsSidebar({ topics, currentTopic, allCompleted, finalComplete, onSelectTopic, onSelectFinal }) {
    return (
        <aside className="hub-sidebar">
            <div className="hub-sidebar-header">
                <HiOutlineBookOpen />
                <h2 className="sidebar-title">Ton parcours</h2>
            </div>

            <div className="hub-topics-list">
                {topics.map((topic, i) => {
                    const IconComp = TOPIC_ICONS[topic.id] || TbForms
                    return (
                        <motion.button
                            key={topic.id}
                            className={`hub-topic-card ${topic.completed ? 'completed' : ''} ${currentTopic?.id === topic.id ? 'active' : ''}`}
                            onClick={() => onSelectTopic(topic)}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08, duration: 0.4 }}
                            whileHover={{ x: 4, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="hub-topic-icon-wrap">
                                <span className="topic-icon"><IconComp /></span>
                                {topic.completed && <span className="check-badge">✓</span>}
                            </div>
                            <div className="hub-topic-info">
                                <span className="hub-topic-name">{topic.title.replace(/^[\\p{Emoji_Presentation}\\p{Extended_Pictographic}️]\\s*/u, '')}</span>
                                <span className={`hub-topic-status ${topic.completed ? 'done' : ''}`}>
                                    {topic.completed ? (
                                        <><HiOutlineCheckCircle /> Complété</>
                                    ) : (
                                        <><HiOutlineBookOpen /> À explorer</>
                                    )}
                                </span>
                            </div>
                        </motion.button>
                    )
                })}

                {/* Défi Final */}
                <motion.button
                    className={`hub-topic-card final ${finalComplete ? 'completed' : allCompleted ? 'unlocked' : 'locked'} ${currentTopic?.id === 'final' ? 'active' : ''}`}
                    onClick={onSelectFinal}
                    disabled={!allCompleted && !finalComplete}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: topics.length * 0.08, duration: 0.4 }}
                    whileHover={allCompleted || finalComplete ? { x: 4, scale: 1.01 } : {}}
                >
                    <div className="hub-topic-icon-wrap">
                        <span className="topic-icon"><HiOutlineTrophy /></span>
                    </div>
                    <div className="hub-topic-info">
                        <span className="hub-topic-name">Défi Final</span>
                        <span className={`hub-topic-status ${finalComplete ? 'done' : allCompleted ? 'ready' : ''}`}>
                            {finalComplete ? (
                                <><HiOutlineSparkles /> Terminé !</>
                            ) : allCompleted ? (
                                <><HiOutlineLockOpen /> Débloqué !</>
                            ) : (
                                <><HiOutlineLockClosed /> Complète tout d'abord</>
                            )}
                        </span>
                    </div>
                </motion.button>
            </div>
        </aside>
    )
}
"""
with open(sidebar_path, "w", encoding="utf-8") as f:
    f.write(sidebar_content)

# ==================================
# 2. Restore HubPage.jsx
# ==================================
hub_path = os.path.join(base_dir, "pages", "HubPage.jsx")
hub_content = """import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../config'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineAcademicCap, HiOutlineUser, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2'
import TopicsSidebar from '../components/TopicsSidebar'
import ChatPanel from '../components/ChatPanel'
import Celebration from '../components/Celebration'
import { TOPIC_SVGS } from '../components/TopicVisualizations'
import { TOPIC_PREVIEWS } from '../components/InteractivePreview'

export default function HubPage({ user, onLogout }) {
    const [topics, setTopics] = useState([])
    const [allCompleted, setAllCompleted] = useState(false)
    const [finalComplete, setFinalComplete] = useState(false)
    const [currentTopic, setCurrentTopic] = useState(null)
    const [showCelebration, setShowCelebration] = useState(false)
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        fetchTopics()
        showWelcome()
    }, [])

    const fetchTopics = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/topics`, { credentials: 'include' })
            const data = await res.json()
            if (data.error) return
            setTopics(data.topics)
            setAllCompleted(data.all_completed)
            setFinalComplete(data.final_complete)
        } catch (err) { }
    }

    const showWelcome = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/welcome`, { credentials: 'include' })
            const data = await res.json()
            if (data.message) {
                setMessages([{ role: 'bot', content: data.message, id: Date.now() }])
            }
        } catch {
            setMessages([{
                role: 'bot',
                content: `**Bienvenue, ${user.name} !**\\n\\nJe suis **CodeBot**, ton assistant pour apprendre les formulaires HTML.\\nChoisis une rubrique à gauche pour commencer !`,
                id: Date.now()
            }])
        }
    }

    const handleSelectTopic = (topic) => {
        setCurrentTopic(topic)
        const msg = `Je veux apprendre la rubrique : ${topic.title}. Commence par m'expliquer la notion avec des exemples de code.`
        sendMessage(msg, true)
    }

    const handleSelectFinal = () => {
        if (!allCompleted && !finalComplete) return
        setCurrentTopic({ id: 'final', title: 'Défi Final', icon: 'trophy' })
        const msg = "Je suis prêt pour le Défi Final ! Lance-moi le défi ultime qui combine toutes les notions de formulaires HTML."
        sendMessage(msg, true)
    }

    const sendMessage = async (text, isSystem = false) => {
        if (loading) return
        if (!isSystem) setMessages(prev => [...prev, { role: 'user', content: text, id: Date.now() }])
        setLoading(true)

        try {
            const res = await fetch(`${API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ message: text })
            })
            const data = await res.json()

            if (data.error) {
                setMessages(prev => [...prev, { role: 'bot', content: '⚠ ' + data.error, id: Date.now() }])
            } else {
                setMessages(prev => [...prev, { role: 'bot', content: data.response, id: Date.now() }])

                if (currentTopic && currentTopic.id !== 'final' && TOPIC_SVGS[currentTopic.id]) {
                    if (data.response.includes('📖')) {
                        setTimeout(() => {
                            setMessages(prev => [...prev, {
                                role: 'bot',
                                type: 'visualize-prompt',
                                topicId: currentTopic.id,
                                content: '',
                                id: Date.now() + 1
                            }])
                        }, 800)
                    }
                }

                if (data.completed_topic) {
                    setTopics(prev => prev.map(t =>
                        t.id === data.completed_topic ? { ...t, completed: true } : t
                    ))
                }

                if (data.all_completed) setAllCompleted(true)
                if (data.final_complete) {
                    setFinalComplete(true)
                    setTimeout(() => setShowCelebration(true), 1000)
                }
            }
        } catch {
            setMessages(prev => [...prev, { role: 'bot', content: 'Erreur réseau.', id: Date.now() }])
        }
        setLoading(false)
    }

    const handleShowVisualization = (topicId) => {
        setMessages(prev => [...prev, { role: 'bot', type: 'svg', topicId: topicId, content: '', id: Date.now() }])
        if (TOPIC_PREVIEWS[topicId]) {
            setTimeout(() => {
                setMessages(prev => [...prev, { role: 'bot', type: 'interactive-prompt', topicId: topicId, content: '', id: Date.now() + 1 }])
            }, 1000)
        }
    }

    const handleShowInteractive = (topicId) => {
        setMessages(prev => [...prev, { role: 'bot', type: 'interactive-preview', topicId: topicId, content: '', id: Date.now() }])
    }

    const handleReadyForQuiz = (topicId) => {
        sendMessage("Je suis prêt pour le quiz !", false)
    }

    return (
        <AppShell 
            user={user} 
            currentStep={3} 
            completedSteps={finalComplete ? [1, 2, 3] : [1, 2]}
            sidebarContent={
                <TopicsSidebar
                    topics={topics}
                    currentTopic={currentTopic}
                    allCompleted={allCompleted}
                    finalComplete={finalComplete}
                    onSelectTopic={handleSelectTopic}
                    onSelectFinal={handleSelectFinal}
                />
            }
        >
            <div className="hub-workspace">
                <ChatPanel
                    messages={messages}
                    loading={loading}
                    currentTopic={currentTopic}
                    onSend={(text) => sendMessage(text, false)}
                    onShowVisualization={handleShowVisualization}
                    onShowInteractive={handleShowInteractive}
                    onReadyForQuiz={handleReadyForQuiz}
                />
            </div>

            <AnimatePresence>
                {showCelebration && <Celebration name={user.name} onClose={() => setShowCelebration(false)} />}
            </AnimatePresence>
        </AppShell>
    )
}
"""
with open(hub_path, "w", encoding="utf-8") as f:
    f.write(hub_content)

# ==================================
# 3. Restore ChatPanel.jsx (Wide-Screen with SVGs injected)
# ==================================
chat_path = os.path.join(base_dir, "components", "ChatPanel.jsx")
chat_content = """import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSend } from 'react-icons/fi'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { HiOutlineAcademicCap, HiOutlineUser, HiOutlineEye, HiOutlineHandRaised, HiOutlineCheckCircle } from 'react-icons/hi2'
import TopicVisualization from './TopicVisualizations'
import InteractivePreview from './InteractivePreview'

export default function ChatPanel({ messages, loading, currentTopic, onSend, onShowVisualization, onShowInteractive, onReadyForQuiz }) {
    const [input, setInput] = useState('')
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, loading])

    const handleSend = () => {
        if (!input.trim() || loading) return
        onSend(input)
        setInput('')
    }

    return (
        <section className="hub-chat-panel">
            <div className="hub-chat-header">
                <div className="hub-chat-header-left">
                    <div className="bot-avatar-small"><HiOutlineAcademicCap /></div>
                    <div>
                        <span className="bot-name">CodeBot</span>
                        <span className="bot-status"><span className="status-dot" /> Assistant pédagogique • En ligne</span>
                    </div>
                </div>
                {currentTopic && (
                    <motion.div className="topic-badge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={currentTopic.id}>
                        {currentTopic.title}
                    </motion.div>
                )}
            </div>

            <div className="fnd-msgs hub-chat-messages">
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        className={`fnd-mg ${msg.role === 'user' ? 'usr-align' : ''} ${msg.type === 'svg' || msg.type === 'interactive-preview' ? 'hub-widget-wrap' : ''}`}
                        initial={{ opacity: 0, y: 15, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                    >
                        <div className={`fnd-bbl ${msg.role === 'user' ? 'usr' : 'bot'}`}>
                            {msg.type === 'visualize-prompt' ? (
                                <div className="visualize-prompt">
                                    <p>🎨 Tu veux voir à quoi ça ressemble visuellement ?</p>
                                    <button className="btn-visualize" onClick={() => onShowVisualization && onShowVisualization(msg.topicId)}>
                                        <HiOutlineEye /> Oui, montre-moi !
                                    </button>
                                </div>
                            ) : msg.type === 'svg' ? (
                                <div className="svg-visualization">
                                    <p className="svg-label">📊 Voici la visualisation :</p>
                                    <TopicVisualization topicId={msg.topicId} />
                                </div>
                            ) : msg.type === 'interactive-prompt' ? (
                                <div className="visualize-prompt">
                                    <p>🖐️ Tu veux essayer par toi-même ? Manipule les vrais éléments HTML !</p>
                                    <button className="btn-visualize interactive" onClick={() => onShowInteractive && onShowInteractive(msg.topicId)}>
                                        <HiOutlineHandRaised /> Oui, je veux essayer !
                                    </button>
                                </div>
                            ) : msg.type === 'interactive-preview' ? (
                                <div className="interactive-preview-wrapper">
                                    <InteractivePreview topicId={msg.topicId} onReadyForQuiz={() => onReadyForQuiz && onReadyForQuiz(msg.topicId)} />
                                </div>
                            ) : msg.type === 'quiz-prompt' ? (
                                <div className="visualize-prompt">
                                    <p>✅ Super ! Tu as bien exploré les éléments. Prêt pour le quiz ?</p>
                                    <button className="btn-visualize quiz" onClick={() => onReadyForQuiz && onReadyForQuiz(msg.topicId)}>
                                        <HiOutlineCheckCircle /> Je suis prêt pour le quiz !
                                    </button>
                                </div>
                            ) : msg.role === 'bot' ? (
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                            ) : (
                                <p>{msg.content}</p>
                            )}
                        </div>
                    </motion.div>
                ))}

                {loading && (
                    <div className="fnd-mg">
                        <div className="fnd-bbl bot">
                            <div className="typing-dots"><span /><span /><span /></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="fnd-cinwrap">
                <div className="fnd-cin-inner">
                    <textarea
                        className="fnd-cin"
                        placeholder="Pose une question ou discute des formulaires..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        rows={1}
                        disabled={loading}
                    />
                    <button className={`fnd-sndbtn ${input.trim() ? 'active' : ''}`} onClick={handleSend} disabled={loading || !input.trim()}>
                        <FiSend size={20} className="fnd-send-ico" />
                    </button>
                </div>
            </div>
        </section>
    )
}
"""
with open(chat_path, "w", encoding="utf-8") as f:
    f.write(chat_content)

print("Restored original Wide-Screen Layout with Dark UX!")
