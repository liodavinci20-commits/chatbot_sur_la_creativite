import { motion } from 'framer-motion'
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
        <aside className="sidebar">
            <div className="sidebar-header">
                <HiOutlineBookOpen />
                <h2 className="sidebar-title">Ton parcours</h2>
            </div>

            <div className="topics-list">
                {topics.map((topic, i) => {
                    const IconComp = TOPIC_ICONS[topic.id] || TbForms
                    return (
                        <motion.button
                            key={topic.id}
                            className={`topic-card ${topic.completed ? 'completed' : ''} ${currentTopic?.id === topic.id ? 'active' : ''}`}
                            onClick={() => onSelectTopic(topic)}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08, duration: 0.4 }}
                            whileHover={{ x: 4, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="topic-icon-wrap">
                                <span className="topic-icon"><IconComp /></span>
                                {topic.completed && <span className="check-badge">✓</span>}
                            </div>
                            <div className="topic-info">
                                <span className="topic-name">{topic.title.replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}️]\s*/u, '')}</span>
                                <span className={`topic-status ${topic.completed ? 'done' : ''}`}>
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
                    className={`topic-card final ${finalComplete ? 'completed' : allCompleted ? 'unlocked' : 'locked'} ${currentTopic?.id === 'final' ? 'active' : ''}`}
                    onClick={onSelectFinal}
                    disabled={!allCompleted && !finalComplete}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: topics.length * 0.08, duration: 0.4 }}
                    whileHover={allCompleted || finalComplete ? { x: 4, scale: 1.01 } : {}}
                >
                    <div className="topic-icon-wrap">
                        <span className="topic-icon"><HiOutlineTrophy /></span>
                    </div>
                    <div className="topic-info">
                        <span className="topic-name">Défi Final</span>
                        <span className={`topic-status ${finalComplete ? 'done' : allCompleted ? 'ready' : ''}`}>
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
