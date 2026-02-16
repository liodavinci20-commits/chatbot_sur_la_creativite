import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { HiOutlineCpuChip, HiOutlineUser, HiOutlinePaperAirplane } from 'react-icons/hi2'

export default function ChatPanel({ messages, loading, currentTopic, onSend }) {
    const [input, setInput] = useState('')
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, loading])

    const handleSend = () => {
        const text = input.trim()
        if (!text || loading) return
        onSend(text)
        setInput('')
        if (inputRef.current) {
            inputRef.current.style.height = 'auto'
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleInput = (e) => {
        setInput(e.target.value)
        e.target.style.height = 'auto'
        e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px'
    }

    return (
        <section className="chat-panel">
            {/* Chat header */}
            <div className="chat-header">
                <div className="chat-header-left">
                    <div className="bot-avatar-small"><HiOutlineCpuChip /></div>
                    <div>
                        <span className="bot-name">CodeBot</span>
                        <span className="bot-status">
                            <span className="status-dot" />
                            Assistant pédagogique • En ligne
                        </span>
                    </div>
                </div>
                {currentTopic && (
                    <motion.div
                        className="topic-badge"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={currentTopic.id}
                    >
                        {currentTopic.title}
                    </motion.div>
                )}
            </div>

            {/* Messages */}
            <div className="chat-messages">
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        className={`message ${msg.role === 'bot' ? 'bot' : 'user'}`}
                        initial={{ opacity: 0, y: 15, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="msg-avatar">
                            {msg.role === 'bot' ? <HiOutlineCpuChip /> : <HiOutlineUser />}
                        </div>
                        <div className="msg-bubble">
                            {msg.role === 'bot' ? (
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        code({ inline, className, children, ...props }) {
                                            return inline ? (
                                                <code className="inline-code" {...props}>{children}</code>
                                            ) : (
                                                <pre className="code-block">
                                                    <code {...props}>{children}</code>
                                                </pre>
                                            )
                                        }
                                    }}
                                >
                                    {msg.content}
                                </ReactMarkdown>
                            ) : (
                                <p>{msg.content}</p>
                            )}
                        </div>
                    </motion.div>
                ))}

                {/* Typing indicator */}
                {loading && (
                    <motion.div
                        className="message bot"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="msg-avatar"><HiOutlineCpuChip /></div>
                        <div className="msg-bubble typing">
                            <div className="typing-dots">
                                <span /><span /><span />
                            </div>
                            <span className="typing-text">CodeBot réfléchit...</span>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="chat-input">
                <textarea
                    ref={inputRef}
                    placeholder="Écris ton message ou ton code HTML ici..."
                    value={input}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    disabled={loading}
                />
                <motion.button
                    className="btn-send"
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                >
                    <HiOutlinePaperAirplane />
                </motion.button>
            </div>
        </section>
    )
}
