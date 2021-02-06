//Cards
let suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];
let values = ['Ace', 'King', 'Queen', 'Jack',
    'Ten', 'Nine', 'Eight', 'Seven', 'Six',
    'Five', 'Four', 'Three', 'Two', 'One'
];

//Elements
let dealerTextArea = document.getElementById('dealer-text-area');
let playerTextArea = document.getElementById('player-text-area');
let dealerSymbolArea = document.getElementById('dealer-symbol-area');
let playerSymbolArea = document.getElementById('player-symbol-area');
let resultTextArea = document.getElementById('result-text-area');
let overallWins = document.getElementById('overall-wins');
let overallLosses = document.getElementById('overall-losses');
let newGameButton = document.getElementById('new-game-button');
let hitButton = document.getElementById('hit-button');
let stayButton = document.getElementById('stay-button');

//Hidden game controls
hitButton.style.display = 'none';
stayButton.style.display = 'none';

//Global Variables
let gameStart = false,
    gameOver = false,
    playWon = false,
    playPush = false,
    dealerCards = [],
    playerCards = [],
    dealerScore = 0,
    playerScore = 0,
    winningCount = 0,
    losingCount = 0,
    deck = [];

//Event listeners
newGameButton.addEventListener('click', function () {
    init();
    deck = createDeck();
    shuffleDeck(deck);
    dealerCards = [getNextCard(), getNextCard()];
    playerCards = [getNextCard(), getNextCard()];
    newGameButton.style.display = 'none';
    hitButton.style.display = 'inline';
    stayButton.style.display = 'inline';
    showStatus();
})

hitButton.addEventListener('click', function () {
    playerCards.push(getNextCard());
    checkForEndOfGame();
    showStatus();
});

stayButton.addEventListener('click', function () {
    gameOver = true;
    checkForEndOfGame();
    showStatus();
});

/**
 * Initialize global variables
 */
function init() {
    gameStart = true;
    gameOver = false;
    playerWon = false;
    playPush = false;
    resultTextArea.innerText = '';
    playerSymbolArea.innerText = '';
    dealerSymbolArea.innerText = '';

}

/**
 * Creates a deck of cards
 * 
 * @returns Array 
 */
function createDeck() {
    let deck = []
    for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
        for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
            let card = {
                suit: suits[suitIdx],
                value: values[valueIdx]
            }
            deck.push(card);
        }
    }
    return deck;
}

/**
 * Shuffle the deck of cards
 * 
 * @param Array deck 
 */
function shuffleDeck(deck) {
    for (let i = 0; i < 3000; i++) {
        var location1 = Math.floor((Math.random() * deck.length));
        var location2 = Math.floor((Math.random() * deck.length));
        var tmp = deck[location1];

        deck[location1] = deck[location2];
        deck[location2] = tmp;
    }
}

/**
 * Check if the game is finished and which player one the game, if dealer did not reach 21 or exceeds it, keep 
 * hitting for the dealer
 */
function checkForEndOfGame() {
    updateScores();

    if (gameOver) {

        while (dealerScore < 17 || dealerScore <= playerScore) {
            dealerCards.push(getNextCard());
            updateScores();
        }

        // while (dealerScore < playerScore &&
        //     playerScore <= 21 &&
        //     dealerScore < 17) {
        //     dealerCards.push(getNextCard());
        //     updateScores();
        // }
    }

    if (playerScore > 21) {
        playerWon = false;
        gameOver = true;
    }

    else if (dealerScore > 21) {
        playerWon = true;
        gameOver = true;
    }

    else if (gameOver) {
        if (playerScore > dealerScore) {
            playerWon = true;
        }
        else if (playerScore < dealerScore) {
            playWon = false;
        }
        else {
            playPush = true;
        }
    }
}

/**
 * Collect score from current player cards
 * 
 * @param Array cardArray 
 * @returns Int
 */
function getScore(cardArray) {
    let score = 0;
    let aceCount = 0;
    for (let i = 0; i < cardArray.length; i++) {
        let card = cardArray[i];
        if (card.value == 'Ace') {
            score += 11;
            aceCount++;
        } else {
            score += getCardNumericValue(card);
        }
    }

    //Check Ace's count and covert 11 into 1 until the score is below 21
    while (aceCount > 0) {
        if (score > 21) {
            score -= 10;
            aceCount--;
        } else {
            break;
        }
    }

    return score;
}

/**
 * Update score global variables with updated cards score
 */
function updateScores() {
    dealerScore = getScore(dealerCards);
    playerScore = getScore(playerCards);
}


/**
 * Collect current card info and show them on the page
 */
function showStatus() {

    overallWins.innerText = winningCount;
    overallLosses.innerText = losingCount;

    if (!gameStart) {
        return;
    }

    let dealerCardString = '';
    let dealerCarSymbols = '';
    for (let i = 0; i < dealerCards.length; i++) {
        dealerCardString += getCardString(dealerCards[i]) + ' - ';
        dealerCarSymbols += getCardSymbol(dealerCards[i]);
    }
    let playerCardString = '';
    let playerCarSymbols = '';
    for (let i = 0; i < playerCards.length; i++) {
        playerCardString += getCardString(playerCards[i]) + ' - ';
        playerCarSymbols += getCardSymbol(playerCards[i]);
    }

    updateScores();

    dealerTextArea.innerHTML = 'Dealer has: '.bold() +
        dealerCardString.italics() +
        '(score: ' + dealerScore.toString().bold() + ')';

    playerTextArea.innerHTML = 'Player has: '.bold() +
        playerCardString.italics() +
        '(score: ' + playerScore.toString().bold() + ')';

    dealerSymbolArea.innerHTML = dealerCarSymbols;
    playerSymbolArea.innerHTML = playerCarSymbols


    if (gameOver) {
        if (playerWon) {
            resultTextArea.innerText += "YOU WIN!";
            winningCount++;
        }
        else if (playPush) {
            resultTextArea.innerText += "It's a TIE";
        } else {
            resultTextArea.innerText += "DEALER WINS";
            losingCount++;
        }
        newGameButton.style.display = 'inline';
        hitButton.style.display = 'none';
        stayButton.style.display = 'none';

    }
}

