import re
import os

base_dir = r"c:\Users\SOP TECH\Desktop\chatbot_creativite\frontend\src"

# 1. Update HubPage.jsx
hub_path = os.path.join(base_dir, "pages", "HubPage.jsx")
with open(hub_path, 'r', encoding='utf-8') as f:
    hub_text = f.read()

if "import AppShell" not in hub_text:
    hub_text = hub_text.replace("import { useNavigate } from 'react-router-dom'", "import { useNavigate } from 'react-router-dom'\nimport AppShell from '../components/AppShell'")

hub_text = re.sub(r"import TeacherAvatar from '../components/TeacherAvatar'\n", "", hub_text)

new_return = """    return (
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

            {/* Celebration overlay */}
            <AnimatePresence>
                {showCelebration && (
                    <Celebration
                        name={user.name}
                        onClose={() => setShowCelebration(false)}
                    />
                )}
            </AnimatePresence>
        </AppShell>
    )"""

hub_text = re.sub(r'    return \(\n        <div className="hub-page">.*?\n    \)', new_return, hub_text, flags=re.DOTALL)

with open(hub_path, 'w', encoding='utf-8') as f:
    f.write(hub_text)


# 2. Update TopicsSidebar.jsx HTML structure
sidebar_path = os.path.join(base_dir, "components", "TopicsSidebar.jsx")
with open(sidebar_path, 'r', encoding='utf-8') as f:
    sidebar = f.read()

if "hub-sidebar" not in sidebar:
    sidebar = sidebar.replace('className="sidebar"', 'className="hub-sidebar"')
    sidebar = sidebar.replace('className="sidebar-header"', 'className="hub-sidebar-header"')
    sidebar = sidebar.replace('className="topics-list"', 'className="hub-topics-list"')
    sidebar = sidebar.replace('className={`topic-card', 'className={`hub-topic-card')
    sidebar = sidebar.replace('className="topic-icon-wrap"', 'className="hub-topic-icon-wrap"')
    sidebar = sidebar.replace('className="topic-info"', 'className="hub-topic-info"')
    sidebar = sidebar.replace('className="topic-name"', 'className="hub-topic-name"')
    sidebar = sidebar.replace('className={`topic-status', 'className={`hub-topic-status')
    
with open(sidebar_path, 'w', encoding='utf-8') as f:
    f.write(sidebar)


# 3. Update ChatPanel.jsx HTML structure
chat_path = os.path.join(base_dir, "components", "ChatPanel.jsx")
with open(chat_path, 'r', encoding='utf-8') as f:
    chat = f.read()

# Add FiSend import
if "FiSend" not in chat:
    chat = chat.replace("import { motion } from 'framer-motion'", "import { motion } from 'framer-motion'\nimport { FiSend } from 'react-icons/fi'")

if "hub-chat-panel" not in chat:
    chat = chat.replace('className="chat-panel"', 'className="hub-chat-panel"')
    chat = chat.replace('className="chat-header"', 'className="hub-chat-header"')
    chat = chat.replace('className="chat-header-left"', 'className="hub-chat-header-left"')
    chat = chat.replace('className="chat-messages"', 'className="fnd-msgs hub-chat-messages"')
    
    # Replace the msg-bubble classes to use the Foundations fnd-bbl logic
    chat = re.sub(r'className={`message \$\{msg\.role === \'user\' \? \'user\' : \'bot\'\}\$\{msg\.type === \'svg\' \? \' svg-message\' : \'\'\}\$\{msg\.type === \'interactive-preview\' \? \' interactive-message\' : \'\'\}`}',
                  r'className={`fnd-mg ${msg.role === \'user\' ? \'usr-align\' : \'\'} ${msg.type === \'svg\' || msg.type === \'interactive-preview\' ? \'hub-widget-wrap\' : \'\'}`}', chat)
    
    chat = chat.replace('className="msg-avatar"', 'className="hub-msg-avatar"')
    chat = chat.replace('className="msg-bubble"', 'className={`fnd-bbl ${msg.role === \'user\' ? \'usr\' : \'bot\'}`}')
    chat = chat.replace('className="msg-bubble typing"', 'className="fnd-bbl bot"')
    
    # Update the Chat Input UI to precisely match Foundations Smart Send
    old_input = """            <div className="chat-input">
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
            </div>"""
            
    new_input = """            <div className="fnd-cinwrap">
                <div className="fnd-cin-inner">
                    <textarea
                        ref={inputRef}
                        className="fnd-cin"
                        placeholder="Pose une question ou discute des formulaires..."
                        value={input}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        disabled={loading}
                    />
                    <button
                        className={`fnd-sndbtn ${input.trim() ? 'active' : ''}`}
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        title="Envoyer au professeur"
                    >
                        <FiSend size={20} className="fnd-send-ico" />
                    </button>
                </div>
            </div>"""
    
    chat = chat.replace(old_input, new_input)
    
