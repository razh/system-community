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

  function renderFaceTexture( ctx ) {
    // Eyes.
    function drawEye( ctx, x, y, radius ) {
      ctx.beginPath();
      ctx.arc( x, y, radius, 0, 2 * Math.PI );

      ctx.shadowColor = '#0f0';
      ctx.shadowBlur = 20;

      ctx.fillStyle = '#0f0';
      ctx.fill();

      ctx.shadowBlur = 0;
    }

    drawEye( ctx, 0.3 * size, 0.3 * size, 0.1 * size );
    drawEye( ctx, 0.7 * size, 0.3 * size, 0.1 * size );
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
