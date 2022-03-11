"use strict";

const Gameboard = {
    board: ["","","","","","","","",""],

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
    gameboard: Gameboard,
    players: [Player("X"), Player("O")],
    toPlay: 0,

    handleClick: function(cell, index) {
        // if cell is already marked, ignore the click.
        if (cell.innerText != "") return false;

        this.players[this.toPlay].playMove(index);
        this.toPlay = (this.toPlay + 1) % this.players.length;
        Gameboard.render();
        return true;
    },

    // return winning player's mark. Return 1 for a tie, 0 for an unfinished game.
    score: function() {
        const b = this.gameboard.board;

        //rows
        if (b[0] === b[1] && b[1] === b[2] && b[0] != "") return b[0];
        if (b[3] === b[4] && b[4] === b[5] && b[3] != "") return b[3];
        if (b[6] === b[7] && b[7] === b[8] && b[6] != "") return b[6];

        // columns
        if (b[0] === b[3] && b[3] === b[6] && b[0] != "") return b[0];
        if (b[1] === b[4] && b[4] === b[7] && b[1] != "") return b[1];
        if (b[2] === b[5] && b[5] === b[8] && b[2] != "") return b[2];

        // diagonals
        if (b[0] === b[4] && b[4] === b[8] && b[0] != "") return b[0];
        if (b[2] === b[4] && b[4] === b[6] && b[2] != "") return b[2];

        // if an empty cell is found, game is unfinished.
        for (const c of b) if (c == "") return 0;

        // if you're still here, it's a tie.
        return 1;
    }
}

Gameboard.render();