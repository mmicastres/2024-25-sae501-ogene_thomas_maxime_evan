# EDT-AI: Maxime BASSET, Evan BOYER, Thomas CERQUIERA, Ogené JOSEPH 
## Introduction
EDT-IA: Est une application mobile, permettant de visualiser l'emploi de temps de chaque salle de cours du pôle " métiers du multimédia et de l'internet " de l'IUT de CASTRES, grâce à la détection de texte par intelligence artificielle via la caméra du smartphone.Ce projet à pour objectif de permettre au utilisateurs finaux, à savoir les étudiants du campus, d'avoir à porté de main l'emploi du temps des salles de manière rapide,pour leurs usages quotidiens de celles-ci.
### Fonctionnement 
Pour le fonctionnement, l'utilisateur se munit de son téléphone pour scanner l'intitulé des portes de l'IUT, ensuite l'emploi du temps du jours de la salle est affiché sur l'écran avec toutes les informations correspondantes.

## Corn Beast
```mermaid
graph TD
    A[Etudants IUT-Castres] -->|À qui rend-il service ?| B[Application mobile:EDT-IA]
    C[Information interne de l'IUT et le quotidien des etudiants] -->|Sur quoi agit-il ?| B
    B -->|Dans quel but ?| D[permettre aux etudiants de connaitre la disponibilité des salles rapidement]
    style A fill:#4169E1,stroke:#000,stroke-width:2px,color:#fff
    style C fill:#FFD700,stroke:#000,stroke-width:2px,color:#000
    style B fill:#DC143C,stroke:#000,stroke-width:2px,color:#fff
    style D fill:#228B22,stroke:#000,stroke-width:2px,color:#fff

```



## Fonctionnalités

### Fonctionnalité principale
- Affichage des emplois du temps des salles au scan avec la caméra du téléphone
### Fonctionnalité secondaire
- Connexion, incription, déconnexion
### Should have
- consulter les emplois du temps des salles par une saisie du nom de la salle sur l'interface
### Won't have 
- avoir son propre emploi du temps sur l'application
- avoir l'emploi du temps hebdomadaire des salles ou sur de plus longues durrées
## Screens
 ![homeScreen](homeScreen.jpeg)
 ![connexionScreen](connexionScreen.jpeg)
 ![signUpScreen](signUpScreen.jpeg) 
 ![calendarScreen](calendarScreen.jpeg)
### Video de démonstration


https://github.com/user-attachments/assets/3c475a92-3461-4a4f-bfbb-141bed601cee


![demo](video.mp4)

## Architecture
### Backend
Cette application utilise une API interne à l'I.U.T de Castres pour la récupération des données des emplois du temps.
Une base de donnée en MongoDB avec express.js
### Front-end
Le framework javascript `React` à été utilisé pour développer ce projet avec l'implémentation de l'environnement d'exécution `Capacitor` qui permet de développer des projets avec des technologies web pour une exécution en natif sur mobile ou ordinateur.
### Et la technologie novatrice l'IA
Dans ce projet nous avons utilisé l'intelligence artificielle Tesseract (IA) spécialisée dans la gestion de texte et la génération d'images.
## Installation de l'application
### Sur android
- recupérez le fichier 'EDTAI.apk' sur ce dépot
- autorisez l'installation d'application externe à google playstore
- installez l'application
- autorisez l'accès à la caméra
- dirigez votre camera face au nom de la porte dont vous voulez avoir l'emploi du temps 
### Sur IOS
- recupérez le fichier 'EDTAI.apk' sur ce dépot
- autorisez l'installation d'application externe 
- installez l'application
- autorisez l'accès à la caméra
- dirigez votre camera face au nom de la porte dont vous voulez avoir l'emploi du temps 
## Pour les développeurs
### installation
Ce projet nécessite:
```
   "@capacitor-community/http": "^1.4.1",
    "@capacitor/android": "^6.2.0",
    "@capacitor/camera": "^6.1.2",
    "@capacitor/cli": "^6.2.0",
    "@capacitor/core": "^6.2.0",
    "@capacitor/ios": "^6.2.0",
    "@tensorflow/tfjs": "^4.1.0",
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^1.7.9",
    "date-fns": "^4.1.0",
    "ical.js": "^2.1.0",
    "react": "^18.3.1",
    "react-big-calendar": "^1.17.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.1.5",
    "react-scripts": "5.0.1",
    "tesseract.js": "^5.1.1",
    "web-vitals": "^2.1.4"
```
### Lancer le projet
- Clonez le dépot git
- ouvrez votre dépot dans le terminal 
- executez les commandes
  ```
  npm install
  npm run build
  npx cap sync
  npx cap open android //ou ios si vous developper sur ios

  ```


