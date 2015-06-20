// Use a cryptographically strong random number generator
// to get the die roll results. Returns an array of
// objects of length numWords (default 1). Each object in
// the array represents a word and its index and is the result of
// numRollsPerWord die rolls (default 5).
function getWords(numWords, numRollsPerWord) {
    'use strict';

    var i,
        j,
        words = [],
        rollResults,
        rollResultsJoined,
        randomBytes;

    if (!numWords) { numWords = 1; }
    if (!numRollsPerWord) { numRollsPerWord = 5; }

    for (i = 0; i < numWords; i += 1) {
        rollResults = [];
        randomBytes = new Uint32Array(numRollsPerWord);
        window.crypto.getRandomValues(randomBytes);

        for (j = 0; j < randomBytes.length; j += 1) {
            // Convert random Byte into 6 sided die roll
            rollResults.push((randomBytes[j] % 6) + 1);
        }

        rollResultsJoined = rollResults.join('');
        if (numRollsPerWord === 5) {
            words.push({"word": diceware[rollResultsJoined], "wordNum": rollResultsJoined, "numRollsPerWord": numRollsPerWord});
        } else if (numRollsPerWord === 2) {
            words.push({"word": special[rollResultsJoined], "wordNum": rollResultsJoined, "numRollsPerWord": numRollsPerWord});
        }
    }

    return words;
}

// Lookup a word by its wordNum and return
// an Array with a single word object suitable for displayWords.
function getWordFromWordNum(wordNum) {
    if (wordNum.length === 5) {
        return [{"word": diceware[wordNum], "wordNum": wordNum}];
    } else if (wordNum.length === 2) {
        return [{"word": special[wordNum], "wordNum": wordNum}];
    }
}

// Takes an array of word objects and display them on the page.
function displayWords(words) {
    'use strict';

    $.each(words, function( index, obj ) {
        $('#diceWords').append('<li>' + obj.word + '<span class="text-muted">' + obj.wordNum + '</span></li>');
    });
}

// Extract a named query string param from the current window.location
function getURLParameterOrDefault(name) {
    param = (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [null,null])[1];

    if (param === null) {
        return "diceware";
    }
    return decodeURI(param);
}

$(document).ready(function () {
    'use strict';

    $('#buttonAddFourWords').on('click', function (e) {
        e.preventDefault();
        $('#diceWords').html('');
        displayWords(getWords(4, 5));
    });

    $('#buttonAddFiveWords').on('click', function (e) {
        e.preventDefault();
        $('#diceWords').html('');
        displayWords(getWords(5, 5));
    });

    $('#buttonAddSixWords').on('click', function (e) {
        e.preventDefault();
        $('#diceWords').html('');
        displayWords(getWords(6, 5));
    });

    $('#buttonAddSevenWords').on('click', function (e) {
        e.preventDefault();
        $('#diceWords').html('');
        displayWords(getWords(7, 5));
    });

    $('#buttonAddEightWords').on('click', function (e) {
        e.preventDefault();
        $('#diceWords').html('');
        displayWords(getWords(8, 5));
    });

    // single word button
    $('#buttonAddWord').on('click', function (e) {
        e.preventDefault();
        displayWords(getWords(1, 5));
    });

    // single symbol button
    $('#buttonAddSymbol').on('click', function (e) {
        e.preventDefault();
        // two die roll
        displayWords(getWords(1, 2));
    });

    $('#addFiveDieRollWordButton').on('click', function (e) {
        var addFiveDieRollWord;
        e.preventDefault();
        addFiveDieRollWord = $('#addFiveDieRollWord').val();
        displayWords(getWordFromWordNum(addFiveDieRollWord));
        $('#addFiveDieRollWord').val('');
    });

    // $('#diceWords').on('click', '.js__diceword-box', function (e) {
    //     e.preventDefault();
    //     $(this).fadeOut('fast', function () {
    //         $(this).remove();
    //     });
    // });

    $('#listTitleHeader span').text(dicelist);

});
