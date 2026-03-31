import re
import os

base_dir = r"c:\Users\SOP TECH\Desktop\chatbot_creativite\frontend\src"

# ==========================================================
# 1. Update HubPage.jsx
# ==========================================================
hub_path = os.path.join(base_dir, "pages", "HubPage.jsx")
with open(hub_path, 'r', encoding='utf-8') as f:
    hub_text = f.read()

# Extract active visualization logic and create split layout
new_return = """    const visualMsgs = messages.filter(m => m.type === 'svg' || m.type === 'interactive-preview');
    const activeVisual = visualMsgs.length > 0 ? visualMsgs[visualMsgs.length - 1] : null;

    return (
        <AppShell 
            user={user} 
            currentStep={3} 
            completedSteps={finalComplete ? [1, 2, 3] : [1, 2]}
        >
            <div className="hub-split-layout">
                {/* TOP NAVIGATION (Horizontal) */}
                <div className="hub-split-top">
                    <TopicsSidebar
                        topics={topics}
                        currentTopic={currentTopic}
                        allCompleted={allCompleted}
                        finalComplete={finalComplete}
                        onSelectTopic={handleSelectTopic}
                        onSelectFinal={handleSelectFinal}
                    />
                </div>

                {/* MAIN SPLIT WORKSPACE */}
                <div className="hub-split-body">
                    {/* LEFT PANE: Visual Board */}
                    <div className="hub-split-left">
                        {activeVisual ? (
                            <div className="hub-active-visual">
                                <div className="hub-av-header">
                                    <span className="hub-av-dot r"></span>
                                    <span className="hub-av-dot y"></span>
                                    <span className="hub-av-dot g"></span>
                                    <h3>{activeVisual.type === 'svg' ? 'Visualisation des Éléments' : 'Aperçu Interactif & Code'}</h3>
                                </div>
                                <div className="hub-av-content">
                                    {activeVisual.type === 'svg' && <TopicVisualization topicId={activeVisual.topicId} />}
                                    {activeVisual.type === 'interactive-preview' && (
                                        <InteractivePreview 
                                            topicId={activeVisual.topicId} 
                                            onReadyForQuiz={() => handleReadyForQuiz(activeVisual.topicId)} 
                                        />
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="hub-empty-board">
                                <HiOutlineAcademicCap size={64} style={{ opacity: 0.2, marginBottom: '20px' }} />
                                <h2>Ton Tableau de Code</h2>
                                <p>Sélectionne une notion dans le parcours en haut, puis échange avec CodeBot pour faire apparaître les visualisations interactives ici.</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT PANE: CodeBot Chat */}
                    <div className="hub-split-right">
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
                </div>
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

hub_text = re.sub(r'    return \(\n        <AppShell.*?    \)', lambda m: new_return, hub_text, flags=re.DOTALL)
with open(hub_path, 'w', encoding='utf-8') as f:
    f.write(hub_text)


# ==========================================================
# 2. Update TopicsSidebar.jsx HTML structure (becomes horizontal)
# ==========================================================
sidebar_path = os.path.join(base_dir, "components", "TopicsSidebar.jsx")
with open(sidebar_path, 'r', encoding='utf-8') as f:
    sidebar = f.read()

# Replace full return to render a horizontal ul/li structure
sidebar_return = """    return (
        <nav className="hub-progress-nav">
            <h2 className="hub-progress-title"><HiOutlineBookOpen /> Phase 3: Explorer</h2>
            <ul className="hub-progress-list">
                {topics.map((topic, i) => {
                    const IconComp = TOPIC_ICONS[topic.id] || TbForms
                    return (
                        <motion.li 
                            key={topic.id}
                            className={`hub-prog-item ${topic.completed ? 'completed' : ''} ${currentTopic?.id === topic.id ? 'active' : ''}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.4 }}
                        >
                            <button 
                                className="hub-prog-btn"
                                onClick={() => onSelectTopic(topic)}
                                title={topic.title}
                            >
                                <span className="hub-prog-icon"><IconComp /></span>
                                <span className="hub-prog-name">{topic.title.replace(/^[\\p{Emoji_Presentation}\\p{Extended_Pictographic}️]\\s*/u, '')}</span>
                                {topic.completed && <span className="hub-prog-check">✓</span>}
                            </button>
                            {i < topics.length - 1 && <div className="hub-prog-line" />}
                        </motion.li>
                    )
                })}
                
                {/* Défi Final */}
                {topics.length > 0 && <div className="hub-prog-line final" />}
                <motion.li 
                    className={`hub-prog-item final ${finalComplete ? 'completed' : allCompleted ? 'unlocked' : 'locked'} ${currentTopic?.id === 'final' ? 'active' : ''}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                >
                    <button 
                        className="hub-prog-btn final-btn"
                        onClick={onSelectFinal}
                        disabled={!allCompleted && !finalComplete}
                        title="Défi Final"
                    >
                        <span className="hub-prog-icon"><HiOutlineTrophy /></span>
                        {finalComplete && <span className="hub-prog-check">✓</span>}
                    </button>
                </motion.li>
            </ul>
        </nav>
    )"""

sidebar = re.sub(r'    return \(\n        <aside className="hub-sidebar">.*?\n    \)', lambda m: sidebar_return, sidebar, flags=re.DOTALL)
with open(sidebar_path, 'w', encoding='utf-8') as f:
    f.write(sidebar)


# ==========================================================
# 3. Update ChatPanel.jsx to filter out the extracted Visuals
# ==========================================================
chat_path = os.path.join(base_dir, "components", "ChatPanel.jsx")
with open(chat_path, 'r', encoding='utf-8') as f:
    chat = f.read()

# Filter out svg and interactive-preview messages from the map loop
chat = chat.replace('{messages.map((msg) => (', '{messages.filter(m => m.type !== \'svg\' && m.type !== \'interactive-preview\').map((msg) => (')
# Remove the old logic blocks rendering msg.type === 'svg' and 'interactive-preview'
chat = re.sub(r'\) : msg\.type === \'svg\' \? \(\n.*?\n                            \) : msg\.type === \'interactive-prompt\'', ') : msg.type === \'interactive-prompt\'', chat, flags=re.DOTALL)
chat = re.sub(r'\) : msg\.type === \'interactive-preview\' \? \(\n.*?\n                            \) : msg\.type === \'quiz-prompt\'', ') : msg.type === \'quiz-prompt\'', chat, flags=re.DOTALL)

with open(chat_path, 'w', encoding='utf-8') as f:
    f.write(chat)


# ==========================================================
# 4. Inject Premium Dark Split CSS into index.css
# ==========================================================
css_path = os.path.join(base_dir, "index.css")
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

new_split_css = """
/* =========================================================
   HUB PHASE 3 - SPLIT SCREEN "FOUNDATIONS" STYLE
   ========================================================= */

.hub-split-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: var(--bg);
}

.hub-split-top {
  padding: 16px 32px;
  background: rgba(255,255,255,0.02);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
}

.hub-split-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.hub-split-left {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.hub-split-right {
  width: 420px;
  min-width: 420px;
  border-left: 1px solid rgba(255,255,255,0.08);
  background: var(--ink);
  display: flex;
  flex-direction: column;
}

/* LEFT PANE - VISUAL BOARD */
.hub-empty-board {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: rgba(255,255,255,0.5);
  font-family: 'Outfit', sans-serif;
  padding: 40px;
  background: rgba(255,255,255,0.01);
  border: 1px dashed rgba(255,255,255,0.1);
  border-radius: 24px;
}
.hub-empty-board h2 { color: rgba(255,255,255,0.8); margin-bottom: 12px; }

.hub-active-visual {
  flex: 1;
  background: var(--ink2);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 12px 40px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.hub-av-header {
  height: 48px;
  min-height: 48px;
  background: rgba(0,0,0,0.2);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 8px;
}
.hub-av-dot { width: 12px; height: 12px; border-radius: 50%; opacity: 0.8; }
.hub-av-dot.r { background: #ff5f56; }
.hub-av-dot.y { background: #ffbd2e; }
.hub-av-dot.g { background: #27c93f; }
.hub-av-header h3 {
  margin-left: 12px;
  font-size: 13px;
  color: rgba(255,255,255,0.7);
  font-family: 'Outfit', sans-serif;
  font-weight: 500;
}
.hub-av-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

/* TOP PROGRESS NAVIGATION (Like Foundations) */
.hub-progress-nav {
  display: flex;
  align-items: center;
  gap: 32px;
  width: 100%;
  max-width: 1200px;
}
.hub-progress-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Outfit', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--teal);
  white-space: nowrap;
}
.hub-progress-list {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
  flex: 1;
  justify-content: flex-start;
}
.hub-prog-item {
  display: flex;
  align-items: center;
}
.hub-prog-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 8px 16px;
  border-radius: 30px;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}
.hub-prog-btn:hover { background: rgba(255,255,255,0.1); }
.hub-prog-icon { font-size: 18px; display: flex; }
.hub-prog-name { font-size: 14px; font-weight: 600; font-family: 'Outfit', sans-serif; }
.hub-prog-check {
  position: absolute;
  top: -4px; right: -4px;
  background: var(--teal);
  color: #000;
  width: 16px; height: 16px;
  border-radius: 50%;
  font-size: 10px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid var(--ink);
}

.hub-prog-item.completed .hub-prog-btn {
  color: #fff; border-color: rgba(255,255,255,0.2);
}
.hub-prog-item.active .hub-prog-btn {
  background: rgba(24, 201, 122, 0.1);
  border-color: rgba(24, 201, 122, 0.4);
  color: #fff;
  box-shadow: 0 0 16px rgba(24, 201, 122, 0.15);
}
.hub-prog-item.active .hub-prog-icon { color: var(--teal); }

.hub-prog-line {
  width: 30px;
  height: 2px;
  background: rgba(255,255,255,0.1);
  margin: 0 8px;
}

.hub-prog-item.final.locked .final-btn { opacity: 0.4; cursor: not-allowed; }
.hub-prog-item.final.unlocked .final-btn {
  background: rgba(240, 152, 56, 0.1);
  border-color: rgba(240, 152, 56, 0.4);
  color: #fff;
}
.hub-prog-item.final.unlocked .hub-prog-icon { color: var(--amb); }

/* Remove ChatPanel margin since it's in its own column */
.hub-split-right .hub-chat-panel {
  margin: 0;
  border-radius: 0;
  border: none;
  box-shadow: none;
  background: transparent;
}
"""

if ".hub-split-layout" not in css:
    css += new_split_css
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css)

print("Split Layout scripts applied with absolute success.")
