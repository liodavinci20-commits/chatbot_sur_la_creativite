# 🤖 CodeBot — Chatbot Créativité HTML

> Chatbot web pédagogique qui aide les élèves de Première D à apprendre les formulaires HTML tout en stimulant leur créativité.

## 🎯 Objectif

Concevoir un chatbot intelligent **100% local** (sans API externe) qui :
- Enseigne les formulaires HTML de manière interactive
- Booste la créativité des élèves à travers des défis contextuels
- S'adapte au rythme de l'élève (ré-explique si besoin avec des analogies)
- Fonctionne **sans connexion internet** et **sans clé API**

## 👥 Public cible

| Élément | Détail |
|---------|--------|
| **Niveau** | Première D (série scientifique) |
| **Âge** | 15 – 20 ans |
| **Matière** | Informatique |
| **Leçon** | Les formulaires en HTML |
| **Système** | Éducation francophone |

## 🏗️ Architecture

```
                    ┌──────────────────┐
                    │   Élève (Browser) │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  Frontend (React) │
                    │  Vite + JSX       │
                    │  Animations       │
                    └────────┬─────────┘
                             │ Fetch /api/*
                    ┌────────▼─────────────────┐
                    │  Backend (Flask)          │
                    │  - app.py (routes API)    │
                    │  - chatbot_engine.py      │
                    │    (moteur scripté)       │
                    │  - lessons_data.py        │
                    │    (contenu des leçons)   │
                    └──────────────────────────┘
```

> 💡 **Pas d'API externe** — Le moteur du chatbot est entièrement scripté en Python. Toutes les réponses sont pré-écrites et suivent un flux pédagogique structuré.

## 📁 Structure du projet

```
chatbot_creativite/
├── app.py                    # Serveur Flask + routes API
├── chatbot_engine.py         # Moteur de conversation scripté
├── lessons_data.py           # Contenu structuré des 5 leçons
├── requirements.txt          # Dépendances Python (Flask uniquement)
├── start.bat                 # Lancement rapide (Windows)
├── README.md
└── frontend/                 # Interface React + Vite
    ├── src/
    │   ├── pages/
    │   │   ├── LoginPage.jsx     # Page de connexion
    │   │   └── HubPage.jsx       # Hub des notions + chatbot
    │   ├── components/
    │   │   ├── ChatPanel.jsx     # Zone de chat
    │   │   ├── TopicsSidebar.jsx # Menu des rubriques
    │   │   └── Celebration.jsx   # Animation de félicitations
    │   ├── App.jsx
    │   └── index.css             # Design system
    ├── package.json
    └── vite.config.js            # Proxy vers Flask
```

## 🔄 Flux utilisateur

```
1. CONNEXION
   Élève entre son nom + classe
        ↓
2. ACCUEIL ANIMÉ
   Animation : "Bienvenue [nom] !"
        ↓
3. HUB DES NOTIONS
   5 rubriques + Défi Final (verrouillé)
   ┌────────────────┬─────────────────┐
   │ 📝 Zones de    │ ☑️ Cases à      │
   │    saisie      │    cocher       │
   ├────────────────┼─────────────────┤
   │ 🔘 Boutons     │ 📋 Listes       │
   │    radio       │    déroulantes  │
   ├────────────────┼─────────────────┤
   │ 🔲 Boutons     │ 🏆 DÉFI FINAL   │
   │    cliquables  │    (verrouillé) │
   └────────────────┴─────────────────┘
        ↓
4. POUR CHAQUE RUBRIQUE (via Chatbot)
   📖 Explication de la notion + exemples de code
        ↓
   ✅ Quiz de compréhension (A/B/C)
        ↓ (si "pas compris" → analogie pour ré-expliquer)
   🎨 Défi créatif (écrire du code HTML)
        ↓
   ✔️ Validation automatique du code soumis
        ↓
5. DÉFI FINAL 🏆
   Formulaire complet combinant toutes les notions
        ↓
6. FÉLICITATIONS 🎉
```

## 🧠 Moteur de conversation (sans IA)

Le chatbot utilise un **système d'états** pour chaque rubrique :

| État | Ce que fait le bot | Ce qu'attend l'élève |
|------|-------------------|---------------------|
| `EXPLANATION` | Affiche l'explication + pose le quiz | Lire la leçon |
| `QUIZ` | Vérifie la réponse (A, B ou C) | Répondre au quiz |
| `CHALLENGE` | Lance le défi créatif | Écrire du code HTML |
| `REVIEW` | Valide le code HTML soumis | Voir le feedback |

**Fonctionnalités intelligentes :**
- 🔍 **Détection "j'ai pas compris"** → Répond avec l'analogie de la rubrique
- ✅ **Vérification des réponses quiz** → Détecte A/B/C dans le message
- 🏷️ **Validation du code HTML** → Vérifie la présence des bonnes balises
- 🔀 **Navigation libre** → L'élève peut changer de rubrique à tout moment

## 🧰 Technologies

| Composant | Technologie |
|-----------|-------------|
| **Backend** | Python + Flask |
| **Moteur chatbot** | Python pur (scripté, sans IA) |
| **Frontend** | React + Vite |
| **Design** | Dark theme, glassmorphism, animations |
| **Police** | Google Fonts (Inter) |

## ⚙️ Installation & Lancement

### Première fois (installation)

```bash
# 1. Installer les dépendances Python
pip install -r requirements.txt

# 2. Installer les dépendances frontend
cd frontend
npm install
cd ..
```

### Lancer le projet

**Option 1 — Double-clic rapide :**
```
Double-cliquer sur start.bat
```

**Option 2 — Manuellement (2 terminaux) :**

```bash
# Terminal 1 : Backend
python app.py
# → http://localhost:5000

# Terminal 2 : Frontend
cd frontend
npm run dev
# → http://localhost:5173
```

Ouvrir **http://localhost:5173** dans le navigateur 🚀

## 📦 Dépendances

```
Flask>=3.0
flask-cors>=4.0
python-dotenv>=1.0
```

> ✅ **Aucune API externe requise** — tout fonctionne en local !

## 📐 Méthode pédagogique

Ce projet suit le modèle **SAM** (Successive Approximation Model) :
- Prototypage rapide
- Tests avec les élèves
- Itérations successives

## 📝 Leçon couverte

**Les formulaires en HTML** :
1. Définition et balise `<form>`
2. Zones de saisie (`text`, `password`, `textarea`)
3. Cases à cocher (`checkbox`)
4. Boutons radio (`radio`)
5. Listes déroulantes (`select`, `option`)
6. Boutons cliquables (`submit`, `reset`)
