define([
  'components/component',
  'utils',
], (
  Component,
  Utils
) => {
  'use strict';

  // # Classe *BackgroundLoaderComponent*
  // Cette classe instancie des sprites à partir d'un fichier
  // de description. Ces sprites sont positionnés dans une grille,
  // mais peuvent elle-mêmes être de tailles diverses.
  class BackgroundLoaderComponent extends Component {
    // ## Méthode *create*
    // Cette méthode est appelée pour configurer le composant avant
    // que tous les composants d'un objet aient été créés.
    create(descr) {
      this.entryMap = descr.entryMap;
      this.scale = descr.scale;
      return Promise.resolve();
    }

    // ## Méthode *setup*
    // Cette méthode est responsable d'instancier les différents
    // objets contenant des sprites. La promesse n'est résolue que
    // lorsque toutes les sprites ont été créées.
    setup(descr) {
      const SceneObject = require('sceneObject');
      const spriteSheet = this.findComponent(descr.spriteSheet);

      return Utils.loadAsync(descr.description, 'text/plain')
        .then((content) => {
          const p = [];

          const lines = content.responseText.split(/\r?\n/);
          for (let row = 0; row < lines.length; ++row) {
            const chars = lines[row].split('');
            for (let col = 0; col < chars.length; ++col) {
              const char = chars[col];
              const entry = this.entryMap[char];
              if (!entry) {
                continue;
              }
              const newSpriteObj = new SceneObject();
              this.owner.addChild(`${col}-${row}`, newSpriteObj);
              const compP = newSpriteObj.createNewComponents({
                Position: {
                  x: col * this.scale,
                  y: row * this.scale,
                  z: row * 0.01,
                },
                Sprite: {
                  spriteSheet: spriteSheet,
                  spriteName: entry.spriteName,
                  isAnimated: entry.isAnimated,
                  frameSkip: entry.frameSkip,
                },
              });
              p.push(compP);
            }
          }

          return Promise.all(p);
        });
    }
  }

  return BackgroundLoaderComponent;
});
