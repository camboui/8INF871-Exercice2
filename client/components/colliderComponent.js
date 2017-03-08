define([
  'components/component',
  'components/rectangle',
], (
  Component,
  Rectangle
) => {
  'use strict';


  /*""À l’aide du projet ChickenDodge, disponible via les exercices #2 et #3, améliorer la gestion de collisions rudimentaire de la classe ColliderComponent.

  Vous devriez implémenter les premières étapes de vérifications vues en classe:

  - drapeaux et masques
  - subdivision spatiales
  - rectangles englobants alignés aux axes"*/

  // ## Variable *colliders*
  // On conserve ici une référence vers toutes les instances
  // de cette classe, afin de déterminer si il y a collision.
  //Divise la carte en 50*50 cases

  const xDivider = 20;
  const yDivider = 20;
  const grid = new Array (xDivider);
  const window = document.getElementById('canvas');
  const cellDim = {x : window.width/xDivider, y :window.height/yDivider};
  // # Classe *ColliderComponent*
  // Ce composant est attaché aux objets pouvant entrer en
  // collision.
  class ColliderComponent extends Component {
    // ## Méthode *create*
    // Cette méthode est appelée pour configurer le composant avant
    // que tous les composants d'un objet aient été créés.
    create(descr) {

      //Initialiser la grille avec des cellules vides
      if(grid[0] == undefined){
        const Scene = require('scene');
        const target = Scene.current.findObject('Camera');
        console.log(target);
        for(var i = 0 ; i < grid.length ; i++){
          grid[i] = new Array(yDivider);
          for(var j = 0 ; j < grid[0].length ; j++){
            grid[i][j] = [];
          }
        }
      }

      this.occupyingCells = [];
      this.flag = descr.flag;
      this.mask = descr.mask;
      this.size = descr.size;
      this.active = true;
      //console.log(this.size);

      return Promise.resolve();
    }

    // ## Méthode *setup*
    // Si un type *handler* est défini, on y appellera une méthode
    // *onCollision* si une collision est détectée sur cet objet.
    // On stocke également une référence à l'instance courante dans
    // le tableau statique *colliders*.
    setup(descr) {
      if (descr.handler) {
        this.handler = this.owner.getComponent(descr.handler);
      }
      // Les poulets ne sont jamais supprimés après ?
      return Promise.resolve();
    }

    // ## Méthode *update*
    // À chaque itération, on vérifie si l'aire courante est en
    // intersection avec l'aire de chacune des autres instances.
    // Si c'est le cas, et qu'un type *handler* a été défini, on
    // appelle sa méthode *onCollision* avec l'objet qui est en
    // collision.

    update( /*frame*/ ) {

      var topLeftCell = {x : Math.trunc(this.area.xMin/cellDim.x), y:Math.trunc(this.area.yMin/cellDim.y)};
      var bottomRightCell = {x : Math.trunc(this.area.xMax/cellDim.x), y:Math.trunc(this.area.yMax/cellDim.y)};

      //On enleve les anciennes traces de l'objet dans les cellules
      if(this.occupyingCells.length!=0)
      {
        this.occupyingCells.forEach((cell) => {
          var deleteIndex = grid[cell.x][cell.y].indexOf(this);
          grid[cell.x][cell.y].splice(deleteIndex, 1);
        });
        this.occupyingCells =[];
      }

      //Si on est bien dans le tableau
      if(this.inBounds(topLeftCell) && this.inBounds(bottomRightCell))
      {
        //Le collider peut être présent dans plusieurs cellules à la fois
        for(var i =  topLeftCell.x ; i <= bottomRightCell.x ; i++){
          for(var j = topLeftCell.y ; j <= bottomRightCell.y ; j++){
            grid[i][j].push(this);
            this.occupyingCells.push({x : i, y:j});
          }
        }
        //console.log(this.occupyingCells)
      }

      if (!this.handler) {
        return;
      }

      //Checker les collisions avec tous les objets qui ont des cellules communes
      const area = this.area;
      var potentialColliders = this.getCollidersInCells();

      potentialColliders.forEach((c) => {
        if (this.isUselessObject(c)) {
          return;
        }
        // vérifie les polygones anglobants
        if (area.intersectsWith(c.area)) {
          //this.logCollision("COLLISION",c);
          this.handler.onCollision(c);
        }
      });

    }

    getCollidersInCells()
    {
      var tab = [];
      this.occupyingCells.forEach((cell) => {
        tab = tab.concat(grid[cell.x][cell.y]);
      });
      return tab;
    }

    inBounds(arrayPos){
      return (arrayPos.x >=0 && arrayPos.x <yDivider && arrayPos.y >=0 && arrayPos.y <xDivider);
    }

    isUselessObject(otherCollider)
    {
      /*On ne teste que les objets intéressants, à savoir
      les objets actifs
      dont le composant est actif
      et dont le masque autorise la collision avec le flag de l'objet*/
      var res =  (otherCollider === this ||
        !otherCollider.enabled ||
        !otherCollider.owner.active ||
        !(this.mask & otherCollider.flag));

        //  if(!res) {this.logCollision("Potential interaction",otherCollider);}
        return res;
      }

      logCollision(message, otherCollider){
        const rupee = otherCollider.owner.getComponent('Rupee');
        const heart = otherCollider.owner.getComponent('Heart');
        const chicken = otherCollider.owner.getComponent('Chicken');

        var text =  message+" between " + this.owner.getComponent('Player').name + " and ";
        if (rupee) {
          text+= "rupee";
        }
        if (heart) {
          text+= "heart";
        }
        if (chicken) {
          text+= "chicken";
        }
        console.log(text);
      }

      // ## Propriété *area*
      // Cette fonction calcule l'aire courante de la zone de
      // collision, après avoir tenu compte des transformations
      // effectuées sur les objets parent.
      get area() {
        const position = this.owner.getComponent('Position').worldPosition;
        return new Rectangle({
          x: position[0],
          y: position[1],
          width: this.size.w,
          height: this.size.h,
        });
      }
    }

    return ColliderComponent;
  });
