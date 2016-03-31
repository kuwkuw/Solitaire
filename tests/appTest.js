var GameComponent = require('../app/gameComponent.js');

let htmlString =
'<div class="game-field" data-component="game">'+
    '<div class="top-field">'+
    '<div class="deck-zone" data-component="deck">'+
    '<div class="cell deck-left">'+
    '<div class="card upend"></div>'+
    '</div>'+
    '<div class="cell deck-right"></div>'+
    '</div>'+
    '<div class="home-zone">'+
    '<div class="cell home-1"></div>'+
    '<div class="cell home-2"></div>'+
    '<div class="cell home-3"></div>'+
    '<div class="cell home-4"></div>'+
    '</div>'+
    '</div>'+
    '<div class="game-columns">'+
    '<div class="column">'+
    '<div class="cell"></div>'+
    '</div>'+
    '<div class="column">'+
    '<div class="cell"></div>'+
    '</div>'+
    '<div class="column">'+
    '<div class="cell"></div>'+
    '</div>'+
    '<div class="column">'+
    '<div class="cell"></div>'+
    '</div>'+
    '<div class="column"><div class="cell"></div></div>'+
'<div class="column"><div class="cell"></div></div>'+
'<div class="column"><div class="cell"></div></div>'+
'</div>'+
'</div>';

function creatMoqRootElement(htmlString){
    let parser = new DOMParser();
    return parser.parseFromString(htmlString, "text/xml");

}
var game = new GameComponent({element: creatMoqRootElement(htmlString)});
