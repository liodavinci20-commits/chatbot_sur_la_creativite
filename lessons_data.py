# lessons_data.py
# Contenu structuré de la leçon : Les formulaires en HTML

LESSONS = {
    "zones_saisie": {
        "id": "zones_saisie",
        "title": "📝 Zones de saisie",
        "icon": "📝",
        "order": 1,
        "explanation": """
Les **zones de saisie** permettent de récolter du texte auprès de l'utilisateur. Il en existe 3 types :

**1. Zone de texte monoligne** — Pour une courte information (nom, prénom...)
```html
<input type="text" name="nom" />
```

**2. Zone de mot de passe** — Le texte est masqué pour protéger la saisie
```html
<input type="password" name="mdp" />
```

**3. Zone de texte multiligne (textarea)** — Pour un message ou commentaire long
```html
<textarea name="message" rows="4" cols="30">Écris ton message ici...</textarea>
```
""",
        "analogy": """
Imagine un cahier :
- `<input type="text">` c'est comme **UNE LIGNE** de cahier → tu écris quelque chose de court (ton nom)
- `<textarea>` c'est comme **UNE PAGE ENTIÈRE** → tu écris un long message
- `<input type="password">` c'est comme écrire avec de **L'ENCRE INVISIBLE** → personne ne peut lire ce que tu tapes !
""",
        "quiz": {
            "question": "Pour un champ où l'élève écrit une lettre de motivation (un long texte), quelle balise utilises-tu ?",
            "choices": [
                "A) <input type='text'>",
                "B) <input type='password'>",
                "C) <textarea>"
            ],
            "correct": "C",
            "explanation": "Exactement ! Une lettre de motivation est un texte long, donc on utilise <textarea> qui permet d'écrire plusieurs lignes."
        },
        "challenge": "Le directeur du lycée te demande de créer un formulaire d'inscription pour l'excursion scolaire. Tu dois utiliser les 3 types de zones de saisie (text, password, textarea). Écris le code HTML complet !"
    },

    "cases_cocher": {
        "id": "cases_cocher",
        "title": "☑️ Cases à cocher",
        "icon": "☑️",
        "order": 2,
        "explanation": """
Les **cases à cocher** (`checkbox`) permettent à l'utilisateur de **sélectionner une ou plusieurs options**.

On utilise `<input type="checkbox">` :
```html
<form method="post" action="traitement.php">
  <p>Cocher vos activités préférées :</p>
  <input type="checkbox" name="football"> Football<br/>
  <input type="checkbox" name="lecture"> Lecture<br/>
  <input type="checkbox" name="jeux"> Jeux vidéo<br/>
</form>
```

Chaque case a un attribut `name` pour identifier le choix lors de l'envoi du formulaire.
L'utilisateur peut cocher **autant de cases qu'il veut** !
""",
        "analogy": """
Les cases à cocher, c'est comme une **liste de courses** :
- ☑️ Pain
- ☑️ Lait
- ☐ Beurre
- ☑️ Œufs

Tu peux cocher **tout ce que tu veux** — 1 article, 3 articles, ou même tous ! C'est toi qui décides combien tu en prends.
""",
        "quiz": {
            "question": "Un formulaire demande les langues parlées par l'élève (il peut en parler plusieurs). Quelle balise est la plus appropriée ?",
            "choices": [
                "A) <input type='radio'> (boutons radio)",
                "B) <input type='checkbox'> (cases à cocher)",
                "C) <select> (liste déroulante)"
            ],
            "correct": "B",
            "explanation": "Bravo ! Les cases à cocher sont parfaites ici car un élève peut parler PLUSIEURS langues (français, anglais, allemand...). Les boutons radio ne permettent qu'UN seul choix."
        },
        "challenge": "Crée un formulaire pour un sondage au lycée : 'Quels clubs veux-tu rejoindre ?' avec au moins 5 clubs différents en cases à cocher. Sois créatif dans le choix des clubs !"
    },

    "boutons_radio": {
        "id": "boutons_radio",
        "title": "🔘 Boutons radio",
        "icon": "🔘",
        "order": 3,
        "explanation": """
Les **boutons radio** permettent de choisir **une seule option** parmi plusieurs.

On utilise `<input type="radio">`. Tous les boutons du même groupe doivent avoir le **même attribut `name`** :
```html
<form method="post" action="traitement.php">
  <p>Sélectionnez votre ville :</p>
  <input type="radio" name="ville" value="Douala"> Douala<br/>
  <input type="radio" name="ville" value="Yaoundé"> Yaoundé<br/>
  <input type="radio" name="ville" value="Bafoussam"> Bafoussam<br/>
</form>
```

⚠️ **Différence avec checkbox** : Les boutons radio ne permettent qu'**UN SEUL choix**. Si tu cliques sur "Yaoundé" puis sur "Douala", "Yaoundé" se décoche automatiquement.
""",
        "analogy": """
Les boutons radio, c'est comme les **boutons d'un ancien poste radio** (d'où le nom !) :
- Quand tu appuies sur un bouton pour changer de station, l'ancien bouton **remonte automatiquement**
- Tu ne peux écouter qu'**UNE SEULE station** à la fois !

Checkbox = tu peux prendre **plusieurs bonbons** dans le bol 🍬🍬🍬
Radio = tu ne peux choisir qu'**UN SEUL parfum** de glace 🍦
""",
        "quiz": {
            "question": "Pour demander le sexe de l'élève (Masculin ou Féminin), quelle balise est la plus appropriée ?",
            "choices": [
                "A) <input type='checkbox'>",
                "B) <input type='radio'>",
                "C) <textarea>"
            ],
            "correct": "B",
            "explanation": "Exactement ! Le sexe est un choix UNIQUE (Masculin OU Féminin), donc les boutons radio sont parfaits. Les checkbox permettraient de cocher les deux, ce qui n'a pas de sens ici."
        },
        "challenge": "Crée un formulaire de commande pour une buvette du lycée. L'élève doit choisir : 1 boisson (parmi 4), 1 plat (parmi 3). Utilise les boutons radio. Sois créatif avec les noms des plats et boissons !"
    },

    "listes_deroulantes": {
        "id": "listes_deroulantes",
        "title": "📋 Listes déroulantes",
        "icon": "📋",
        "order": 4,
        "explanation": """
Les **listes déroulantes** permettent de choisir une option dans une liste compacte.

On utilise `<select>` avec des `<option>` à l'intérieur :
```html
<form method="post" action="traitement.php">
  <p>Choisissez votre classe :</p>
  <select name="classe">
    <option value="seconde">Seconde</option>
    <option value="premiere">Première</option>
    <option value="terminale">Terminale</option>
  </select>
</form>
```

**Quand utiliser une liste déroulante plutôt que des boutons radio ?**
- Si tu as **beaucoup d'options** (ex : choisir un pays parmi 200) → liste déroulante ✅
- Si tu as **peu d'options** (ex : Masculin/Féminin) → boutons radio ✅
""",
        "analogy": """
La liste déroulante, c'est comme un **menu de restaurant** :
- Tu ouvres le menu (tu cliques sur le `<select>`)
- Tu vois tous les plats (les `<option>`)
- Tu choisis UN plat et tu refermes le menu

C'est **compact** — imagine si le restaurant affichait tous ses 50 plats sur des pancartes au mur ! Ce serait le bazar. Le menu garde tout bien rangé.
""",
        "quiz": {
            "question": "Tu dois permettre à l'utilisateur de choisir son pays parmi une liste de 54 pays africains. Quelle balise est la plus adaptée ?",
            "choices": [
                "A) 54 <input type='radio'> (boutons radio)",
                "B) 54 <input type='checkbox'> (cases à cocher)",
                "C) <select> avec 54 <option>"
            ],
            "correct": "C",
            "explanation": "Bien joué ! Avec 54 options, les boutons radio prendraient ÉNORMÉMENT de place. La liste déroulante <select> garde tout compact et propre."
        },
        "challenge": "Crée un formulaire d'inscription à un tournoi inter-lycées. L'élève doit choisir : son lycée (liste déroulante de 5 lycées), sa discipline sportive (liste déroulante de 4 sports). Combine avec au moins un autre type de champ que tu as appris !"
    },

    "boutons_cliquables": {
        "id": "boutons_cliquables",
        "title": "🔲 Boutons cliquables",
        "icon": "🔲",
        "order": 5,
        "explanation": """
Les **boutons cliquables** permettent d'envoyer ou de réinitialiser un formulaire.

**1. Bouton Envoyer (submit)** — Envoie les données du formulaire au serveur
```html
<input type="submit" name="envoi" value="Envoyer" />
```

**2. Bouton Annuler (reset)** — Réinitialise tous les champs à leur valeur par défaut
```html
<input type="reset" name="annuler" value="Annuler" />
```

⚠️ Sans bouton `submit`, les données du formulaire ne peuvent pas être envoyées !
""",
        "analogy": """
Pense à un **examen sur papier** :
- Le bouton **Envoyer (submit)** = c'est quand tu **remets ta copie** au surveillant. C'est fait, c'est envoyé !
- Le bouton **Annuler (reset)** = c'est comme si tu **effaçais tout** et recommençais avec une copie blanche

Un formulaire sans bouton Envoyer, c'est comme un examen où tu ne peux jamais remettre ta copie. Ça ne sert à rien ! 😄
""",
        "quiz": {
            "question": "Quelle est la différence entre type='submit' et type='reset' ?",
            "choices": [
                "A) submit envoie les données, reset efface tout",
                "B) submit efface tout, reset envoie les données",
                "C) Ils font la même chose"
            ],
            "correct": "A",
            "explanation": "Parfait ! submit = envoyer les données au serveur. reset = tout effacer et recommencer. Ne les confonds jamais !"
        },
        "challenge": "Crée un formulaire COMPLET de contact pour le site web de ton lycée. Il doit avoir : au moins 3 champs de saisie différents, et les boutons Envoyer et Annuler. Personnalise le texte des boutons (pas juste 'Envoyer' — sois créatif !)."
    }
}

