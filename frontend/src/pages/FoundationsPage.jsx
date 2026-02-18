import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Lottie from 'lottie-react'
import {
    HiOutlineArrowRight,
    HiOutlineQuestionMarkCircle,
    HiOutlineLightBulb,
    HiOutlineCodeBracket,
    HiOutlineChatBubbleLeftRight,
    HiOutlineXMark,
    HiOutlinePaperAirplane
} from 'react-icons/hi2'
import codingAnimation from '../assets/animations/coding-animation.json'

/* ═══════════════════════════════════════
   SVG : Structure d'un <form>
   ═══════════════════════════════════════ */
function FormStructureSVG() {
    return (
        <svg viewBox="0 0 320 260" className="foundations-svg" xmlns="http://www.w3.org/2000/svg">
            {/* Fond */}
            <rect x="0" y="0" width="320" height="260" rx="16" fill="#1E1E2E" />

            {/* Ligne 1: <form> */}
            <text x="20" y="40" fill="#C678DD" fontSize="14" fontFamily="monospace">&lt;</text>
            <text x="30" y="40" fill="#E06C75" fontSize="14" fontFamily="monospace">form</text>
            <text x="66" y="40" fill="#C678DD" fontSize="14" fontFamily="monospace">&gt;</text>

            {/* Zone de contenu - le "plateau" */}
            <rect x="30" y="55" width="260" height="140" rx="8" fill="none" stroke="#61AFEF" strokeWidth="2" strokeDasharray="6 4" />
            <text x="90" y="100" fill="#5C6370" fontSize="11" fontFamily="monospace">// Le contenu du</text>
            <text x="90" y="118" fill="#5C6370" fontSize="11" fontFamily="monospace">// formulaire va ici</text>
            <text x="90" y="140" fill="#5C6370" fontSize="11" fontFamily="monospace">// (input, select...)</text>

            {/* Icône plateau */}
            <text x="50" y="125" fontSize="28">🍽️</text>

            {/* Flèche annotée */}
            <line x1="290" y1="55" x2="310" y2="30" stroke="#98C379" strokeWidth="1.5" />
            <text x="240" y="24" fill="#98C379" fontSize="9" fontFamily="sans-serif">Balise ouvrante</text>

            {/* Ligne finale: </form> */}
            <text x="20" y="220" fill="#C678DD" fontSize="14" fontFamily="monospace">&lt;/</text>
            <text x="38" y="220" fill="#E06C75" fontSize="14" fontFamily="monospace">form</text>
            <text x="74" y="220" fill="#C678DD" fontSize="14" fontFamily="monospace">&gt;</text>

            {/* Flèche annotée */}
            <line x1="80" y1="215" x2="100" y2="240" stroke="#98C379" strokeWidth="1.5" />
            <text x="105" y="247" fill="#98C379" fontSize="9" fontFamily="sans-serif">Balise fermante</text>
        </svg>
    )
}

/* ═══════════════════════════════════════
   SVG : Élément <input> avec attributs
   ═══════════════════════════════════════ */
function InputAttributesSVG() {
    return (
        <svg viewBox="0 0 360 300" className="foundations-svg" xmlns="http://www.w3.org/2000/svg">
            {/* Fond */}
            <rect x="0" y="0" width="360" height="300" rx="16" fill="#1E1E2E" />

            {/* Code de l'input */}
            <text x="15" y="35" fill="#C678DD" fontSize="11" fontFamily="monospace">&lt;</text>
            <text x="23" y="35" fill="#E06C75" fontSize="11" fontFamily="monospace">input</text>

            {/* Attribut type */}
            <text x="30" y="60" fill="#D19A66" fontSize="11" fontFamily="monospace">type</text>
            <text x="62" y="60" fill="#56B6C2" fontSize="11" fontFamily="monospace">=</text>
            <text x="70" y="60" fill="#98C379" fontSize="11" fontFamily="monospace">"text"</text>

            {/* Attribut name */}
            <text x="30" y="85" fill="#D19A66" fontSize="11" fontFamily="monospace">name</text>
            <text x="65" y="85" fill="#56B6C2" fontSize="11" fontFamily="monospace">=</text>
            <text x="73" y="85" fill="#98C379" fontSize="11" fontFamily="monospace">"prenom"</text>

            {/* Attribut placeholder */}
            <text x="30" y="110" fill="#D19A66" fontSize="11" fontFamily="monospace">placeholder</text>
            <text x="120" y="110" fill="#56B6C2" fontSize="11" fontFamily="monospace">=</text>
            <text x="128" y="110" fill="#98C379" fontSize="11" fontFamily="monospace">"Ton prénom"</text>

            {/* Attribut required */}
            <text x="30" y="135" fill="#D19A66" fontSize="11" fontFamily="monospace">required</text>

            {/* Fermeture */}
            <text x="15" y="155" fill="#C678DD" fontSize="11" fontFamily="monospace">/&gt;</text>

            {/* Séparateur */}
            <line x1="20" y1="170" x2="340" y2="170" stroke="#3E4451" strokeWidth="1" />

            {/* Rendu visuel du champ */}
            <text x="15" y="195" fill="#ABB2BF" fontSize="10" fontFamily="sans-serif">Résultat visuel :</text>
            <rect x="15" y="205" width="250" height="36" rx="8" fill="#2D2D3F" stroke="#61AFEF" strokeWidth="1.5" />
            <text x="25" y="228" fill="#5C6370" fontSize="12" fontFamily="sans-serif">Ton prénom</text>
            <text x="225" y="228" fill="#E06C75" fontSize="10" fontFamily="sans-serif">*</text>

            {/* Annotations */}
            <line x1="270" y1="60" x2="300" y2="60" stroke="#E5C07B" strokeWidth="1" />
            <text x="305" y="63" fill="#E5C07B" fontSize="8" fontFamily="sans-serif">Le type de champ</text>

            <line x1="270" y1="85" x2="300" y2="85" stroke="#E5C07B" strokeWidth="1" />
            <text x="305" y="88" fill="#E5C07B" fontSize="8" fontFamily="sans-serif">Son identifiant</text>

            <line x1="270" y1="110" x2="300" y2="110" stroke="#E5C07B" strokeWidth="1" />
            <text x="305" y="113" fill="#E5C07B" fontSize="8" fontFamily="sans-serif">Texte d'aide</text>

            <line x1="270" y1="135" x2="300" y2="135" stroke="#E06C75" strokeWidth="1" />
            <text x="305" y="138" fill="#E06C75" fontSize="8" fontFamily="sans-serif">Obligatoire !</text>

            {/* Flèche vers le résultat */}
            <text x="15" y="260" fill="#61AFEF" fontSize="9" fontFamily="sans-serif">⬆ Le navigateur transforme le code en champ de saisie !</text>
        </svg>
    )
}

