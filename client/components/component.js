define(() => {
  'use strict';

  // # Classe *Component*
  // Cette classe est une classe de base pour l'ensemble des
  // composants et implémente les méthodes par défaut.
  class Component {
    // ## Constructeur de la classe *Composant*
    // Le constructeur de cette classe prend en paramètre l'objet
    // propriétaire du composant, et l'assigne au membre `owner`.
    constructor(owner) {
      // ## Membre *enabled*
      // Si ce membre a une valeur fausse, les méthodes *update* et
      // *display* ne seront pas appelées.
      this._enabled = true;

      this.owner = owner;
    }

    // ## Méthode *create*
    // Cette méthode est appelée pour configurer le composant avant
    // que tous les composants d'un objet aient été créés. Cette
    // méthode peut retourner une promesse.
    create( /*descr*/ ) {
      return Promise.resolve();
    }

    // ## Méthode *setup*
    // Cette méthode est appelée pour configurer le composant après
    // que tous les composants d'un objet aient été créés. Cette
    // méthode peut retourner une promesse.
    setup( /*descr*/ ) {
      return Promise.resolve();
    }

    // ## Méthode *display*
    // La méthode *display* de chaque composant est appelée une fois
    // par itération de la boucle de jeu.
    display( /*frame*/ ) {}

    // ## Méthode *update*
    // La méthode *update* de chaque composant est appelée une fois
    // par itération de la boucle de jeu.
    update( /*frame*/ ) {}

    // ## Accesseur *enabled*
    // L'accesseur *enabled* active ou désactive le composant, et appelle
    // une méthode en réponse si l'état a changé.
    get enabled() {
      return this._enabled;
    }

    set enabled(val) {
      if (this.enabled === val) {
        return;
      }
      this._enabled = val;

      if (this.enabled) {
        this.onEnabled();
      } else {
        this.onDisabled();
      }
    }

    enable(val) {
      this.enabled = val;
    }

    // ## Méthode *onEnabled*
    // La méthode *onEnabled* est appelée quand l'objet passe de l'état
    // activé à désactivé.
    onEnabled() {}

    // ## Méthode *onDisabled*
    // La méthode *onDisabled* est appelée quand l'objet passe de l'état
    // désactivé à activé.
    onDisabled() {}

    // ## Fonction *findComponent*
    // Cette fonction permet de trouver simplement un composant dans
    // un objet de la scène depuis un identifiant correspondant
    // au nom de l'objet et au type de composant, séparés par un point.
    // Par exemple: "MonObjet.MonComposant".
    findComponent(name) {
      if (typeof(name) !== 'string') {
        return name;
      }

      const tokens = name.split('.');
      const targetName = tokens[0];
      const compName = tokens[1];

      const Scene = require('scene');
      const target = Scene.current.findObject(targetName);
      return target.getComponent(compName);
    }
  }

  return Component;
});
