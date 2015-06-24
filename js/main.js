// Global
// which list will be used to lookup words.
// standard diceware wordlist by default.
var currentList = "diceware";

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
        words.push(getWordFromWordNum(rollResultsJoined)[0]);
    }

    return words;
}

// Polyfill : for Math.log2 which is part of ES6
// See : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log2
Math.log2 = Math.log2 || function(x) {
  return Math.log(x) / Math.LN2;
};

// See : http://world.std.com/~reinhold/dicewarefaq.html#calculatingentropy
function calcEntropyForWordOrSymbol(isSymbol) {
    var entropy;

    if (!isSymbol) {
        // ~ 12.9 bit of entropy per Diceware word.
        entropy = new Big(Math.log2(7776));
    } else {
        // ~ 5.16 bits for special characters.
        entropy = new Big(Math.log2(36));
    }

    return entropy;
}

function calcCrackTime(numWords, guessesPerSec) {
    var keySpace,
        seconds,
        minutes,
        hours,
        days,
        years,
        millenia,
        humanLifetimes,
        universeLifetimes,
        avgHumanLifespanInYears = new Big(67.2),     // https://en.wikipedia.org/wiki/Life_expectancy
        ageOfUniverseInYears = new Big(13798000000); // https://en.wikipedia.org/wiki/Age_of_the_universe

    // https://xkcd.com/936/
    // https://security.stackexchange.com/questions/62832/is-the-oft-cited-xkcd-scheme-no-longer-good-advice/62881#62881
    // https://hashcat.net/forum/thread-2580.html
    keySpace = new Big(Math.pow(7776, numWords));

    // Divide the keySpace in half. On average it is expected that an
    // exhaustive search of only half the keySpace will result in success.
    halfKeySpace = keySpace.div(2);

    // "Assume that your adversary is capable of a trillion guesses per second" - Snowden
    // http://www.nytimes.com/2013/08/18/magazine/laura-poitras-snowden.html?pagewanted=all&_r=0
    if (!guessesPerSec) {
        guessesPerSec = new Big(1000000000000);
    } else {
        guessesPerSec = new Big(guessesPerSec);
    }

    seconds           = halfKeySpace.div(guessesPerSec);
    minutes           = seconds.div(60);
    hours             = minutes.div(60);
    days              = hours.div(24);
    years             = days.div(365);
    millenia          = years.div(1000);
    humanLifetimes    = years.div(avgHumanLifespanInYears);
    universeLifetimes = years.div(ageOfUniverseInYears);

    // All values returned are of 'Big' type.
    // See : https://mikemcl.github.io/big.js/
    return {numWords: numWords, guessesPerSec: guessesPerSec, keySpace: keySpace, halfKeySpace: halfKeySpace, seconds: seconds, hours: hours, minutes: minutes, days: days, years: years, avgHumanLifespanInYears: avgHumanLifespanInYears, humanLifetimes: humanLifetimes, millenia: millenia, ageOfUniverseInYears: ageOfUniverseInYears, universeLifetimes: universeLifetimes};
}

// Lookup a word by its wordNum and return
// an Array with a single word object suitable for displayWords.
function getWordFromWordNum(wordNum) {
    if (wordNum.length === 5) {
        var word;
        switch (currentList) {
            case "alternative":
                word = alternative[wordNum];
                break;
            case "catalan":
                word = catalan[wordNum];
                break;
            case "dutch":
                word = dutch[wordNum];
                break;
            case "esperanto":
                word = esperanto[wordNum];
                break;
            case "german":
                word = german[wordNum];
                break;
            case "japanese":
                word = japanese[wordNum];
                break;
            case "polish":
                word = polish[wordNum];
                break;
            case "swedish":
                word = swedish[wordNum];
                break;
            default:
                word = diceware[wordNum];
                break;
        }
        return [{"word": word, "wordNum": wordNum, "entropy": calcEntropyForWordOrSymbol(false)}];
    } else if (wordNum.length === 2) {
        return [{"word": special[wordNum], "wordNum": wordNum, "entropy": calcEntropyForWordOrSymbol(true)}];
    }
}

