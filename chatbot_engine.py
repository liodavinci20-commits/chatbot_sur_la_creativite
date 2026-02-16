# chatbot_engine.py
# Moteur de conversation scripté — 100% local, sans API externe

import re
from lessons_data import LESSONS, FINAL_CHALLENGE, WELCOME_MESSAGE, COMPLETION_MESSAGE


# ═══════════════════════════════════════════════════════════
# États du flux de conversation pour chaque rubrique
# ═══════════════════════════════════════════════════════════
STATE_IDLE = "idle"
STATE_EXPLANATION = "explanation"
STATE_QUIZ = "quiz"
STATE_CHALLENGE = "challenge"
STATE_REVIEW = "review"
STATE_FINAL = "final"
STATE_FINAL_REVIEW = "final_review"


def _detect_confusion(message):
    """Détecte si l'élève ne comprend pas."""
    keywords = [
        "comprends pas", "comprend pas", "compris pas", "j'ai pas compris",
        "pas compris", "c'est quoi", "je comprends pas", "je ne comprends pas",
        "explique", "ré-explique", "reexplique", "re-explique",
        "c'est difficile", "je suis perdu", "perdue", "aide-moi",
        "je ne sais pas", "je sais pas", "pas clair", "pas claire",
        "comment ça marche", "comment ca marche", "pourquoi",
        "je comprends rien", "comprends rien"
    ]
    msg_lower = message.lower().strip()
    return any(kw in msg_lower for kw in keywords)


def _detect_quiz_answer(message):
    """Détecte la réponse au quiz (A, B ou C)."""
    msg = message.strip().upper()

    # Réponse directe : juste "A", "B", ou "C"
    if msg in ("A", "B", "C"):
        return msg

    # Réponse avec contexte : "A)", "choix A", "la réponse A", "je choisis B"
    patterns = [
        r'\b([ABC])\)',           # A) ou B) ou C)
        r'\bchoix\s+([ABC])\b',  # choix A
        r'\bréponse\s+([ABC])\b', # réponse B
        r'\breponse\s+([ABC])\b', # reponse C (sans accent)
        r'\bchoisis\s+([ABC])\b', # choisis A
        r'\bje\s+dis\s+([ABC])\b', # je dis B
        r'\bc\'est\s+([ABC])\b',   # c'est A
        r'\b([ABC])\b',           # juste la lettre dans le texte
    ]

    for pattern in patterns:
        match = re.search(pattern, msg)
        if match:
            return match.group(1)

    return None


def _detect_topic_request(message):
    """Détecte si l'élève demande une rubrique spécifique."""
    msg_lower = message.lower()

    topic_keywords = {
        "zones_saisie": ["zone de saisie", "zones de saisie", "saisie", "input text", "textarea", "password"],
        "cases_cocher": ["case à cocher", "cases à cocher", "case a cocher", "cases a cocher", "checkbox"],
        "boutons_radio": ["bouton radio", "boutons radio", "radio"],
        "listes_deroulantes": ["liste déroulante", "listes déroulantes", "liste deroulante", "select", "déroulante"],
        "boutons_cliquables": ["bouton cliquable", "boutons cliquables", "submit", "reset", "bouton envoyer"],
    }

    # Check by lesson title
    for key, lesson in LESSONS.items():
        if lesson["title"].lower() in msg_lower:
            return key

    # Check by keywords
    for key, keywords in topic_keywords.items():
        for kw in keywords:
            if kw in msg_lower:
                return key

    return None


def _detect_final_request(message):
    """Détecte si l'élève demande le défi final."""
    keywords = ["défi final", "defi final", "défi ultime", "defi ultime", "final"]
    msg_lower = message.lower()
    return any(kw in msg_lower for kw in keywords)


def _check_html_tags(message, required_tags):
    """Vérifie la présence de balises HTML dans le code soumis."""
    msg_lower = message.lower()
    found = []
    missing = []
    for tag in required_tags:
        if tag.lower() in msg_lower:
            found.append(tag)
        else:
            missing.append(tag)
    return found, missing


def _format_explanation(lesson):
    """Formate l'explication d'une rubrique avec le quiz."""
    return f"""📖 **{lesson['title']}**

{lesson['explanation']}

---

✅ **Quiz — Vérifie que tu as compris !**

{lesson['quiz']['question']}

{chr(10).join(lesson['quiz']['choices'])}

**Tape la lettre de ta réponse (A, B ou C) !** 👇"""


