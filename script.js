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
    },

    // Return an array of free cell indices.
    freeCells: function () {
        const res = [];
        for (let i = 0; i < 9; i++) {
            if (this.board[i] == "")
                res.push(i);
        }
        return res;
    }
};

// Player factory
function Player(name, symbol) {
    const playMove = function (index) {
        Gameboard.mark(this, index);
    };

    const undoMove = function(c) {
        Gameboard.board[c] = "";
    }

    return {name, symbol, playMove, undoMove};
}

const Game = {
    gameboard: Gameboard,
    state: "menu",
    players: [Player('Player1', "X"), Player('Player2', "O")],
    toPlay: 0,

    newGame: function() {
        // get data from form
        const playerXname = document.querySelector("#playerX").value;
        const playerOname = document.querySelector("#playerO").value;

        // create first player or CPU.
        if (playerXname == "CPU")
            this.players = [CPU(this, 0, "X", "ideal")];
        else
            this.players = [Player(playerXname, "X")];

        // create second player or CPU.
        if (playerOname == "CPU")
            this.players.push(CPU(this, 1, "O", "ideal"));
        else
            this.players.push(Player(playerOname, "O"));

        // clear board
        this.gameboard.clear();

        this.toPlay = 0;

        // switch game state
        this.state = "game";

        // handle possible AI turns.
        
        this.writeMessage(`${this.players[this.toPlay].name}'s turn (${this.players[this.toPlay].symbol}).`);
        this.playAI();
        this.gameboard.render();
    },

    nextTurn: function() {
        this.toPlay = (this.toPlay + 1) % this.players.length;

        this.writeMessage(`${this.players[this.toPlay].name}'s turn (${this.players[this.toPlay].symbol}).`);
    },

    handleClick: function(cell, index) {
        // if not in "game" state, ignore click.
        if (this.state != "game") return false;

        // if cell is already marked, ignore the click.
        if (cell.innerText != "") return false;

        this.players[this.toPlay].playMove(index);
        this.nextTurn();
        
        // handle AI turns, but only if game is not over.
        if (this.checkGameOver() == 0)
            this.playAI();
        
        this.gameboard.render();
        
        return true;
    },

    // returns 0 if game is not over.
    checkGameOver: function() {
        // score game.
        const s = this.score();
                
        // Handle game over.
        if (s != 0) {
            this.state = "menu";
            this.declareWinner(s);
        }

        return s;
    },

    declareWinner: function(score) {
        switch (score) {
            case 1: this.writeMessage("Tie!");
            break;
            case "X": this.writeMessage(`${this.players[0].name} won!`);
            break;
            case "O": this.writeMessage(`${this.players[1].name} won!`);
            break;
        }
    },

    writeMessage: function(message) {
        const span = document.querySelector("#winner");
        span.innerText = message;
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
    },

    playAI: function() {
        // keep going as long as you find AIs to play.
        let player = this.players[this.toPlay];
        while (player.name == "CPU") {
            player.playMove(player.chooseMove());

            // if game over, exit loop. Otherwise move onto next turn.
            if(this.checkGameOver() !== 0) break;
            
            this.nextTurn();
            player = this.players[this.toPlay];
        }

    }
}

//CPU factory
function CPU(game, order, symbol, AI) {
    const obj = Player("CPU", symbol);

    obj.randMove = function() {
        const free = game.gameboard.freeCells();
        return free[Math.floor(Math.random() * free.length)];
    }

    switch (AI) {
        case "random":
        // Play random moves.
        obj.chooseMove = function() {
            const free = game.gameboard.freeCells();
            return free[Math.floor(Math.random() * free.length)];
        }
        break;

        case "ideal":
        // Play an ideal strategy
        obj.chooseMove = function() {
            const free = game.gameboard.freeCells();
            
            // Check if I can win
            const win = this.findWin(this);

            if (win !== false) return win;
            else {
                // otherwise, check if I can block opponent's win
                const block = this.findWin(game.players[(game.toPlay + 1) % game.players.length]);
                if (block !== false) return block;
                
                else return this.randMove();
            }

        }
        break;
    }

    

    // try marking every free cell
    obj.findWin = function(player) {
        const free = Gameboard.freeCells();
        for (let c of free) {

            // test move;
            player.playMove(c);
            const s = Game.score();
            player.undoMove(c);

            // if we found the winning move, return it; otherwise, keep going.
            if (s == player.symbol) {
                return c;
            }
        }

        return false;
    }

    return obj;
}

Gameboard.render();