FINAL_CHALLENGE = {
    "title": "🏆 DÉFI FINAL — Le Formulaire Ultime",
    "description": """
Tu es recruté comme **développeur web** pour ton lycée ! Le proviseur te confie une mission :

**Crée le formulaire d'inscription en ligne COMPLET du lycée.**

Il doit contenir :
- Le **nom** et **prénom** de l'élève (zones de texte)
- Un **mot de passe** pour son compte
- Sa **classe** (parmi Seconde, Première, Terminale) — choisis le bon type de champ !
- Ses **matières préférées** (choix multiples parmi au moins 5 matières)
- Son **sexe** (Masculin / Féminin)
- Un **message pour le proviseur** (zone multiligne)
- Un bouton **Envoyer** et un bouton **Annuler**

💡 **Bonus créativité** : Ajoute des champs ORIGINAUX auxquels personne n'a pensé ! (ex : photo de profil, email, date de naissance, couleur préférée...)

Montre ta créativité et écris le code HTML complet ! 🚀
"""
}

WELCOME_MESSAGE = """
✨ **Bienvenue, {name} !** ✨

Je suis **CodeBot** 🤖, ton assistant IA pour apprendre les formulaires HTML et booster ta créativité !

Voici comment ça marche :
1. 📚 Choisis une **rubrique** dans le menu à gauche
2. 📖 Je t'explique la notion avec des exemples
3. ✅ Tu passes un petit **quiz** pour vérifier
4. 🎨 Tu relèves un **défi créatif** !
5. 🏆 Quand tout est validé, le **Défi Final** se débloque !

**N'hésite jamais à dire "j'ai pas compris"** — je t'expliquerai autrement ! 😊

Allez, choisis ta première rubrique et c'est parti ! 👈
"""

