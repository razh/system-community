(function( window, document, undefined ) {
  'use strict';

  // Data accessor functions.
  function xFn( el ) {
    return el.offsetLeft;
  }

  function yFn( el ) {
    return el.offsetTop;
  }

  function widthFn( el ) {
    return el.clientWidth;
  }

  function heightFn( el ) {
    return el.clientHeight;
  }

  function paddingFn( el ) {
    var computedStyle = window.getComputedStyle( el );

    return {
      top: parseFloat( computedStyle.paddingTop ),
      left: parseFloat( computedStyle.paddingLeft ),
      bottom: parseFloat( computedStyle.paddingBottom ),
      right: parseFloat( computedStyle.paddingRight )
    };
  }

  function logDimensions( el ) {
    console.log( xFn( el ), yFn( el ), widthFn( el ), heightFn( el ) );
    return el;
  }


  var elements = [].slice.call( document.body.getElementsByTagName( '*' ) );

  var tags = elements.map(function( el ) {
    return el.tagName;
  }).reduce(function( object, tag ) {
    object[ tag ] = object[ tag ] ? object[ tag ] + 1 : 1;
    return object;
  }, {} );

  console.log( tags );

  // Determine element visibility/style?
  elements = elements.filter(function( el ) {
    return el.offsetWidth && el.offsetHeight;
  }).map( logDimensions );

  var temp = elements.map(function( el ) {
    // Grab all dimensions before we beigin conversion.
    return {
      el: el,
      x: xFn( el ),
      y: yFn( el ),
      width: widthFn( el ),
      height: heightFn( el ),
      padding: paddingFn( el )
    };
  });

  setTimeout(function() {
    temp.map(function( options ) {
      var el = options.el;
      var padding = options.padding;

      var computedStyle = window.getComputedStyle( el );
      if ( computedStyle.position === 'static' ) {
        el.style.position = 'fixed';
        el.style.left = options.x + 'px';
        el.style.top = options.y + 'px';
        el.style.width = ( options.width - padding.left - padding.right ) + 'px';
        el.style.height = ( options.height - padding.top - padding.bottom ) + 'px';
      }

      return el;
    });

    console.log( '-------------------' );
    console.log( elements.map( logDimensions ) );
  }, 2000 );


}) ( window, document );
