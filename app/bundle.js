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

	
	'use strict';
	var GameComponent = __webpack_require__(1);

	var game = new GameComponent({element: document.querySelector('[data-component="game"]')});

	document.querySelector('[data-selector="restart"]').addEventListener('click', game.restart.bind(game));




/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	let DeckComponent = __webpack_require__(2);
	let HomeComponent = __webpack_require__(5);
	let ColumnComponent =  __webpack_require__(7);

	class GameComponent{
	    constructor(options) {
	        this._el = options.element;
	        this.homeComponents = [];
	        this.columnComponents = [];
	        //this._draggedCard;
	        this._initDeckComponent()
	        this._initHomeComponents();
	        this._initColumnComponents()

	        this._fillGameField();

	        this._el.addEventListener('contextmenu', (e)=>{e.preventDefault()});
	    }

	    restart(){
	        console.log('restart');
	        this.homeComponents.forEach((component)=>{component.clear()});
	        this.columnComponents.forEach((component)=>{component.clear()});
	        this.deckComponent.clear();
	        this.deckComponent.shuffle();
	        this._fillGameField();
	    }

	    _fillGameField(){
	        for(let columnIndex = 0; columnIndex < 7; columnIndex++){
	            this.columnComponents[columnIndex].fill(this.deckComponent.getCards(columnIndex+1));
	        }
	    }

	    _initDeckComponent(){
	        let element = this._el.querySelector('[data-component="deck"]');
	        this.deckComponent = new DeckComponent({element: element});
	        this.deckComponent.onOpenCardCatch(this._onCardCatchFromDeck.bind(this));
	        this.deckComponent.onCardIsDropped(this._onCardIsDropped.bind(this));
	    }

	    _initHomeComponents(){
	        for(let i = 0; i < 4; i++){
	            let element = this._el.querySelector('[data-component="home-'+i+'"]');
	            let home = new HomeComponent({element: element});
	            this.homeComponents.push(home);
	        }
	    }



	    _onCardCatchFromDeck(e){
	        this._hookedCard = e.detail.cardObject;
	        this._hookedCard.element.style.position = 'absolute';
	        this._hookedCard.element.style.zIndex = 200;
	        this._moveCard(e.detail.mouseCoordinates);
	        document.onmousemove = this._moveCard.bind(this);
	        //document.addEventListener('mousemove', this._moveCard.bind(this));
	    }

	    _onCardIsDropped(e){
	        let card = this._hookedCard;

	        //find new container object
	        card.element.hidden = true;
	        var el = document.elementFromPoint(e.detail.clientX, e.detail.clientY).closest('.cell');
	        card.element.hidden = false;
	        let container = this._findContainer(el);

	        if(!!container && container.cardSuits(card)){
	            container.add(card);
	        }


	        card.element.style.top = '';
	        card.element.style.left = '';
	        this._hookedCard.element.style.zIndex = '';
	        document.onmousemove = null;
	        //document.removeEventListener('mousemove', this._moveCard);
	    }

	    _findContainer(el){
	        let container = this.homeComponents.find((obj)=>{
	            return obj.equalElement(el);
	        });

	        if(!container){
	            container = this.columnComponents.find((obj)=>{
	                return obj.equalElement(el);
	            });
	        }

	        return container;
	    }

	    _moveCard(e){
	        //e.preventDefault();
	        this._hookedCard.moveElement({pageX: e.pageX, pageY: e.pageY});
	    }

	    _initColumnComponents() {
	        for(let i = 0; i < 7; i++){
	            let element = this._el.querySelector('[data-component="column-'+i+'"]');
	            let home = new ColumnComponent({element: element});
	            this.columnComponents.push(home);
	        }
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
	        this._CARDS_COUNT = 52;
	        this._el = options.element;
	        this._deck = [];
	        this._shuffledDeck =[];
	        this._tmpDeck = [];
	        this._leftDeck = this._el.querySelector('[data-selector="left-deck"]');
	        this._rightDeck = this._el.querySelector('[data-selector="right-deck"]');
	        this._createDeck();
	        this.shuffle();

	        this._leftDeck.addEventListener('click', this._deckClickHandler.bind(this));
	    }
	    clear(){
	        this._shuffledDeck =[];
	        this._tmpDeck = [];
	        this._openCard = null;
	        this._rightDeck.innerHTML = '';
	    }
	    onOpenCardCatch(handler){
	        this._deck.forEach((card)=>{card.onCardCatch(handler)});
	    }

	    onCardIsDropped(handler){
	        this._deck.forEach((card)=>{card.onCardIsDropped(handler)});
	    }

	    getCards(count){
	        let cards = [];
	        while(count!==0){
	            cards.push(this._shuffledDeck.pop());
	            count--;
	        }
	        return cards;
	    }

	    _createDeck(){
	        for(let cardValueProp in cardValuesEnum){
	           for(let suitProp in suitEnum){
	               let card = {
	                   suit: suitProp,
	                   value: cardValueProp
	               };
	               let newCard = new Card(suitProp, cardValueProp);
	               //����������� �� ������� ��������� ���������� ��� �����
	               newCard.onContainerIsChanged(this._removeCardFromDeck.bind(this));
	               this._deck.push(newCard);
	           }
	        }
	    }

	    shuffle(){
	        while(this._shuffledDeck.length < this._deck.length){
	            let randomIndex = this._getRandom(0, this._deck.length);
	            let newCard = this._deck[randomIndex];
	            if(this._isCardInShuffleDeck(newCard) === -1){
	                this._shuffledDeck.push(newCard);
	            }
	        }
	    }

	    _isCardInShuffleDeck(card){
	        return this._shuffledDeck.findIndex((item)=>{
	            if(item.equal(card)){
	                return true;
	            }
	            return false;
	        });
	    }

	    _deckClickHandler(e){
	        if(this._shuffledDeck.length === 0 && this._tmpDeck.length === 0){
	            return;
	        }

	        if(this._shuffledDeck.length > 0){
	            this._showNextCard();
	        }else{
	            this._shuffledDeck = this._tmpDeck.reverse();
	            this._tmpDeck = [];
	            this._leftDeck.classList.add('upend');
	            this._leftDeck.classList.remove('empty-deck');
	            this._rightDeck.innerHTML = '';
	        }
	    }

	    _getRandom(min, max){
	        return Math.floor(Math.random() * (max - min) + min);
	    }

	    _showNextCard() {
	        if(this._openCard){
	            this._tmpDeck.push(this._openCard);
	        }

	        this._openCard = this._shuffledDeck.pop();

	        this._rightDeck.innerHTML = '';
	        this._rightDeck.appendChild(this._openCard.element);

	        if(this._shuffledDeck.length === 0){
	            this._leftDeck.classList.remove('upend');
	            this._leftDeck.classList.add('empty-deck');
	        }
	    }
	    _showPrevCard(){
	        this._rightDeck.innerHTML = '';
	        if(!this._openCard){
	            this._openCard = this._tmpDeck.pop();
	            this._rightDeck.appendChild(this._openCard.element);
	        }



	    }
	    _removeCardFromDeck(){
	        this._openCard.onContainerIsChanged(null);
	        this._openCard = null;
	        if(this._tmpDeck.length > 0){
	            this._showPrevCard();
	        }
	        //this._showNextCard();
	        console.log('Card was removed from deck. Cards in deck:' + (this._shuffledDeck.length + this._tmpDeck.length));
	    }
	}

	module.exports = DeckComponent;