/* ═══════════════════════════════════════
   SVG : Bouton submit
   ═══════════════════════════════════════ */
function SubmitButtonSVG() {
    return (
        <svg viewBox="0 0 320 220" className="foundations-svg" xmlns="http://www.w3.org/2000/svg">
            {/* Fond */}
            <rect x="0" y="0" width="320" height="220" rx="16" fill="#1E1E2E" />

            {/* Code du bouton */}
            <text x="20" y="35" fill="#C678DD" fontSize="12" fontFamily="monospace">&lt;</text>
            <text x="30" y="35" fill="#E06C75" fontSize="12" fontFamily="monospace">button</text>
            <text x="30" y="55" fill="#D19A66" fontSize="12" fontFamily="monospace">  type</text>
            <text x="78" y="55" fill="#56B6C2" fontSize="12" fontFamily="monospace">=</text>
            <text x="86" y="55" fill="#98C379" fontSize="12" fontFamily="monospace">"submit"</text>
            <text x="20" y="75" fill="#C678DD" fontSize="12" fontFamily="monospace">&gt;</text>

            {/* Texte du bouton */}
            <text x="30" y="95" fill="#ABB2BF" fontSize="12" fontFamily="monospace">  Envoyer 🚀</text>

            {/* Fermeture */}
            <text x="20" y="115" fill="#C678DD" fontSize="12" fontFamily="monospace">&lt;/</text>
            <text x="38" y="115" fill="#E06C75" fontSize="12" fontFamily="monospace">button</text>
            <text x="84" y="115" fill="#C678DD" fontSize="12" fontFamily="monospace">&gt;</text>

            {/* Séparateur */}
            <line x1="20" y1="130" x2="300" y2="130" stroke="#3E4451" strokeWidth="1" />

            {/* Rendu visuel */}
            <text x="20" y="155" fill="#ABB2BF" fontSize="10" fontFamily="sans-serif">Résultat visuel :</text>

            {/* Bouton rendu */}
            <rect x="80" y="165" width="160" height="40" rx="10" fill="url(#submitGrad)" />
            <defs>
                <linearGradient id="submitGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#667EEA" />
                    <stop offset="100%" stopColor="#764BA2" />
                </linearGradient>
            </defs>
            <text x="118" y="190" fill="white" fontSize="13" fontWeight="bold" fontFamily="sans-serif">Envoyer 🚀</text>
        </svg>
    )
}

/* ═══════════════════════════════════════
   SVG : <label> lié à un input
   ═══════════════════════════════════════ */
function LabelSVG() {
    return (
        <svg viewBox="0 0 360 280" className="foundations-svg" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="360" height="280" rx="16" fill="#1E1E2E" />
            {/* Code label + input */}
            <text x="15" y="30" fill="#C678DD" fontSize="11" fontFamily="monospace">&lt;</text>
            <text x="23" y="30" fill="#E06C75" fontSize="11" fontFamily="monospace">label</text>
            <text x="60" y="30" fill="#D19A66" fontSize="11" fontFamily="monospace">for</text>
            <text x="82" y="30" fill="#56B6C2" fontSize="11" fontFamily="monospace">=</text>
            <text x="90" y="30" fill="#98C379" fontSize="11" fontFamily="monospace">"prenom"</text>
            <text x="150" y="30" fill="#C678DD" fontSize="11" fontFamily="monospace">&gt;</text>
            <text x="20" y="50" fill="#ABB2BF" fontSize="11" fontFamily="monospace">  Ton prénom :</text>
            <text x="15" y="70" fill="#C678DD" fontSize="11" fontFamily="monospace">&lt;/</text>
            <text x="30" y="70" fill="#E06C75" fontSize="11" fontFamily="monospace">label</text>
            <text x="65" y="70" fill="#C678DD" fontSize="11" fontFamily="monospace">&gt;</text>
            <text x="15" y="100" fill="#C678DD" fontSize="11" fontFamily="monospace">&lt;</text>
            <text x="23" y="100" fill="#E06C75" fontSize="11" fontFamily="monospace">input</text>
            <text x="58" y="100" fill="#D19A66" fontSize="11" fontFamily="monospace">id</text>
            <text x="72" y="100" fill="#56B6C2" fontSize="11" fontFamily="monospace">=</text>
            <text x="80" y="100" fill="#98C379" fontSize="11" fontFamily="monospace">"prenom"</text>
            <text x="140" y="100" fill="#C678DD" fontSize="11" fontFamily="monospace">/&gt;</text>
            {/* Lien visuel for ↔ id */}
            <line x1="130" y1="30" x2="200" y2="30" stroke="#E5C07B" strokeWidth="1" />
            <line x1="130" y1="100" x2="200" y2="100" stroke="#E5C07B" strokeWidth="1" />
            <line x1="200" y1="30" x2="200" y2="100" stroke="#E5C07B" strokeWidth="1.5" strokeDasharray="4 3" />
            <text x="205" y="68" fill="#E5C07B" fontSize="9" fontFamily="sans-serif">Liés !</text>
            {/* Séparateur */}
            <line x1="15" y1="125" x2="345" y2="125" stroke="#3E4451" strokeWidth="1" />
            {/* Rendu visuel */}
            <text x="15" y="150" fill="#ABB2BF" fontSize="10" fontFamily="sans-serif">Résultat visuel :</text>
            <text x="15" y="175" fill="#E5C07B" fontSize="13" fontFamily="sans-serif" fontWeight="bold">Ton prénom :</text>
            <rect x="15" y="185" width="220" height="34" rx="8" fill="#2D2D3F" stroke="#61AFEF" strokeWidth="1.5" />
            <text x="25" y="207" fill="#5C6370" fontSize="11" fontFamily="sans-serif">Clique sur le label → le champ s'active !</text>
            <text x="15" y="250" fill="#61AFEF" fontSize="9" fontFamily="sans-serif">⬆ Cliquer sur "Ton prénom :" place le curseur dans le champ !</text>
        </svg>
    )
}

