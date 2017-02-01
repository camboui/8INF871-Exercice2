define([
  'components/component',
  'eventTrigger',
], (
  Component,
  EventTrigger
) => {
  'use strict';

  // # Classe *EnablerComponent*
  // Ce composant active ou désactive d'autres composants,
  // au lancement et en réponse à un événement externe.
  class EnablerComponent extends Component {
    // ## Méthode *setup*
    // Cette méthode est appelée pour configurer le composant après
    // que tous les composants d'un objet aient été créés.
    setup(descr) {
      this.eventTargets = new EventTrigger();

      Object.keys(descr.onStart).forEach((name) => {
        const enabled = descr.onStart[name];
        const target = this.findComponent(name);
        target.enabled = enabled;
      });

      Object.keys(descr.onEvent).forEach((name) => {
        const enabled = descr.onEvent[name];
        const target = this.findComponent(name);
        this.eventTargets.add(target, 'enable', null, enabled);
      });

      return Promise.resolve();
    }

    // ## Méthode *onEvent*
    // Active ou désactive les composants en réaction à un événement.
    onEvent() {
      this.eventTargets.trigger();
    }
  }

  return EnablerComponent;
});
