/*globals Box*/
(function( window, document, undefined ) {
  'use strict';

  var config = (function() {
    var head = {
      width: 4,
      height: 4,
      depth: 4
    };

    var chest = {
      width: 4,
      height: 6,
      depth: 2
    };

    var leg = {
      width: 2,
      height: 3,
      depth: 2
    };

    // Scaling.
    var scale = 20;
    [ head, chest, leg ].forEach(function( box ) {
      box.width  *= scale;
      box.height *= scale;
      box.depth  *= scale;
    });

    var spacing = 0;

    var headOffsetY = 0.5 * ( head.height + chest.height ) + spacing;
    var chestOffsetY = 0.5 * chest.height + 2 * scale + spacing;

    var legOffsetX = 0.5 * leg.width + spacing;
    var legOffsetY = 0.5 * ( leg.height + chest.height ) + spacing;
    var legOffsetZ = leg.depth + spacing;

    return {
      head: {
        dimensions: [ head.width, head.height, head.depth ],
        translate3d: [ 0, -headOffsetY, 0 ],
        transformOrigin: [ 0, 0.5 * head.height, 0 ]
      },

      chest: {
        dimensions: [ chest.width, chest.height, chest.depth ],
        translate3d: [ 0, -chestOffsetY, 0 ]
      },

      leg: {
        dimensions: [ leg.width, leg.height, leg.depth ],
      },

      hind: { transformOrigin: [ 0, -0.5 * leg.height, -0.5 * leg.depth ] },
      fore: { transformOrigin: [ 0, -0.5 * leg.height,  0.5 * leg.depth ] },

      'hindleg-left':  { translate3d: [ -legOffsetX, legOffsetY, -legOffsetZ ] },
      'hindleg-right': { translate3d: [  legOffsetX, legOffsetY, -legOffsetZ ] },
      'foreleg-left':  { translate3d: [ -legOffsetX, legOffsetY,  legOffsetZ ] },
      'foreleg-right': { translate3d: [  legOffsetX, legOffsetY,  legOffsetZ ] }
    };
  }) ();

  var boxEls = [
    'chest', 'head', 'leg'
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

  // Anteroposterior transform origins.
  [
    'hind', 'fore'
  ].forEach(function( className ) {
    var els = [].slice.call( document.querySelectorAll( className ) );
    var classConfig = config[ className ];

    els.forEach(function( el ) {
      Box.setTransformOrigin.apply( null, [ el ].concat( classConfig.transformOrigin ) );
    });
  });

  // Directional translation offsets.
  [
    'hindleg-left', 'hindleg-right',
    'foreleg-left', 'foreleg-right'
  ].forEach(function( id ) {
    var el = document.querySelector( '#' + id );
    var idConfig = config[ id ];

    if ( el ) {
      Box.setTranslate3D.apply( null, [ el ].concat( idConfig.translate3d ) );
    }
  });
}) ( window, document );
