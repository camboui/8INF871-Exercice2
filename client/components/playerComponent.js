define([
  'components/component',
  'eventTrigger',
], (
  Component,
  EventTrigger
) => {
  'use strict';

  const vec3 = window.vec3;

  // # Classe *PlayerComponent*
  // Ce composant représente le comportement d'un joueur.
  class PlayerComponent extends Component {
    // ## Méthode *create*
    // Cette méthode est appelée pour configurer le composant avant
    // que tous les composants d'un objet aient été créés.
    create(descr) {
      this.deadEvent = new EventTrigger();

      this.name = descr.name;
      this.facing = 'F';
      this.prefix = descr.prefix;
      this.gameArea = descr.gameArea;
      this.isAttacking = false;
      this.isMoving = false;
      this.isDead = false;
      this.isHurt = false;
      this.isInvulnerable = false;
      this.invulnerableDuration = descr.invulnerableDuration;
      this.hurtDuration = descr.hurtDuration;
      this.hurtMotion = descr.hurtMotion;
      return Promise.resolve();
    }

    // ## Méthode *setup*
    // Cette méthode configure le composant. Elle crée une instance
    // de sprite, et y configure une fonction de rappel lorsque
    // l'animation d'attaque est terminée.
    setup(descr) {
      this.input = this.findComponent(descr.input);
      this.spriteSheet = this.findComponent(descr.spriteSheet);
      this.score = this.findComponent(descr.score);
      this.life = this.findComponent(descr.life);
      this.life.deadEvent.add(this, this.onDead);
      this.life.hurtEvent.add(this, this.onHurt);

      descr.onHurtEnable.forEach((item) => {
        const component = this.findComponent(item);
        this.life.hurtEvent.add(this, () => {
          component.enabled = true;
        });
      });

      this.sprite = this.owner.addComponent('Sprite');
      const spriteDescr = {
        spriteSheet: this.spriteSheet,
      };
      return this.sprite.create(spriteDescr)
        .then(() => {
          this.sprite.animationEndedEvent.push(() => {
            this.isAttacking = false;
            this.sprite.frameSkip = 2;
            this.updateSprite();
            this.sprite.updateMesh();
          });
          this.updateSprite();
          return this.sprite.setup(spriteDescr);
        })
        .then(() => {
          this.sprite.__ready = true;
        });
    }

    // ## Méthode *onDead*
    // Déclenchée lorsque le joueur est mort
    onDead() {
      this.isDead = true;
      this.deadEvent.trigger();
    }

    // ## Méthode *onHurt*
    // Déclenchée lorsque le joueur est blessé
    onHurt() {
      const collider = this.owner.getComponent('Collider');

      this.isHurt = true;
      setTimeout(() => {
        this.isHurt = false;
      }, this.hurtDuration);

      this.isInvulnerable = true;
      collider.enabled = false;
      setTimeout(() => {
        this.isInvulnerable = false;
        collider.enabled = true;
      }, this.invulnerableDuration);
    }

    // ## Méthode *update*
    // Cette méthode récupère les entrées du joueur, effectue les
    // déplacements appropriés, déclenche l'état d'attaque et ajuste
    // la sprite du joueur.
    update(frame) {
      let delta = undefined;
      if (this.isDead) {
        delta = this.updateDead();
      } else if (this.isHurt) {
        delta = this.updateHurt();
      } else {
        delta = this.updateStandard();
      }

      const visible = (!this.isInvulnerable) || (frame % 2);
      this.sprite.enabled = visible;

      const position = this.owner.getComponent('Position');
      vec3.scale(delta, delta, 3);
      position.translate(delta);
      position.clamp(this.gameArea.x, this.gameArea.x + this.gameArea.w, this.gameArea.y, this.gameArea.y + this.gameArea.h);
    }

    // ## Méthode *updateDead*
    // Met à jour le joueur quand il est mort
    updateDead() {
      this.isMoving = false;
      this.isAttacking = false;
      this.sprite.isAnimated = false;
      this.sprite.spriteName = `${this.prefix}D`;
      this.sprite.updateMesh();

      const collider = this.owner.getComponent('Collider');
      collider.enabled = false;
      return vec3.create();
    }

    // ## Méthode *updateHurt*
    // Met à jour le joueur quand il est blessé
    updateHurt() {
      this.isMoving = false;
      this.isAttacking = false;
      this.sprite.isAnimated = false;
      this.sprite.spriteName = `${this.prefix}H${this.facing}`;
      this.sprite.updateMesh();

      const delta = vec3.create();
      switch (this.facing) {
        case 'B':
          delta[1] = this.hurtMotion;
          break;
        case 'F':
          delta[1] = -this.hurtMotion;
          break;
        case 'L':
          delta[0] = this.hurtMotion;
          break;
        case 'R':
          delta[0] = -this.hurtMotion;
          break;
      }
      return delta;
    }

    // ## Méthode *updateStandard*
    // Met à jour le mouvement normal du joueur
    updateStandard() {
      if (!this.isAttacking && this.input.getKey('attack')) {
        this.isAttacking = true;
        this.sprite.animationFrame = 1;
        this.sprite.frameSkip = 1;
      }

      const delta = vec3.create();

      if (this.input.getKey('up')) {
        delta[1]--;
        this.facing = 'B';
      }
      if (this.input.getKey('down')) {
        delta[1]++;
        this.facing = 'F';
      }
      if (this.input.getKey('left')) {
        delta[0]--;
        this.facing = 'L';
      }
      if (this.input.getKey('right')) {
        delta[0]++;
        this.facing = 'R';
      }

      this.isMoving = vec3.length(delta) > 0;

      this.updateSprite();
      this.sprite.updateMesh();

      return delta;
    }

    // ## Méthode *updateSprite*
    // Choisi la sprite appropriée selon le contexte.
    updateSprite() {
      this.sprite.isAnimated = this.isMoving || this.isAttacking;
      const mod = this.isAttacking ? 'A' : 'M';
      const frame = this.sprite.isAnimated ? '' : '1';

      this.sprite.spriteName = `${this.prefix}${mod}${this.facing}${frame}`;
    }

    // ## Méthode *onCollision*
    // Cette méthode est appelée par le *CollisionComponent*
    // lorsqu'il y a collision entre le joueur et un objet pertinent.
    // Si cet objet est un rubis, on le récupère et on incrémente
    // le score, si c'est un poulet, on le détruit si on est en
    // état d'attaque, sinon on soustrait le score et on désactive
    // ce poulet.
    onCollision(otherCollider) {
      const obj = otherCollider.owner;
      const rupee = obj.getComponent('Rupee');
      const heart = obj.getComponent('Heart');
      const chicken = obj.getComponent('Chicken');

      if (rupee) {
        this.score.value += rupee.value;
        obj.active = false;
        obj.parent.removeChild(obj);
      }
      if (heart) {
        this.life.value += heart.heal;
        obj.active = false;
        obj.parent.removeChild(obj);
      }
      if (chicken) {
        if (this.isAttacking) {
          chicken.onAttack();
        } else {
          this.life.value -= chicken.attack;
        }
      }
    }
  }

  return PlayerComponent;
});
