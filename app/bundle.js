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
	        this._draggedCard;
	        this._initDeckComponent()
	        this._initHomeComponents();
	        this._initColumnComponents()


	        this._fillGameField();
	        //this._el.addEventListener('mouseup', ()=>{console.log("game up")});
	        //this._el.addEventListener('cardIsDropped', ()=>{console.log("game cardIsDropped")});
	    }

	    restart(){
	        //this.homeComponents.forEach((component)=>{component.clear()});
	        //this.columnComponents.forEach((component)=>{component.clear()});
	        //this.deckComponent.clear();
	        //this.deckComponent._shuffle();
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
	        this._hookedCard.getElement().style.position = 'absolute';
	        this._moveCard(e.detail.mouseEvent);
	        document.onmousemove = this._moveCard.bind(this);
	        //document.addEventListener('mousemove', this._moveCard.bind(this));
	    }

	    _onCardIsDropped(e){
	        let card = e.detail.cardObject;
	        console.log(card);
	        card.getElement().hidden = true;
	        var el = document.elementFromPoint(e.detail.mouseEvent.clientX, e.detail.mouseEvent.clientY);
	        card.getElement().hidden = false;

	        //find new container object
	        let container = this._findContainer(el);

	        if(!!container && container.cardSuits(card)){
	            container.add(card);
	        }

	        this._hookedCard.getElement().style.position = '';

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
	        this._hookedCard.moveElement(e);
	    }

	    _initColumnComponents() {
	        for(let i = 0; i < 7; i++){
	            let element = this._el.querySelector('[data-component="column-'+i+'"]');
	            let home = new ColumnComponent({element: element});
	            //home.onCardIsDropped(this._onCardIsDropped.bind(this));
	            this.columnComponents.push(home);
	        }    }
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
	        this._shuffle();

	        this._leftDeck.addEventListener('click', this._deckClickHandler.bind(this));
	        //this._rightDeck.addEventListener('mousedown', this._onCardCatch.bind(this));
	    }

	    onOpenCardCatch(handler){
	        this._deck.forEach((card)=>{card.onCardCatch(handler)});
	        //this._el.addEventListener('openCardCatch', hendler);
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
	               //TODO do implementation fo _removeCardFromDeck()
	               newCard.onContainerIsChanged(this._removeCardFromDeck.bind(this));
	               this._deck.push(newCard);
	           }
	        }
	    }

	    _shuffle(){
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
	        this._rightDeck.appendChild(this._openCard.getElement());

	        if(this._shuffledDeck.length === 0){
	            this._leftDeck.classList.remove('upend');
	        }
	    }

	    _removeCardFromDeck(){
	        console.log('remove card from deck')
	        this._openCard.onContainerIsChanged(null);
	        this._openCard = [];
	        this._showNextCard();
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

	        this._createCardElement();

	        this._el.addEventListener('mouseup', this._initCardDroppedEvent.bind(this))
	        this._el.addEventListener('mousedown', this._initCardCatch.bind(this));
	    }


	    getElement(){
	        return this._el;
	    }

	    setElement(element){
	        this._el = element;
	    }

	    equal(card){
	        if(this.suit === card.suit && this.value == card.value){
	            return true;
	        }
	        return false;
	    }

	    moveElement(e){
	        //let box = this._el.getBoundingClientRect();
	        //let boxParent = this._el.offsetParent.getBoundingClientRect();
	        //console.log('box', box);
	        //console.log('boxParent', boxParent);
	        //console.log('mous', e.pageX, e.pageY);
	        //let shiftX = e.pageX - box.left
	        //let shifrY = e.pageY - box.top;
	        //console.log('shifr', shiftX, shifrY);
	        //console.log('offset', this._el.offsetParent.offsetLeft, this._el.offsetParent.offsetTop)
	        //console.dir(this._el);
	        //
	        ////let left =  e.pageX - this._el.offsetWidth/2;
	        ////let top = e.pageY - this._el.offsetHeight/2;
	        let left =  e.pageX - (this._el.offsetWidth/2 + this._el.offsetParent.offsetLeft + 10);
	        let top = e.pageY - (this._el.offsetHeight/2 + this._el.offsetParent.offsetTop + 10);
	        this._el.style.left = left +'px';
	        this._el.style.top = top + 'px';
	    }

	    onCardIsDropped(handler){
	        this._el.addEventListener('cardIsDropped', handler);
	    }

	    onCardCatch(handler){
	        this._el.addEventListener('cardHooked', handler);
	    }

	    containerIsChanged(e){
	        let detail = {
	            'cardObject': this,
	            'mouseEvent' :e
	        };

	        let event = new CustomEvent('containerIsChanged', {detail: detail});
	        this._el.dispatchEvent(event);
	    }

	    onContainerIsChanged(handler){
	        this._el.addEventListener('containerIsChanged', handler);
	    }



	    _createCardElement(){
	        var newCartElement = document.createElement('div');
	        newCartElement.setAttribute('data-selector', 'card');
	        newCartElement.setAttribute('class', 'card grab '+this.suit+'-'+this.value);

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
	        if(!e.target.closest('[data-selector="card"]')){
	            return
	        }

	        let detail = {
	            'cardObject': this,
	            'mouseEvent' :e
	        };

	        let event = new CustomEvent('cardHooked', {detail: detail});
	        this._el.dispatchEvent(event);
	    }



	    _initCardDroppedEvent(e){
	        let detail = {
	            'cardObject': this,
	            'mouseEvent' :e
	        };
	        let event = new CustomEvent('cardIsDropped', {detail: detail});
	        this._el.dispatchEvent(event);
	    }


	}

	module.exports = CardComponent;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	let BaseComponent = __webpack_require__(6);

	class HomeComponent extends BaseComponent{
	    constructor(options){
	        super(options)


	        //this._el.addEventListener('mouseup', this._cardIsDropped.bind(this))
	    }

	    add(card){
	        card.onContainerIsChanged(this._moveCard.bind(this));
	        super.add(card);
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
	        this._el.innerHTML = '';
	        this._deck = [];
	    }

	    equalElement(el){
	        return this._el === el;
	    }

	    cardSuits(card){
	        if(this._deck.length === 0 ){
	            return true;
	        }
	        return false;
	    }
	    //Add card to container
	    add(card){
	        card.containerIsChanged();
	        this._deck.push(card);
	        this._el.appendChild(card.getElement());
	    }
	}


	module.exports = BaseComponent;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	let BaseComponent = __webpack_require__(6);

	class ColumnComponent extends BaseComponent{
	    constructor(options) {
	        super(options);
	    }

	    fill(cards){
	        let cardCount = cards.length
	        for(let cardIndex = 0; cardIndex < cardCount; cardIndex++){
	            this._deck.push(cards.pop());
	            if(cardIndex === cardCount-1){
	                let openCard = this._deck[this._deck.length-1].getElement();
	                //openCard.style.top = 10 * cardIndex + 'px';
	                //openCard.style.marginBottom = -150 * (cardIndex+1) + 'px';
	                this._el.appendChild(openCard);
	            }else{
	                this._addClosedCardElement(cardIndex);
	            }
	        }
	    }

	    add(card){

	        super.add(card);
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


	}


	module.exports =  ColumnComponent;

/***/ }
/******/ ]);