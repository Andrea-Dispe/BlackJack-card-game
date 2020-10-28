//declare variables
let arraySeed, currentScorePlayer, winningScore, activePlayer, playerOne, dealer, winner, idNumber, space, result;

begin();
//activePlayer 0 is the dealer
//activePlayer 1 is the first player

//HIT button
$(`#hit-1`).click(function () {
	if(winner[dealer] !== true && winner[playerOne] !== true){
		drawCard();
		winningConditionCheck();
	}
})
 
//STAND button
$(`#stand-${activePlayer}`).click(function () {
    idNumber = 0;
    space = 0; 
	//Stand button works only if the player 1 has already drew at least one card
	if(currentScorePlayer[playerOne] > 0 && currentScorePlayer[playerOne] <= 21){
		//it's the dealer's turn
		//if activePlayer is 1 (player 1) then change it to acrtivePlayer 0 (the Dealer)
		if (activePlayer === 1) {
			activePlayer = 0;
		}
		while (currentScorePlayer[dealer] <= 21 && currentScorePlayer[dealer] <= currentScorePlayer[playerOne]) {
				drawCard();
		}		winningConditionCheck();
	}
});

//RESET GAME button
$(`#reset`).click(function () {
	begin();
});

//----------------------------------------
//functions
//----------------------------------------

//Start or re-start the game from zero
function begin() {
	//the player starts 
	activePlayer = 1;
	dealer = 0;
	playerOne = 1;
	//reset the score and UI
	currentScorePlayer = [0,0];
	winningScore = 21;
	winner = [false,false];
    arraySeed = ["C", "D", "H", "S"];
    space = 0;
    idNumber = 0;
	//reset the UI
	$(`.points-0`).html('0').css('color', 'black');
	$(`.points-1`).html('0').css('color', 'black');
	$(`.score-notification-1`).html('Click the HIT! button to start!').css('color', 'black');
	$(`.result-message`).html(``);
    $(`.deck-0 > img`).remove();
    $(`.deck-1 > img`).remove();
    $(`.deck-0`).append(`<img class=back-of-the-card-0 src=cards/blue_back.png>`);
    $(`.deck-1`).append(`<img class=back-of-the-card-1 src=cards/blue_back.png>`);
}

//drawCard function
function drawCard(){

	//generate a random number from 1 to 13 included to be used to draw the number of the card in the filename
	let randomNumber = Math.ceil(Math.random() * 13);
	//after the player drew a card number, we need to determine the seed (spades, clubs, diamonds, hearts). Since the 4 initial letters of the seeds are stored in the array, then we need a number between 0 and 3 (index 0, 1, 2, 3).
	let randomLetter = Math.floor(Math.random() * 4);

	//assign the randomNUmber + arraySeed[randomLetter to a variable to be used later when displaying the cards in the UI]
	result = `${randomNumber}${arraySeed[randomLetter]}`;

	//update the score
	//if the card filename is 11 || 12 || 13, therefore the cards are face cards (jack, quen, king) then set the score for each to 10 and update the currenstScorePlayer0
	if (randomNumber  > 10) {
		randomNumber = 10;
		currentScorePlayer[activePlayer] += randomNumber;
	} else if (randomNumber === 1) {
		if (currentScorePlayer[activePlayer] < 11) {
			randomNumber = 11;
			currentScorePlayer[activePlayer] += randomNumber;
		} else {
            randomNumber = 1;
			currentScorePlayer[activePlayer] += randomNumber;
		}
	} else {
		currentScorePlayer[activePlayer] += randomNumber;
	};
	
	//update the UI current score
	$(`.points-${activePlayer}`).html(currentScorePlayer[activePlayer]);

	//update the UI that displays the drawn card.
	//Select the id card + the active player number from the DOM. If it's player 0's turn then jquery will select #card-0, while if if it's player 1's turn then jquery will select #card-1.
	//once selected I need to change the attribute src to display the card whose filename includes the randomNumber together with one of the four letters randomly chosen from the arraySeed. These values have already been stored into the result variable.
	if (winner[activePlayer] !== true) { 
        $(`.back-of-the-card-${activePlayer}`).remove();
		idNumber++;
		$(`.deck-${activePlayer}`).append(`<img id=card-${idNumber} src=cards/${result}.png style='position:relative; margin-left:${space}px'>`);
		space = -150;
    };

}

//check if there is a winner or not and adjust the UI accordingly
function winningConditionCheck(){
	if (currentScorePlayer[dealer] === 21 && currentScorePlayer[playerOne] === 21){
		alert(`It's a DRAW`);
	} else if (currentScorePlayer[dealer] <= winningScore && currentScorePlayer[dealer] > currentScorePlayer[playerOne]) {
		alert(`The DEALER wins. You LOSE!`);
		$(`.score-notification-1`).html("You LOST the game!").css('color', 'red');
		$(`.result-message`).html("The Dealer has more points than you!").css('color', 'red');
		$(`.points-${dealer}`).css("color", "green");	
		$(`.points-${playerOne}`).css("color", "red");
		winner[dealer] = true;
	} 	else if (currentScorePlayer[dealer] > winningScore) {
		alert(`The DEALER lose. You WiN!`);
		$(`.score-notification-${playerOne}`).html("You WON the game!").css('color', 'green');
		$(`.points-${dealer}`).css("color", "red");
		winner[playerOne] = true;
	}  else if (currentScorePlayer[playerOne] > winningScore){
		alert(`The DEALER wins. You LOSE!`);
		$(`.score-notification-1`).html("You LOST the game!").css('color', 'red');
		$(`.result-message`).html("You exceeded 21 points!").css('color', 'red');
		$(`.points-${dealer}`).css("color", "green");	
		$(`.points-${playerOne}`).css("color", "red");
		winner[dealer] = true;
	} else {
		$(`.points-${playerOne}`).css("color", "green");
		$(`.score-notification-1`).html("You are still in the game!");
	}
}
