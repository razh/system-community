(function( window, document, undefined ) {
  'use strict';

  var robotEl = document.querySelector( '.robot' );

  var directions = [
    'top', 'bottom',
    'back', 'front',
    'left', 'right'
  ];

  function createBox() {
    var fragment = document.createDocumentFragment();

    var faceEl;
    directions.forEach(function( direction ) {
      faceEl = document.createElement( 'div' );
      faceEl.classList.add( 'face', direction );
      fragment.appendChild( faceEl );
    });

    return fragment;
  }

  function appendBox( el ) {
    el.appendChild( createBox() );
  }

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

      styleSheet.insertRule( '.' + direction + ' ' + rule, 0 );
    });
  }

  function addDebugTexture() {
    var size = 256;

    var width = size,
        height = size;

    var ctx = document.getCSSCanvasContext( '2d', 'texture', width, height );

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

        if ( !i || !j || i === yCount - 1 || j === xCount - 1 ) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.fill();
        }
      }
    }
  }

  setTimeout(function() {
    addTestShading();

    (function() {
      var styleSheet = document.styleSheets[0];
      // Append rules at end.
      styleSheet.insertRule( '.face {position: absolute;}', styleSheet.cssRules.length );
      styleSheet.insertRule( '.face {background: -webkit-canvas(texture);}', styleSheet.cssRules.length );
      styleSheet.insertRule( '.face {background-size: 100% 100%;}', styleSheet.cssRules.length );
      addDebugTexture();
    }) ();
  }, 100 );

  function setDimensions( el, width, height, depth ) {
    var id = el.id;

    var halfWidth  = 0.5 * width,
        halfHeight = 0.5 * height,
        halfDepth  = 0.5 * depth;

    var faceEls = el.querySelectorAll( '#' + id + ' > .face' );
    faceEls = [].slice.call( faceEls );

    var top, bottom, back, front, left, right;
    var transform;

    faceEls.forEach(function( faceEl ) {
      top    = faceEl.classList.contains( 'top'    );
      bottom = faceEl.classList.contains( 'bottom' );
      back   = faceEl.classList.contains( 'back'   );
      front  = faceEl.classList.contains( 'front'  );
      left   = faceEl.classList.contains( 'left'   );
      right  = faceEl.classList.contains( 'right'  );

      if ( top || bottom ) {
        faceEl.style.width  = width + 'px';
        faceEl.style.height = depth + 'px';

        faceEl.style.marginLeft = -halfWidth + 'px';
        faceEl.style.marginTop  = -halfDepth + 'px';
      }

      if ( back || front ) {
        faceEl.style.width =  width  + 'px';
        faceEl.style.height = height + 'px';

        faceEl.style.marginLeft = -halfWidth  + 'px';
        faceEl.style.marginTop =  -halfHeight + 'px';
      }

      if ( left || right ) {
        faceEl.style.width =  depth  + 'px';
        faceEl.style.height = height + 'px';

        faceEl.style.marginLeft = -halfDepth  + 'px';
        faceEl.style.marginTop =  -halfHeight + 'px';
      }

      if ( top    ) { transform = 'translate3d(0, ' + -halfHeight + 'px, 0) rotateX( 90deg)'; }
      if ( bottom ) { transform = 'translate3d(0, ' +  halfHeight + 'px, 0) rotateX(-90deg)'; }

      if ( back  ) { transform = 'translate3d(0, 0, ' + -halfDepth + 'px) rotateY(180deg)'; }
      if ( front ) { transform = 'translate3d(0, 0, ' +  halfDepth + 'px) rotateY(  0deg)'; }

      if ( left  ) { transform = 'translate3d(' + -halfWidth + 'px, 0, 0) rotateY(-90deg)'; }
      if ( right ) { transform = 'translate3d(' +  halfWidth + 'px, 0, 0) rotateY( 90deg)'; }

      faceEl.style.webkitTransform = transform;
      faceEl.style.transform = transform;
    });
  }

  function setTranslate3D( el, x, y, z ) {
    if ( !el || ( !x && !y && !z ) ) {
      return;
    }

    var transform = 'translate3d(' +
      ( x || 0 ) + 'px, ' +
      ( y || 0 ) + 'px, ' +
      ( z || 0 ) + 'px)';

    el.style.webkitTransform = transform;
    el.style.transform = transform;
  }

  function setTransformOrigin( el, x, y, z ) {
    if ( !el || ( !x && !y && !z ) ) {
      return;
    }

    var transformOrigin = ( x || 0 ) + 'px, ' +
      ( y || 0 ) + 'px, ' +
      ( z || 0 ) + 'px';

    el.style.webkitTransformOrigin = transformOrigin;
    el.style.transformOrigin = transformOrigin;
  }

  function setTransformStyle( el ) {
    if ( !el ) {
      return;
    }

    el.style.webkitTransformStyle = 'preserve-3d';
    el.style.transformStyle = 'preserve-3d';
  }

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
      height: 100,
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

    var headOffsetY = 0.5 * ( head.height + chest.height ) + spacing;
    var armOffsetX = 0.5 * ( chest.width + arm.width ) + spacing;

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

      'arm-left': [ armOffsetX ],
      'arm-right': [ -armOffsetX ],

      leg: {
        dimensions: [ leg.width, leg.height, leg.depth ],
        transformOrigin: [ 0, -0.5 * leg.height ]
      },

      'leg-left': [ legOffsetX, legOffsetY ],
      'leg-right': [ -legOffsetX, legOffsetY ],

      foot: {
        dimensions: [ foot.width, foot.height, foot.depth ],
        translate3d: [ 0, footOffsetY, 0.5 * ( leg.depth - foot.depth ) ],
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
      appendBox( el );
      setDimensions.apply( null, [ el ].concat( classConfig.dimensions ) );
      setTranslate3D.apply( null, [ el ].concat( classConfig.translate3d ) );
      setTransformOrigin.apply( null, [ el ].concat( classConfig.transformOrigin ) );
      setTransformStyle( el );
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
      setTranslate3D.apply( null, [ el ].concat( classConfig ) );
    });
  });

  // Add basic user interaction.
  function rotate( rx, ry ) {
    var transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';

    robotEl.style.webkitTransform = transform;
    robotEl.style.transform = transform;
  }

  function onMouseMove( event ) {
    if ( !event.shiftKey ) {
      return;
    }

    var rx = -( event.clientY / window.innerHeight - 0.5 ) * 360,
        ry =  ( event.clientX / window.innerWidth  - 0.5 ) * 360;

    rotate( rx, ry );
  }

  window.addEventListener( 'mousemove', onMouseMove );

  document.addEventListener( 'keydown', function( event ) {
    // R.
    if ( event.which === 82 ) {
      rotate( 0, 0 );
    }
  });

}) ( window, document );
