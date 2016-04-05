
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
               //Подписаться на событие изминения контейнера для карты
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