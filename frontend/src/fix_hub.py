import os

path = r"c:\Users\SOP TECH\Desktop\chatbot_creativite\frontend\src\pages\HubPage.jsx"

with open(path, "r", encoding="utf-8") as f:
    text = f.read()

# Target the clean start of the return block
pre_return = text.split("    return (")[0]

new_return = """    return (
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
    )
}
"""

final = pre_return + new_return

with open(path, "w", encoding="utf-8") as f:
    f.write(final)

print("Fixed HubPage.jsx completely!")
