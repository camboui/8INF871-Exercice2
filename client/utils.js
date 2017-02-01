define(() => {
  'use strict';

  // # Fonctions utilitaires
  // Fonctions utilitaires pour des méthodes génériques qui n'ont
  // pas de lien direct avec le jeu.

  // ## Fonction *requestAnimationFrame*
  // Encapsuler dans une promesse la méthode qui attend à 60Hz..
  function requestAnimationFrame() {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000 / 60);
    });
  }

  // ## Fonction *iterate*
  // Exécute une itération de la boucle de jeu, en attendant
  // après chaque étape du tableau `actions`.
  function iterate(actions, frame) {
    let p = Promise.resolve();
    actions.forEach((a) => {
      p = p.then(() => {
        return a(frame);
      });
    });
    return p;
  }

  // ## Fonction *loop*
  // Boucle de jeu simple, on lui passe un tableau de fonctions
  // à exécuter à chaque itération. La boucle se rappelle elle-même
  // après avoir attendu à 60Hz.
  function loop(actions, frame = 0) {
    const nextLoop = loop.bind(this, actions, frame + 1);
    return iterate(actions, frame)
      .then(requestAnimationFrame)
      .then(nextLoop);
  }

  // ## Fonction *inRange*
  // Méthode utilitaire retournant le booléen *vrai* si une
  // valeur se situe dans un interval.
  function inRange(x, min, max) {
    return (min <= x) && (x <= max);
  }

  // ## Fonction *clamp*
  // Méthode retournant la valeur passée en paramètre si elle
  // se situe dans l'interval spécifié, ou l'extrémum correspondant
  // si elle est hors de l'interval.
  function clamp(x, min, max) {
    return Math.min(Math.max(x, min), max);
  }

  // ## Fonction *loadAsync*
  // Fonction qui charge un fichier de façon asynchrone,
  // via une [promesse](http://bluebirdjs.com/docs/why-promises.html)
  function loadAsync(url, mime, responseType) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.addEventListener('error', reject);
      xhr.addEventListener('load', () => {
        resolve(xhr);
      });
      if (mime) {
        xhr.overrideMimeType(mime);
      }
      xhr.open('GET', url);
      if (responseType) {
        xhr.responseType = responseType;
      }
      xhr.send(null);
    });
  }

  // ## Fonction *loadJSON*
  // Fonction qui charge un fichier JSON de façon asynchrone,
  // via une [promesse](http://bluebirdjs.com/docs/why-promises.html)
  function loadJSON(url) {
    return loadAsync(url)
      .then((xhr) => {
        return JSON.parse(xhr.responseText);
      });
  }

  // Méthodes exportées du module `utils`
  return {
    loop: loop,
    inRange: inRange,
    clamp: clamp,
    loadAsync: loadAsync,
    loadJSON: loadJSON,
  };
});