/***/ },
/* 3 */
/***/ function(module, exports) {

	
	exports.cardValuesEnum = {
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
	    two: 2,
	    a: 'A'
	};

	exports.suitEnum = {
	    clubs: '&clubs;',
	    diams: '&diams;',
	    spades: '&spades;',
	    hearts: '&hearts;'
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	
	let cardValuesEnum = __webpack_require__(3).cardValuesEnum;
	let suitEnum = __webpack_require__(3).suitEnum;

	class CardComponent{
	    constructor(suit, value){
	        this.suit = suit;
	        this.value = value;
	        this.nextCard = null;
	        this._createCardElement();

	        this._el.addEventListener('mouseup', this._initCardDroppedEvent.bind(this))
	        this._el.addEventListener('mousedown', this._initCardCatch.bind(this));
	    }

	    get element(){
	        return this._el;
	    }

	    set element(element){
	        this._el = element;
	    }

	    equal(card){
	        if(this.suit === card.suit && this.value == card.value){
	            return true;
	        }
	        return false;
	    }

	    moveElement(mouseCoordinates){
	        let left =  mouseCoordinates.pageX - (this._el.offsetWidth/2 + this._el.offsetParent.offsetLeft + 10);
	        let top = mouseCoordinates.pageY - (this._el.offsetHeight/2 + this._el.offsetParent.offsetTop + 10);
	        this._el.style.left = left +'px';
	        this._el.style.top = top + 'px';
	    }

	    onCardIsDropped(handler){
	        this._el.addEventListener('cardIsDropped', handler);
	    }

	    onCardCatch(handler){
	        this._el.addEventListener('cardHooked', handler);
	    }

	    containerIsChanged(){
	        this.containerIsChangedHendler(this);
	    }

	    onContainerIsChanged(handler){
	        this.containerIsChangedHendler = handler;
	    }

	    _createCardElement(){
	        var newCartElement = document.createElement('div');
	        newCartElement.setAttribute('data-selector', 'card');
	        newCartElement.setAttribute('class', 'card grab '+this.suit);

	        var cardValue = this._cardValueElement(cardValuesEnum[this.value]);
	        var cardSuit = this._cardSuitElement(suitEnum[this.suit]);

	        newCartElement.appendChild(cardValue);
	        newCartElement.appendChild(cardSuit);

	        this._el = newCartElement;
	    }

	    _cardValueElement(value){
	        let cardValue = document.createElement('div');
	        cardValue.setAttribute('class', 'value');
	        cardValue.innerText = value;
	        return cardValue
	    }

	    _cardSuitElement(suit){
	        let cardSuit = document.createElement('div');
	        cardSuit.setAttribute('class', 'suit');
	        cardSuit.insertAdjacentHTML('afterbegin', suit);
	        return cardSuit
	    }
	    _initCardCatch(e){
	        e.stopPropagation();
	        e.preventDefault();
	        if(!e.target.closest('[data-selector="card"]')){
	            return
	        }

	        let detail = {
	            'cardObject': this,
	            'mouseCoordinates': this._getEventCoordinates(e)
	        };

	        let event = new CustomEvent('cardHooked', {detail: detail});
	        this._el.dispatchEvent(event);
	    }

	    _initCardDroppedEvent(e){
	        e.preventDefault();
	        //let detail = {
	        //    'cardObject': this,
	        //    'mouseCoordinates': this._getEventCoordinates(e)
	        //};
	        let event = new CustomEvent('cardIsDropped', {detail: this._getEventCoordinates(e)});
	        this._el.dispatchEvent(event);
	    }

	    _getEventCoordinates(e){
	        return {'pageX': e.pageX, 'pageY': e.pageY, 'clientX': e.clientX, 'clientY': e.clientY }
	    }
	}

	module.exports = CardComponent;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	
	let cardValuesEnum = __webpack_require__(3).cardValuesEnum;
	let BaseComponent = __webpack_require__(6);

	class HomeComponent extends BaseComponent{
	    constructor(options){
	        super(options)

	        //this._el.addEventListener('mouseup', this._cardIsDropped.bind(this))
	    }

	    cardSuits(card){
	        let keys = Object.keys(cardValuesEnum).reverse();
	        let nextCardValueKey = keys[this._deck.length];
	        let lastCard =  this._deck[this._deck.length];

	        if(this._deck.length === 0 && card.value === nextCardValueKey){
	            return true;
	        }

	        if(card.value === nextCardValueKey && card.suit === this._deck[0].suit){
	            return true;
	        }

	        return false;
	    }

	    add(card){
	        card.containerIsChanged();
	        this._deck.push(card);
	        card.onContainerIsChanged(this._moveCard.bind(this));
	        this._el.appendChild(card.element);
	    }

	    _moveCard(){
	        this._deck.pop();
	    }

	}

	module.exports = HomeComponent;

/***/ },
/* 6 */
/***/ function(module, exports) {

	class BaseComponent{
	    constructor(options){
	        this._el = options.element;
	        this._deck = [];
	    }

	    clear(){
	        this._deck = [];
	        this._el.innerHTML = '';
	    }

	    equalElement(el){
	        return this._el === el;
	    }

	}


	module.exports = BaseComponent;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	
	let cardValuesEnum = __webpack_require__(3).cardValuesEnum;
	let BaseComponent = __webpack_require__(6);

	class ColumnComponent extends BaseComponent{
	    constructor(options) {
	        //this._openCards = [];
	        super(options);
	    }

	    get _lastCard(){
	        let currentCard = this._firstOpenCard;
	        while(!!currentCard.nextCard){
	            currentCard = currentCard.nextCard;
	        }

	        return currentCard;
	    }

	    get lastCardValue() {
	        return this._lastCard.value;
	    }

	    fill(cards){
	        let cardCount = cards.length
	        for(let cardIndex = 0; cardIndex < cardCount; cardIndex++){
	            let newCard = cards.pop()
	            newCard.onContainerIsChanged(this._removeCard.bind(this));
	            if(cardIndex === cardCount -1){
	                this._firstOpenCard = newCard;
	                //openCard.style.top = 10 * cardIndex + 'px';
	                //openCard.style.marginBottom = -150 * (cardIndex+1) + 'px';
	                this._el.appendChild(this._firstOpenCard.element);

	            }else{
	                this._deck.push(newCard);
	                this._addClosedCardElement(cardIndex);
	            }
	        }
	    }

	    cardSuits(card){
	        if(this._deck.length === 0 && !this._firstOpenCard){
	            return true;
	        }

	        if(this._cardValueSuits(card) && this._cardColorSuits(card) ){
	            return true;
	        }

	        return false;
	    }

	   _cardValueSuits(card){
	       let prevCard = this._lastCard;
	       let keys = Object.keys(cardValuesEnum);
	       return card.value === keys[keys.indexOf(prevCard.value) + 1];
	    }

	    _cardColorSuits(card){
	        let prevCard = this._lastCard;
	        if(prevCard.suit === 'clubs' || prevCard.suit === 'spades'){
	            return card.suit === 'diams' || card.suit === 'hearts';
	        }else{
	            return card.suit === 'clubs' || card.suit === 'spades';
	        }
	    }

	    add(card){
	        card.element.style.position = '';
	        card.containerIsChanged();
	        card.onContainerIsChanged(this._removeCard.bind(this));
	        this._addCardToColumn(card);
	    }

	    _addCardToColumn(card) {
	        if(this._firstOpenCard){
	            this._lastCard.element.appendChild(card.element);
	            this._lastCard.nextCard = card;
	        }
	        else{
	            this._firstOpenCard = card;
	            this._el.appendChild(this._firstOpenCard.element);
	        }

	    }

	    _addClosedCardElement(cardIndex){
	        this._el.appendChild(this._createClosedCardElement(cardIndex));
	    }

	    _createClosedCardElement(cardIndex){
	        let element = document.createElement('div')
	        element.setAttribute('class', 'card upend');
	        element.style.marginBottom = -150 + 'px';
	        return element;
	    }

	    _removeCard(card){
	        if(!this._firstOpenCard){
	            return;
	        }

	        let currentCard = this._firstOpenCard;
	        if(currentCard.equal(card)){
	            this._firstOpenCard = null;
	        }
	        while(currentCard.nextCard){
	            if(currentCard.nextCard.equal(card)){
	                currentCard.nextCard = null;
	                break;
	            }
	            currentCard = currentCard.nextCard;
	        }

	        if(!this._firstOpenCard && this._deck.length !== 0){
	            this._openCardFromColumnDeck();
	        }
	    }

	    _openCardFromColumnDeck() {
	        this._el.querySelectorAll('.card.upend')[this._deck.length-1].outerHTML = '';
	        this._firstOpenCard = this._deck.pop();
	        this._el.appendChild(this._firstOpenCard.element);
	    }
	}


	module.exports =  ColumnComponent;

/***/ }
/******/ ]);