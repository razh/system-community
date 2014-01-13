(function( window, document, undefined ) {
  'use strict';

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

  function setDimensions( el, width, height, depth ) {
    var id = el.id;

    var halfWidth  = 0.5 * width,
        halfHeight = 0.5 * height,
        halfDepth  = 0.5 * depth;

    var faceEls = el.querySelectorAll( id + ' > .face' );
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
    var transform = 'translate3d(' +
      x + 'px, ' +
      y + 'px, ' +
      z + 'px';

    el.style.webkitTransform = transform;
    el.style.transform = transform;
  }

  function setTransformOrigin( el, x, y, z ) {
    var transformOrigin = x + 'px, ' +
      y + 'px, ' +
      z + 'px';

    el.style.webkitTransformOrigin = transformOrigin;
    el.style.transformOrigin = transformOrigin;
  }

  var chestEl = document.querySelector( '#chest' );
  appendBox( chestEl );
  setDimensions( chestEl, 200, 200, 200 );

  var config = (function() {
    var head = {
      width: 50,
      height: 50,
      depth: 50
    };

    var chest = {
      width: 200,
      height: 200,
      depth: 200
    };

    var arm = {
      width: 20,
      height: 100,
      depth: 20
    };

    var leg = {
      width: 20,
      height: 40,
      depth: 20
    };

    var headOffsetY = 0.5 * ( head.height + chest.height );
    var armOffsetX = 0.5 * ( chest.width + arm.width );

    var legOffsetX = 0.25 * chest.width;
    var legOffsetY = 0.5 * ( leg.height + chest.height );

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
        translate3d: [ 0, legOffsetY, 0 ],
        transformOrigin: [ 0, -0.5 * leg.height ]
      },

      'leg-left': [ legOffsetX ],
      'leg-right': [ -legOffsetX ]
    };
  }) ();

  var armLeftEl = document.querySelector( '#arm-left' );
  appendBox( armLeftEl );
}) ( window, document );
