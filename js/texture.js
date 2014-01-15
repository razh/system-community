(function( window, document, undefined ) {
  'use strict';

  function renderTexture( ctx ) {
    var width  = ctx.canvas.width,
        height = ctx.canvas.height;

    var imageData = ctx.getImageData( 0, 0, width, height ),
        data = imageData.data;

    var length = data.length;

    var value;
    var i = 0;
    while ( i < length ) {
      // Set RGB.
      value = 96 + Math.round( Math.random() * 16 );
      data[ i++ ] = data[ i++ ] = data[ i++ ] = value;
      // Set alpha.
      data[ i++ ] = 255;
    }

    ctx.putImageData( imageData, 0, 0 );
  }

  (function init() {
    var canvas = document.querySelector( 'canvas' ),
        ctx    = canvas.getContext( '2d' );

    // Keep this a power of 2.
    var size = 512;

    canvas.width = size;
    canvas.height = size;

    renderTexture( ctx );

  }) ();
}) ( window, document );
