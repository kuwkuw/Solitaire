
let cardValuesEnum = require('./enums').cardValuesEnum;
let suitEnum = require('./enums').suitEnum;
let Card = require('./cardComponent');

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
               //Подписаться на событие изминения контейнера для карты
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