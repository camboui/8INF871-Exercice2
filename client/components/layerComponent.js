define([
  'components/component',
], (
  Component
) => {
  'use strict';

  // # Classe *LayerComponent*
  // Ce composant représente un ensemble de sprites qui
  // doivent normalement être considérées comme étant sur un
  // même plan.
  class LayerComponent extends Component {
    // ## Méthode *display*
    // La méthode *display* est appelée une fois par itération
    // de la boucle de jeu.
    display( /*frame*/ ) {
      const layerSprites = this.listSprites();
      if (layerSprites.length === 0) {
        return;
      }
      const spriteSheet = layerSprites[0].spriteSheet;

      return Promise.resolve();
    }

    // ## Fonction *listSprites*
    // Cette fonction retourne une liste comportant l'ensemble
    // des sprites de l'objet courant et de ses enfants.
    listSprites() {
      const sprites = [];
      this.listSpritesRecursive(this.owner, sprites);
      return sprites;
    }

    listSpritesRecursive(obj, sprites) {
      if (!obj.active) {
        return;
      }

      const objSprite = obj.getComponent('Sprite');
      if (objSprite && objSprite.enabled) {
        sprites.push(objSprite);
      }
      Object.keys(obj.children).forEach((k) => {
        const child = obj.children[k];
        this.listSpritesRecursive(child, sprites);
      });
    }
  }

  return LayerComponent;
});
