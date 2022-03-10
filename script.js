"use strict";

const Game = {
    board: new Array(9),

    render: function () {
        const container = document.querySelector(".board-container");
        const cells = container.children;
        for (let i = 0; i < 9; i++) {
            cells.item(i).innerText = this.board[i];
        }
    },
};

function Player (symbol) {
    const proto = {
        playMove() {
            
        }
    }
    return {symbol}
}

Game.board = ["O", "X", " ",
              " ", "O", "X",
              " ", "O", "X"];

Game.render();