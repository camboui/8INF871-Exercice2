define([
  'components/component',
  'graphicsAPI',
], (
  Component,
  GraphicsAPI
) => {
  'use strict';

  let GL = undefined;
  let origDrawElements = undefined;
  let value = 0;

  // ## Méthode *countDrawCalls*
  // Cette méthode est appelée à la place de *drawElements*
  // de l'API WebGL. Puisqu'on utilise une manière détournée
  // d'atteindre cette méthode, le pointeur *this*
  // correspond au contexte WebGL. On incrémente donc le
  // compteur d'appels de rendu, et on appelle ensuite
  // la méthode d'origine via la fonction *apply* et le
  // paramètre magique *arguments*, qui est un tableau comportant
  // tous les paramètres passés à cette fonction.
  function countDrawCalls() {
    value++;
    origDrawElements.apply(this, arguments);
  }

  // # Classe *DebugDrawCallsComponent*
  // Ce composant permet d'intercepter les appels de rendu,
  // de compter leur nombre et d'afficher le résultat dans
  // un élément de la page Web.
  class DebugDrawCallsComponent extends Component {
    // ## Méthode *create*
    // On substitue ici la méthode *drawElements* de l'API
    // WebGL par une fonction locale.
    create( /*descr*/ ) {
      GL = GraphicsAPI.context;
      origDrawElements = GL.drawElements;
      GL.drawElements = countDrawCalls;
      return Promise.resolve();
    }

    // ## Méthode *setup*
    // On conserve la référence vers l'élément HTML dans
    // lequel on écrira le nombre d'appels de rendu.
    setup(descr) {
      this.target = document.getElementById(descr.field);
      return Promise.resolve();
    }

    // ## Méthode *update*
    // On affiche le nombre d'appels de rendu exécuté à
    // la dernière itération et on remet le compteur à zéro.
    update( /*frame*/ ) {
      this.target.innerHTML = value;
      value = 0;
    }
  }

  return DebugDrawCallsComponent;
});
