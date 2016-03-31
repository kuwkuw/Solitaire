let BaseComponent = require('./baseComponent.js');

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