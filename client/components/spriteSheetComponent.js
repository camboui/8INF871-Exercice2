define([
  'components/textureComponent',
  'graphicsAPI',
  'utils',
], (
  TextureComponent,
  GraphicsAPI,
  Utils
) => {
  'use strict';

  // # Classe *SpriteSheetComponent*
  // Ce composant comprend les fonctions nécessaires à l'affichage
  // de sprites.
  class SpriteSheetComponent extends TextureComponent {
    // ## Méthode *create*
    create(descr) {
      // On conserve une référence vers le canvas
      this.canvas = GraphicsAPI.canvas;

      // On charge l'image et les shaders
      return super.create(descr)
        .then(() => {
          // On charge ensuite le fichier de description de l'image,
          // qui contient l'emplacement et les dimensions des sprites
          // contenues sur la feuille.

          return Utils.loadJSON(descr.description);
        })
        .then((rawDescription) => {
          this.parseDescription(rawDescription);
        });
    }

    // ## Méthode *parseDescription*
    // Cette méthode extrait la description de la feuille de sprite.
    parseDescription(rawDescription) {
      this.sprites = rawDescription.frames;
      Object.keys(rawDescription.frames).forEach((k) => {
        const v = rawDescription.frames[k];
        v.uv = this.normalizeUV(v.frame, rawDescription.meta.size);
      });
    }

    // ## Fonction *normalizeUV*
    // La fonction *normalizeUV* retourne la position relative, entre
    // 0 et 1, des rectangles comportant les sprites de la feuille.
    normalizeUV(frame, size) {
      return {
        x: frame.x / size.w,
        y: frame.y / size.h,
        w: frame.w / size.w,
        h: frame.h / size.h,
      };
    }
  }

  return SpriteSheetComponent;
});
