class BaseComponent{
    constructor(options){
        this._el = options.element;
        this._deck = [];
    }

    clear(){
        this._deck = [];
        this._el.innerHTML = '';
    }

    equalElement(el){
        return this._el === el;
    }

}


module.exports = BaseComponent;
