define([
  'components/component',
  'components/textureComponent',
  'graphicsAPI',
], (
  Component,
  TextureComponent,
  GraphicsAPI
) => {
  'use strict';

  var GL = undefined ;

  // # Classe *LayerComponent*
  // Ce composant représente un ensemble de sprites qui
  // doivent normalement être considérées comme étant sur un
  // même plan.
  class LayerComponent extends Component {
    // ## Méthode *display*
    // La méthode *display* est appelée une fois par itération
    // de la boucle de jeu.

    display( /*frame*/ ) {
      const layerSprites = this.listSprites();
      // console.log(this.listSprites());
      if (layerSprites.length === 0 || !layerSprites[0].spriteSheet) {
        return;
      }
      GL = GraphicsAPI.context;


      const spriteSheet = layerSprites[0].spriteSheet;
	  
      this.indexBuffer = layerSprites[0].indexBuffer;
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer);


      this.vertexBuffer = layerSprites[0].vertexBuffer;

      GL.bindBuffer(GL.ARRAY_BUFFER, this.vertexBuffer);

      this.indices = new Uint16Array(layerSprites.length*6);

      this.verticesTab = [];
      var i = 0;
      Object.keys(layerSprites).forEach((k) => {

        if(layerSprites[k].vertices){
          Object.keys(layerSprites[k].vertices).forEach((key) => {
            this.verticesTab.push(layerSprites[k].vertices[key]);
          });
          this.indices.set([i, i+1, i+2, i+2, i+3, i],k*6);
          i = i + 4;
        }
      });

      this.vertices = Float32Array.from(this.verticesTab);
	  
      GL.bufferData(GL.ARRAY_BUFFER, this.vertices, GL.DYNAMIC_DRAW);
      GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, this.indices, GL.DYNAMIC_DRAW);


      spriteSheet.bind();
      GL.drawElements(GL.TRIANGLES,layerSprites.length*6, GL.UNSIGNED_SHORT, 0);
      spriteSheet.unbind();
      return Promise.resolve();
    }

    // ## Fonction *listSprites*
    // Cette fonction retourne une liste comportant l'ensemble
    // des sprites de l'objet courant et de ses enfants.
    listSprites() {
      const sprites = [];
      this.listSpritesRecursive(this.owner, sprites);
      return sprites;
    }

    listSpritesRecursive(obj, sprites) {
      if (!obj.active) {
        return;
      }
	  
      const objSprite = obj.getComponent('Sprite');
      if (objSprite && objSprite.enabled) {
        sprites.push(objSprite);
      }
      Object.keys(obj.children).forEach((k) => {
        const child = obj.children[k];
        this.listSpritesRecursive(child, sprites);
      });
    }
  }

  return LayerComponent;
});
