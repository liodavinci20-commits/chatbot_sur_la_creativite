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
