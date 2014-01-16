(function( window, document, undefined ) {
  'use strict';

  // Keep this a power of 2.
  var size = 256;

  function renderTexture( ctx ) {
    var width  = ctx.canvas.width,
        height = ctx.canvas.height;

    var imageData = ctx.getImageData( 0, 0, width, height ),
        data = imageData.data;

    var length = data.length;

    var value;
    var index;
    var x, y;
    var i = 0;
    while ( i < length ) {
      index = 0.25 * i;
      x = index % width;
      y = Math.floor( index / height );

      // Set RGB.
      value = 96 + Math.round( Math.random() * 16 );
      data[ i++ ] = data[ i++ ] = data[ i++ ] = value;
      // Set alpha.
      data[ i++ ] = 255;
    }

    var noise = new Uint8ClampedArray( data );
    var x1, y1;
    i = 0;
    while ( i < length ) {
      index = 0.25 * i;
      x = index % width;
      y = Math.floor( index / height );

      // First octave coordinates.
      x1 = Math.floor( 0.25 * x );
      y1 = Math.floor( 0.25 * y );
      data[ i++ ] = data[ i++ ] = data[ i++ ] = 0 +
        0.5 * noise[ i - 1 ] + 0.2 * x +
        0.25 * noise[ 4 * ( y1 * width + x1 ) ];
      data[ i++ ] = 255;
    }

    ctx.putImageData( imageData, 0, 0 );
  }

  function roundRectCentered( ctx, x, y, width, height, radius ) {
    var halfWidth  = 0.5 * width,
        halfHeight = 0.5 * height;

    var x0 = x - halfWidth,
        y0 = y - halfHeight,
        x1 = x + halfWidth,
        y1 = y + halfHeight;

    ctx.beginPath();

    ctx.moveTo( x0 + radius, y0 );
    ctx.lineTo( x1 - radius, y0 );
    ctx.quadraticCurveTo(
      x1, y0,
      x1, y0 + radius
    );
    ctx.lineTo( x1, y1 - radius );
    ctx.quadraticCurveTo(
      x1, y1,
      x1 - radius, y1
    );
    ctx.lineTo( x0 + radius, y1 );
    ctx.quadraticCurveTo(
      x0, y1,
      x0, y1 - radius
    );
    ctx.lineTo( x0, y0 + radius );
    ctx.quadraticCurveTo(
      x0, y0,
      x0 + radius, y0
    );

    ctx.closePath();
  }

  function renderFaceTexture( ctx ) {
    // Eyes.
    function drawEye( ctx, x, y, radius ) {
      ctx.beginPath();
      ctx.arc( x, y, radius, 0, 2 * Math.PI );

      ctx.shadowColor = '#0f0';
      ctx.shadowBlur = 20;

      ctx.fillStyle = '#0f0';
      ctx.fill();

      // Inner eye.
      ctx.beginPath();
      ctx.arc( x, y, 0.8 * radius, 0, 2 * Math.PI );

      ctx.shadowColor = '#fff';

      ctx.fillStyle = 'fff';
      ctx.fill();

      ctx.shadowBlur = 0;
    }

    function drawMouth( ctx, x, y, width, height, radius ) {
      roundRectCentered( ctx, x, y, width, height, radius );
      ctx.fillStyle = '#222';
      ctx.fill();
    }

    drawEye( ctx, 0.3 * size, 0.3 * size, 0.1 * size );
    drawEye( ctx, 0.7 * size, 0.3 * size, 0.1 * size );
    drawMouth( ctx, 0.5 * size, 0.7 * size, 0.6 * size, 0.3 * size, 0.1 * size );
  }

  function setCanvasDimensions( canvas ) {
    canvas.width = size;
    canvas.height = size;
  }

  (function init() {
    var canvas = document.querySelector( '#default' ),
        ctx    = canvas.getContext( '2d' );

    setCanvasDimensions( canvas );
    renderTexture( ctx );

    var faceCanvas = document.querySelector( '#face' ),
        faceCtx    = faceCanvas.getContext( '2d' );

    setCanvasDimensions( faceCanvas );
    renderTexture( faceCtx );
    renderFaceTexture( faceCtx );
  }) ();
}) ( window, document );
