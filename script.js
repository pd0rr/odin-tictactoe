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
    },

    clear: function() {
        this.board = ["","","","","","","","",""];
    }
};

// Player factory
function Player(name, symbol) {
    const playMove = function (index) {
        Gameboard.mark(this, index);
    };
    return {name, symbol, playMove};
}

const Game = {
    gameboard: Gameboard,
    state: "menu",
    players: [Player('Player1', "X"), Player('Player2', "O")],
    toPlay: 0,

    newGame: function() {
        // get data from form
        const playerXname = document.querySelector("#playerX");
        const playerOname = document.querySelector("#playerO");

        // create players
        this.players = [Player(playerXname, "X"), Player(playerOname, "O")];

        // clear board
        this.gameboard.clear();

        // switch game state
        this.state = "game";

        this.gameboard.render();
    },

    handleClick: function(cell, index) {
        // if not in "game" state, ignore click.
        if (this.state != "game") return false;

        // if cell is already marked, ignore the click.
        if (cell.innerText != "") return false;

        this.players[this.toPlay].playMove(index);
        this.toPlay = (this.toPlay + 1) % this.players.length;
        
        // score game.
        const s = this.score();

        // Handle game over.
        if (s != 0) {
            this.state = "menu";
            this.toPlay = 0;
        }
        
        this.gameboard.render();
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