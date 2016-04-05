
let cardValuesEnum = require('./enums').cardValuesEnum;
let BaseComponent = require('./baseComponent.js');

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
        let cardCount = cards.length;
        for(let cardIndex = 0; cardIndex < cardCount; cardIndex++){
            let newCard = cards.pop();
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

        return !!(this._cardValueSuits(card) && this._cardColorSuits(card));


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

    _createClosedCardElement(){
        let element = document.createElement('div');
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