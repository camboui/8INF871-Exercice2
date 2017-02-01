define([
  'sceneObject',
], (
  SceneObject
) => {
  'use strict';

  // # Classe *Scene*
  // La classe *Scene* représente la hiérarchie d'objets contenus
  // simultanément dans la logique du jeu.
  class Scene {
    // ## Fonction statique *create*
    // La fonction *create* permet de créer une nouvelle instance
    // de la classe *Scene*, contenant tous les objets instanciés
    // et configurés. Le paramètre `description` comprend la
    // description de la hiérarchie et ses paramètres. La fonction
    // retourne une promesse résolue lorsque l'ensemble de la
    // hiérarchie est configurée correctement.
    static create(description) {
      const scene = new Scene(description);
      Scene.current = scene;
      let calls = Promise.resolve();
      ['create', 'setup'].forEach((fn) => {
        calls = calls.then(() => {
          return scene.init(description, fn);
        });
      });

      return calls.then(() => {
        return scene;
      });
    }

    // ## Constructeur de *Scene*
    // On crée ici un objet racine sur lequel on pourra faire
    // les manipulations de la scène.
    constructor() {
      this.root = new SceneObject();
      this.root.__name = '(root)';
    }

    // ## Méthode *init*
    // On profite de la syntaxe du langage qui nous permet d'atteindre
    // une fonction membre en indexant le tableau associatif où elle
    // est définie. Par exemple, `monObj['fonction']()` est équivalent
    // à `monObj.fonction()`
    init(description, fn) {
      return this.root[fn]({
        children: description,
      });
    }

    // ## Méthode *display*
    // Cette méthode appelle les méthodes *display* de tous les
    // objets de la scène.
    display() {
      return this.root.callRecursive('display', arguments);
    }

    // ## Méthode *update*
    // Cette méthode appelle les méthodes *update* de tous les
    // objets de la scène.
    update() {
      return this.root.callRecursive('update', arguments);
    }

    // ## Fonction *findObject*
    // La fonction *findObject* retourne l'objet de la scène
    // portant le nom spécifié.
    findObject(objectName) {
      return this.root.findChildRecursive(objectName);
    }
  }

  return Scene;
});