COMPLETION_MESSAGE = """
🎉🎉🎉 **FÉLICITATIONS, {name} !** 🎉🎉🎉

Tu as relevé TOUS les défis créatifs et terminé le Défi Final ! 🏆

Tu maîtrises maintenant :
✅ Les zones de saisie (text, password, textarea)
✅ Les cases à cocher (checkbox)
✅ Les boutons radio (radio)
✅ Les listes déroulantes (select)
✅ Les boutons cliquables (submit, reset)

Et surtout, tu as appris à **CRÉER** et **IMAGINER** des formulaires, pas juste à copier du code ! 🎨

Continue à coder et à être créatif ! Le monde du web t'attend ! 🌍💻
"""

GENERAL_KNOWLEDGE = {
    # ═══════════════════════════════════════
    #  QUESTIONS GÉNÉRALES SUR LES FORMULAIRES
    # ═══════════════════════════════════════

    "definition": {
        "keywords": ["c'est quoi un formulaire", "c'est quoi exactement", "qu'est-ce qu'un formulaire", "definition", "expliques", "c'est un formulaire", "cest quoi", "formulaire en html", "formulaire html"],
        "response": "Un **formulaire en HTML**, c'est comme un **bon de commande** numérique ! 📝\n\nC'est une zone sur une page web avec des champs à remplir (nom, email, mot de passe...) qui permet d'**envoyer des informations** au site.\n\n🍕 **Analogie** : Imagine que tu commandes une pizza en ligne. Le formulaire, c'est la **fiche de commande** : tu choisis ta taille, tes ingrédients, ton adresse... et tu cliques \"Commander\". Sans cette fiche, le pizzaiolo ne sait pas quoi te préparer !\n\nEn HTML, on crée un formulaire avec la balise `<form>` qui contient des `<input>`, `<select>`, `<textarea>`, etc."
    },

    "utilite_site": {
        "keywords": ["sert à quoi", "ça sert dans un vrai site", "pourquoi", "utilité", "usage", "ça sert", "vrai site", "dans un site"],
        "response": "Les formulaires sont **partout** sur les vrais sites ! 🌐\n\nIls servent à :\n- 🔐 **Se connecter** (login/mot de passe)\n- 📝 **S'inscrire** (créer un compte)\n- 🔍 **Rechercher** (barre de recherche Google)\n- 🛒 **Acheter** (adresse de livraison, paiement)\n- 💬 **Contacter** (formulaire de contact)\n- 📊 **Répondre à des sondages**\n\n📱 **Analogie** : Un formulaire, c'est comme un **guichet** dans une banque. Tu donnes tes infos au guichetier (le serveur), et il fait l'action pour toi. Sans guichet, impossible de communiquer avec la banque !"
    },

    "tous_sites_formulaires": {
        "keywords": ["tous les sites", "est-ce que tous", "chaque site", "tous les sites utilisent"],
        "response": "**Oui, pratiquement tous les sites utilisent des formulaires !** 🌍\n\nMême les plus simples ! Par exemple :\n- **Google** → la barre de recherche est un formulaire\n- **YouTube** → la barre de recherche + commentaires\n- **Instagram** → connexion, inscription, messages\n- **WhatsApp Web** → champ de message\n\n🏠 **Analogie** : C'est comme les **portes** dans une maison. Même la plus petite maison a au moins une porte pour entrer/sortir. Un formulaire, c'est la \"porte\" qui permet aux visiteurs d'**interagir** avec le site. Un site sans formulaire, c'est comme une maison sans porte — tu peux regarder par la fenêtre, mais tu ne peux rien faire !"
    },

    "envoi_formulaire": {
        "keywords": ["quand j'envoie", "se passe quoi derrière", "envoie un formulaire", "après envoi", "données vont où", "il se passe quoi", "derrière"],
        "response": "Quand tu cliques sur \"Envoyer\", voici ce qui se passe **en coulisses** ! 🎬\n\n1. 📦 Le navigateur **emballe** toutes tes données (nom, email, etc.)\n2. 🚀 Il les **envoie** au serveur (l'ordinateur du site)\n3. 🧠 Le serveur **traite** les données (vérifie, enregistre...)\n4. 📬 Le serveur **répond** (page de confirmation, erreur...)\n\n📮 **Analogie** : C'est exactement comme envoyer une **lettre par la poste** !\n- Tu remplis la lettre (= tu remplis le formulaire)\n- Tu la mets dans la boîte aux lettres (= tu cliques Envoyer)\n- Le facteur la transporte (= Internet)\n- Le destinataire la lit et te répond (= le serveur traite et répond)\n\nTout ça se passe en quelques millisecondes ! ⚡"
    },

    "html_envoie_donnees": {
        "keywords": ["c'est le html qui envoie", "html qui envoie", "html envoie", "autre chose qui envoie", "qui envoie les données"],
        "response": "**Non, le HTML tout seul n'envoie rien !** 🚫\n\nLe HTML crée juste l'**apparence** du formulaire (les champs, les boutons). C'est le **navigateur** qui se charge d'envoyer les données quand tu cliques sur Submit.\n\nEnsuite, c'est un **langage serveur** (PHP, Python, Node.js...) qui traite les données côté serveur.\n\n🎭 **Analogie** : Le HTML, c'est comme un **décor de théâtre**. Il crée la scène (les champs, les boutons), mais il ne joue pas la pièce ! Les **acteurs** (le navigateur + le serveur), ce sont eux qui font le vrai travail. Le HTML dit \"voici le formulaire\", le navigateur dit \"j'envoie les infos\", et le serveur dit \"je les traite\" !"
    },

    # ═══════════════════════════════════════
    #  QUESTIONS SUR <form>
    # ═══════════════════════════════════════

    "pourquoi_form": {
        "keywords": ["pourquoi on est obligé", "obligé de mettre form", "pourquoi form", "obligé form", "pourquoi <form>", "besoin de form", "besoin de <form>"],
        "response": "La balise `<form>` est **obligatoire** pour que le navigateur sache que c'est un formulaire ! 📋\n\nSans `<form>` :\n- ❌ Le bouton Submit ne fait rien\n- ❌ Les données ne sont pas envoyées\n- ❌ Le navigateur ignore tes champs\n\n📦 **Analogie** : `<form>`, c'est comme un **carton d'expédition**. Tu peux avoir plein d'objets (tes `<input>`), mais si tu ne les mets pas dans un carton, le livreur ne peut rien transporter ! Le carton regroupe tout et dit au livreur : \"Prends tout ça et envoie-le à cette adresse !\" 📮"
    },

    "oubli_form_fermant": {
        "keywords": ["oublie </form>", "oublie form", "oublier </form>", "pas fermer form", "sans </form>", "si j'oublie"],
        "response": "Si tu oublies `</form>`, le navigateur va **essayer de deviner** où le formulaire se termine... et il se trompera souvent ! 😱\n\nConséquences possibles :\n- 🐛 D'autres éléments de la page sont \"aspirés\" dans le formulaire\n- 📤 Des boutons ou champs qui ne devaient pas être envoyés le sont\n- 🎭 Le design de la page peut casser\n\n🏠 **Analogie** : C'est comme oublier de **fermer la porte** de ta chambre. Tout ce qui est dans le couloir peut \"entrer\" dans ta chambre sans que tu le veuilles ! Le navigateur ne sait plus ce qui fait partie du formulaire et ce qui n'en fait pas partie. Toujours fermer ses balises ! ✅"
    },

    "plusieurs_form": {
        "keywords": ["plusieurs form", "plusieurs formulaires", "deux form", "2 form", "multiple form"],
        "response": "**Oui, tu peux mettre plusieurs `<form>` dans une seule page !** ✅\n\nC'est même très courant. Exemples :\n- Un formulaire de **recherche** en haut\n- Un formulaire de **connexion** sur le côté\n- Un formulaire de **commentaire** en bas\n\nChaque `<form>` fonctionne **indépendamment** — quand tu cliques \"Envoyer\" dans l'un, seules SES données sont envoyées.\n\n🏢 **Analogie** : C'est comme un **immeuble avec plusieurs boîtes aux lettres**. L'immeuble = ta page web. Chaque boîte = un `<form>`. Quand tu mets une lettre dans la boîte n°2, elle va au destinataire n°2, pas aux autres !"
    },

    "form_envoie_auto": {
        "keywords": ["form envoie automatiquement", "automatiquement", "auto", "envoie tout seul", "form envoie seul"],
        "response": "**Non !** `<form>` tout seul **n'envoie rien automatiquement** ! 🚫\n\nIl faut **obligatoirement** un bouton pour déclencher l'envoi :\n```html\n<input type=\"submit\" value=\"Envoyer\" />\n```\nou\n```html\n<button type=\"submit\">Envoyer</button>\n```\n\n🚗 **Analogie** : Le `<form>`, c'est comme une **voiture**. Elle a tout ce qu'il faut (moteur, roues, essence), mais elle ne démarre pas toute seule ! Il faut appuyer sur le **bouton de démarrage** (le bouton Submit). Sans ce bouton, la voiture reste au parking ! 🅿️"
    },

    "form_fonctionne_vraiment": {
        "keywords": ["ajouter quelque chose", "fonctionne vraiment", "pour que ça marche", "il faut ajouter", "ça fonctionne"],
        "response": "Pour qu'un formulaire **fonctionne vraiment**, il faut 3 choses essentielles :\n\n1. ✅ La balise `<form>` avec l'attribut `action` (où envoyer)\n```html\n<form action=\"traitement.php\" method=\"post\">\n```\n2. ✅ Des champs avec l'attribut `name` (pour identifier les données)\n3. ✅ Un bouton `submit` (pour déclencher l'envoi)\n\n🍳 **Analogie** : C'est comme faire un **gâteau**. Il te faut :\n- Le **moule** = `<form>` (le contenant)\n- Les **ingrédients** = `<input>` avec `name` (les données)\n- Le **four** = bouton `submit` (l'action qui transforme le tout)\n\nSans l'un de ces 3 éléments, pas de gâteau ! 🎂"
    },

    # ═══════════════════════════════════════
    #  QUESTIONS SUR <input>
    # ═══════════════════════════════════════

    "input_auto_fermant": {
        "keywords": ["pourquoi input se ferme", "se ferme avec />", "/>", "auto-fermant", "autofermant", "pas de </input>", "ferme input"],
        "response": "Bonne question ! `<input>` se ferme avec `/>` parce que c'est une **balise auto-fermante** ! 🔒\n\nContrairement à `<form>...</form>` ou `<textarea>...</textarea>`, `<input>` n'a **pas de contenu** à l'intérieur. Tout est dans ses attributs.\n\n```html\n<!-- ✅ Correct -->\n<input type=\"text\" name=\"nom\" />\n\n<!-- ❌ Incorrect -->\n<input type=\"text\">du texte</input>\n```\n\n📦 **Analogie** : Pense aux **emballages**. Un `<form>` c'est comme un **sac** — il s'ouvre, tu mets des trucs dedans, et tu le fermes. Un `<input>`, c'est comme un **autocollant** — il n'a pas d'intérieur, il se colle directement sur la page ! On met juste `/>`  pour dire \"c'est fini\" 🏁"
    },

    "name_vs_id": {
        "keywords": ["différence entre name et id", "name et id", "name vs id", "id vs name", "difference name id"],
        "response": "Super question ! `name` et `id` ont des rôles **différents** :\n\n| | `name` | `id` |\n|---|---|---|\n| **Sert à** | Envoyer les données au serveur | Identifier l'élément dans la page |\n| **Utilisé par** | Le serveur | Le CSS et JavaScript |\n| **Peut être dupliqué ?** | Oui (pour les radio buttons) | Non, toujours unique |\n\n```html\n<input type=\"text\" name=\"prenom\" id=\"champ-prenom\" />\n```\n\n🏫 **Analogie** : Imagine les élèves d'une classe :\n- `id` = c'est le **matricule** de l'élève. Chaque élève a un matricule UNIQUE\n- `name` = c'est le **nom de famille**. Plusieurs élèves peuvent avoir le même nom (frères/sœurs) !\n\nQuand le prof fait l'appel (= JavaScript), il utilise le matricule (`id`). Quand l'école envoie les bulletins (= serveur), elle utilise le nom (`name`) 📊"
    },

    "name_obligatoire": {
        "keywords": ["name obligatoire", "name est obligatoire", "obligatoire name", "sans name", "pas de name"],
        "response": "**`name` n'est pas techniquement obligatoire**, mais sans lui, le champ est **inutile** ! 😱\n\nSi un `<input>` n'a pas de `name`, ses données **ne sont pas envoyées** au serveur.\n\n```html\n<!-- ❌ Les données de ce champ ne seront PAS envoyées -->\n<input type=\"text\" placeholder=\"Ton nom\" />\n\n<!-- ✅ Les données seront envoyées avec la clé \"nom\" -->\n<input type=\"text\" name=\"nom\" placeholder=\"Ton nom\" />\n```\n\n🏷️ **Analogie** : C'est comme mettre un **colis à la poste sans étiquette**. Le colis existe, tu l'as bien rempli, mais le facteur ne sait pas à qui l'envoyer ! L'attribut `name`, c'est l'étiquette qui dit : \"Ce champ contient le NOM de l'utilisateur\". Sans étiquette, le serveur ignore le colis 📦"
    },

    "meme_name": {
        "keywords": ["deux fois le même name", "même name", "meme name", "name identique", "même nom", "dupliquer name"],
        "response": "Si tu mets **deux fois le même `name`**, ça dépend du type de champ !\n\n**Pour les boutons radio** → C'est **normal et nécessaire** ! Ça les regroupe :\n```html\n<input type=\"radio\" name=\"ville\" value=\"Douala\"> Douala\n<input type=\"radio\" name=\"ville\" value=\"Yaoundé\"> Yaoundé\n```\n\n**Pour les champs texte** → Le serveur reçoit **les deux valeurs**, mais souvent seule la dernière est gardée. C'est une **erreur** à éviter !\n\n👕 **Analogie** : C'est comme des **tiroirs avec des étiquettes** :\n- Pour les radios : c'est normal d'avoir un tiroir \"Ville\" avec plusieurs options dedans (mais tu n'en choisis qu'une)\n- Pour les inputs texte : si tu as 2 tiroirs appelés \"Nom\", quelqu'un va se tromper de tiroir ! Donne un nom unique à chaque tiroir 🗄️"
    },

    "placeholder_disparait": {
        "keywords": ["placeholder disparaît", "placeholder disparait", "placeholder efface", "placeholder quand on écrit", "placeholder écrit"],
        "response": "**Oui, le placeholder disparaît dès que tu commences à écrire !** ✨\n\nC'est fait exprès — c'est juste un **texte d'aide** pour guider l'utilisateur.\n\n```html\n<input type=\"text\" placeholder=\"Ex: Kenfack...\" />\n```\n\n- Avant de cliquer : on voit \"Ex: Kenfack...\" en gris\n- Quand tu tapes : le placeholder disparaît et ton texte apparaît\n- Si tu effaces tout : le placeholder revient !\n\n📝 **Analogie** : Le placeholder, c'est comme les **lignes pointillées** dans un cahier de maternelle avec un modèle écrit en gris clair. Ça te montre quoi écrire, mais quand tu écris par-dessus, ton écriture remplace le modèle ! Et si tu gommes tout, le modèle est toujours là en dessous. C'est un guide, pas du vrai contenu ! ✏️"
    },

    "required_rouge": {
        "keywords": ["champ devient rouge", "rouge required", "required rouge", "bordure rouge", "rouge quand required"],
        "response": "Le champ devient **rouge** quand tu essaies d'envoyer le formulaire **sans le remplir** alors qu'il est `required` ! 🔴\n\nC'est le **navigateur** qui ajoute automatiquement ce style rouge — ce n'est pas toi qui le codes !\n\n```html\n<input type=\"text\" name=\"nom\" required />\n```\n\nQuand tu cliques \"Envoyer\" sans remplir ce champ :\n1. Le navigateur **bloque** l'envoi\n2. Il affiche un message \"Veuillez remplir ce champ\"\n3. Il met une **bordure rouge** pour attirer ton attention\n\n🚦 **Analogie** : `required`, c'est comme un **feu rouge** 🚦. Quand tu arrives au feu rouge et que tu n'as pas rempli la condition (attendre le vert), tu ne peux pas passer ! Le navigateur joue le rôle du **policier** qui t'empêche de griller le feu 👮"
    },

    "required_empeche": {
        "keywords": ["required empêche", "empêche d'envoyer", "required bloque", "vraiment empêcher", "required vraiment"],
        "response": "**Oui, `required` empêche VRAIMENT d'envoyer le formulaire !** ✋\n\nSi un champ a `required` et qu'il est vide → le formulaire **ne part pas**. Le navigateur bloque tout !\n\n⚠️ **MAIS ATTENTION** : Cette vérification se fait **côté navigateur** uniquement. Un développeur malin pourrait la contourner. C'est pour ça que les vrais sites vérifient AUSSI côté serveur.\n\n🔐 **Analogie** : `required` côté HTML, c'est comme le **vigile à l'entrée** de la boîte de nuit 🕺. Il vérifie ta carte d'identité (= le champ est rempli). Mais un vigile peut être distrait ! C'est pourquoi à l'intérieur, il y a un **deuxième contrôle** (= le serveur) pour être sûr. Deux niveaux de sécurité valent mieux qu'un ! 🛡️"
    },

    "style_input": {
        "keywords": ["changer le style", "style input", "modifier apparence", "personnaliser input", "css input", "design input", "rendre joli"],
        "response": "**Oui, tu peux totalement changer le style d'un `<input>` avec du CSS !** 🎨\n\nPar exemple :\n```css\ninput {\n    padding: 12px;\n    border: 2px solid #667EEA;\n    border-radius: 10px;\n    font-size: 16px;\n    background: #f5f6fa;\n}\n\ninput:focus {\n    border-color: #43e97b;\n    box-shadow: 0 0 10px rgba(67, 233, 123, 0.3);\n}\n```\n\nTu peux changer : les **couleurs**, les **bordures**, la **taille**, les **coins arrondis**, l'**ombre**, et même ajouter des **animations** !\n\n🎭 **Analogie** : Le HTML crée la **structure** (le squelette), le CSS ajoute le **style** (les vêtements). Un `<input>` par défaut, c'est comme sortir en **pyjama** — ça marche, mais c'est moche ! Avec CSS, tu lui mets un **costume sur mesure** ! 👔✨"
    },

    # ═══════════════════════════════════════
    #  CONNAISSANCES EXISTANTES (mises à jour)
    # ═══════════════════════════════════════

    "history": {
        "keywords": ["inventé", "créé", "origine", "histoire", "quand", "année", "invention"],
        "response": "Les formulaires HTML sont nés avec le web au début des années 90 ! 🕰️\n\nC'est **Tim Berners-Lee** (l'inventeur du Web) et ses collègues qui les ont imaginés pour que le web ne soit pas juste de la lecture, mais aussi de l'échange !\n\n📺 **Analogie** : Avant les formulaires, le web c'était comme la **télé** — tu pouvais juste regarder. Avec les formulaires, c'est devenu comme un **téléphone** — tu peux aussi parler et envoyer des messages !"
    },

    "structure": {
        "keywords": ["structure", "ressemble"],
        "response": "Un formulaire commence toujours par `<form>` et finit par `</form>`. À l'intérieur, on met des ingrédients comme `<input>` (zones de texte) ou `<button>` !\n\n🍔 **Analogie** : C'est comme un **hamburger** ! Le `<form>` c'est le pain du dessus et du dessous. Les `<input>`, `<select>`, `<textarea>`, ce sont les ingrédients au milieu (steak, salade, tomate...). Sans le pain, tout tombe ! 🍞"
    }
}

