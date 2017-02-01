define(() => {
  'use strict';

  // ## Classe *Rectangle*
  // Classe pour représenter un rectangle.
  class Rectangle {
    // ### Constructeur de la classe *Rectangle*
    // Le constructeur de cette classe prend en paramètre un
    // objet pouvant définir soit le centre et la taille du
    // rectangle (`x`, `y`, `width` et `height`) ou les côtés
    // de celui-ci (`xMin`, `xMax`, `yMin` et `yMax`).
    constructor(descr) {
      let ref;
      this.xMin = (ref = descr.xMin) !== undefined ? ref : (descr.x - descr.width / 2);
      this.xMax = (ref = descr.xMax) !== undefined ? ref : (descr.x + descr.width / 2);
      this.yMin = (ref = descr.yMin) !== undefined ? ref : (descr.y - descr.height / 2);
      this.yMax = (ref = descr.yMax) !== undefined ? ref : (descr.y + descr.height / 2);
    }

    // ### Fonction *intersectsWith*
    // Cette fonction retourne *vrai* si ce rectangle et celui
    // passé en paramètre se superposent.
    intersectsWith(other) {
      return !(
        (this.xMin >= other.xMax) ||
        (this.xMax <= other.xMin) ||
        (this.yMin >= other.yMax) ||
        (this.yMax <= other.yMin)
      );
    }
  }

  return Rectangle;
});
