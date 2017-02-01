define([
  'components/component',
], (
  Component
) => {
  'use strict';

  // # Classe *TextSpriteComponent*
  class TextSpriteComponent extends Component {
    // ## Méthode *create*
    // Cette méthode est appelée pour configurer le composant avant
    // que tous les composants d'un objet aient été créés.
    create(descr) {
      this.sprites = [];
      this._text = [];
      this.align = descr.align;
      return Promise.resolve();
    }

    // ## Méthode *setup*
    // Cette méthode conserve la feuille de sprite comportant
    // les glyphes du texte, et met le texte à jour.
    setup(descr) {
      this.spriteSheet = this.findComponent(descr.spriteSheet);
      return this.updateTextSprites();
    }

    // ## Propriété *text*
    // Cette propriété met à jour le texte affiché. On force tout
    // d'abord le paramètre à un type de chaîne de caractères,
    // et on ne met à jour que si le texte a changé.
    set text(text) {
      this.array = String(text).split('');
    }

    // ## Propriété *array*
    // Cette propriété met à jour le texte affiché, à partir d'un
    // tableau d'identifiants de sprites.
    set array(array) {
      let changed = array.length !== this._text.length;
      if (!changed) {
        for (let i = 0; i < array.length; ++i) {
          if (array[i] !== this._text[i]) {
            changed = true;
          }
        }
      }

      if (!changed) {
        return;
      }
      this._text = array;
      this.updateTextSprites();
    }

    // ## Méthode *updateTextSprites*
    // On crée de nouvelles sprites pour chaque caractère de la
    // chaîne, on les positionne correctement, et on détruit les
    // anciens sprites.
    updateTextSprites() {
      const SceneObject = require('sceneObject');

      const oldSprites = this.sprites;
      this.sprites = [];

      let offset = 0;
      const dir = (this.align === 'left') ? 1 : -1;
      let text = this._text.slice();
      if (this.align === 'right') {
        text = text.reverse();
      }

      const p = [];
      text.forEach((c, index) => {
        if (!this.spriteSheet.sprites[c]) {
          return;
        }

        const newSpriteObj = new SceneObject();
        this.sprites.push(newSpriteObj);
        this.owner.addChild(`${this._text}_${index}`, newSpriteObj);

        const x = offset;
        offset += this.spriteSheet.sprites[c].sourceSize.w * dir;

        p.push(newSpriteObj.createNewComponents({
          Sprite: {
            spriteSheet: this.spriteSheet,
            isAnimated: false,
            spriteName: c,
          },
          Position: {
            x: x,
          }
        }));
      });

      return Promise.all(p)
        .then(() => {
          oldSprites.forEach((s) => {
            s.parent.removeChild(s);
          });
        });
    }
  }

  return TextSpriteComponent;
});
