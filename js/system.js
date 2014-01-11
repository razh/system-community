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

  /**
   * Determine dimensions of the box model edges:
   *   margin, padding, border.
   */
  function boxModelEdgeFn( property ) {
    var topEdge    = property + 'Top',
        leftEdge   = property + 'Left',
        bottomEdge = property + 'Bottom',
        rightEdge  = property + 'Right';

    return function( el ) {
      var computedStyle = window.getComputedStyle( el );

      return {
        top:    parseFloat( computedStyle[ topEdge    ] ),
        left:   parseFloat( computedStyle[ leftEdge   ] ),
        bottom: parseFloat( computedStyle[ bottomEdge ] ),
        right:  parseFloat( computedStyle[ rightEdge  ] )
      };
    };
  }

  var marginFn  = boxModelEdgeFn( 'margin' );
  var paddingFn = boxModelEdgeFn( 'padding' );
  // Note that borders are represented like '1px solid red'.
  var borderFn  = boxModelEdgeFn( 'border' );

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
    return widthFn( el ) && heightFn( el );
  }).map( logDimensions );

  var temp = elements.map(function( el ) {
    var parentEl = el.parentNode;

    // Grab all dimensions before we begin conversion.
    var properties = {
      el: el,
      x: xFn( el ),
      y: yFn( el ),
      width: widthFn( el ),
      height: heightFn( el ),
      padding: paddingFn( el ),
      margin: marginFn( el ),
      border: borderFn( el )
    };

    // Get the parent element dimensions as well.
    if ( parentEl ) {
      properties.parent = {
        padding: paddingFn( parentEl ),
        margin: marginFn( parentEl ),
        border: borderFn( parentEl )
      };
    }

    return properties;
  });

  setTimeout(function() {
    temp.map(function( options ) {
      var el = options.el;
      var padding = options.padding;
      var parent = options.parent;

      var computedStyle = window.getComputedStyle( el );
      if ( computedStyle.position !== 'fixed' ) {
        el.style.position = 'absolute';
      }

      var x = options.x;
      var y = options.y;
      var width = options.width - ( padding.left + padding.right );
      var height = options.height - ( padding.top + padding.bottom );

      if ( parent ) {
        x -= parent.padding.left;
        y -= parent.padding.right;
      }

      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.width = width + 'px';
      el.style.height = height + 'px';

      return el;
    });

    console.log( '-------------------' );
    console.log( elements.map( logDimensions ) );
  }, 2000 );


}) ( window, document );
