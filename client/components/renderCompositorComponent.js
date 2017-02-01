define([
  'components/compositorComponent',
  'graphicsAPI',
], (
  CompositorComponent,
  GraphicsAPI
) => {
  'use strict';

  let GL = undefined;

  // # Classe *RenderCompositorComponent*
  // Ce compositeur affiche la texture à l'écran. Il devrait être le dernier
  // de la liste.
  class RenderCompositorComponent extends CompositorComponent {
    // ## Méthode *setup*
    // Charge les shaders et configure le composant
    setup(descr) {
      GL = GraphicsAPI.context;

      return super.setup(descr)
        .then(() => {
          this.positionAttrib = GL.getAttribLocation(this.shader, 'aPosition');
          this.uSampler = GL.getUniformLocation(this.shader, 'uSampler');

          const verts = [1, 1, -1, 1, -1, -1, -1, -1, 1, -1, 1, 1];
          this.screenQuad = GL.createBuffer();
          GL.bindBuffer(GL.ARRAY_BUFFER, this.screenQuad);
          GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(verts), GL.STATIC_DRAW);
          this.screenQuad.itemSize = 2;
          this.screenQuad.numItems = 6;
        });
    }

    // ## Méthode *compose*
    // Cette méthode est appelée afin d'effectuer le rendu final.
    compose(texture) {
      GL.bindFramebuffer(GL.FRAMEBUFFER, null);

      GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

      GL.useProgram(this.shader);

      GL.bindBuffer(GL.ARRAY_BUFFER, this.screenQuad);
      GL.enableVertexAttribArray(this.positionAttrib);
      GL.vertexAttribPointer(this.positionAttrib, this.screenQuad.itemSize, GL.FLOAT, false, 0, 0);

      GL.activeTexture(GL.TEXTURE0);
      GL.bindTexture(GL.TEXTURE_2D, texture);
      GL.uniform1i(this.uSampler, 0);

      GL.drawArrays(GL.TRIANGLES, 0, this.screenQuad.numItems);
      GL.disableVertexAttribArray(this.positionAttrib);
    }
  }

  return RenderCompositorComponent;
});
