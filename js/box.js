/*exported Box*/
var Box = (function( window, document, undefined ) {
  'use strict';

  var directions = [
    'top', 'bottom',
    'back', 'front',
    'left', 'right'
  ];

  function create() {
    var fragment = document.createDocumentFragment();

    var faceEl;
    directions.forEach(function( direction ) {
      faceEl = document.createElement( 'div' );
      faceEl.classList.add( 'face', direction );
      fragment.appendChild( faceEl );
    });

    return fragment;
  }

  function append( el ) {
    el.appendChild( create() );
  }

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
        faceEl.style.width  = width  + 'px';
        faceEl.style.height = height + 'px';

        faceEl.style.marginLeft = -halfWidth  + 'px';
        faceEl.style.marginTop  = -halfHeight + 'px';
      }

      if ( left || right ) {
        faceEl.style.width  = depth  + 'px';
        faceEl.style.height = height + 'px';

        faceEl.style.marginLeft = -halfDepth  + 'px';
        faceEl.style.marginTop  = -halfHeight + 'px';
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

    var transformOrigin = ( x || 0 ) + 'px ' +
      ( y || 0 ) + 'px ' +
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

  return {
    directions: directions,

    create: create,
    append: append,

    setDimensions: setDimensions,
    setTranslate3D: setTranslate3D,
    setTransformOrigin: setTransformOrigin,
    setTransformStyle: setTransformStyle
  };
}) ( window, document );