def _format_analogy(lesson):
    """Formate l'analogie pour ré-expliquer."""
    return f"""💡 **Pas de souci, je t'explique autrement !**

{lesson['analogy']}

---

Maintenant, essaie de répondre au quiz ! 😊

{lesson['quiz']['question']}

{chr(10).join(lesson['quiz']['choices'])}

**Tape A, B ou C !**"""


def _format_quiz_correct(lesson):
    """Réponse quand le quiz est correct."""
    return f"""🎉 **Bravo, c'est la bonne réponse !**

{lesson['quiz']['explanation']}

---

🎨 **Maintenant, place à la créativité !**

Voici ton **défi créatif** :

> {lesson['challenge']}

**Écris ton code HTML complet et envoie-le-moi !** 💻"""


def _format_quiz_wrong(lesson, given_answer):
    """Réponse quand le quiz est incorrect."""
    return f"""❌ **Oups, ce n'est pas la bonne réponse !**

La réponse **{given_answer}** n'est pas correcte. Pas de panique, réessaie ! 💪

{lesson['quiz']['question']}

{chr(10).join(lesson['quiz']['choices'])}

💡 *Indice : relis bien l'explication au-dessus, ou tape \"j'ai pas compris\" pour que je t'explique autrement !*"""


# Tags requis pour chaque rubrique dans le défi créatif
REQUIRED_TAGS = {
    "zones_saisie": ["<input", "<textarea", "type=\"text\"", "type=\"password\""],
    "cases_cocher": ["<input", "type=\"checkbox\""],
    "boutons_radio": ["<input", "type=\"radio\"", "name="],
    "listes_deroulantes": ["<select", "<option"],
    "boutons_cliquables": ["type=\"submit\"", "type=\"reset\""],
}

FINAL_REQUIRED_TAGS = [
    "<form", "<input", "type=\"text\"", "type=\"password\"",
    "type=\"checkbox\"", "type=\"radio\"", "<select", "<option",
    "type=\"submit\"", "<textarea"
]


