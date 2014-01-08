(function( window, document, undefined ) {
  'use strict';

  var elements = [].slice.call( document.body.getElementsByTagName( '*' ) );

  var tags = elements.map(function( el ) {
    return el.tagName;
  }).reduce(function( object, tag ) {
    object[ tag ] = object[ tag ] ? object[ tag ] + 1 : 1;
    return object;
  }, {} );

  console.log( tags );
}) ( window, document );
