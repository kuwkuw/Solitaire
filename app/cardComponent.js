
let cardValuesEnum = require('./enums').cardValuesEnum;
let suitEnum = require('./enums').suitEnum;

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