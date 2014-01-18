(function( window, document, undefined ) {
  'use strict';

  var PI2 = 2 * Math.PI;

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
      value = 144 + Math.round( Math.random() * 32 );
      data[ i++ ] = data[ i++ ] = data[ i++ ] = value;
      // Set alpha.
      data[ i++ ] = 255;
    }

    // Additional noise.
    (function( moreNoise ) {
      if ( moreNoise ) {
        return;
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
          0.5 * noise[ i - 1 ] + 0.1 * x +
          0.1 * noise[ 4 * ( y1 * width + x1 ) ];
        data[ i++ ] = 255;
      }
    }) ( false );

    ctx.putImageData( imageData, 0, 0 );
  }

  function drawRivet( ctx, x, y, radius ) {
    ctx.beginPath();
    ctx.arc( x, y, radius, 0, PI2 );

    ctx.shadowColor = '#222';
    ctx.shadowBlur = 5 * radius;

    ctx.fillStyle = '#ccc';
    ctx.fill();

    ctx.shadowBlur = 0;
  }

  function drawRivets( ctx, x, y, width, height, xCount, yCount, rivetRadius ) {
    var halfWidth  = 0.5 * width,
        halfHeight = 0.5 * height;

    var x0 = x - halfWidth,
        y0 = y - halfHeight,
        x1 = x + halfWidth,
        y1 = y + halfHeight;

    var xSpacing = width / ( xCount - 1 ),
        ySpacing = height / ( yCount - 1 );

    var xi, yi;

    // Draw horizontal top and bottom rows.
    var i;
    for ( i = 0; i < xCount; i++ ) {
      xi = x0 + xSpacing * i;
      drawRivet( ctx, xi, y0, rivetRadius );
      drawRivet( ctx, xi, y1, rivetRadius );
    }

    // Draw vertical left and right columns (except first and last points).
    for ( i = 1; i < yCount - 1; i++ ) {
      yi = y0 + ySpacing * i;
      drawRivet( ctx, x0, yi, rivetRadius );
      drawRivet( ctx, x1, yi, rivetRadius );
    }
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
      ctx.arc( x, y, radius, 0, PI2 );

      ctx.shadowColor = '#0f0';
      ctx.shadowBlur = radius;

      ctx.fillStyle = '#0f0';
      ctx.fill();

      // Inner eye.
      ctx.beginPath();
      ctx.arc( x, y, 0.8 * radius, 0, PI2 );

      ctx.shadowColor = '#fff';

      ctx.fillStyle = '#fff';
      ctx.fill();

      ctx.shadowBlur = 0;
    }

    function drawVerticalGrating( ctx, x, y, width, height, count ) {
      var halfWidth = 0.5 * width,
          halfHeight = 0.5 * height;

      var x0 = x - halfWidth,
          y0 = y - halfHeight,
          y1 = y + halfHeight;

      var spacing = width / ( count - 1 );

      ctx.beginPath();
      for ( var i = 0; i < count; i++ ) {
        ctx.moveTo( x0 + spacing * i, y0 );
        ctx.lineTo( x0 + spacing * i, y1 );
      }
    }

    function drawMouth( ctx, x, y, width, height, radius ) {
      roundRectCentered( ctx, x, y, width, height, radius );
      ctx.fillStyle = '#666';
      ctx.fill();

      ctx.shadowColor = '#111';
      ctx.shadowBlur = 0.05 * width;

      ctx.lineWidth = 0.04 * width;
      ctx.strokeStyle = '#666';
      ctx.stroke();

      ctx.shadowBlur = 0;

      drawVerticalGrating( ctx, x, y, 0.75 * width, 0.7 * height, 7 );
      ctx.lineCap = 'round';
      ctx.lineWidth = 0.08 * width;
      ctx.strokeStyle = '#111';
      ctx.stroke();
      ctx.lineCap = 'butt';
    }

    drawEye( ctx, 0.28 * size, 0.32 * size, 0.11 * size );
    drawEye( ctx, 0.72 * size, 0.32 * size, 0.11 * size );
    drawMouth( ctx, 0.5 * size, 0.7 * size, 0.4 * size, 0.3 * size, 0.06 * size );
  }

  function setCanvasDimensions( canvas ) {
    canvas.width = size;
    canvas.height = size;
  }

  (function init() {
    var canvas = document.querySelector( '#default' ),
        ctx    = canvas.getContext( '2d' );

    function drawDefaultRivets( ctx ) {
      drawRivets( ctx, 0.5 * size, 0.5 * size, 0.96 * size, 0.96 * size, 10, 10, 0.005 * size );
    }

    setCanvasDimensions( canvas );
    renderTexture( ctx );
    drawDefaultRivets( ctx );

    var faceCanvas = document.querySelector( '#face' ),
        faceCtx    = faceCanvas.getContext( '2d' );

    setCanvasDimensions( faceCanvas );
    renderTexture( faceCtx );
    drawDefaultRivets( faceCtx );
    renderFaceTexture( faceCtx );
  }) ();
}) ( window, document );
