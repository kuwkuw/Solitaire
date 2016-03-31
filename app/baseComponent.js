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
