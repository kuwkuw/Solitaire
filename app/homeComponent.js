
let cardValuesEnum = require('./enums').cardValuesEnum;
let BaseComponent = require('./baseComponent.js');

class HomeComponent extends BaseComponent{
    constructor(options){
        super(options)

        //this._el.addEventListener('mouseup', this._cardIsDropped.bind(this))
    }

    cardSuits(card){
        let keys = Object.keys(cardValuesEnum).reverse();
        let nextCardValueKey = keys[this._deck.length];
        let lastCard =  this._deck[ this._deck.length];

        if(!lastCard && card.value === nextCardValueKey){
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