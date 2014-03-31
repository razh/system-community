/*globals Box*/
(function( window, document, undefined ) {
  'use strict';

  function addTestShading() {
    var styleSheet = document.styleSheets[0];

    // Lightness order (descending).
    [
      'top', 'front', 'right',
      'back', 'left', 'bottom'
    ].forEach(function( direction, index, array ) {
      var lightness = 1 - ( index / array.length );
      lightness *= 100;

      var backgroundColor = 'hsla(0, 0%, ' + lightness + '%, 0.5);';

      var rule = '{' +
        'background-color: ' + backgroundColor +
      '}';

      // Append rules.
      styleSheet.insertRule( '.' + direction + ' ' + rule, styleSheet.cssRules.length );
    });
  }

  function drawDebugTexture( ctx ) {
    var width = ctx.canvas.width,
        height = ctx.canvas.height;

    var cellWidth = 16,
        cellHeight = 16;

    var xCount = Math.ceil( width / cellWidth ),
        yCount = Math.ceil( height / cellHeight );

    var i, j;
    var x, y;
    for ( i = 0; i < yCount; i++ ) {
      y = i * cellHeight;
      for( j = 0; j < xCount; j++ ) {
        x = j * cellWidth;

        ctx.beginPath();
        ctx.rect( x, y, cellWidth, cellHeight );

        // Colors alternate between black and purple.
        ctx.fillStyle = ( i + j ) % 2 ? '#f0f' : '#000';
        ctx.fill();

        // Add texture border.
        if ( !i || !j || i === yCount - 1 || j === xCount - 1 ) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.fill();
        }
      }
    }
  }


  /**
   * Appends a canvas element to the DOM.
   * Returns that element.
   */
  function addMozDebugCanvas( size ) {
    var width = size,
        height = size;

    var canvas = document.createElement( 'canvas' );

    canvas.id = 'texture';
    canvas.classList.add( 'moz-canvas' );

    canvas.width = width;
    canvas.height = height;
    canvas.style.display = 'none';
    canvas.style.position = 'absolute';

    document.body.appendChild( canvas );

    return canvas;
  }

  function addWebkitDebugTexture( size ) {
    var width = size,
        height = size;

    var ctx = document.getCSSCanvasContext( '2d', 'texture', width, height );

    drawDebugTexture( ctx );
  }

  setTimeout(function() {
    addTestShading();

    (function() {
      // Texture size.
      var size = 256;
      var mozCanvas = addMozDebugCanvas( size );

      var styleSheet = document.styleSheets[0];

      // Append rules at end.
      styleSheet.insertRule( '.face {background-image: -webkit-canvas(texture);}', styleSheet.cssRules.length );
      styleSheet.insertRule( '.face {background-image: -moz-element(#texture);}', styleSheet.cssRules.length );
      styleSheet.insertRule( '.face {background-size: 100% 100%;}', styleSheet.cssRules.length );

      // Check for webkit (since getCSSCanvasContext() may not exist).
      var faceEl = document.createElement( 'div' );
      faceEl.style.visibility = 'hidden';
      faceEl.classList.add( 'face' );
      document.body.appendChild(faceEl);

      var backgroundImage = window.getComputedStyle( faceEl ).backgroundImage;
      if ( backgroundImage.indexOf( 'webkit' ) !== -1 ) {
        addWebkitDebugTexture( size );
        // Remove unnecessary Mozilla canvas element.
        document.body.removeChild( mozCanvas );
      } else if ( backgroundImage.indexOf( 'moz' ) !== -1 ) {
        drawDebugTexture( mozCanvas.getContext( '2d' ) );
      }

      document.body.removeChild( faceEl );
    }) ();
  });

  var config = (function() {
    var head = {
      width: 50,
      height: 50,
      depth: 50
    };

    var chest = {
      width: 100,
      height: 120,
      depth: 60
    };

    var arm = {
      width: 25,
      height: 130,
      depth: 25
    };

    var leg = {
      width: 30,
      height: 100,
      depth: 30
    };

    var foot = {
      width: 30,
      height: 20,
      depth: 60
    };

    // Scaling.
    var scale = 1.5;
    [ head, chest, arm, leg, foot ].forEach(function( box ) {
      box.width  *= scale;
      box.height *= scale;
      box.depth  *= scale;
    });

    var spacing = 0;
    var shoulderHeight = 0.1 * chest.height;

    var headOffsetY = 0.5 * ( head.height + chest.height ) + spacing;
    var armOffsetX = 0.5 * ( chest.width + arm.width ) + spacing;
    var armOffsetY = 0.5 * ( arm.height - chest.height ) + shoulderHeight;

    var legOffsetX = 0.25 * chest.width;
    var legOffsetY = 0.5 * ( leg.height + chest.height ) + spacing;
    var footOffsetY = 0.5 * ( foot.height + leg.height ) + spacing;

    return {
      head: {
        dimensions: [ head.width, head.height, head.depth ],
        translate3d: [ 0, -headOffsetY, 0 ]
      },

      chest: {
        dimensions: [ chest.width, chest.height, chest.depth ]
      },

      arm: {
        dimensions: [ arm.width, arm.height, arm.depth ],
        transformOrigin: [ 0, -0.5 * arm.height ]
      },

      'arm-left': [ armOffsetX, armOffsetY ],
      'arm-right': [ -armOffsetX, armOffsetY ],

      leg: {
        dimensions: [ leg.width, leg.height, leg.depth ],
        transformOrigin: [ 0, -0.5 * leg.height ]
      },

      'leg-left': [ legOffsetX, legOffsetY ],
      'leg-right': [ -legOffsetX, legOffsetY ],

      foot: {
        dimensions: [ foot.width, foot.height, foot.depth ],
        translate3d: [ 0, footOffsetY, -0.5 * ( leg.depth - foot.depth ) ],
        transformOrigin: [ 0, -0.5 * foot.height ]
      }
    };
  }) ();

  var boxEls = [
    'chest', 'head', 'arm', 'leg', 'foot'
  ].map(function( className ) {
    var els = [].slice.call( document.querySelectorAll( '.' + className ) );
    var classConfig = config[ className ];

    els.forEach(function( el ) {
      Box.append( el );
      Box.setDimensions.apply( null, [ el ].concat( classConfig.dimensions ) );
      Box.setTranslate3D.apply( null, [ el ].concat( classConfig.translate3d ) );
      Box.setTransformOrigin.apply( null, [ el ].concat( classConfig.transformOrigin ) );
      Box.setTransformStyle( el );
    });

    return els;
  });

  // Flatten boxEls.
  boxEls = boxEls.reduce(function( array, els ) {
    return array.concat( els );
  }, [] );

  // Add directional offsets.
  [
    'arm-left', 'arm-right',
    'leg-left', 'leg-right'
  ].forEach(function( className ) {
    var els = [].slice.call( document.querySelectorAll( '.' + className ) );
    var classConfig = config[ className ];
    els.forEach(function( el ) {
      Box.setTranslate3D.apply( null, [ el ].concat( classConfig ) );
    });
  });

}) ( window, document );
