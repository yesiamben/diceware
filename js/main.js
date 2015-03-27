

// -----------------------------------------------------------------------------------------------------------------------------------------
/* DOCUMENT READY */

	function getDiceRoll () {
		
		return Math.floor(Math.random() * 6) + 1;
		
	}
	
	function addBox (num, list) {
	
		if (list == 'diceware') {
			var word = diceware[num];
		} else if (list == 'special') {
			var word = special[num];
		} 
		
		$('.new-diceword').append('<div class="new-diceword__box js__diceword-box"><div class="new-diceword__box-top">'+word+'</div><div class="new-diceword__box-bottom">'+num+'</div></div>');
		
	}
	
	// Ta!
	// http://www.drupalden.co.uk/get-values-from-url-query-string-jquery
	function getUrlVars() {
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++) {
		    hash = hashes[i].split('=');
		    vars.push(hash[0]);
		    vars[hash[0]] = hash[1];
		}
		return vars;
	}


	$(document).ready(function () {

		$('.js__new-word-button').on('click', function (e) {
		
			e.preventDefault();
			var num = '';
			for (i=0; i<5; i++) {
				
				num += getDiceRoll();
			}
			
			addBox (num, 'diceware');
			
		});
		
		$('.js__new-special-button').on('click', function (e) {
			
			e.preventDefault();
			var num = '';
			for (i=0; i<2; i++) {
				
				num += getDiceRoll();
			}
			
			addBox (num, 'special');

		});
		
		$('.js__new-lookup-input').keydown(function(event){    
			if(event.keyCode==13){
				$('.js__new-lookup-button').trigger('click');
			}
		});
		
		$('.js__new-lookup-button').on('click', function (e) {

			e.preventDefault();
			var buttonVal = $('.js__new-lookup-input').val();

			if ( (buttonVal).length != 5 && (buttonVal).length != 2 ) {
				
				$('.js__new-lookup-input').css('border-color', '#c00');
				
			} else {
				
				var proceed = true;
				for (var i = 0; i < (buttonVal).length; i++) {
				    if((buttonVal).charAt(i) < 1 || (buttonVal).charAt(i) > 6) {
					    
					    $('.js__new-lookup-input').css('border-color', '#c00');
					    proceed = false;
					    
				    }
				}
				
				if (proceed === true) {
					
					if ((buttonVal).length == 2) {
						
						addBox (buttonVal, 'special');
						$('.js__new-lookup-input').val('');
						
					} else {
					
						addBox (buttonVal, 'diceware');
						$('.js__new-lookup-input').val('');
					
					}
					
				}
				
			}

			var num = '';
			
		});
		
		$('.js__new-lookup-input').on('keyup', function() {
			
			$(this).css('border-color', '#333');
			
		});
		
		$('.new-diceword').on('click', '.js__diceword-box', function (e) {
		
			e.preventDefault();

			$(this).fadeOut('fast', function() {
				$(this).remove();
			});	
		});
		
		
		$('.list-title span').text(wordlist);
		

	});
