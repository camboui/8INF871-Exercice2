define([
  'components/component',
], (
  Component
) => {
  'use strict';

  // # Classe *HeartComponent*
  // Cette classe comprend les informations d'un coeur à ramasser.
  class HeartComponent extends Component {
    // ## Méthode *create*
    // Cette méthode est appelée pour configurer le composant avant
    // que tous les composants d'un objet aient été créés.
    create(descr) {
      this.heal = descr.heal;
      this.lifetime = descr.lifetime;
      return Promise.resolve();
    }

    // ## Méthode *setup*
    // Cette méthode est appelée pour configurer le composant après
    // que tous les composants d'un objet aient été créés.
    setup( /*descr*/ ) {
      this.start = new Date();
      return Promise.resolve();
    }

    // ## Méthode *update*
    // La méthode *update* de chaque composant est appelée une fois
    // par itération de la boucle de jeu.
    update( /*frame*/ ) {
      const now = new Date();
      const elapsed = now - this.start;
      if (elapsed > this.lifetime) {
        this.owner.active = false;
        this.owner.parent.removeChild(this.owner);
      }
    }
  }

  return HeartComponent;
});
