define([
  'components/component',
], (
  Component
) => {
  'use strict';

  // ## Variable *keyPressed*
  // Tableau associatif vide qui contiendra l'état courant
  // des touches du clavier.
  const keyPressed = {};

  // ## Méthode *setupKeyboardHandler*
  // Cette méthode enregistre des fonctions qui seront
  // appelées par le navigateur lorsque l'utilisateur appuie
  // sur des touches du clavier. On enregistre alors si la touche
  // est appuyée ou relâchée dans le tableau `keyPressed`.
  //
  // On utilise la propriété `code` de l'événement, qui est
  // indépendant de la langue du clavier (ie.: WASD vs ZQSD)
  //
  // Cette méthode est appelée lors du chargement de ce module.
  function setupKeyboardHandler() {
    document.addEventListener('keydown', (evt) => {
      keyPressed[evt.code] = true;
    }, false);

    document.addEventListener('keyup', (evt) => {
      keyPressed[evt.code] = false;
    }, false);
  }

  // # Composant *InputComponent*
  // Ce composant comprend les méthodes nécessaires pour
  // saisir les entrées de l'utilisateur.
  class InputComponent extends Component {
    // ## Méthode *create*
    // Cette méthode est appelée pour configurer le composant avant
    // que tous les composants d'un objet aient été créés.
    create(descr) {
      this.symbols = descr.symbols;
      return Promise.resolve();
    }

    // ## Fonction *getKey*
    // Cette méthode retourne une valeur correspondant à un symbole défini.
    //
    // Si on le voulait, on pourrait substituer cette implémentation
    // par clavier par une implémentation de l'[API Gamepad.](https://developer.mozilla.org/fr/docs/Web/Guide/API/Gamepad)
    getKey(symbol) {
      if (keyPressed[this.symbols[symbol]]) {
        return true;
      }
      return false;
    }
  }

  // Configuration de la capture du clavier au chargement du module.
  setupKeyboardHandler();

  return InputComponent;
});
