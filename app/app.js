
'use strict';
var GameComponent = require('./gameComponent.js');

var game = new GameComponent({element: document.querySelector('[data-component="game"]')});

document.querySelector('[data-selector="restart"]').addEventListener('click', game.restart.bind(game));


