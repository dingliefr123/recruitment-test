# L'exercice de CodeInput

Bonjour, madame ou Monsieur. Merci d'avoir consulté cette repo, tout d'abord, je vais vous expliquer la structure ce project.

Les fichers de logiciels sont réalisés par typescript, `.ts` u `.tsx`, dans la répertoire `./src/technical-test/code-input`. Vous pouvez exécuter les commands `npm run start`, `npm run test:unit` et `npm run test:e2e` directement, il faut installer les dépandances à l'avant. Je vous recommande d'installer les dépandances par `npm install`.

Les demandes de ce test est dans le ficher `./README_DEMANDES.md`.

## La répertoire de CodeInput

```bash
├───code-input # touts les fichers des tests unitaires et code
│   ├───CodeInput.test.tsx # le ficher de tests unitaire des composnats
│   ├───CodeInput.tsx # le code du composant, tous inclus
│   └───CodeInputHook.test.ts # les tests unitaires pour les custm hooks utilisés
└───Input.tsx # Original Input Composant rien de change
```

## Explication de la réalisation des deux composants

### CodeInput

J'ai introdui duex états, `activeIdx` par `setState(0)`, qui est pour controller l'indice de composant active(focus) c'est-à-dire quand il faut changer le focus il faur juste appeler `setActiveIdx`, et `arr` par `setState(['', '', '', ''])` est pour stocker et controller les entrées de l'utilisateur, quand il a la nouvelle entrée, on peut appeler le logociel comme `setArr(arr => { arr[idx] = input;  return [...arr] })` pour démarer le processus de mis-a-jour, et quand on a déteté que l'utilisateur a entré **Backspace**, on peut effacer le input par le logiciel comme ca, `setArr(arr => { arr[idx] = '';  return [...arr] })`. Quand le `activeIdx` est égale a **3(aussi la 4ième de table)**, et il y a de noubeau input, dans ce cas, il faut appeler la méthode `onFullCode`.

Et dans l'extrieur, j'ai déjà érigé 3 **handlers**, `focusHandler`, `inputHandler` et `keydownHandler`, respectivement pour règler les évenements, `focusEvent`, `changeEvent` et `keydownEvent`. Tous ces 3 **handlers** sont registrés dans l'élement `input` native. `inputHandler` contrôle l'avancé du focus, par contre, `keydownHandler` contrôle la reculé.

### Child

Alors, il n'y pas l'état dans le `Child` composant, ni **callback**, mais juste un `ref` pour stocker l'élement de input et un `useEffect` hook, qui fonctione à détecter les changements de `index`, qui est l'indice de chaque `Child` et toujours statique, et `activeIdx`. Pendant chaque rendu ou re-rendu, quand les duex parameters sont égaeux, il va **focus** cette élement d'input, qui est lié par `ref`, comme `ref.current?.focus()`. Comme un composant, c'est très simple.

### Les Petits Points

#### Justs les chiffres sont acceptés

J'ai utilisé le logiciel comme `Number.isNaN(Number(input))` à filter si c'est un chiffre. Au plus, l'input de **Backspace** est vide, donc il faut aussi `if (input.length !== 1) return;` à filter lors de compoetement de suppression.

#### Comment analyser si c'est le comportement de suppression

Chaque `keydown` évenement est avec les attributes comme `key` et `keyCode`. Pour le cas de **Backspace** plus précisement, c'est `Backspace` et `13`. 

## Les tests

### Tests unitaires

En utilisant `Jest` et `@testing-library/react` poue réaliser les **tests unitaires**. Dans `CodeInput.test.tsx`, 2 composants, `CodeInput` et `Child` sont testés. Pour le `CodeInput`, j'ai déjà testé son rendu initial, le déplacement automatic du focus après le rempli, le retour en arrière apr après l'input de **Backspace** et le final appelé de `onFullCode`. Et pour le `Child` composant, c'est plus simple, il faut juste mock `useRef` React Hook à assurer l'appelé de focus de `ref` d'intérieur.

Pour les tests de `hooks`, c'est pour assurer les états peuvent être initiées correctement. J'ai utilisé les méthodes, tel que `renderHook`(rendu de hook), `act`(simulation du comportement) et `waitFor`(attandre les chnagement de l'état), tous venant de `@testing-library`.

### Tests End2End

Juste `cypress` est suffi dans ce cas, c'est un outil très fort. Presque on peut simuler tous les comportements des utilisateurs dans les navigateurs. Alors, ce projet est assez petit, donc il ne y'a pas beaucoup d'éspace à afficher tous ses avantages. A mon avis, les tests de End2End sont vraiment nécessaires, quand il s'agit de grande projet ou les processus très compliqués en particulère. Sachanr que dans certains cas, c'est uniquement End2End tests qui peuvent nous aider à trouver les problèmes.  
