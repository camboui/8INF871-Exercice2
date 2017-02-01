define([
  'components/component',
  'eventTrigger',
], (
  Component,
  EventTrigger
) => {
  'use strict';

  // # Classe *RefereeComponent*
  // Ce composant permet de déclarer un vainqueur!
  class RefereeComponent extends Component {
    // ## Méthode *create*
    // Cette méthode est appelée pour configurer le composant avant
    // que tous les composants d'un objet aient été créés.
    create( /*descr*/ ) {
      this.winEvent = new EventTrigger();
      this.winEvent.add(this, this.showWinMessage);
      return Promise.resolve();
    }

    // ## Méthode *setup*
    // Cette méthode configure le composant.
    setup(descr) {
      this.players = [];
      descr.players.forEach((p) => {
        const player = this.findComponent(p);
        this.players.push(player);
        player.deadEvent.add(this, this.onDead, null, player);
      });

      return Promise.resolve();
    }

    // ## Méthode *onDead*
    // Cette méthode est déclenchée quand un joueur meurt
    onDead( /*player*/ ) {
      let bestScore = -1;
      let bestPlayer = null;
      let worstScore = Number.MAX_VALUE;
      let worstPlayer = null;

      let gameOver = true;

      this.players.forEach((p) => {
        if (!gameOver) {
          return;
        }
        if (!p.isDead) {
          gameOver = false;
          return;
        }

        if (p.score.value > bestScore) {
          bestScore = p.score.value;
          bestPlayer = p;
        }
        if (p.score.value < worstScore) {
          worstScore = p.score.value;
          worstPlayer = p;
        }
      });

      if (gameOver) {
        this.winEvent.trigger(bestPlayer, worstPlayer);
      }
    }

    // ## Méthode *showWinMessage*
    // Affiche un popup mentionnant le gagnant
    showWinMessage(winner, loser) {
      alert(`${winner.name} a gagné contre ${loser.name}`);
    }
  }

  return RefereeComponent;
});
