define(() => {
  'use strict';

  // # Classe *EventTrigger*
  // Classe utilitaire pour appeler des méthodes en réaction
  // à des événements.
  class EventTrigger {
    constructor() {
      this.handlers = {};
      this.autoIndex = 0;
    }

    // ## Méthode *add*
    // Ajoute une méthode à appeler lors du déclenchement de
    // l'événement.
    add(instance, method, name, context) {
      if (!name) {
        name = this.autoIndex++;
      }

      this.handlers[name] = {
        instance: instance,
        method: method,
        context: context,
      };

      return name;
    }

    // ## Méthode *remove*
    // Supprime une méthode du tableau de méthodes à appeler.
    remove(name) {
      delete this.handlers[name];
    }

    // ## Méthode *trigger*
    // Déclenche les méthodes enregistrées.
    trigger() {
      Object.keys(this.handlers).forEach((k) => {
        const handler = this.handlers[k];
        const params = Array.prototype.slice.call(arguments);
        if (handler.context) {
          params.push(handler.context);
        }
        let method = handler.method;
        if (typeof(method) === 'string') {
          method = handler.instance[method];
        }
        method.apply(handler.instance, params);
      });
    }
  }

  return EventTrigger;
});
