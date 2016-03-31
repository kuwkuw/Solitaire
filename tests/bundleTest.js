/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var GameComponent = __webpack_require__(1);

	let htmlString =
	'<div class="game-field" data-component="game">'+
	    '<div class="top-field">'+
	    '<div class="deck-zone" data-component="deck">'+
	    '<div class="cell deck-left">'+
	    '<div class="card upend"></div>'+
	    '</div>'+
	    '<div class="cell deck-right"></div>'+
	    '</div>'+
	    '<div class="home-zone">'+
	    '<div class="cell home-1"></div>'+
	    '<div class="cell home-2"></div>'+
	    '<div class="cell home-3"></div>'+
	    '<div class="cell home-4"></div>'+
	    '</div>'+
	    '</div>'+
	    '<div class="game-columns">'+
	    '<div class="column">'+
	    '<div class="cell"></div>'+
	    '</div>'+
	    '<div class="column">'+
	    '<div class="cell"></div>'+
	    '</div>'+
	    '<div class="column">'+
	    '<div class="cell"></div>'+
	    '</div>'+
	    '<div class="column">'+
	    '<div class="cell"></div>'+
	    '</div>'+
	    '<div class="column"><div class="cell"></div></div>'+
	'<div class="column"><div class="cell"></div></div>'+
	'<div class="column"><div class="cell"></div></div>'+
	'</div>'+
	'</div>';

	function creatMoqRootElement(htmlString){
	    let parser = new DOMParser();
	    return parser.parseFromString(htmlString, "text/xml");

	}
	var game = new GameComponent({element: creatMoqRootElement(htmlString)});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var DeckComponent = __webpack_require__(2);

	class GameComponent{
	    constructor(options) {
	        this._el = options.element;

	        this.deckComponent = new DeckComponent({element: this._el.querySelector('[data-component="deck"]')});

	        this.homesComponent;

	        this.columnsComponent;
	    }
	}

	module.exports =  GameComponent;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	
	let cardValuesEnum = __webpack_require__(3).cardValuesEnum;
	let suitEnum = __webpack_require__(3).suitEnum;
	let Card = __webpack_require__(4);

	class DeckComponent{
	    constructor(options){
	        this._el = options.element;

	        this._shuffledDeck = this._shuffle();
	    }

	    _createDeck(cardsCount){
	        for(let cardIndex = 0; cardIndex < cardsCount; cardIndex++){
	           for(let suitIndex = 0;suitIndex < suitEnum.length; suitIndex++){
	               this._deck.push(new Card({
	                   suit: suitEnum[suitIndex],
	                   value: cardValuesEnum[cardIndex],
	               }));
	           }
	        }
	    }

	    _shuffle(){

	    }


	}

	module.exports = DeckComponent;

/***/ },
/* 3 */
/***/ function(module, exports) {

	

	exports.cardValuesEnum = {
	    a: 'A',
	    k: 'K',
	    q: 'Q',
	    j: 'J',
	    ten: 10,
	    nine: 9,
	    eight: 8,
	    seven: 7,
	    six: 6,
	    five: 5,
	    four: 4,
	    three: 3,
	    two: 2
	}

	exports.suitEnum = {
	    clubs: '?',
	    diams: '?',
	    spades: '?',
	    hearts: '?'
	}


/***/ },
/* 4 */
/***/ function(module, exports) {

	
	class CardComponent{
	    constructor(options){
	        this.suit = options.suit;
	        this.value = options.value;
	    }
	}

	module.exports = CardComponent;

/***/ }
/******/ ]);