# Diceware Passphrase Generator

A [Diceware](http://world.std.com/~reinhold/diceware.html) passphrase generator implemented in JavaScript using the CSPRNG in your browser as its source of entropy instead of physical dice.

## Using It

All you have to do is click on a button with the number of words you want to generate. Click the button again and you'll get a new word list. Click one of the languages in the menu bar and you can generate words in many languages. Clicking a button rolls a set of five virtual dice for each word. Words are chosen from the standard Diceware word lists and the die roll numbers are shown next to each word.

You can find a live version of this application at:

[https://www.rempe.us/diceware/](https://www.rempe.us/diceware/)

If you are security conscious (smart!) you are of course encouraged to download the [source code](https://github.com/grempe/diceware) for this app, with git commits [signed with my public code signing key](https://www.rempe.us/keys/) to ensure the integrity of the code. Once downloaded you can freely inspect and run it in any modern web browser locally. Feel free to run it without a network connection to satisfy that this application sends nothing upstream.

All HTML, CSS, JavaScript is embedded as static files in the repository and nothing is downloaded or uploaded once the app is loaded in your browser. There is no 'server' logic, just static files.

There are no tracking scripts or logs kept of who has accessed this page. When served from the rempe.us domain you are protected by an A+ rated TLS connection.

If you want to be extra secure, roll your own physical dice and plug them into the UI and just use this tool to help look up the words faster (in any of the supported languages).

You don't need a web server to run it locally, just run (on OS X) `open index.html` in a terminal, or double-click the `index.html` elsewhere.

## Thanks
This implementation was inspired by the very nicely done [https://github.com/yesiamben/diceware](https://github.com/yesiamben/diceware). I took the opportunity to update the security (much stronger source of entropy) and the UI.
