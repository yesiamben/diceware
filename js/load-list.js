// load appropriate diceware scripts based on URL params.

var scriptToLoad, dicelist;
dicelist = getURLParameterOrDefault("dicelist");

scriptToLoad = dicelist + "-min.js";

// Dynamically load different diceware lists.
// In development requires to be run in a web server since
// it loads scripts via ajax.
//
// e.g. 'python -m SimpleHTTPServer 8888'
//
$.getScript( "js/lists/" + scriptToLoad, function( data, textStatus, jqxhr ) {
  // console.log( data ); // Data returned
  // console.log( textStatus ); // Success
  // console.log( jqxhr.status ); // 200
  // console.log( "Load was performed." );
});