with open(chat_path, 'w', encoding='utf-8') as f:
    f.write(chat)


# 4. Inject Premium Dark CSS into index.css
css_path = os.path.join(base_dir, "index.css")
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

new_hub_css = """
/* =========================================================
   HUB PAGE / EXPLORER PHASE - PREMIUM DARK EDITION
   ========================================================= */

.hub-workspace {
  display: flex;
  height: 100%;
  width: 100%;
  padding: 0;
}

/* SIDEBAR (TopicsSidebar) */
.hub-sidebar {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}
.hub-sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Outfit', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}
.hub-sidebar-header svg {
  font-size: 24px;
  color: var(--teal);
}
.hub-topics-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 10px;
}
.hub-topic-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  text-align: left;
  cursor: pointer;
  outline: none;
  font-family: 'Outfit', sans-serif;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: rgba(255,255,255,0.6);
}
.hub-topic-card:hover {
  background: rgba(255,255,255,0.06);
}
.hub-topic-card.active {
  background: rgba(24, 201, 122, 0.08);
  border-color: rgba(24, 201, 122, 0.4);
  color: #fff;
  box-shadow: 0 4px 20px rgba(24, 201, 122, 0.15);
}
.hub-topic-card.completed {
  color: #fff;
  border-color: rgba(255,255,255,0.15);
}
.hub-topic-icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: rgba(0,0,0,0.3);
  border-radius: 12px;
  font-size: 22px;
}
.hub-topic-card.active .hub-topic-icon-wrap {
  color: var(--teal);
  background: rgba(24, 201, 122, 0.15);
}
.check-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: var(--teal);
  color: #000;
  font-size: 10px;
  font-weight: 800;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid var(--ink);
}
.hub-topic-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.hub-topic-name {
  font-size: 15px;
  font-weight: 600;
}
.hub-topic-status {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0.6;
}
.hub-topic-card.active .hub-topic-status {
  opacity: 0.9;
  color: var(--teal);
}

.hub-topic-card.final.locked { opacity: 0.5; cursor: not-allowed; }
.hub-topic-card.final.unlocked {
  background: rgba(240, 152, 56, 0.1);
  border-color: rgba(240, 152, 56, 0.4);
  color: #fff;
}
.hub-topic-card.final.unlocked .hub-topic-icon-wrap {
  color: var(--amb);
}

/* CHAT PANEL (Main Area) */
.hub-chat-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: var(--ink2);
  border-radius: 20px;
  margin: 16px;
  margin-left: 0;
  border: 1px solid rgba(255,255,255,0.06);
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}
.hub-chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  background: rgba(0,0,0,0.1);
}
.hub-chat-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.bot-avatar-small {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--g1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}
.bot-name {
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: #fff;
  display: block;
}
.bot-status {
  font-size: 11px;
  color: rgba(255,255,255,0.5);
  display: flex;
  align-items: center;
  gap: 6px;
}
.topic-badge {
  padding: 6px 14px;
  background: rgba(24, 201, 122, 0.1);
  border: 1px solid rgba(24, 201, 122, 0.3);
  color: var(--teal);
  font-size: 12px;
  font-weight: 700;
  border-radius: 20px;
  font-family: 'Outfit', sans-serif;
}

.hub-chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.hub-msg-avatar { display: none; /* Hide default user/bot SVG since we use Foundations bbls */ }

/* Make the visual artifacts pop out of the chat */
.hub-widget-wrap .fnd-bbl {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  border-radius: 20px;
  padding: 24px;
  width: 100%;
  max-width: 700px;
}

.visualize-prompt {
  background: rgba(123, 111, 248, 0.08);
  border: 1px solid rgba(123, 111, 248, 0.3);
  border-radius: 16px;
  padding: 16px 20px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.btn-visualize {
  background: var(--g2);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 12px;
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(123, 111, 248, 0.4);
}
.btn-visualize.interactive { background: var(--g1); box-shadow: 0 4px 16px rgba(24, 201, 122, 0.35); }
.btn-visualize.quiz { background: var(--g3); box-shadow: 0 4px 16px rgba(240, 152, 56, 0.35); }
.svg-label { color: var(--teal); font-weight: 600; margin-bottom: 12px; display: block; }
"""

if ".hub-workspace" not in css:
    css += new_hub_css
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css)

print("HubPage Redesign Implementation Completed Successfully!")
