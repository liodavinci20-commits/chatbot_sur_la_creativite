            {/* ══════════════════════════════════════
                CONCEPT 3 — type=
            ══════════════════════════════════════ */}
            {current === 3 && (
              <div className="fnd-cp">
                <div className="fnd-cp-card">
                  <div className="fnd-cp-head">
                    <div className="fnd-cp-num n3">3</div>
                    <div className="fnd-cp-info">
                      <div className="fnd-cp-eyebrow">CONCEPT 3 / 5</div>
                      <div className="fnd-cp-title">
                        L'attribut <code className="c">type=</code> — Chaque champ a son rôle
                      </div>
                    </div>
                  </div>

                  <div className="fnd-cp-explain">
                    <p className="fnd-exp-p">
                      L'attribut <code className="fnd-ic c">type</code> change complètement le <strong>comportement du champ</strong>. Clique sur chaque type pour voir le résultat en direct.
                    </p>
                    <div className="fnd-analogy">
                      <div className="fnd-an-ico"><FiTool size={24} color="var(--vio)" /></div>
                      <div className="fnd-an-txt">
                        <strong>Analogie</strong> — C'est comme des <strong>ustensiles différents</strong> en cuisine. Une fourchette pour les pâtes, une cuillère pour la soupe — chaque outil a son usage !
                      </div>
                    </div>
                  </div>

                  <div className="fnd-cp-code">
                    <div className="fnd-type-tabs">
                      {['text', 'password', 'email', 'number'].map(t => (
                        <button
                          key={t}
                          className={`fnd-ttab${activeType === t ? ' on' : ''}`}
                          onClick={() => { handleSwitchType(t); markExplored(3); }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <CodeBlock fileName="TYPES.HTML">
                      <CodeLine><Ct c="&lt;input" /></CodeLine>
                      <CodeLine indent><Ca c='type=' /><Cv c={`"${activeType}"`} /></CodeLine>
                      <CodeLine indent><Ca c='placeholder=' /><Cv c='"Essaie de taper..."' /></CodeLine>
                      <CodeLine><Ct c="/&gt;" /></CodeLine>
                    </CodeBlock>
                    <div className="fnd-lp-box">
                      <div className="fnd-lp-hdr"><span className="fnd-lp-dot" />RÉSULTAT EN DIRECT</div>
                      <input
                        key={activeType}
                        type={activeType}
                        className="fnd-live-inp"
                        placeholder="Essaie de taper..."
                      />
                      <motion.div
                        key={typeHint}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="fnd-type-pill"
                      >
                        (^_^) {typeHint}
                      </motion.div>
                    </div>
                  </div>
                </div>

                <div ref={challengeRef}>
                  <ChallengeSection
                    visible={challengeVisible[3]}
                    explored={explored[3]}
                    onReveal={() => revealChallenge(3)}
                  >
                    <div className="fnd-cz-hd">
                      <div className="fnd-cz-ico"><FiZap size={22} color="var(--amb)" /></div>
                      <div className="fnd-cz-ttl">Mini-défi — Complète le code</div>
                    </div>
                    <p className="fnd-cz-sub">Tu veux un champ mot de passe qui masque les caractères. Quel type ?</p>
                    <div className="fnd-fitb" style={{ fontSize: '12.5px' }}>
                      <Ct c="&lt;input" /> <Ca c='type=' /><Cv c='"' />
                      <input
                        className={`fnd-blank ${c4Status}`}
                        placeholder="???" style={{ width: 82 }}
                        value={c4Blank}
                        onChange={e => setC4Blank(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && checkC4()}
                      />
                      <Cv c='"' /> <Ct c="/&gt;" />
                    </div>
                    <div className="fnd-fitb-actions">
                      <button className="fnd-btn-check" onClick={checkC4}>Vérifier ✓</button>
                      <button className="fnd-btn-hint" onClick={() => addMsg('bot', 'Indice : ce type cache les caractères avec des points ●●●. C\'est un mot anglais qui commence par <strong>p</strong>… pense à la sécurité !')}>Indice (*_*)</button>
                    </div>
                    <AnimatePresence>
                      {c4Feedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className={`fnd-cz-fb ${c4Feedback.ok ? 'ok' : 'nope'}`}
                          dangerouslySetInnerHTML={{ __html: c4Feedback.text }}
                        />
                      )}
                    </AnimatePresence>
                    {c4Unlock && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                        className="fnd-unlock-btn"
                        onClick={() => { setSolved(prev => ({...prev, 3: true})); unlockNext(4); }}
                      >
                        Concept suivant : le &lt;label&gt; →
                      </motion.button>
                    )}
                  </ChallengeSection>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════
                CONCEPT 4 — <label>
            ══════════════════════════════════════ */}
            {current === 4 && (
              <div className="fnd-cp">
                <div className="fnd-cp-card">
                  <div className="fnd-cp-head">
                    <div className="fnd-cp-num n1">4</div>
                    <div className="fnd-cp-info">
                      <div className="fnd-cp-eyebrow">CONCEPT 4 / 5</div>
                      <div className="fnd-cp-title">
                        La balise <code className="t">&lt;label&gt;</code> — L'étiquette
                      </div>
                    </div>
                  </div>

                  <div className="fnd-cp-explain">
                    <p className="fnd-exp-p">
                      Le <code className="fnd-ic t">&lt;label&gt;</code> donne un <strong>nom visible</strong> à chaque champ. Quand on clique dessus, le curseur saute automatiquement dans le champ lié !
                    </p>
                    <div className="fnd-analogy">
                      <div className="fnd-an-ico"><FiFolder size={24} color="var(--vio)" /></div>
                      <div className="fnd-an-txt">
                        <strong>Analogie</strong> — C'est comme les <strong>étiquettes sur les tiroirs</strong>. Sans étiquette, impossible de savoir où ranger chaque chose !
                      </div>
                    </div>
                  </div>

                  <div className="fnd-cp-code">
                    <div className="fnd-code-tip">
                      <span className="fnd-tip-dot" />
                      Clique sur le label dans le rendu — le curseur saute dans le champ !
                    </div>
                    <CodeBlock fileName="LABEL.HTML">
                      <CodeLine><Ct c="&lt;label" /> <Ca c='for=' /><Cv c='"prenom"' /><Ct c="&gt;" /></CodeLine>
                      <CodeLine indent><Cw c="Ton prénom :" /></CodeLine>
                      <CodeLine><Ct c="&lt;/label&gt;" /></CodeLine>
                      <CodeLine>&nbsp;</CodeLine>
                      <CodeLine><Ct c="&lt;input" /></CodeLine>
                      <CodeLine indent><Ca c='id=' /><Cv c='"prenom"' /></CodeLine>
                      <CodeLine indent><Ca c='type=' /><Cv c='"text"' /></CodeLine>
                      <CodeLine><Ct c="/&gt;" /></CodeLine>
                    </CodeBlock>
                    <div className="fnd-lp-box">
                      <div className="fnd-lp-hdr"><span className="fnd-lp-dot" />CLIQUE SUR LE LABEL</div>
                      <label
                        htmlFor="lp3-field"
                        className={`fnd-demo-label${labelClicked ? ' clicked' : ''}`}
                        onClick={() => {
                          handleLabelClick();
                          markExplored(4);
                        }}
                      >
                        Ton prénom :
                      </label>
                      <input
                        id="lp3-field"
                        ref={lp3Ref}
                        type="text"
                        className="fnd-live-inp"
                        placeholder="Clique sur le label pour activer ce champ…"
                      />
                      <AnimatePresence>
                        {labelClicked && (
                          <motion.div
                            initial={{ opacity: 0, y: 4, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className="fnd-label-badge"
                          >
                            (*_*) Magie ! Le curseur a sauté automatiquement !
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <div ref={challengeRef}>
                  <ChallengeSection
                    visible={challengeVisible[4]}
                    explored={explored[4]}
                    onReveal={() => revealChallenge(4)}
                  >
                    <div className="fnd-cz-hd">
                      <div className="fnd-cz-ico"><FiZap size={22} color="var(--amb)" /></div>
                      <div className="fnd-cz-ttl">Mini-défi — QCM</div>
                    </div>
                    <p className="fnd-cz-sub">
                      Quel attribut du &lt;label&gt; doit avoir la même valeur que <code className="fnd-ic t">id</code> de l'input pour les lier ?
                    </p>
                    <McqOptions
                      options={[
                        { label: 'name',  correct: false },
                        { label: 'for',   correct: true  },
                        { label: 'class', correct: false },
                      ]}
                      selectedIdx={c3MCQ.selected}
                      onSelect={(idx, correct) => {
                        handleC3MCQ(idx, correct);
                      }}
                    />
                    <AnimatePresence>
                      {c3Feedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className={`fnd-cz-fb ${c3Feedback.ok ? 'ok' : 'nope'}`}
                          dangerouslySetInnerHTML={{ __html: c3Feedback.text }}
                        />
                      )}
                    </AnimatePresence>
                    {c3Unlock && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                        className="fnd-unlock-btn"
                        onClick={() => { setSolved(prev => ({...prev, 4: true})); unlockNext(5); }}
                      >
                        Dernier concept : le &lt;button&gt; →
                      </motion.button>
                    )}
                  </ChallengeSection>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════
                CONCEPT 5 — <button>
            ══════════════════════════════════════ */}
            {current === 5 && (
              <div className="fnd-cp">
                <div className="fnd-cp-card">
                  <div className="fnd-cp-head">
                    <div className="fnd-cp-num n2">5</div>
                    <div className="fnd-cp-info">
                      <div className="fnd-cp-eyebrow">CONCEPT 5 / 5 · DERNIER !</div>
                      <div className="fnd-cp-title">
                        <code className="t">&lt;button&gt;</code> — Le clou du spectacle
                      </div>
                    </div>
                  </div>

                  <div className="fnd-cp-explain">
                    <p className="fnd-exp-p">
                      Un formulaire a toujours besoin d'un <strong>bouton d'envoi</strong>. L'attribut le plus important ici, c'est <code className="fnd-ic t">type="submit"</code> !
                    </p>
                    <div className="fnd-analogy">
                      <div className="fnd-an-ico"><FiSend size={24} color="var(--vio)" /></div>
                      <div className="fnd-an-txt">
                        <strong>Analogie</strong> — C'est comme le <strong>timbre sur ton enveloppe</strong>. Sans lui, impossible de poster la lettre au serveur !
                      </div>
                    </div>
                  </div>

                  <div className="fnd-cp-code">
                    <div className="fnd-preview-box">
                      <span className="fnd-fp-lbl">Rendu du Bouton d'Envoi :</span>
                      <button 
                        className="fnd-live-btn"
                        onClick={() => {
                          markExplored(5);
                          alert("Pouf ! Les données partent vers le serveur (si on avait un vrai serveur !)");
                        }}
                        style={{
                          background: 'var(--vio)', color: 'white', border: 'none', padding: '12px 24px', 
                          borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px'
                        }}
                      >
                        Envoyer le formulaire
                      </button>
                    </div>
                    <CodeBlock fileName="BOUTON.HTML">
                      <CodeLine><Ct c="&lt;button" /> <Ca c='type=' /><Cv c='"submit"' /><Ct c="&gt;" /></CodeLine>
                      <CodeLine indent><Cw c="Envoyer le formulaire" /></CodeLine>
                      <CodeLine><Ct c="&lt;/button&gt;" /></CodeLine>
                    </CodeBlock>
                  </div>
                </div>

                <div ref={challengeRef}>
                  <ChallengeSection
                    visible={challengeVisible[5]}
                    explored={explored[5]}
                    onReveal={() => revealChallenge(5)}
                  >
                    <div className="fnd-cz-hd">
                      <div className="fnd-cz-ico"><FiAward size={22} color="var(--amb)" /></div>
                      <div className="fnd-cz-ttl">Défi final — Le bon type</div>
                    </div>
                    <p className="fnd-cz-sub">Pour envoyer les données au serveur, quel "type" doit avoir notre bouton ?</p>
                    <McqOptions
                      options={[
                        { label: 'type="button"', correct: false },
                        { label: 'type="send"',   correct: false },
                        { label: 'type="submit"', correct: true  },
                      ]}
                      selectedIdx={c5MCQ?.selected ?? null}
                      onSelect={(idx, correct) => {
                        handleC5MCQ(idx, correct);
                      }}
                    />
                    <AnimatePresence>
                      {c5Feedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className={`fnd-cz-fb ${c5Feedback.ok ? 'ok' : 'nope'}`}
                          dangerouslySetInnerHTML={{ __html: c5Feedback.text }}
                        />
                      )}
                    </AnimatePresence>
                    {solved[5] && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                        className="fnd-unlock-btn final"
                        onClick={() => navigate('/hub')}
                      >
                        \(^_^)/ Continuer vers l'Explorer !
                      </motion.button>
                    )}
                  </ChallengeSection>
                </div>
              </div>
            )}
