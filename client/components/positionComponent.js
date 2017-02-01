define([
  'components/component',
], (
  Component
) => {
  'use strict';

  const vec3 = window.vec3;

  // # Classe *PositionComponent*
  // Ce composant représente une position dans l'espace, via un
  // tableau de nombres flottants issu d'une bibliothèque externe.
  class PositionComponent extends Component {
    // ## Méthode *create*
    // Cette méthode est appelée pour configurer le composant avant
    // que tous les composants d'un objet aient été créés. Les valeurs
    // omises prennent la valeur 0 par défaut.
    create(descr) {
      let ref;
      const x = (ref = descr.x) !== undefined ? ref : ((ref = descr[0]) !== undefined ? ref : 0);
      const y = (ref = descr.y) !== undefined ? ref : ((ref = descr[1]) !== undefined ? ref : 0);
      const z = (ref = descr.z) !== undefined ? ref : ((ref = descr[2]) !== undefined ? ref : 0);
      this.local = vec3.fromValues(x, y, z);
      return Promise.resolve();
    }

    // ## Propriété *worldPosition*
    // Cette propriété combine les transformations des parents afin
    // de trouver la position absolue de l'objet dans le monde.
    get worldPosition() {
      const pos = vec3.clone(this.local);
      const parentPosition = this.owner.parent ? this.owner.parent.getComponent('Position') : undefined;
      if (parentPosition) {
        const parentWorld = parentPosition.worldPosition;
        vec3.add(pos, pos, parentWorld);
      }
      return pos;
    }

    // ## Méthode *translate*
    // Applique une translation sur l'objet.
    translate(delta) {
      vec3.add(this.local, this.local, delta);
    }

    // ## Méthode *clamp*
    // Cette méthode limite la position de l'objet dans une zone
    // donnée.
    clamp(xMin = Number.MIN_VALUE, xMax = Number.MAX_VALUE, yMin = Number.MIN_VALUE, yMax = Number.MAX_VALUE, zMin = Number.MIN_VALUE, zMax = Number.MAX_VALUE) {
      if (this.local[0] < xMin) {
        this.local[0] = xMin;
      }
      if (this.local[0] > xMax) {
        this.local[0] = xMax;
      }
      if (this.local[1] < yMin) {
        this.local[1] = yMin;
      }
      if (this.local[1] > yMax) {
        this.local[1] = yMax;
      }
      if (this.local[2] < zMin) {
        this.local[2] = zMin;
      }
      if (this.local[2] > zMax) {
        this.local[2] = zMax;
      }
    }
  }

  return PositionComponent;
});
