define([
  'components/component',
], (
  Component
) => {
  'use strict';

  // # Classe *RupeeComponent*
  // Cette classe comprend les informations d'un rubis.
  class RupeeComponent extends Component {
    // ## Propriété *value*
    // Cette propriété retourne la valeur numérique correspondant
    // au rubis.
    get value() {
      return this.values[this.type];
    }

    // ## Méthode *create*
    // Cette méthode est appelée pour configurer le composant avant
    // que tous les composants d'un objet aient été créés.
    create(descr) {
      this.values = descr.values;
      this.lifetime = descr.lifetime;
      return Promise.resolve();
    }

    // ## Méthode *setup*
    // Cette méthode choisit une valeur aléatoire pour le rubis, et
    // détermine la sprite correspondante.
    setup( /*descr*/ ) {
      const types = Object.keys(this.values);
      const count = types.length;
      this.type = types[Math.floor(Math.random() * count)];

      const sprite = this.owner.getComponent('Sprite');
      sprite.spriteName = this.type;
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

  return RupeeComponent;
});
