let DeckComponent = require('./deckComponent.js');
let HomeComponent = require('./homeComponent.js');
let ColumnComponent =  require('./columnComponent.js');

class GameComponent{
    constructor(options) {
        this._el = options.element;
        this.homeComponents = [];
        this.columnComponents = [];
        this._draggedCard;
        this._initDeckComponent()
        this._initHomeComponents();
        this._initColumnComponents()


        this._fillGameField();
        //this._el.addEventListener('mouseup', ()=>{console.log("game up")});
        //this._el.addEventListener('cardIsDropped', ()=>{console.log("game cardIsDropped")});
    }

    restart(){
        //this.homeComponents.forEach((component)=>{component.clear()});
        //this.columnComponents.forEach((component)=>{component.clear()});
        //this.deckComponent.clear();
        //this.deckComponent._shuffle();
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
        this._hookedCard.getElement().style.position = 'absolute';
        this._moveCard(e.detail.mouseEvent);
        document.onmousemove = this._moveCard.bind(this);
        //document.addEventListener('mousemove', this._moveCard.bind(this));
    }

    _onCardIsDropped(e){
        let card = e.detail.cardObject;
        console.log(card);
        card.getElement().hidden = true;
        var el = document.elementFromPoint(e.detail.mouseEvent.clientX, e.detail.mouseEvent.clientY);
        card.getElement().hidden = false;

        //find new container object
        let container = this._findContainer(el);

        if(!!container && container.cardSuits(card)){
            container.add(card);
        }

        this._hookedCard.getElement().style.position = '';

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
        this._hookedCard.moveElement(e);
    }

    _initColumnComponents() {
        for(let i = 0; i < 7; i++){
            let element = this._el.querySelector('[data-component="column-'+i+'"]');
            let home = new ColumnComponent({element: element});
            //home.onCardIsDropped(this._onCardIsDropped.bind(this));
            this.columnComponents.push(home);
        }    }
}

module.exports =  GameComponent;