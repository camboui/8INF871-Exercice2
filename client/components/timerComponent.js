define([
  'components/component',
], (
  Component
) => {
  'use strict';

  // ## Méthode *format*
  // Cette méthode prend un interval et le converti en une chaîne
  // lisible.
  function format(total_ms) {
    const total_s = Math.floor(total_ms / 1000);
    const minutes = Math.floor(total_s / 60);
    let seconds = total_s - (minutes * 60);
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    return `${minutes}:${seconds}`;
  }

  // # Classe *TimerComponent*
  // Ce composant affiche le temps écoulé depuis son lancement.
  class TimerComponent extends Component {
    // ## Méthode *setup*
    // Cette méthode conserve le composant de texte qui affiche
    // le pointage, et initialise sa valeur.
    setup( /*descr*/ ) {
      this.textSprite = this.owner.getComponent('TextSprite');
      this.start = new Date();
      return Promise.resolve();
    }

    // ## Méthode *onEnabled*
    // La méthode *onEnabled* est appelée quand l'objet passe de l'état
    // activé à désactivé.
    onEnabled() {
      const now = new Date();
      const paused = now - this.beginPause;
      this.start = +this.start + paused;
    }

    // ## Méthode *onDisabled*
    // La méthode *onDisabled* est appelée quand l'objet passe de l'état
    // désactivé à activé.
    onDisabled() {
      this.beginPause = new Date();
    }

    // ## Méthode *update*
    // La méthode *update* de chaque composant est appelée une fois
    // par itération de la boucle de jeu.
    update( /*frame*/ ) {
      const now = new Date();
      const elapsed = now - this.start;
      const array = format(elapsed).split('');
      for (let i = 0; i < array.length; ++i) {
        if (array[i] === ':') {
          array[i] = 'colon';
        }
      }
      this.textSprite.array = array;
    }

  }

  return TimerComponent;
});
