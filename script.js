"use strict";

const Gameboard = {
    board: new Array(9),

    render: function () {
        const container = document.querySelector(".board-container");
        const cells = container.children;
        for (let i = 0; i < 9; i++) {
            cells.item(i).innerText = this.board[i];
        }
    },

    mark: function(player, index) {
        this.board[index] = player.symbol;
    }
};

// Player factory
function Player(symbol) {
    const playMove = function (index) {
        Gameboard.mark(this, index);
    };
    return { symbol, playMove };
}

const Game = {
    players: [Player("X"), Player("O")],
    toPlay: 0,
    handleClick: function (index) {
        this.players[this.toPlay].playMove(index);
        this.toPlay = (this.toPlay + 1) % this.players.length;
        Gameboard.render();
    }
}


Gameboard.board = [ "O", "X", " ",
                    " ", "O", "X",
                    " ", "O", "X"];

Player("X").playMove(2);
Gameboard.render();