/* ═══════════════════════════════════════
   SVG : Types d'input (password, email, number)
   ═══════════════════════════════════════ */
function InputTypesSVG() {
    return (
        <svg viewBox="0 0 360 320" className="foundations-svg" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="360" height="320" rx="16" fill="#1E1E2E" />
            <text x="15" y="25" fill="#ABB2BF" fontSize="11" fontFamily="sans-serif" fontWeight="bold">Les types les plus utilisés :</text>
            {/* type="text" */}
            <rect x="10" y="38" width="340" height="60" rx="8" fill="#252536" />
            <text x="20" y="55" fill="#98C379" fontSize="10" fontFamily="monospace">type="text"</text>
            <text x="150" y="55" fill="#5C6370" fontSize="9" fontFamily="sans-serif">→ Texte normal</text>
            <rect x="20" y="62" width="180" height="26" rx="6" fill="#2D2D3F" stroke="#61AFEF" strokeWidth="1" />
            <text x="30" y="80" fill="#ABB2BF" fontSize="10" fontFamily="sans-serif">Jean Dupont</text>
            {/* type="password" */}
            <rect x="10" y="108" width="340" height="60" rx="8" fill="#252536" />
            <text x="20" y="125" fill="#98C379" fontSize="10" fontFamily="monospace">type="password"</text>
            <text x="168" y="125" fill="#5C6370" fontSize="9" fontFamily="sans-serif">→ Texte masqué</text>
            <rect x="20" y="132" width="180" height="26" rx="6" fill="#2D2D3F" stroke="#E06C75" strokeWidth="1" />
            <text x="30" y="150" fill="#ABB2BF" fontSize="13" fontFamily="monospace">••••••••</text>
            <text x="210" y="150" fill="#E06C75" fontSize="16">🔒</text>
            {/* type="email" */}
            <rect x="10" y="178" width="340" height="60" rx="8" fill="#252536" />
            <text x="20" y="195" fill="#98C379" fontSize="10" fontFamily="monospace">type="email"</text>
            <text x="145" y="195" fill="#5C6370" fontSize="9" fontFamily="sans-serif">→ Vérifie le format @</text>
            <rect x="20" y="202" width="180" height="26" rx="6" fill="#2D2D3F" stroke="#61AFEF" strokeWidth="1" />
            <text x="30" y="220" fill="#ABB2BF" fontSize="10" fontFamily="sans-serif">jean@email.com</text>
            <text x="210" y="220" fill="#61AFEF" fontSize="16">📧</text>
            {/* type="number" */}
            <rect x="10" y="248" width="340" height="60" rx="8" fill="#252536" />
            <text x="20" y="265" fill="#98C379" fontSize="10" fontFamily="monospace">type="number"</text>
            <text x="155" y="265" fill="#5C6370" fontSize="9" fontFamily="sans-serif">→ Chiffres uniquement</text>
            <rect x="20" y="272" width="120" height="26" rx="6" fill="#2D2D3F" stroke="#61AFEF" strokeWidth="1" />
            <text x="30" y="290" fill="#ABB2BF" fontSize="10" fontFamily="sans-serif">16</text>
            <text x="110" y="285" fill="#5C6370" fontSize="8" fontFamily="sans-serif">▲</text>
            <text x="110" y="295" fill="#5C6370" fontSize="8" fontFamily="sans-serif">▼</text>
            <text x="150" y="290" fill="#61AFEF" fontSize="16">🔢</text>
        </svg>
    )
}

/* ═══════════════════════════════════════
   SVG : <select> et <textarea>
   ═══════════════════════════════════════ */