class ChatbotEngine:
    """Moteur de conversation scripté — sans IA externe."""

    def __init__(self):
        pass  # Aucune API à initialiser !

    def get_welcome_message(self, student_name):
        """Retourne le message de bienvenue personnalisé."""
        return WELCOME_MESSAGE.format(name=student_name)

    def get_completion_message(self, student_name):
        """Retourne le message de félicitations."""
        return COMPLETION_MESSAGE.format(name=student_name)

    def get_response(self, message, student_name, student_class, progress, chat_history, conversation_state=None):
        """
        Génère une réponse scriptée basée sur l'état de la conversation.

        Args:
            message: Le message de l'élève
            student_name: Nom de l'élève
            student_class: Classe de l'élève
            progress: Dict de progression {rubrique: True/False}
            chat_history: Liste de messages [{role, content}, ...]
            conversation_state: Dict {current_topic, state} pour suivre le flux

        Returns:
            dict: {response, completed_topic, final_complete, conversation_state}
        """
        if conversation_state is None:
            conversation_state = {"current_topic": None, "state": STATE_IDLE}

        current_topic_key = conversation_state.get("current_topic")
        state = conversation_state.get("state", STATE_IDLE)

        # ─────────────────────────────────────────────
        # 1. Détection d'une demande de rubrique
        # ─────────────────────────────────────────────
        requested_topic = _detect_topic_request(message)
        if requested_topic and requested_topic in LESSONS:
            lesson = LESSONS[requested_topic]
            conversation_state["current_topic"] = requested_topic
            conversation_state["state"] = STATE_QUIZ

            return {
                "response": _format_explanation(lesson),
                "completed_topic": None,
                "final_complete": False,
                "conversation_state": conversation_state
            }

        # ─────────────────────────────────────────────
        # 2. Détection du défi final
        # ─────────────────────────────────────────────
        if _detect_final_request(message) and state != STATE_FINAL_REVIEW:
            conversation_state["current_topic"] = "final"
            conversation_state["state"] = STATE_FINAL

            return {
                "response": f"""🏆 **DÉFI FINAL — Le Formulaire Ultime !**

Bravo **{student_name}**, tu as complété toutes les rubriques ! 🎉

Voici ta mission finale :

{FINAL_CHALLENGE['description']}

**Écris ton code HTML complet et envoie-le-moi !** 🚀""",
                "completed_topic": None,
                "final_complete": False,
                "conversation_state": conversation_state
            }

        # ─────────────────────────────────────────────
        # 3. Traitement selon l'état actuel
        # ─────────────────────────────────────────────

        # État QUIZ : on attend une réponse A/B/C
        if state == STATE_QUIZ and current_topic_key and current_topic_key in LESSONS:
            lesson = LESSONS[current_topic_key]

            # L'élève ne comprend pas → analogie
            if _detect_confusion(message):
                return {
                    "response": _format_analogy(lesson),
                    "completed_topic": None,
                    "final_complete": False,
                    "conversation_state": conversation_state
                }

            # Vérifier la réponse au quiz
            answer = _detect_quiz_answer(message)
            if answer:
                if answer == lesson["quiz"]["correct"]:
                    conversation_state["state"] = STATE_CHALLENGE
                    return {
                        "response": _format_quiz_correct(lesson),
                        "completed_topic": None,
                        "final_complete": False,
                        "conversation_state": conversation_state
                    }
                else:
                    return {
                        "response": _format_quiz_wrong(lesson, answer),
                        "completed_topic": None,
                        "final_complete": False,
                        "conversation_state": conversation_state
                    }

            # Pas de réponse détectée
            return {
                "response": f"""🤔 Je n'ai pas compris ta réponse, **{student_name}** !

Tape simplement la lettre **A**, **B** ou **C** pour répondre au quiz. 😊

{lesson['quiz']['question']}

{chr(10).join(lesson['quiz']['choices'])}""",
                "completed_topic": None,
                "final_complete": False,
                "conversation_state": conversation_state
            }

        # État CHALLENGE : on attend du code HTML
        if state == STATE_CHALLENGE and current_topic_key and current_topic_key in LESSONS:
            lesson = LESSONS[current_topic_key]

            # L'élève ne comprend pas → rappel du défi
            if _detect_confusion(message):
                return {
                    "response": f"""💡 **Pas de souci !** Voici un rappel de ce qu'il faut faire :

> {lesson['challenge']}

Tu dois écrire du **code HTML** avec les balises qu'on vient d'apprendre. Par exemple, commence par :

```html
<form>
  <!-- Tes champs ici -->
</form>
```

**Essaie et envoie-moi ton code !** 💪""",
                    "completed_topic": None,
                    "final_complete": False,
                    "conversation_state": conversation_state
                }

            # Vérifier le code HTML soumis
            required = REQUIRED_TAGS.get(current_topic_key, [])
            found, missing = _check_html_tags(message, required)

            if "<" in message and len(found) > 0:
                if len(missing) == 0:
                    # Code complet et valide !
                    conversation_state["state"] = STATE_IDLE
                    conversation_state["current_topic"] = None

                    return {
                        "response": f"""🎉🎉 **EXCELLENT, {student_name} !** 🎉🎉

Ton code HTML est **super bien fait** ! Tu as utilisé toutes les balises attendues :
{chr(10).join(f'✅ `{tag}`' for tag in found)}

La rubrique **{lesson["title"]}** est maintenant **VALIDÉE** ! ✔️

👈 **Retourne sur le menu à gauche** pour choisir une autre rubrique, ou si tu les as toutes validées, lance le **Défi Final** ! 🏆""",
                        "completed_topic": current_topic_key,
                        "final_complete": False,
                        "conversation_state": conversation_state
                    }
                else:
                    # Code partiel — il manque des balises
                    return {
                        "response": f"""👍 **Bon début, {student_name} !** Tu es sur la bonne voie !

Voici ce que j'ai trouvé dans ton code :
{chr(10).join(f'✅ `{tag}`' for tag in found)}

Mais il manque encore :
{chr(10).join(f'❌ `{tag}`' for tag in missing)}

**Complète ton code et renvoie-le !** Tu y es presque ! 💪""",
                        "completed_topic": None,
                        "final_complete": False,
                        "conversation_state": conversation_state
                    }
            else:
                # Pas de HTML détecté
                return {
                    "response": f"""🤔 Je ne vois pas de code HTML dans ton message, **{student_name}** !

Pour ce défi, tu dois écrire du **code HTML**. Commence par les balises qu'on a vues :

```html
<form>
  <!-- Mets tes champs ici -->
</form>
```

> **Rappel du défi :** {lesson['challenge']}

**Écris ton code et envoie-le !** 💻""",
                    "completed_topic": None,
                    "final_complete": False,
                    "conversation_state": conversation_state
                }

        # État FINAL : on attend le code du défi final
        if state == STATE_FINAL:
            # L'élève ne comprend pas
            if _detect_confusion(message):
                return {
                    "response": f"""💡 **Pas de souci !** Pour le Défi Final, tu dois créer un **formulaire d'inscription complet** qui combine TOUT ce qu'on a appris :

- `<input type="text">` pour le nom et prénom
- `<input type="password">` pour le mot de passe
- `<input type="checkbox">` pour les matières préférées
- `<input type="radio">` pour le sexe
- `<select>` pour la classe
- `<textarea>` pour un message
- `<input type="submit">` et `<input type="reset">` pour les boutons

**Écris le tout dans une balise `<form>` et envoie-moi le code !** 🚀""",
                    "completed_topic": None,
                    "final_complete": False,
                    "conversation_state": conversation_state
                }

            # Vérifier le code HTML du défi final
            found, missing = _check_html_tags(message, FINAL_REQUIRED_TAGS)

            if "<" in message and len(found) >= 3:
                if len(missing) <= 2:
                    # Défi final réussi !
                    conversation_state["state"] = STATE_IDLE
                    conversation_state["current_topic"] = None

                    completion_msg = self.get_completion_message(student_name)

                    return {
                        "response": f"""🏆🎉 **INCROYABLE, {student_name} !** 🎉🏆

Tu as relevé le **Défi Final** avec brio ! Ton formulaire est complet et utilise :

{chr(10).join(f'✅ `{tag}`' for tag in found)}

{completion_msg}""",
                        "completed_topic": None,
                        "final_complete": True,
                        "conversation_state": conversation_state
                    }
                else:
                    return {
                        "response": f"""👍 **Bon travail, {student_name} !** Mais le Défi Final demande un formulaire COMPLET.

Ce que tu as bien fait :
{chr(10).join(f'✅ `{tag}`' for tag in found)}

Ce qu'il manque encore :
{chr(10).join(f'❌ `{tag}`' for tag in missing)}

**Rappel** : le formulaire doit contenir des zones de texte, un mot de passe, des cases à cocher, des boutons radio, une liste déroulante, une zone multiligne, et les boutons Envoyer/Annuler.

**Complète ton code et renvoie-le !** 💪""",
                        "completed_topic": None,
                        "final_complete": False,
                        "conversation_state": conversation_state
                    }
            else:
                return {
                    "response": f"""🤔 Je ne vois pas assez de code HTML pour le Défi Final, **{student_name}** !

Commence par la structure de base :

```html
<form method="post" action="inscription.php">
  <p>Nom : <input type="text" name="nom" /></p>
  <!-- Ajoute les autres champs ici -->
</form>
```

**Rappel** : tu dois utiliser TOUTES les notions qu'on a apprises ensemble (text, password, checkbox, radio, select, textarea, submit, reset).

**Écris le code et envoie-le !** 🚀""",
                    "completed_topic": None,
                    "final_complete": False,
                    "conversation_state": conversation_state
                }

        # ─────────────────────────────────────────────
        # 4. État IDLE — message libre / hors contexte
        # ─────────────────────────────────────────────

        # Salutations
        greetings = ["bonjour", "salut", "coucou", "hello", "hey", "bonsoir", "yo"]
        if any(g in message.lower().strip() for g in greetings):
            return {
                "response": f"""👋 **Salut {student_name} !**

Je suis **CodeBot** 🤖, ton assistant pour apprendre les formulaires HTML !

👈 **Choisis une rubrique** dans le menu à gauche pour commencer à apprendre. J'ai hâte de t'enseigner ! 😊""",
                "completed_topic": None,
                "final_complete": False,
                "conversation_state": conversation_state
            }

        # Message hors-sujet ou non reconnu
        return {
            "response": f"""🤖 **Hey {student_name} !**

Je suis spécialisé dans les **formulaires HTML** ! Pour avancer, voici ce que tu peux faire :

1. 👈 **Clique sur une rubrique** dans le menu à gauche
2. 📝 Si tu es dans un quiz, **tape A, B ou C**
3. 💻 Si tu es dans un défi, **envoie-moi ton code HTML**
4. 🤔 Si tu ne comprends pas, **dis-le moi** et je t'expliquerai autrement !

**Choisis une rubrique pour commencer !** 🚀""",
            "completed_topic": None,
            "final_complete": False,
            "conversation_state": conversation_state
        }
