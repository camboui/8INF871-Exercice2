define([
  'components/component',
  'eventTrigger',
], (
  Component,
  EventTrigger
) => {
  'use strict';

  // # Classe *ScoreComponent*
  class ScoreComponent extends Component {
    // ## Méthode *create*
    // Cette méthode est appelée pour configurer le composant avant
    // que tous les composants d'un objet aient été créés.
    create( /*descr*/ ) {
      this.scoreChangedEvent = new EventTrigger();
      return Promise.resolve();
    }

    // ## Méthode *setup*
    // Cette méthode conserve le composant de texte qui affiche
    // le pointage, et initialise sa valeur.
    setup(descr) {
      this.scoreSprite = this.findComponent(descr.scoreSprite);
      this.value = 0;
      return Promise.resolve();
    }

    // ## Propriété *value*
    // Cette méthode met à jour le pointage et l'affichage de
    // ce dernier.
    get value() {
      return this._value;
    }

    set value(newVal) {
      this._value = newVal;
      this.scoreChangedEvent.trigger(this.value);
      this.scoreSprite.text = this.value;
    }
  }

  return ScoreComponent;
});