// Takes an array of word objects and display them on the page.
function displayWords(words) {
    'use strict';

    var totalEntropy = new Big(0);

    // add the word to the global array of words
    $.each(words, function( index, obj ) {
        totalEntropy = totalEntropy.plus(obj.entropy);
        $('#totalEntropy').text(totalEntropy.toFixed(2));
        wordList.push(obj.word);
    });

    // add the word to the main display
    $.each(words, function( index, obj ) {
        $('#diceWords').append('<li>' + obj.word + '<span class="text-muted">' + obj.wordNum + '</span></li>');
    });

    $('#totalWords').text(words.length);

    // Display crack time results
    var crackTimeResults = calcCrackTime(words.length);

    $('#crackTimeResultsGuessesPerSecond').text(crackTimeResults.guessesPerSec.toFixed(0));
    $('#crackTimeResultsHalfKeySpace').text(crackTimeResults.halfKeySpace.toFixed(0));

    $('#crackTimeResultsSeconds').text(
        (crackTimeResults.seconds > 1) ? crackTimeResults.seconds.toFixed(0) : crackTimeResults.seconds.toFixed(2)
    );

    $('#crackTimeResultsMinutes').text(
        (crackTimeResults.minutes > 1) ? crackTimeResults.minutes.toFixed(0) : crackTimeResults.minutes.toFixed(2)
    );

    $('#crackTimeResultsHours').text(
        (crackTimeResults.hours > 1) ? crackTimeResults.hours.toFixed(0) : crackTimeResults.hours.toFixed(2)
    );

    $('#crackTimeResultsDays').text(
        (crackTimeResults.days > 1) ? crackTimeResults.days.toFixed(0) : crackTimeResults.days.toFixed(2)
    );

    $('#crackTimeResultsYears').text(
        (crackTimeResults.years > 1) ? crackTimeResults.years.toFixed(0) : crackTimeResults.years.toFixed(4)
    );

    $('#crackTimeResultsHumanLifetimes').text(
        (crackTimeResults.humanLifetimes > 1) ? crackTimeResults.humanLifetimes.toFixed(0) : crackTimeResults.humanLifetimes.toFixed(6)
    );

    $('#crackTimeResultsMillenia').text(
        (crackTimeResults.millenia > 1) ? crackTimeResults.millenia.toFixed(0) : crackTimeResults.millenia.toFixed(7)
    );

    $('#crackTimeResultsUniverseLifetimes').text(
        (crackTimeResults.universeLifetimes > 1) ? crackTimeResults.universeLifetimes.toFixed(0) : crackTimeResults.universeLifetimes.toFixed()
    );

    $("#diceWordsCopyableSpace").text(wordList.join(' '));
    $("#diceWordsCopyableDash").text(wordList.join('-'));
    $("#diceWordsCopyableContainer").slideDown();
    $('#entropyEstimateContainer').slideDown();
}

function resetUI() {
    wordList = [];
    $('#entropyResults').text('0.0');
    $('#entropyEstimateContainer').hide();
    $('#listTitleHeader span').text(currentList);
    $('#diceWords').html('');
    $("#diceWordsCopyable").text('');
    $("#diceWordsCopyableContainer").hide();
}

$(document).ready(function () {
    'use strict';

    // an array of objects representing the current random word list.
    var wordList = [];

    // clear and reset everything on load.
    resetUI();

    // The nav links are used to select the current word list.
    $('.listSelectionLink').on('click', function (e) {
        currentList = $(this).data("list");
        // the active class gets applied to the parent <li> which
        // gets highlited if that was the last selected link.
        $('.listSelectionLink').parent().removeClass('active');
        $(this).parent().addClass('active');
        resetUI();
    });

    $('#buttonAddFourWords').on('click', function (e) {
        e.preventDefault();
        resetUI();
        displayWords(getWords(4, 5));
    });

    $('#buttonAddFiveWords').on('click', function (e) {
        e.preventDefault();
        resetUI();
        displayWords(getWords(5, 5));
    });

    $('#buttonAddSixWords').on('click', function (e) {
        e.preventDefault();
        resetUI();
        displayWords(getWords(6, 5));
    });

    $('#buttonAddSevenWords').on('click', function (e) {
        e.preventDefault();
        resetUI();
        displayWords(getWords(7, 5));
    });

    $('#buttonAddEightWords').on('click', function (e) {
        e.preventDefault();
        resetUI();
        displayWords(getWords(8, 5));
    });

    $('#buttonAddNineWords').on('click', function (e) {
        e.preventDefault();
        resetUI();
        displayWords(getWords(9, 5));
    });

    $('#buttonAddTenWords').on('click', function (e) {
        e.preventDefault();
        resetUI();
        displayWords(getWords(10, 5));
    });

    // single word button
    // does not reset UI. Adds onto existing wordList
    $('#buttonAddWord').on('click', function (e) {
        e.preventDefault();
        displayWords(getWords(1, 5));
    });

    // single symbol button
    // does not reset UI. Adds onto existing wordList
    $('#buttonAddSymbol').on('click', function (e) {
        e.preventDefault();
        // two die roll
        displayWords(getWords(1, 2));
    });

    // add a word from the output from analog die rolls e.g. 14352
    // can be either a five die roll for a full word, or a two die
    // roll for a symbol.
    // does not reset UI. Adds onto existing wordList
    $('#addFiveDieRollWordForm').on('submit', function (e) {
        var addFiveDieRollWord;
        e.preventDefault();
        addFiveDieRollWord = $('#addFiveDieRollWord').val();
        if ((addFiveDieRollWord.match(/^[1-6]{2}$/) || addFiveDieRollWord.match(/^[1-6]{5}$/)) && (addFiveDieRollWord.length === 2 || addFiveDieRollWord.length === 5)) {
            displayWords(getWordFromWordNum(addFiveDieRollWord));
        }
        $('#addFiveDieRollWord').val('');
    });

});
