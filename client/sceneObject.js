define([
  'components',
], (
  ComponentFactory
) => {
  'use strict';

  // # Classe *SceneObject*
  // La classe *SceneObject* représente un objet de la scène qui
  // peut contenir des enfants et des composants.
  class SceneObject {
    constructor() {
      // ## Membre *active*
      // Si ce membre a une valeur fausse, les méthodes *update* et
      // *display* ne seront pas appelées sur les composants de
      // cet objet et ses enfants.
      this.active = true;

      this.components = {};
      this.children = {};
    }

    // ## Méthode *create*
    // Crée la hiérarchie d'objets et de composants depuis une
    // description.
    create(description) {
      if (!description.children) {
        description.children = {};
      }
      if (!description.components) {
        description.components = {};
      }

      const p = [];
      Object.keys(description.children).forEach((name) => {
        const child = this.addChild(name, new SceneObject());
        p.push(child.create(description.children[name]));
      });

      return Promise.all(p)
        .then(() => {
          const pcomp = [];
          Object.keys(description.components).forEach((type) => {
            const comp = this.addComponent(type);
            const compP = comp.create(description.components[type]);
            pcomp.push(compP);
          });
          return Promise.all(pcomp);
        });
    }

    // ## Méthode *setup*
    // Configure les composants de la hiérarchie d'objets, en
    // s'assurant de les identifier lorsque leur configuration
    // est complète afin d'éviter de faire les mises à jour
    // sur des composants incomplets.
    setup(description) {
      if (!description.children) {
        description.children = {};
      }
      if (!description.components) {
        description.components = {};
      }

      const p = [];
      Object.keys(description.children).forEach((name) => {
        const child = this.getChild(name);
        p.push(child.setup(description.children[name]));
      });

      return Promise.all(p)
        .then(() => {
          const pcomp = [];
          Object.keys(description.components).forEach((type) => {
            const comp = this.getComponent(type);
            const compP = comp.setup(description.components[type])
              .then(() => {
                comp.__ready = true;
              });
            pcomp.push(compP);
          });
          return Promise.all(pcomp);
        });
    }

    // ## Méthode *addComponent*
    // Cette méthode prend en paramètre le type d'un composant et
    // instancie un nouveau composant.
    addComponent(type) {
      const newComponent = ComponentFactory.create(type, this);
      this.components[type] = newComponent;
      return newComponent;
    }

    // ## Fonction *getComponent*
    // Cette fonction retourne un composant existant du type spécifié
    // associé à l'objet.
    getComponent(type) {
      return this.components[type];
    }

    // ## Méthode *addChild*
    // La méthode *addChild* ajoute à l'objet courant un objet
    // enfant.
    addChild(objectName, child) {
      child.parent = this;
      child.__name = objectName;
      this.children[objectName] = child;
      return child;
    }

    // ## Méthode *removeChild*
    // La méthode *remoteChild* supprime un enfant direct de l'objet
    // courant, par son nom ou par sa référence.
    removeChild(child) {
      if (typeof(child) === 'string') {
        delete this.children[child];
      } else {
        Object.keys(this.children).forEach((k) => {
          if (this.children[k] === child) {
            delete this.children[k];
          }
        });
      }
    }

    // ## Fonction *getChild*
    // La fonction *getChild* retourne un objet existant portant le
    // nom spécifié, dont l'objet courant est le parent.
    getChild(objectName) {
      return this.children[objectName];
    }

    // ## Fonction *findChildRecursive*
    // La fonction *findChildRecursive* retourne un objet existant
    // portant le nom spécifié, dont l'objet courant ou un de ses
    // enfants en est le parent.
    findChildRecursive(objectName) {
      if (this.children[objectName]) {
        return this.getChild(objectName);
      }
      let found = null;
      Object.keys(this.children).forEach((k) => {
        if (found) {
          return;
        }
        found = this.children[k].findChildRecursive(objectName);
      });
      return found;
    }

    // ## Fonction *fingObjectInScene*
    // Cette fonction retourne un objet de la scène portant le
    // nom spécifié. Cet objet n'est pas nécessairement en lien
    // avec l'objet courant. Voir la méthode `findObject` de la
    // classe *Scene*.
    findObjectInScene(objectName) {
      const Scene = require('scene');
      return Scene.current.findObject(objectName);
    }

    // ## Méthode *callRecursive*
    // Cette méthode appelle la méthode voulue des composants
    // de l'objet et de ses enfants.
    callRecursive(method, params = []) {
      if (!this.active) {
        return;
      }

      Object.keys(this.components).forEach((name) => {
        const comp = this.components[name];
        if (comp.__ready && comp.enabled) {
          comp[method].apply(comp, params);
        }
      });
      Object.keys(this.children).forEach((name) => {
        const child = this.children[name];
        child.callRecursive(method, params);
      });
    }

    // ## Méthode *createNewComponents*
    // Cette méthode instancie un nouvel objet et ses composants
    // à un moment autre que l'initialisation d'une scène.
    createNewComponents(descriptions) {
      const types = Object.keys(descriptions);
      const components = [];
      types.forEach((type) => {
        components.push(this.addComponent(type));
      });

      let calls = Promise.resolve();
      ['create', 'setup'].forEach((fn) => {
        calls = calls.then(() => {
          const p = [];
          for (let i = 0; i < components.length; ++i) {
            const comp = components[i];
            const type = types[i];
            p.push(comp[fn](descriptions[type]));
          }
          return Promise.all(p);
        });
      });

      return calls.then(() => {
        components.forEach((comp) => {
          comp.__ready = true;
        });
      });
    }
  }

  return SceneObject;
});
