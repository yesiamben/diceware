// Use a cryptographically strong random number generator
// to get the die roll results.
function getDiceRoll(numRolls) {
    'use strict';

    var i, rollResults = [];

    if (!numRolls) {
        numRolls = 5;
    }

    var array = new Uint32Array(numRolls);
    window.crypto.getRandomValues(array);

    for (i = 0; i < array.length; i += 1) {
        // Convert random Byte into 6 sided die roll
        rollResults.push((array[i] % 6) + 1);
    }

    return rollResults.join('');
}

function addBox(num, list) {
    'use strict';
    var word;

    if (list === 'diceware') {
        word = diceware[num];
    } else if (list === 'special') {
        word = special[num];
    }
    $('.new-diceword').append('<div class="new-diceword__box js__diceword-box"><div class="new-diceword__box-top">' + word + '</div><div class="new-diceword__box-bottom">' + num + '</div></div>');
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

    $('.js__new-word-button').on('click', function (e) {
        e.preventDefault();
        addBox(getDiceRoll(5), 'diceware');
    });

    $('.js__new-special-button').on('click', function (e) {
        e.preventDefault();
        addBox(getDiceRoll(2), 'special');
    });

    $('.js__new-lookup-input').keydown(function (event) {
        if (event.keyCode === 13) {
            $('.js__new-lookup-button').trigger('click');
        }
    });

    $('.js__new-lookup-button').on('click', function (e) {
        var buttonVal,
            proceed,
            i;

        e.preventDefault();
        buttonVal = $('.js__new-lookup-input').val();

        if ((buttonVal).length !== 5 && (buttonVal).length !== 2) {
            $('.js__new-lookup-input').css('border-color', '#c00');
        } else {
            proceed = true;
            for (i = 0; i < (buttonVal).length; i += 1) {
                if ((buttonVal).charAt(i) < 1 || (buttonVal).charAt(i) > 6) {
                    $('.js__new-lookup-input').css('border-color', '#c00');
                    proceed = false;
                }
            }

            if (proceed === true) {
                if ((buttonVal).length === 2) {
                    addBox(buttonVal, 'special');
                    $('.js__new-lookup-input').val('');
                } else {
                    addBox(buttonVal, 'diceware');
                    $('.js__new-lookup-input').val('');
                }
            }
        }
    });

    $('.js__new-lookup-input').on('keyup', function () {
        $(this).css('border-color', '#333');
    });

    $('.new-diceword').on('click', '.js__diceword-box', function (e) {
        e.preventDefault();
        $(this).fadeOut('fast', function () {
            $(this).remove();
        });
    });

    $('.list-title span').text(wordlist);

});