function SelectTextareaSVG() {
    return (
        <svg viewBox="0 0 360 300" className="foundations-svg" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="360" height="300" rx="16" fill="#1E1E2E" />
            {/* SELECT */}
            <text x="15" y="25" fill="#E5C07B" fontSize="11" fontFamily="sans-serif" fontWeight="bold">📋 Liste déroulante (&lt;select&gt;) :</text>
            <text x="15" y="48" fill="#C678DD" fontSize="10" fontFamily="monospace">&lt;</text>
            <text x="22" y="48" fill="#E06C75" fontSize="10" fontFamily="monospace">select</text>
            <text x="60" y="48" fill="#D19A66" fontSize="10" fontFamily="monospace">name</text>
            <text x="88" y="48" fill="#56B6C2" fontSize="10" fontFamily="monospace">=</text>
            <text x="95" y="48" fill="#98C379" fontSize="10" fontFamily="monospace">"classe"</text>
            <text x="150" y="48" fill="#C678DD" fontSize="10" fontFamily="monospace">&gt;</text>
            <text x="25" y="65" fill="#C678DD" fontSize="10" fontFamily="monospace">&lt;</text>
            <text x="32" y="65" fill="#E06C75" fontSize="10" fontFamily="monospace">option</text>
            <text x="70" y="65" fill="#C678DD" fontSize="10" fontFamily="monospace">&gt;</text>
            <text x="78" y="65" fill="#ABB2BF" fontSize="10" fontFamily="monospace">Seconde</text>
            <text x="130" y="65" fill="#C678DD" fontSize="10" fontFamily="monospace">&lt;/</text>
            <text x="142" y="65" fill="#E06C75" fontSize="10" fontFamily="monospace">option</text>
            <text x="180" y="65" fill="#C678DD" fontSize="10" fontFamily="monospace">&gt;</text>
            <text x="25" y="82" fill="#C678DD" fontSize="10" fontFamily="monospace">&lt;</text>
            <text x="32" y="82" fill="#E06C75" fontSize="10" fontFamily="monospace">option</text>
            <text x="70" y="82" fill="#C678DD" fontSize="10" fontFamily="monospace">&gt;</text>
            <text x="78" y="82" fill="#ABB2BF" fontSize="10" fontFamily="monospace">Première</text>
            <text x="137" y="82" fill="#C678DD" fontSize="10" fontFamily="monospace">&lt;/</text>
            <text x="149" y="82" fill="#E06C75" fontSize="10" fontFamily="monospace">option</text>
            <text x="187" y="82" fill="#C678DD" fontSize="10" fontFamily="monospace">&gt;</text>
            <text x="15" y="99" fill="#C678DD" fontSize="10" fontFamily="monospace">&lt;/</text>
            <text x="27" y="99" fill="#E06C75" fontSize="10" fontFamily="monospace">select</text>
            <text x="65" y="99" fill="#C678DD" fontSize="10" fontFamily="monospace">&gt;</text>
            {/* Rendu select */}
            <rect x="220" y="50" width="120" height="30" rx="6" fill="#2D2D3F" stroke="#61AFEF" strokeWidth="1.5" />
            <text x="230" y="70" fill="#ABB2BF" fontSize="10" fontFamily="sans-serif">Seconde</text>
            <text x="318" y="70" fill="#61AFEF" fontSize="10">▼</text>
            <text x="220" y="45" fill="#ABB2BF" fontSize="9" fontFamily="sans-serif">Rendu :</text>
            {/* Séparateur */}
            <line x1="15" y1="120" x2="345" y2="120" stroke="#3E4451" strokeWidth="1" />
            {/* TEXTAREA */}
            <text x="15" y="145" fill="#E5C07B" fontSize="11" fontFamily="sans-serif" fontWeight="bold">📝 Zone de texte (&lt;textarea&gt;) :</text>
            <text x="15" y="168" fill="#C678DD" fontSize="10" fontFamily="monospace">&lt;</text>
            <text x="22" y="168" fill="#E06C75" fontSize="10" fontFamily="monospace">textarea</text>
            <text x="15" y="185" fill="#D19A66" fontSize="10" fontFamily="monospace">  rows</text>
            <text x="55" y="185" fill="#56B6C2" fontSize="10" fontFamily="monospace">=</text>
            <text x="62" y="185" fill="#98C379" fontSize="10" fontFamily="monospace">"4"</text>
            <text x="15" y="202" fill="#D19A66" fontSize="10" fontFamily="monospace">  placeholder</text>
            <text x="105" y="202" fill="#56B6C2" fontSize="10" fontFamily="monospace">=</text>
            <text x="112" y="202" fill="#98C379" fontSize="10" fontFamily="monospace">"Ton message..."</text>
            <text x="15" y="219" fill="#C678DD" fontSize="10" fontFamily="monospace">&gt;&lt;/</text>
            <text x="38" y="219" fill="#E06C75" fontSize="10" fontFamily="monospace">textarea</text>
            <text x="90" y="219" fill="#C678DD" fontSize="10" fontFamily="monospace">&gt;</text>
            {/* Rendu textarea */}
            <rect x="200" y="155" width="145" height="75" rx="6" fill="#2D2D3F" stroke="#61AFEF" strokeWidth="1.5" />
            <text x="210" y="175" fill="#5C6370" fontSize="9" fontFamily="sans-serif">Ton message...</text>
            <text x="200" y="150" fill="#ABB2BF" fontSize="9" fontFamily="sans-serif">Rendu :</text>
            <text x="15" y="265" fill="#61AFEF" fontSize="9" fontFamily="sans-serif">💡 &lt;select&gt; = choix limité | &lt;textarea&gt; = texte long et libre</text>
        </svg>
    )
}

/* ═══════════════════════════════════════
   SVG : Checkbox et Radio
   ═══════════════════════════════════════ */
