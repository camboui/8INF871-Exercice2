define([
  'components/component',
], (
  Component
) => {
  'use strict';

  const vec3 = window.vec3;
  let dropId = 0;

  // # Classe *ChickenComponent*
  // Ce composant exécute la logique d'un poulet...
  class ChickenComponent extends Component {
    // ## Méthode *create*
    // Cette méthode est appelée pour configurer le composant avant
    // que tous les composants d'un objet aient été créés.
    create(descr) {
      this.dropped = false;
      this.distance = 0;
      this.target = vec3.fromValues(descr.target.x, descr.target.y, 0);
      this.rupeeTemplate = descr.rupeeTemplate;
      this.heartAttackChance = descr.heartAttackChance;
      this.heartTemplate = descr.heartTemplate;
      this.attack = descr.attack;
      return Promise.resolve();
    }

    // ## Méthode *setup*
    // Cette méthode détermine la trajectoire du poulet et configure
    // la sprite à utiliser pour son affichage.
    setup( /*descr*/ ) {
      const position = this.owner.getComponent('Position');
      this.velocity = vec3.create();
      vec3.subtract(this.velocity, this.target, position.local);
      vec3.normalize(this.velocity, this.velocity);
      vec3.scale(this.velocity, this.velocity, Math.random() * 3 + 2);
      const sprite = this.owner.getComponent('Sprite');
      const dir = (this.velocity[0] > 0) ? 'R' : 'L';
      sprite.spriteName = `C${dir}`;
    }

    // ## Méthode *update*
    // La méthode *update* met à jour la position du poulet. Si il
    // a atteint sa cible, il laisse tomber un rubis. Le poulet est
    // automatiquement détruit si il a parcouru une distance trop
    // grande (il sera déjà en dehors de l'écran).
    update( /*frame*/ ) {
      const position = this.owner.getComponent('Position');
      const targetDistanceSq = vec3.squaredDistance(this.target, position.local);
      position.translate(this.velocity);
      const newTargetDistanceSq = vec3.squaredDistance(this.target, position.local);
      if ((!this.dropped) && (newTargetDistanceSq > targetDistanceSq)) {
        this.drop(this.rupeeTemplate, dropId++);
      }

      this.distance += vec3.length(this.velocity);
      if (this.distance > 500) {
        this.owner.parent.removeChild(this.owner);
      }
    }

    // ## Méthode *drop*
    // Cette méthode instancie un objet au même endroit que le
    // poulet.
    drop(template, id) {
      const SceneObject = require('sceneObject');
      const newObj = new SceneObject();
      this.owner.parent.addChild(id, newObj);
      this.dropped = true;

      const position = this.owner.getComponent('Position');

      template.Position = position.local;
      template.Sprite.spriteSheet = this.owner.getComponent('Sprite').spriteSheet;

      return newObj.createNewComponents(template);
    }

    // ## Méthode *onAttack*
    // Cette méthode est appelée quand le poulet se fait attaquer
    onAttack() {
      const toDrop = (Math.random() < this.heartAttackChance) ? this.heartTemplate : this.rupeeTemplate;
      this.drop(toDrop, dropId++);

      const collider = this.owner.getComponent('Collider');
      collider.enabled = false;
      this.velocity[0] *= -1;
      const sprite = this.owner.getComponent('Sprite');
      const dir = (this.velocity[0] > 0) ? 'R' : 'L';
      sprite.spriteName = `C${dir}`;
    }
  }

  return ChickenComponent;
});