/**
 * Get next card in deck
 * 
 * @returns Object
 */
function getNextCard() {
    return deck.shift();
}

/**
 * Convert card values into a representable string
 * 
 * @param Object card 
 * @returns String
 */
function getCardString(card) {
    if (card == undefined) return '';
    return card.value + " of " + card.suit;
}

/**
 * Convert card value into int
 * 
 * @param Object card 
 * @returns int
 */
function getCardNumericValue(card) {
    if (card == undefined) return 0;
    switch (card.value) {
        case 'Two':
            return 2;
        case 'Three':
            return 3;
        case 'Four':
            return 4;
        case 'Five':
            return 5;
        case 'Six':
            return 6;
        case 'Seven':
            return 7;
        case 'Eight':
            return 8;
        case 'Nine':
            return 9;
        default:
            return 10;
    }
}

/**
 * Convert card values into Unicode string representation of a deck card
 * 
 * @param Object card 
 * @returns String
 */
function getCardSymbol(card) {
    if (card == undefined) return '';
    switch (card.suit) {
        case 'Hearts':
            return getHeartSymbol(card.value);
        case 'Clubs':
            return getClubSymbol(card.value);
        case 'Diamonds':
            return getDiamondSymbol(card.value);
        default: // Spades           
            return getSpadeSymbol(card.value);
    }
}

/**
 * Get Unicode string of deck card symbol
 * 
 * @param String value 
 * @returns String
 */
function getHeartSymbol(value) {
    if (value == undefined) return '';
    switch (value) {
        case 'Ace':
            return '\u{1F0B1}';
        case 'Two':
            return '\u{1F0B2}';
        case 'Three':
            return '\u{1F0B3}';
        case 'Four':
            return '\u{1F0B4}';
        case 'Five':
            return '\u{1F0B5}';
        case 'Six':
            return '\u{1F0B6}';
        case 'Seven':
            return '\u{1F0B7}';
        case 'Eight':
            return '\u{1F0B8}';
        case 'Nine':
            return '\u{1F0B9}';
        case 'Ten':
            return '\u{1F0BA}';
        case 'King':
            return '\u{1F0BE}';
        case 'Queen':
            return '\u{1F0BD}';
        default: // Jack
            return '\u{1F0BB}';
    }
}

/**
 * Get Unicode string of deck card symbol
 * 
 * @param String value 
 * @returns String
 */
function getSpadeSymbol(value) {
    switch (value) {
        case 'Ace':
            return '\u{1F0A1}';
        case 'Two':
            return '\u{1F0A2}';
        case 'Three':
            return '\u{1F0A3}';
        case 'Four':
            return '\u{1F0A4}';
        case 'Five':
            return '\u{1F0A5}';
        case 'Six':
            return '\u{1F0A6}';
        case 'Seven':
            return '\u{1F0A7}';
        case 'Eight':
            return '\u{1F0A8}';
        case 'Nine':
            return '\u{1F0A9}';
        case 'Ten':
            return '\u{1F0AA}';
        case 'King':
            return '\u{1F0AE}';
        case 'Queen':
            return '\u{1F0AD}';
        default: // Jack
            return '\u{1F0AB}';
    }
}

/**
 * Get Unicode string of deck card symbol
 * 
 * @param String value 
 * @returns String
 */
function getDiamondSymbol(value) {
    switch (value) {
        case 'Ace':
            return '\u{1F0C1}';
        case 'Two':
            return '\u{1F0C2}';
        case 'Three':
            return '\u{1F0C3}';
        case 'Four':
            return '\u{1F0C4}';
        case 'Five':
            return '\u{1F0C5}';
        case 'Six':
            return '\u{1F0C6}';
        case 'Seven':
            return '\u{1F0C7}';
        case 'Eight':
            return '\u{1F0C8}';
        case 'Nine':
            return '\u{1F0C9}';
        case 'Ten':
            return '\u{1F0CA}';
        case 'King':
            return '\u{1F0CE}';
        case 'Queen':
            return '\u{1F0CD}';
        default: // Jack
            return '\u{1F0CB}';
    }
}

/**
 * Get Unicode string of deck card symbol
 * 
 * @param String value 
 * @returns String
 */
function getClubSymbol(value) {
    switch (value) {
        case 'Ace':
            return '\u{1F0D1}';
        case 'Two':
            return '\u{1F0D2}';
        case 'Three':
            return '\u{1F0D3}';
        case 'Four':
            return '\u{1F0D4}';
        case 'Five':
            return '\u{1F0D5}';
        case 'Six':
            return '\u{1F0D6}';
        case 'Seven':
            return '\u{1F0D7}';
        case 'Eight':
            return '\u{1F0D8}';
        case 'Nine':
            return '\u{1F0D9}';
        case 'Ten':
            return '\u{1F0DA}';
        case 'King':
            return '\u{1F0DE}';
        case 'Queen':
            return '\u{1F0DD}';
        default: // Jack
            return '\u{1F0DB}';
    }
}