function CheckboxRadioSVG() {
    return (
        <svg viewBox="0 0 360 280" className="foundations-svg" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="360" height="280" rx="16" fill="#1E1E2E" />
            {/* CHECKBOX */}
            <text x="15" y="25" fill="#E5C07B" fontSize="11" fontFamily="sans-serif" fontWeight="bold">☑️ Cases à cocher (checkbox) :</text>
            <text x="15" y="48" fill="#C678DD" fontSize="9" fontFamily="monospace">&lt;</text>
            <text x="22" y="48" fill="#E06C75" fontSize="9" fontFamily="monospace">input</text>
            <text x="52" y="48" fill="#D19A66" fontSize="9" fontFamily="monospace">type</text>
            <text x="75" y="48" fill="#56B6C2" fontSize="9" fontFamily="monospace">=</text>
            <text x="82" y="48" fill="#98C379" fontSize="9" fontFamily="monospace">"checkbox"</text>
            <text x="148" y="48" fill="#C678DD" fontSize="9" fontFamily="monospace">/&gt;</text>
            <text x="160" y="48" fill="#ABB2BF" fontSize="9" fontFamily="monospace">HTML</text>
            {/* Rendu checkbox */}
            <rect x="220" y="30" width="120" height="80" rx="8" fill="#252536" />
            <text x="230" y="48" fill="#ABB2BF" fontSize="9" fontFamily="sans-serif">Rendu :</text>
            <rect x="230" y="55" width="14" height="14" rx="3" fill="#2D2D3F" stroke="#98C379" strokeWidth="1.5" />
            <text x="237" y="66" fill="#98C379" fontSize="10" fontFamily="sans-serif">✓</text>
            <text x="250" y="66" fill="#ABB2BF" fontSize="10" fontFamily="sans-serif">HTML</text>
            <rect x="230" y="75" width="14" height="14" rx="3" fill="#2D2D3F" stroke="#98C379" strokeWidth="1.5" />
            <text x="237" y="86" fill="#98C379" fontSize="10" fontFamily="sans-serif">✓</text>
            <text x="250" y="86" fill="#ABB2BF" fontSize="10" fontFamily="sans-serif">CSS</text>
            <rect x="230" y="95" width="14" height="14" rx="3" fill="#2D2D3F" stroke="#61AFEF" strokeWidth="1" />
            <text x="250" y="106" fill="#5C6370" fontSize="10" fontFamily="sans-serif">JavaScript</text>
            <text x="15" y="80" fill="#5C6370" fontSize="9" fontFamily="sans-serif">→ Plusieurs choix possibles</text>
            {/* Séparateur */}
            <line x1="15" y1="130" x2="345" y2="130" stroke="#3E4451" strokeWidth="1" />
            {/* RADIO */}
            <text x="15" y="155" fill="#E5C07B" fontSize="11" fontFamily="sans-serif" fontWeight="bold">🔘 Boutons radio (radio) :</text>
            <text x="15" y="178" fill="#C678DD" fontSize="9" fontFamily="monospace">&lt;</text>
            <text x="22" y="178" fill="#E06C75" fontSize="9" fontFamily="monospace">input</text>
            <text x="52" y="178" fill="#D19A66" fontSize="9" fontFamily="monospace">type</text>
            <text x="75" y="178" fill="#56B6C2" fontSize="9" fontFamily="monospace">=</text>
            <text x="82" y="178" fill="#98C379" fontSize="9" fontFamily="monospace">"radio"</text>
            <text x="15" y="195" fill="#D19A66" fontSize="9" fontFamily="monospace">  name</text>
            <text x="52" y="195" fill="#56B6C2" fontSize="9" fontFamily="monospace">=</text>
            <text x="59" y="195" fill="#98C379" fontSize="9" fontFamily="monospace">"niveau"</text>
            <text x="115" y="195" fill="#C678DD" fontSize="9" fontFamily="monospace">/&gt;</text>
            {/* Rendu radio */}
            <rect x="220" y="150" width="120" height="80" rx="8" fill="#252536" />
            <text x="230" y="168" fill="#ABB2BF" fontSize="9" fontFamily="sans-serif">Rendu :</text>
            <circle cx="237" cy="183" r="7" fill="#2D2D3F" stroke="#61AFEF" strokeWidth="1.5" />
            <circle cx="237" cy="183" r="4" fill="#667EEA" />
            <text x="250" y="187" fill="#ABB2BF" fontSize="10" fontFamily="sans-serif">Débutant</text>
            <circle cx="237" cy="205" r="7" fill="#2D2D3F" stroke="#61AFEF" strokeWidth="1" />
            <text x="250" y="209" fill="#5C6370" fontSize="10" fontFamily="sans-serif">Intermédiaire</text>
            <circle cx="237" cy="227" r="7" fill="#2D2D3F" stroke="#61AFEF" strokeWidth="1" />
            <text x="250" y="231" fill="#5C6370" fontSize="10" fontFamily="sans-serif">Expert</text>
            <text x="15" y="220" fill="#5C6370" fontSize="9" fontFamily="sans-serif">→ Un seul choix possible</text>
            <text x="15" y="265" fill="#61AFEF" fontSize="9" fontFamily="sans-serif">💡 checkbox = plusieurs choix | radio = un seul choix (même name)</text>
        </svg>
    )
}

