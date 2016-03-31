
let cardValuesEnum = require('./enums').cardValuesEnum;
let suitEnum = require('./enums').suitEnum;

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