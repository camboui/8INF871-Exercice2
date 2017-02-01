(function() {
  'use strict';

  require(['main'], (main) => {
    const config = {
      canvasId: 'canvas',
    };

    main.run(config, 'scenes/play.json');
  });

})();
