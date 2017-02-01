define([
  'components/component',
  'eventTrigger',
], (
  Component,
  EventTrigger
) => {
  'use strict';

  // # Classe *LifeComponent*
  class LifeComponent extends Component {
    // ## Méthode *create*
    // Cette méthode est appelée pour configurer le composant avant
    // que tous les composants d'un objet aient été créés.
    create(descr) {
      this.deadEvent = new EventTrigger();
      this.hurtEvent = new EventTrigger();
      this.max = descr.max;
      this.sprites = descr.sprites;
      return Promise.resolve();
    }

    // ## Méthode *setup*
    // Cette méthode conserve le composant de texte qui affiche
    // la vie, et initialise sa valeur.
    setup(descr) {
      this.lifeSprite = this.findComponent(descr.lifeSprite);
      this.value = descr.default;
      return Promise.resolve();
    }

    // ## Propriété *value*
    // Cette méthode met à jour la vie et l'affichage de
    // cette dernière.
    get value() {
      return this._value;
    }

    set value(newVal) {
      if (newVal < 0) {
        newVal = 0;
      }
      if (newVal > this.max) {
        newVal = this.max;
      }

      if (newVal === 0) {
        this.deadEvent.trigger();
      } else if (newVal < this.value) {
        this.hurtEvent.trigger();
      }

      this._value = newVal;

      const hearts = [];
      for (let i = 0; i < this.max; ++i) {
        let sIndex = 0;
        if (i < this.value) {
          sIndex = 1;
        }
        if (i + 1 <= this.value) {
          sIndex = 2;
        }
        hearts.push(this.sprites[sIndex]);
      }

      this.lifeSprite.array = hearts;
    }
  }

  return LifeComponent;
});
