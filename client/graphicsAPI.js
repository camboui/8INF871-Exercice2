define(() => {
  'use strict';

  // # Fonctions d'affichage
  // Méthodes nécessaires pour charger et afficher
  // des images à l'écran.

  // ## Variable *canvas*
  // Représente l'élément HTML où est rendu le jeu
  let canvas = undefined;

  // ## Variable *ctx*
  // Représente le contexte de rendu, où s'exécutent
  // les commandes pour contrôller l'affichage
  let ctx = undefined;

  // ## Variable *images*
  // Comprend une liste des images pré-chargées
  const images = {};

  // ## Méthode *init*
  // La méthode d'initialisation prend en paramètre le nom d'un objet de
  // type *canvas* de la page web où dessiner. On y extrait
  // et conserve alors une référence vers le contexte de rendu 3D.
  // Pour des fins de déboggage, on substitue ici les fonctions de
  // rendu par des fonctions qui affichent des informations détaillées
  // si leurs paramètres ne sont pas corrects.
  function init(canvasId) {
    module.canvas = canvas = document.getElementById(canvasId);
    const gl = canvas.getContext('webgl');
    if (!gl) {
      throw new Error('Impossible de récupérer le contexte WebGL!');
    }
    module.context = ctx = window.WebGLDebugUtils.makeDebugContext(gl);
    return ctx;
  }

  // ## Méthode *preloadImage*
  // Cette méthode instancie dynamiquement un objet du navigateur
  // afin qu'il la charge. Ce chargement se faisant de façon
  // asynchrone, on crée une [promesse](http://bluebirdjs.com/docs/why-promises.html)
  // qui sera [résolue](http://bluebirdjs.com/docs/api/new-promise.html)
  // lorsque l'image sera chargée.
  function preloadImage(name) {
    if (images[name]) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const imgDownload = new Image();
      imgDownload.onload = () => {
        images[name] = imgDownload;
        resolve();
      };
      imgDownload.src = name;
    });
  }

  // ## Méthode *loadImage*
  // Attends le téléchargement d'une image et la retourne dans
  // une promesse.
  function loadImage(name) {
    return preloadImage(name)
      .then(() => {
        return images[name];
      });
  }

  // ## Méthode *requestFullScreen*
  // Méthode utilitaire pour mettre le canvas en plein écran.
  // Il existe plusieurs méthodes selon le navigateur, donc on
  // se doit de vérifier l'existence de celles-ci avant de les
  // appeler.
  //
  // À noter qu'un script ne peut appeler le basculement en plein
  // écran que sur une action explicite du joueur.
  function requestFullScreen() {
    const method = canvas.requestFullScreen || canvas.webkitRequestFullScreen || canvas.mozRequestFullScreen || function() {};
    method.apply(canvas);
  }

  // Méthodes exportées du module `graphicsAPI`.
  // On la met dans une variable car on désire y ajouter
  // les propriétés `canvas` et `context` lors de l'appel
  // de la méthode d'initialisation.
  const module = {
    init: init,
    loadImage: loadImage,
    preloadImage: preloadImage,
    requestFullScreen: requestFullScreen,
  };

  return module;
});
