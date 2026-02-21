import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../config'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineAcademicCap, HiOutlineUser, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2'
import TopicsSidebar from '../components/TopicsSidebar'
import ChatPanel from '../components/ChatPanel'
import Celebration from '../components/Celebration'
import TeacherAvatar from '../components/TeacherAvatar'
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

    // Charger les données du hub
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
        } catch (err) {
            console.error('Erreur chargement topics:', err)
        }
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
                content: `**Bienvenue, ${user.name} !**\n\nJe suis **CodeBot**, ton assistant pour apprendre les formulaires HTML.\nChoisis une rubrique à gauche pour commencer !`,
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

        if (!isSystem) {
            setMessages(prev => [...prev, { role: 'user', content: text, id: Date.now() }])
        }

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

                // Après l'explication (état visualize), proposer la visualisation SVG
                if (currentTopic && currentTopic.id !== 'final' && TOPIC_SVGS[currentTopic.id]) {
                    // Vérifier si c'est une réponse d'explication (contient le titre avec 📖)
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

                if (data.all_completed) {
                    setAllCompleted(true)
                }

                if (data.final_complete) {
                    setFinalComplete(true)
                    setTimeout(() => setShowCelebration(true), 1000)
                }
            }
        } catch {
            setMessages(prev => [...prev, {
                role: 'bot',
                content: 'Erreur de connexion. Vérifie ta connexion et réessaie.',
                id: Date.now()
            }])
        }

        setLoading(false)
    }

    const handleLogout = async () => {
        try { await fetch(`${API_BASE_URL}/api/logout`, { method: 'POST', credentials: 'include' }) } catch { }
        onLogout()
        navigate('/')
    }

    // Étape 2 : Afficher la visualisation SVG, puis proposer l'interactif
    const handleShowVisualization = (topicId) => {
        setMessages(prev => [...prev, {
            role: 'bot',
            type: 'svg',
            topicId: topicId,
            content: '',
            id: Date.now()
        }])

        // Après le SVG, proposer les éléments interactifs si disponibles
        if (TOPIC_PREVIEWS[topicId]) {
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    role: 'bot',
                    type: 'interactive-prompt',
                    topicId: topicId,
                    content: '',
                    id: Date.now() + 1
                }])
            }, 1000)
        }
    }

    // Étape 3 : Afficher la preview interactive
    const handleShowInteractive = (topicId) => {
        setMessages(prev => [...prev, {
            role: 'bot',
            type: 'interactive-preview',
            topicId: topicId,
            content: '',
            id: Date.now()
        }])
    }

    // Étape 4 : L'enfant est prêt pour le quiz → envoyer au backend
    const handleReadyForQuiz = (topicId) => {
        const msg = "Je suis prêt pour le quiz !"
        sendMessage(msg, false)
    }

    const completed = topics.filter(t => t.completed).length
    const progressPercent = topics.length > 0 ? (completed / topics.length) * 100 : 0

    return (
        <div className="hub-page">
            {/* Progress bar */}
            <div className="progress-bar-track">
                <motion.div
                    className="progress-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />
            </div>

            {/* Header */}
            <header className="hub-header">
                <div className="header-left">
                    <span className="logo-icon"><HiOutlineAcademicCap /></span>
                    <h1>Code<span className="accent">Bot</span></h1>
                </div>
                <div className="header-right">
                    <div className="user-badge">
                        <HiOutlineUser />
                        <span>{user.name}</span>
                        <span className="sep">•</span>
                        <span>{user.classe}</span>
                    </div>
                    <button className="btn-icon" onClick={handleLogout} title="Déconnexion">
                        <HiOutlineArrowRightOnRectangle />
                    </button>
                </div>
            </header>

            {/* Main content */}
            <main className="hub-main">
                <TopicsSidebar
                    topics={topics}
                    currentTopic={currentTopic}
                    allCompleted={allCompleted}
                    finalComplete={finalComplete}
                    onSelectTopic={handleSelectTopic}
                    onSelectFinal={handleSelectFinal}
                />
                <div className="chat-with-teacher">
                    <div className="teacher-side">
                        <TeacherAvatar loading={loading} />
                    </div>
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
            </main>

            {/* Celebration overlay */}
            <AnimatePresence>
                {showCelebration && (
                    <Celebration
                        name={user.name}
                        onClose={() => setShowCelebration(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}
