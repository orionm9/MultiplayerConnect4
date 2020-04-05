// Orion Moreno
// CS 479
// Connect 4 game for personal website to demonstrate js, html, & css

// server testing
// Making sure window loads completely before starting
window.onload = function() {
        var socket = io();
        //Testing server by sending message out
        socket.on('message', function(data) {
            console.log(data);
        });
        //creating a new player when tab is opened
        socket.emit('new player');

        // game state
        socket.on('state', function(gameState) {
            for (let player in gameState.players) {
                Myplayer(gameState.players[player])
            }
        });



        function Myplayer(player) {
            // Player movements
            const playerMovement = {
                    redTurn: true,
                    yellowTurn: false
                }
                //testing if data can be transfered to players

            // console.log(player.Pid);
            // console.log(player.myTurn + " before");
            // player.myTurn = true;
            // console.log(player.myTurn + " after");



            // Prompt players to enter name
            // while (!player1) {
            //     var player1 = prompt('Player One you will be red:');
            // };

            // while (!player2) {
            //     var player2 = prompt('Player Two you will be yellow:');
            // };
            var player1 = "Red Guy";
            var player2 = "Yellow Guy";


            //set colors for players to fill slots with when it's their turn
            var player1Color = 'red';
            var player2Color = 'yellow';

            // Selectors to keep track of table information, we are getting data from html to be able
            // to use it in our js to create actions play connect 4
            var tableRow = document.getElementsByTagName('tr');
            // there are 42 slots
            var tableData = document.getElementsByTagName('td');
            var playerTurn = document.querySelector('.playerTurn');
            const slots = document.querySelectorAll('.slot');
            const resetBtn = document.querySelector('.resetMe');


            // var currentPlayer = 1;
            // if (player.Pid == 1 && playerMovement.redTurn == false) {
            //     playerMovement.redTurn = true;
            // }
            // if (player.Pid == 2 && playerMovement.yellowTurn == false) {
            //     playerMovement.yellowTurn = true;
            // }
            playerTurn.textContent = `${player1}'s turn!`
            playerTurn.style.color = player1Color;


            // for loop to log cell coordinates when clicked, displays in console to test if positions are correct
            // There are 42 slots a user can select, 6 X 7 table.
            for (i = 0; i < tableData.length; i++) {
                tableData[i].addEventListener('click', (e) => {
                    console.log(`${e.target.parentElement.rowIndex},${e.target.cellIndex}`)
                });
            };


            // Funtion to change color of slot to user
            function changeColor(e) {

                // Get clicked column index
                let column = e.target.cellIndex;
                //row index
                let row = [];

                //we want to check bottom row first because that's the first slot that will get a color and go up after
                for (i = 5; i > -1; i--) {
                    //check if slot hasn't be selected yet
                    if (tableRow[i].children[column].style.backgroundColor == 'white') {
                        if (typeof row !== 'undefined') {
                            row.push(tableRow[i].children[column]);
                        } else
                            console.log("Error here");
                        //keep track of which cell has been selected

                        //Player 1's turn
                        if (player.Pid === 1 && playerMovement.redTurn) {

                            playerTurn.style.color = player2Color;
                            row[0].style.backgroundColor = 'red';
                            // adding class to create fall animation on slot
                            row[0].classList.add('fall');
                            // socket.emit("PlayerMoved", { row: i, column: column, playerMovement: playerMovement });
                            if (horizontalCheck() || verticalCheck() || diagonalCheck() || diagonalCheck2()) {
                                playerTurn.textContent = `${player1} WINS!!`;
                                playerTurn.style.color = player1Color;
                                return alert(`${player1} WINS!!`);
                            } else if (drawCheck()) {
                                playerTurn.textContent = 'DRAW!';
                                return alert('DRAW!');
                            } else {
                                playerTurn.textContent = `${player2}'s turn`
                                    // return currentPlayer = 2;
                                playerMovement.yellowTurn = true;
                                socket.emit("PlayerMoved", { row: i, column: column, playerMovement: playerMovement });

                                return playerMovement.redTurn = false;

                            }
                        } //Player 2's turn
                        else if (player.Pid === 2 && playerMovement.yellowTurn) {
                            playerTurn.style.color = player1Color;
                            row[0].style.backgroundColor = 'yellow';
                            row[0].classList.add('fall');
                            if (horizontalCheck() || verticalCheck() || diagonalCheck() || diagonalCheck2()) {
                                playerTurn.textContent = `${player2} WINS!!`;
                                playerTurn.style.color = player2Color;
                                return alert(`${player2} WINS!!`);
                            } else if (drawCheck()) {
                                playerTurn.textContent = 'DRAW!';
                                return alert('DRAW!');
                            } else {
                                playerTurn.textContent = `${player1}'s turn`;
                                playerMovement.redTurn = true;
                                socket.emit("PlayerMoved", { row: i, column: column, playerMovement: playerMovement });

                                return playerMovement.yellowTurn = false;
                            }
                        }
                        //added to send update on player turns
                        setInterval(function() {
                            socket.emit('playerMovement', playerMovement);
                        });
                    }
                }
                //socket.emit('board update', row);
            } //end change color

            Array.prototype.forEach.call(tableData, (cell) => {
                cell.addEventListener('click', changeColor);
                // Set all slots to white game.
                cell.style.backgroundColor = 'white';
                // socket.on('update', function(row) {
                //     cell.addEventListener('click', changeColor(e, row));
                // });
            });

            //comparing 4 different spots to return true or false
            function colorMatchCheck(one, two, three, four) {
                return (one === two && one === three && one === four && one !== 'white' && one !== undefined);
            }
            // functions to check if horizontal, vertical, diagonal in either direction, or draw occurs
            function horizontalCheck() {
                for (let row = 0; row < tableRow.length; row++) {
                    // 4 because you can only win 4 ways on horizontal
                    for (let col = 0; col < 4; col++) {
                        if (colorMatchCheck(tableRow[row].children[col].style.backgroundColor, tableRow[row].children[col + 1].style.backgroundColor,
                                tableRow[row].children[col + 2].style.backgroundColor, tableRow[row].children[col + 3].style.backgroundColor)) {
                            return true;
                        }
                    }
                }
            }
            //checking vertical for 4 in a row
            function verticalCheck() {
                for (let col = 0; col < 7; col++) {
                    for (let row = 0; row < 3; row++) {
                        if (colorMatchCheck(tableRow[row].children[col].style.backgroundColor, tableRow[row + 1].children[col].style.backgroundColor,
                                tableRow[row + 2].children[col].style.backgroundColor, tableRow[row + 3].children[col].style.backgroundColor)) {
                            return true;
                        };
                    }
                }
            }
            //checking both diagonals
            function diagonalCheck() {
                for (let col = 0; col < 4; col++) {
                    for (let row = 0; row < 3; row++) {
                        if (colorMatchCheck(tableRow[row].children[col].style.backgroundColor, tableRow[row + 1].children[col + 1].style.backgroundColor,
                                tableRow[row + 2].children[col + 2].style.backgroundColor, tableRow[row + 3].children[col + 3].style.backgroundColor)) {
                            return true;
                        }
                    }
                }

            }

            function diagonalCheck2() {
                for (let col = 0; col < 4; col++) {
                    for (let row = 5; row > 2; row--) {
                        if (colorMatchCheck(tableRow[row].children[col].style.backgroundColor, tableRow[row - 1].children[col + 1].style.backgroundColor,
                                tableRow[row - 2].children[col + 2].style.backgroundColor, tableRow[row - 3].children[col + 3].style.backgroundColor)) {
                            return true;
                        }
                    }
                }
            }

            //check for draw
            function drawCheck() {
                let fullSlot = []
                for (i = 0; i < tableData.length; i++) {
                    if (tableData[i].style.backgroundColor !== 'white') {
                        fullSlot.push(tableData[i]);
                    }
                }
                if (fullSlot.length === tableData.length) {
                    return true;
                }
            }

            // reset game if button is pressed
            //dont need this right now
            resetBtn.addEventListener('click', () => {
                //set all colors back to white
                slots.forEach(slot => {
                    slot.style.backgroundColor = 'white';
                });
                playerTurn.style.color = 'black';
                return (currentPlayer === 1 ? playerTurn.textContent = `${player1}'s turn!` : playerTurn.textContent = `${player2}'s turn!`);
            });
            //sending socket data
        }
    } // end of onload