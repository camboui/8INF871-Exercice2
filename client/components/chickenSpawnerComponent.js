define([
  'components/component',
], (
  Component
) => {
  'use strict';

  // # Classe *ChickenSpawnerComponent*
  // Cette classe contrôle l'apparition de poulets.
  class ChickenSpawnerComponent extends Component {
    // ## Méthode *create*
    // Cette méthode est appelée pour configurer le composant avant
    // que tous les composants d'un objet aient été créés.
    create(descr) {
      this.spawnDelay = descr.spawnDelay;
      this.sourceArea = descr.sourceArea;
      this.targetArea = descr.targetArea;
      this.spawnWaitFactor = descr.spawnWaitFactor;
      this.chickenTemplate = descr.chickenTemplate;
      return Promise.resolve();
    }

    // ## Méthode *setup*
    // Cette méthode est appelée pour configurer le composant après
    // que tous les composants d'un objet aient été créés.
    setup(descr) {
      this.spriteSheet = this.findComponent(descr.spriteSheet);
      return Promise.resolve();
    }

    // ## Méthode *update*
    // À chaque itération, on vérifie si on a attendu un délai
    // quelconque. Si c'est le cas, on génère un poulet, et on
    // réduit le temps d'attente.
    update(frame) {
      const spawnDelay = Math.floor(this.spawnDelay);
      if ((frame % spawnDelay) === 0) {
        this.spawnDelay = Math.max(8, this.spawnDelay * this.spawnWaitFactor);
        this.spawn(frame);
      }
    }

    // ## Méthode *spawn*
    // Cette méthode crée un nouveau poulet. On configure son
    // apparition sur un rectangle autour de l'écran, et sa
    // cible sur l'aire de jeu.
    spawn(frame) {
      const SceneObject = require('sceneObject');
      const newChickenObj = new SceneObject();
      this.owner.addChild(frame, newChickenObj);
      let x = 0;
      let y = 0;
      if (Math.floor(Math.random() * 2) === 0) {
        x = this.sourceArea.x;
        if (Math.floor(Math.random() * 2) === 0) {
          x += this.sourceArea.w;
        }
        y = Math.random() * this.sourceArea.h + this.sourceArea.y;
      } else {
        y = this.sourceArea.y;
        if (Math.floor(Math.random() * 2) === 0) {
          y += this.sourceArea.h;
        }
        x = Math.random() * this.sourceArea.w + this.sourceArea.x;
      }

      this.chickenTemplate.Chicken.target = {
        x: Math.random() * this.targetArea.w + this.targetArea.x,
        y: Math.random() * this.targetArea.h + this.targetArea.y,
      };
      this.chickenTemplate.Position = {
        x: x,
        y: y,
        z: 0,
      };
      this.chickenTemplate.Sprite.spriteSheet = this.spriteSheet;
      return newChickenObj.createNewComponents(this.chickenTemplate);
    }
  }

  return ChickenSpawnerComponent;
});
