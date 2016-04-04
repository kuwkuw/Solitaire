let DeckComponent = require('./deckComponent.js');
let HomeComponent = require('./homeComponent.js');
let ColumnComponent =  require('./columnComponent.js');

class GameComponent{
    constructor(options) {
        this._el = options.element;
        this.homeComponents = [];
        this.columnComponents = [];
        //this._draggedCard;
        this._initDeckComponent()
        this._initHomeComponents();
        this._initColumnComponents()


        this._fillGameField();
    }

    restart(){
        console.log('restart');
        this.homeComponents.forEach((component)=>{component.clear()});
        this.columnComponents.forEach((component)=>{component.clear()});
        this.deckComponent.clear();
        this.deckComponent.shuffle();
        this._fillGameField();
    }

    _fillGameField(){
        for(let columnIndex = 0; columnIndex < 7; columnIndex++){
            this.columnComponents[columnIndex].fill(this.deckComponent.getCards(columnIndex+1));
        }
    }

    _initDeckComponent(){
        let element = this._el.querySelector('[data-component="deck"]');
        this.deckComponent = new DeckComponent({element: element});
        this.deckComponent.onOpenCardCatch(this._onCardCatchFromDeck.bind(this));
        this.deckComponent.onCardIsDropped(this._onCardIsDropped.bind(this));
    }

    _initHomeComponents(){
        for(let i = 0; i < 4; i++){
            let element = this._el.querySelector('[data-component="home-'+i+'"]');
            let home = new HomeComponent({element: element});
            this.homeComponents.push(home);
        }
    }



    _onCardCatchFromDeck(e){
        this._hookedCard = e.detail.cardObject;
        this._hookedCard.element.style.position = 'absolute';
        this._hookedCard.element.style.zIndex = 200;
        this._moveCard(e.detail.mouseCoordinates);
        document.onmousemove = this._moveCard.bind(this);
        //document.addEventListener('mousemove', this._moveCard.bind(this));
    }

    _onCardIsDropped(e){
        let card = this._hookedCard;

        //find new container object
        card.element.hidden = true;
        var el = document.elementFromPoint(e.detail.clientX, e.detail.clientY).closest('.cell');
        card.element.hidden = false;
        let container = this._findContainer(el);

        if(!!container && container.cardSuits(card)){
            container.add(card);
        }

        //card.element.style.position = '';
        card.element.style.top = '';
        card.element.style.left = '';
        this._hookedCard.element.style.zIndex = '';
        document.onmousemove = null;
        //document.removeEventListener('mousemove', this._moveCard);
    }

    _findContainer(el){
        let container = this.homeComponents.find((obj)=>{
            return obj.equalElement(el);
        });

        if(!container){
            container = this.columnComponents.find((obj)=>{
                return obj.equalElement(el);
            });
        }

        return container;
    }

    _moveCard(e){
        //e.preventDefault();
        this._hookedCard.moveElement({pageX: e.pageX, pageY: e.pageY});
    }

    _initColumnComponents() {
        for(let i = 0; i < 7; i++){
            let element = this._el.querySelector('[data-component="column-'+i+'"]');
            let home = new ColumnComponent({element: element});
            this.columnComponents.push(home);
        }
    }
}

module.exports =  GameComponent;