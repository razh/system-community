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

      if ( top    ) { transform = 'translate3d(0, ' + -halfHeight + 'px, 0) rotateX( 90deg)'; }
    });
  }

  var chestEl = document.querySelector( '#chest' );
  appendBox( chestEl );
  setDimensions( chestEl, 200, 200, 200 );
}) ( window, document );
