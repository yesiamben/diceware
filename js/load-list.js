// load appropriate diceware scripts based on URL params.

var scriptToLoad, dicelist, wordlist;
dicelist = getURLParameterOrDefault("dicelist");

// Capitalize the wordlist string. Ugh, javascript.
// http://forwebonly.com/capitalize-the-first-letter-of-a-string-in-javascript-the-fast-way/
wordlist = dicelist.charAt(0).toUpperCase() + dicelist.substring(1);
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
