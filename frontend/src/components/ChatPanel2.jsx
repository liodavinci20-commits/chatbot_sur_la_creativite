// ChatPanel2.jsx — Chat panel redesigné (dark theme, typing indicator, chips)
import { useState, useRef, useEffect } from 'react'

// ── Streaming HTML : tape le texte brut puis affiche le HTML complet ──
function StreamingHtmlMessage({ html, onDone }) {
    const plain = (html || '').replace(/<[^>]*>/g, '')
    const [displayed, setDisplayed] = useState('')
    const [done, setDone]           = useState(false)

    useEffect(() => {
        setDisplayed('')
        setDone(false)
        let i = 0
        const id = setInterval(() => {
            if (i < plain.length) {
                i = Math.min(i + 1, plain.length)
                setDisplayed(plain.slice(0, i))
            } else {
                clearInterval(id)
                setDone(true)
                onDone?.()
            }
        }, 28)
        return () => clearInterval(id)
    }, [html])

    if (done) return <span dangerouslySetInnerHTML={{ __html: html }} />
    return (
        <span style={{ whiteSpace: 'pre-wrap' }}>
            {displayed}<span className="typing-cursor" />
        </span>
    )
}

export default function ChatPanel2({
    messages = [],
    loading = false,
    phaseLabel = 'Phase 1',
    userName = 'Élève',
    chips = [],
    onSend,
}) {
    const [input, setInput]           = useState('')
    const [streamingIdx, setStreamingIdx] = useState(null)
    const msgsRef    = useRef(null)
    const prevCount  = useRef(messages.length)

    // Détecte un nouveau message bot → lance le streaming
    useEffect(() => {
        if (messages.length > prevCount.current) {
            const last = messages[messages.length - 1]
            if (last?.type === 'bot' || last?.type === 'soc') {
                setStreamingIdx(messages.length - 1)
            }
        }
        prevCount.current = messages.length
    }, [messages])

    // Auto-scroll vers le bas
    useEffect(() => {
        if (msgsRef.current) {
            msgsRef.current.scrollTop = msgsRef.current.scrollHeight
        }
    }, [messages, loading, streamingIdx])

    const handleSend = () => {
        const text = input.trim()
        if (!text || !onSend) return
        onSend(text)
        setInput('')
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="v2-chat">
            {/* Header */}
            <div className="v2-chat-hd">
                <div className="v2-bot-av">💎</div>
                <div>
                    <div className="v2-bot-name">CodeBot</div>
                    <div className="v2-bot-status">{phaseLabel}</div>
                </div>
                <div className="v2-phase-chip">( 1 ) Découvrir</div>
            </div>

            {/* Messages */}
            <div className="v2-msgs" ref={msgsRef}>
                {messages.map((msg, i) => {
                    // System message
                    if (msg.type === 'system') {
                        return <div key={i} className="v2-bbl sys">{msg.text}</div>
                    }

                    // Bot or Socratic message
                    if (msg.type === 'bot' || msg.type === 'soc') {
                        return (
                            <div key={i} className="v2-mg">
                                <div className={`v2-ms ${msg.type}`}>
                                    <span>{msg.type === 'soc' ? '💭' : '💎'}</span>
                                    CodeBot{msg.type === 'soc' ? ' — Réflexion' : ''}
                                </div>
                                <div className={`v2-bbl ${msg.type}`}>
                                    {i === streamingIdx
                                        ? <StreamingHtmlMessage
                                            html={msg.html || msg.text || ''}
                                            onDone={() => setStreamingIdx(null)}
                                          />
                                        : <span dangerouslySetInnerHTML={{ __html: msg.html || msg.text }} />
                                    }
                                </div>
                            </div>
                        )
                    }

                    // User message
                    if (msg.type === 'user') {
                        return (
                            <div key={i} className="v2-mg" style={{ alignItems: 'flex-end' }}>
                                <div className="v2-ms usr">{userName}</div>
                                <div className="v2-bbl usr">{msg.text}</div>
                            </div>
                        )
                    }

                    return null
                })}

                {/* Typing indicator */}
                <div className={`v2-typing ${loading ? 'show' : ''}`}>
                    <div className="v2-ty" />
                    <div className="v2-ty" />
                    <div className="v2-ty" />
                </div>
            </div>

            {/* Quick chips */}
            {chips.length > 0 && (
                <div className="v2-chips">
                    {chips.map((chip, i) => (
                        <button
                            key={i}
                            className={`v2-chip ${chip.wild ? 'wild' : ''}`}
                            onClick={() => onSend && onSend(chip.text)}
                        >
                            {chip.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Input */}
            <div className="v2-cin-wrap">
                <textarea
                    className="v2-cin"
                    placeholder="Réponds à CodeBot…"
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button className="v2-send-btn" onClick={handleSend}>↑</button>
            </div>
        </div>
    )
}