export default function FoundationsPage({ user }) {
    const [simpleExplanations, setSimpleExplanations] = useState({})
    const [chatOpen, setChatOpen] = useState(false)
    const [chatMessages, setChatMessages] = useState([])
    const [chatInput, setChatInput] = useState('')
    const [chatLoading, setChatLoading] = useState(false)
    const chatMessagesRef = useRef(null)
    const navigate = useNavigate()

    const suggestedQuestions = [
        "Pourquoi on a besoin de <form> ?",
        "Différence entre type='text' et type='password' ?",
        "À quoi sert le <label> ?",
        "Comment obliger quelqu'un à remplir un champ ?",
        "Où vont les données quand on clique submit ?",
        "Comment mettre une liste déroulante ?",
        "checkbox ou radio, lequel choisir ?",
        "C'est quoi le placeholder ?",
        "Comment vérifier qu'un email est valide ?",
        "Tu peux me montrer un formulaire complet ?",
        "C'est quoi name et value dans un input ?",
        "Je peux mettre une image dans un formulaire ?",
        "Comment écrire beaucoup de texte dans un champ ?",
        "Différence entre submit et button normal ?",
        "Comment rendre le formulaire joli avec CSS ?"
    ]

    const handleChatSend = async (text) => {
        if (chatLoading || !text.trim()) return
        setChatMessages(prev => [...prev, { role: 'user', content: text }])
        setChatInput('')
        setChatLoading(true)
        try {
            await new Promise(r => setTimeout(r, 800))
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ message: text })
            })
            const data = await res.json()
            setChatMessages(prev => [...prev, { role: 'bot', content: data.response || "Je n'ai pas compris, reformule ta question ! 🤔" }])
        } catch {
            setChatMessages(prev => [...prev, { role: 'bot', content: "Oups, erreur de connexion ! Réessaie. 😅" }])
        }
        setChatLoading(false)
    }

    const handleChatSubmit = (e) => {
        e.preventDefault()
        handleChatSend(chatInput)
    }

    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
        }
    }, [chatMessages, chatLoading])

    const toggleExplanation = (key) => {
        setSimpleExplanations(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const handleContinue = () => {
        navigate('/hub')
    }

    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
    }

    return (
        <div className="intro-page foundations-page">
            {/* Particules de fond */}
            <div className="particles">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${3 + Math.random() * 4}px`,
                            height: `${3 + Math.random() * 4}px`,
                        }}
                        animate={{
                            y: [0, -40 - Math.random() * 60, 0],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: 8 + Math.random() * 8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: Math.random() * 4,
                        }}
                    />
                ))}
            </div>

            <div className="intro-content">
                {/* ═══════════════════════════════════════
                   SECTION 1 — Accueil avec Lottie
                   ═══════════════════════════════════════ */}
                <motion.section
                    className="intro-section intro-welcome"
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                >
                    <div className="intro-welcome-inner">
                        <div className="lottie-container">
                            <Lottie
                                animationData={codingAnimation}
                                loop={true}
                                style={{ width: '100%', maxWidth: 280 }}
                            />
                        </div>
                        <div className="intro-welcome-text">
                            <motion.h1
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5, duration: 0.7 }}
                            >
                                Super, <span className="accent">{user?.name || 'toi'}</span> ! 🎉
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8, duration: 0.7 }}
                            >
                                Maintenant que tu sais ce qu'est un formulaire, apprenons à en <strong>construire un</strong> avec du code HTML !
                            </motion.p>
                            <motion.div
                                className="foundations-badge"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.2, duration: 0.6 }}
                            >
                                <HiOutlineCodeBracket />
                                <span>Les fondations</span>
                            </motion.div>
                        </div>
                    </div>
                </motion.section>

                {/* ═══════════════════════════════════════
                   SECTION 2 — La balise <form>
                   ═══════════════════════════════════════ */}
                <motion.section
                    className="intro-section foundations-step"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={fadeUp}
                >
                    <div className="step-number">1</div>
                    <h2 className="step-title">
                        La balise <code>&lt;form&gt;</code> — Le plateau du serveur 🍽️
                    </h2>

                    <div className="step-content">
                        <div className="step-text">
                            <p>
                                Tout formulaire HTML commence par <code>&lt;form&gt;</code> et
                                se termine par <code>&lt;/form&gt;</code>.
                            </p>
                            <p>
                                C'est le <strong>conteneur</strong> qui regroupe tous les champs.
                                Sans lui, le navigateur ne sait pas qu'il s'agit d'un formulaire !
                            </p>
                            <div className="step-analogy">
                                <span className="analogy-emoji">🍽️</span>
                                <p>
                                    <strong>Analogie :</strong> La balise <code>&lt;form&gt;</code>, c'est comme le
                                    <strong> plateau du serveur</strong>. Sans plateau, impossible de transporter
                                    ta commande en cuisine !
                                </p>
                            </div>
                        </div>
                        <div className="step-visual">
                            <FormStructureSVG />
                        </div>
                    </div>

                    {/* Bouton "J'ai pas compris" */}
                    <motion.button
                        className="btn-not-understood"
                        onClick={() => toggleExplanation('form')}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <HiOutlineQuestionMarkCircle />
                        {simpleExplanations.form ? "OK, j'ai compris !" : "J'ai pas compris 🤔"}
                    </motion.button>

                    <AnimatePresence>
                        {simpleExplanations.form && (
                            <motion.div
                                className="simple-explanation"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <HiOutlineLightBulb className="bulb-icon" />
                                <div>
                                    <p><strong>En plus simple :</strong></p>
                                    <p>
                                        Imagine une <strong>boîte</strong> 📦. Tu mets tous tes éléments dedans
                                        (champs de texte, boutons...).
                                        La balise <code>&lt;form&gt;</code> c'est cette boîte.
                                        Tout ce qui est à l'intérieur fait partie du formulaire !
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.section>

                {/* ═══════════════════════════════════════
                   SECTION 3 — L'élément <input> + attributs
                   ═══════════════════════════════════════ */}
                <motion.section
                    className="intro-section foundations-step"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={fadeUp}
                >
                    <div className="step-number">2</div>
                    <h2 className="step-title">
                        L'élément <code>&lt;input&gt;</code> — Le champ de saisie ✏️
                    </h2>

                    <div className="step-content reverse">
                        <div className="step-visual">
                            <InputAttributesSVG />
                        </div>
                        <div className="step-text">
                            <p>
                                L'élément <code>&lt;input&gt;</code> est le <strong>composant de base</strong> d'un
                                formulaire. C'est lui qui crée les champs à remplir.
                            </p>
                            <p>Il a plusieurs <strong>attributs</strong> importants :</p>
                            <ul className="attribute-list">
                                <li>
                                    <code>type</code> — Le type de champ (texte, email, mot de passe...)
                                </li>
                                <li>
                                    <code>name</code> — L'identifiant unique du champ
                                </li>
                                <li>
                                    <code>placeholder</code> — Le texte d'aide grisé
                                </li>
                                <li>
                                    <code>required</code> — Rend le champ obligatoire
                                </li>
                            </ul>
                        </div>
                    </div>

                    <motion.button
                        className="btn-not-understood"
                        onClick={() => toggleExplanation('input')}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <HiOutlineQuestionMarkCircle />
                        {simpleExplanations.input ? "OK, j'ai compris !" : "J'ai pas compris 🤔"}
                    </motion.button>

                    <AnimatePresence>
                        {simpleExplanations.input && (
                            <motion.div
                                className="simple-explanation"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <HiOutlineLightBulb className="bulb-icon" />
                                <div>
                                    <p><strong>En plus simple :</strong></p>
                                    <p>
                                        Un <code>&lt;input&gt;</code>, c'est comme une <strong>ligne sur un formulaire papier</strong> 📝.
                                        Le <code>type</code> dit si c'est pour écrire du texte, un email, etc.
                                        Le <code>placeholder</code>, c'est le petit texte gris qui dit "Écris ici...".
                                        Et <code>required</code>, c'est comme quand il y a une <strong>étoile *</strong> à
                                        côté = obligatoire !
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.section>

                {/* ═══════════════════════════════════════
                   SECTION 3 — Le <label>
                   ═══════════════════════════════════════ */}
                <motion.section
                    className="intro-section foundations-step"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={fadeUp}
                >
                    <div className="step-number">3</div>
                    <h2 className="step-title">
                        La balise <code>&lt;label&gt;</code> — L'étiquette 🏷️
                    </h2>
                    <div className="step-content reverse">
                        <div className="step-visual">
                            <LabelSVG />
                        </div>
                        <div className="step-text">
                            <p>
                                Le <code>&lt;label&gt;</code> donne un <strong>nom visible</strong> à
                                chaque champ. Il dit à l'utilisateur ce qu'on attend de lui.
                            </p>
                            <p>
                                Grâce à l'attribut <code>for</code>, quand on <strong>clique sur le label</strong>,
                                le curseur se place automatiquement dans le champ correspondant !
                            </p>
                            <div className="step-analogy">
                                <span className="analogy-emoji">🏷️</span>
                                <p>
                                    <strong>Analogie :</strong> C'est comme les <strong>étiquettes sur les tiroirs</strong>.
                                    Sans étiquette, tu ne sais pas dans quel tiroir ranger tes affaires !
                                </p>
                            </div>
                        </div>
                    </div>
                    <motion.button
                        className="btn-not-understood"
                        onClick={() => toggleExplanation('label')}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <HiOutlineQuestionMarkCircle />
                        {simpleExplanations.label ? "OK, j'ai compris !" : "J'ai pas compris 🤔"}
                    </motion.button>
                    <AnimatePresence>
                        {simpleExplanations.label && (
                            <motion.div
                                className="simple-explanation"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <HiOutlineLightBulb className="bulb-icon" />
                                <div>
                                    <p><strong>En plus simple :</strong></p>
                                    <p>
                                        Le <code>&lt;label&gt;</code> c'est le <strong>nom du champ</strong> qu'on voit
                                        à l'écran. L'attribut <code>for="prenom"</code> dit au label : "tu es lié au
                                        champ qui a <code>id="prenom"</code>". Quand on clique dessus, ça met le
                                        curseur directement dans le bon champ. Pratique !
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.section>

                {/* ═══════════════════════════════════════
                   SECTION 4 — Types d'input
                   ═══════════════════════════════════════ */}
                <motion.section
                    className="intro-section foundations-step"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={fadeUp}
                >
                    <div className="step-number">4</div>
                    <h2 className="step-title">
                        Les types d'<code>&lt;input&gt;</code> — Chaque champ a son rôle 🔧
                    </h2>
                    <div className="step-content">
                        <div className="step-text">
                            <p>
                                L'attribut <code>type</code> change complètement le <strong>comportement</strong> du champ :
                            </p>
                            <ul className="attribute-list">
                                <li><code>type="text"</code> — Texte normal, visible</li>
                                <li><code>type="password"</code> — Le texte est <strong>masqué</strong> avec des points 🔒</li>
                                <li><code>type="email"</code> — Vérifie qu'il y a un <strong>@</strong> 📧</li>
                                <li><code>type="number"</code> — Accepte <strong>uniquement les chiffres</strong> 🔢</li>
                            </ul>
                            <div className="step-analogy">
                                <span className="analogy-emoji">🔧</span>
                                <p>
                                    <strong>Analogie :</strong> C'est comme des <strong>ustensiles différents</strong> en cuisine.
                                    Une fourchette pour les pâtes, une cuillère pour la soupe — chaque outil a son usage !
                                </p>
                            </div>
                        </div>
                        <div className="step-visual">
                            <InputTypesSVG />
                        </div>
                    </div>
                    <motion.button
                        className="btn-not-understood"
                        onClick={() => toggleExplanation('types')}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <HiOutlineQuestionMarkCircle />
                        {simpleExplanations.types ? "OK, j'ai compris !" : "J'ai pas compris 🤔"}
                    </motion.button>
                    <AnimatePresence>
                        {simpleExplanations.types && (
                            <motion.div
                                className="simple-explanation"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <HiOutlineLightBulb className="bulb-icon" />
                                <div>
                                    <p><strong>En plus simple :</strong></p>
                                    <p>
                                        <code>password</code> cache ce que tu tapes (comme quand tu entres ton mot de
                                        passe sur Instagram). <code>email</code> vérifie qu'il y a un @ dans l'adresse.
                                        <code>number</code> empêche de taper des lettres — que des chiffres !
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.section>

                {/* ═══════════════════════════════════════
                   SECTION 5 — <select> et <textarea>
                   ═══════════════════════════════════════ */}
                <motion.section
                    className="intro-section foundations-step"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={fadeUp}
                >
                    <div className="step-number">5</div>
                    <h2 className="step-title">
                        <code>&lt;select&gt;</code> et <code>&lt;textarea&gt;</code> — Plus de choix ! 📋
                    </h2>
                    <div className="step-content reverse">
                        <div className="step-visual">
                            <SelectTextareaSVG />
                        </div>
                        <div className="step-text">
                            <p>
                                <code>&lt;select&gt;</code> crée une <strong>liste déroulante</strong> pour choisir
                                parmi plusieurs options prédéfinies.
                            </p>
                            <p>
                                <code>&lt;textarea&gt;</code> offre un <strong>grand champ de texte</strong> pour
                                écrire des messages longs (commentaires, descriptions...).
                            </p>
                            <div className="step-analogy">
                                <span className="analogy-emoji">📋</span>
                                <p>
                                    <strong>Analogie :</strong> Le <code>&lt;select&gt;</code> c'est comme le
                                    <strong> menu du restaurant</strong> — tu choisis parmi ce qui est proposé.
                                    Le <code>&lt;textarea&gt;</code> c'est une <strong>page blanche</strong> pour écrire
                                    ce que tu veux !
                                </p>
                            </div>
                        </div>
                    </div>
                    <motion.button
                        className="btn-not-understood"
                        onClick={() => toggleExplanation('selectarea')}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <HiOutlineQuestionMarkCircle />
                        {simpleExplanations.selectarea ? "OK, j'ai compris !" : "J'ai pas compris 🤔"}
                    </motion.button>
                    <AnimatePresence>
                        {simpleExplanations.selectarea && (
                            <motion.div
                                className="simple-explanation"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <HiOutlineLightBulb className="bulb-icon" />
                                <div>
                                    <p><strong>En plus simple :</strong></p>
                                    <p>
                                        <code>&lt;select&gt;</code> = tu cliques et une liste apparaît (comme choisir
                                        ta classe dans un menu). <code>&lt;textarea&gt;</code> = un grand espace pour
                                        écrire plein de texte (comme la zone de commentaire sur YouTube !).
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.section>

                {/* ═══════════════════════════════════════
                   CTA Final
                   ═══════════════════════════════════════ */}
                <motion.section
                    className="intro-section intro-cta"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={fadeUp}
                >
                    <motion.div className="cta-card" variants={fadeUp}>
                        <h2>Tu maîtrises les fondations ! 🏆</h2>
                        <p>
                            <code>&lt;form&gt;</code>, <code>&lt;input&gt;</code>, <code>&lt;label&gt;</code>,
                            les types de champs, <code>&lt;select&gt;</code> et <code>&lt;textarea&gt;</code> —
                            tu as les bases solides !
                            Passons maintenant à l'<strong>exploration interactive</strong> de chaque élément !
                        </p>
                        <motion.button
                            className="btn-start"
                            onClick={handleContinue}
                            whileHover={{ scale: 1.05, y: -3 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>Je suis prêt, allons explorer ! 🚀</span>
                            <HiOutlineArrowRight />
                        </motion.button>
                    </motion.div>
                </motion.section>
            </div>

            {/* ═══════════════════════════════════════
               CHATBOT FLOTTANT Q&A
               ═══════════════════════════════════════ */}
            <motion.button
                className="chatbot-fab"
                onClick={() => setChatOpen(prev => !prev)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Une question ? Demande-moi !"
            >
                {chatOpen ? <HiOutlineXMark /> : <HiOutlineChatBubbleLeftRight />}
            </motion.button>

            <AnimatePresence>
                {chatOpen && (
                    <motion.div
                        className="chatbot-panel"
                        initial={{ opacity: 0, y: 40, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <div className="chatbot-header">
                            <span>🎓 Pose ta question !</span>
                            <button onClick={() => setChatOpen(false)}><HiOutlineXMark /></button>
                        </div>

                        <div className="chatbot-messages" ref={chatMessagesRef}>
                            {chatMessages.length === 0 && (
                                <div className="chatbot-welcome">
                                    <p>👋 Salut ! Tu as une question sur les fondations HTML ?</p>
                                    <p className="chatbot-hint">Clique sur une question ou écris la tienne :</p>
                                </div>
                            )}
                            {chatMessages.map((msg, i) => (
                                <div key={i} className={`chatbot-msg ${msg.role}`}>
                                    <div className="chatbot-msg-bubble">{msg.content}</div>
                                </div>
                            ))}
                            {chatLoading && (
                                <div className="chatbot-msg bot">
                                    <div className="chatbot-msg-bubble typing">💭 Je réfléchis...</div>
                                </div>
                            )}
                        </div>

                        {chatMessages.length < 2 && (
                            <div className="suggested-questions">
                                {suggestedQuestions.map((q, i) => (
                                    <button key={i} onClick={() => handleChatSend(q)} className="suggested-q">
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}

                        <form className="chatbot-input" onSubmit={handleChatSubmit}>
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Écris ta question..."
                                disabled={chatLoading}
                            />
                            <button type="submit" disabled={chatLoading || !chatInput.trim()}>
                                <HiOutlinePaperAirplane />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

