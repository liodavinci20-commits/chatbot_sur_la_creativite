import { useState, useRef, useEffect } from 'react'
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
