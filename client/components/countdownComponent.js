define([
  'components/component',
  'eventTrigger',
  'graphicsAPI',
], (
  Component,
  EventTrigger,
  GraphicsAPI
) => {
  'use strict';

  // # Classe *CountdownComponent*
  // Ce composant affiche un décompte et envoie un événement
  // lorsqu'il a terminé.
  class CountdownComponent extends Component {
    // ## Méthode *create*
    // Cette méthode est appelée pour configurer le composant avant
    // que tous les composants d'un objet aient été créés.
    create(descr) {
      this.handler = new EventTrigger();
      this.sprites = descr.sprites;
      this.delay = descr.delay;
      this.spriteTemplate = descr.spriteTemplate;
      return this.preloadSprites();
    }

    // ## Méthode *setup*
    // Cette méthode est appelée pour configurer le composant après
    // que tous les composants d'un objet aient été créés.
    setup(descr) {
      if (descr.handler) {
        const tokens = descr.handler.split('.');
        this.handler.add(this.owner.getComponent(tokens[0]), tokens[1]);
      }

      this.index = -1;
      return Promise.resolve();
    }

    // ## Méthode *update*
    // À chaque itération, on vérifie si on a attendu le délai
    // désiré, et on change d'image si c'est le cas.
    update( /*frame*/ ) {
      const now = new Date();
      if ((now - this.shownTime) < this.delay) {
        return;
      }
      this.index++;
      if (this.current) {
        this.owner.removeChild(this.current);
        delete this.current;
      }

      let p = Promise.resolve();
      if (this.index >= this.sprites.length) {
        this.handler.trigger();
        this.enabled = false;
      } else {
        p = this.showImage();
      }
      return p;
    }

    // ## Méthode *preloadSprites*
    // Pré-charge les sprites pour qu'elles soient immédiatement
    // disponibles quand on voudra les afficher.
    preloadSprites() {
      const p = [];
      this.sprites.forEach((s) => {
        p.push(GraphicsAPI.preloadImage(s));
      });
      return Promise.all(p);
    }

    // ## Méthode *showImage*
    // Affiche une image parmi les sprites désirées, si il y en
    // a encore à afficher.
    showImage() {
      this.shownTime = new Date();
      return this.showNamedImage(this.sprites[this.index]);
    }

    // ## Méthode *showNamedImage*
    // Affiche une image, directement à partir de son nom
    showNamedImage(textureName) {
      const SceneObject = require('sceneObject');
      this.current = new SceneObject();
      this.owner.addChild('sprite', this.current);
      this.spriteTemplate.RawSprite.texture = textureName;
      return this.current.createNewComponents(this.spriteTemplate);
    }
  }

  return CountdownComponent;
});
