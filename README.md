# fire-sim-ciril

## Sujet

> Pour ce test, nous vous proposons d’utiliser (Javascript ou Typescript avec un rendu en 3D utilisant Three.js).
> 
> Énoncé :
> L'objectif est d'implémenter une simulation de la propagation d’un feu de forêt.
> Le code doit être rédigé exclusivement en anglais.
> 
> La forêt est représentée par une grille de dimension h x l.
> La dimension temporelle est discrétisée. Le déroulement de la simulation se fait donc étape par étape.
> Dans l’état initial, une ou plusieurs cases sont en feu.
> Si une case est en feu à l’étape t, alors à l’étape t+1 :
> · Le feu s'éteint dans cette case (la case est remplie de cendre et ne peut ensuite plus brûler)
> · et il y a une probabilité p que le feu se propage à chacune des 4 cases adjacentes
> La simulation s’arrête lorsqu’il n’y a plus aucune case en feu
> Les dimensions de la grille, la position des cases initialement en feu, ainsi que la probabilité de propagation, sont des paramètres du programme stockés dans un fichier de configuration (format libre).
> Ce qui nous intéresse n’est pas de simplement voir un programme de simulation tourné avec le meilleur IHM mais surtout de comprendre :
> 
> - Comment vous appréhendez un problème
> 
> - Comment vous codez
> 
> - Quels sont vos choix architecturaux
> 
> - Comment vous présentez votre travail une fois réalisé
> 
> Si vous avez des questions, n’hésitez pas à me contacter par mail.
> 
> Le test est à nous retourner sous un délai d’une semaine.
> 
> Une fois celui-ci réalisé, je vous invite à nous envoyer le lien Git afin que nous puissions poursuivre le processus de recrutement.
> 
> Je vous remercie de me confirmer la bonne réception de ce mail.
> 
> Bon courage !

## Documentation

### General

Le projet est une simulation au tour par tour de départ de feu de forêt en 3D sur threejs.
### Tech Stack
**Coté client :**

- **Threejs** (aucun autre framework front-end n'est requis pour le scope de ce projet)

**Coté Serveur :**

- Github Pages (pour un hébergement statique et une facilité de déploiement)

**Environnement de développement :**

- Vite (Itération rapide sur des projets front-end, et déploiement Github Pages facilité)
- Deno (Permet de travailler facilement avec **Typescript**, la version 2 est compatible avec tous les projets Nodejs)

*NOTE : Par défaut, les dépendances devraient etre définies dans le fichier deno.json. Elles ont été déplacées dans un package.json pour résoudre un bug récemment identifié.*

### Configuration

Le document config.json défini toutes les variables de l'expérience.

```JSON
{

    /* probabilité de contagion */
    "p":0.3,

    /* longueur de la grille */
    "l":9,

    /* hauteur de la grille */
    "h":9,

    /* Liste des départs de feu, en coordonnées existantes sur la grille */
    "fireStarts": [
        {
            "x":0,
            "y":0
        },
        {
            "x":4,
            "y":4
        },
        {
            "x":0,
            "y":4
        },
        {
            "x":4,
            "y":0
        },{
            "x":8,
            "y":8
        },
        {
            "x":0,
            "y":8
        },
        {
            "x":8,
            "y":0
        },
        {
            "x":4,
            "y":8
        },
        {
            "x":8,
            "y":4
        }

    ]
}
```

### Pour tester

Vous pouvez dés à présent tester l'expérience ici : https://arthurmougin.github.io/fire-sim-ciril/

### Pour modifier et contribuer

1. [Installer Deno](https://docs.deno.com/runtime/)

Le projet aussi être compatible node, mais requièrera davantage de configuration.

2. ` > deno install`

Installer les dépendences

3. ` > deno task dev`

Démarre l'environnement de développement. Vite proposera alors dans le terminal une url de test en direct.

*NOTE : Les fichiers dans le dossier public ne sont pas concernés par le live-refresh. Un rechargement de page sera nécéssaire pour chaque changement de config.json.*