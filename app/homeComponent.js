let BaseComponent = require('./baseComponent.js');

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