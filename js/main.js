'use strict'

const BOARD_SIZE = 14;
const ALIENS_ROW_LENGTH = 8
const ALIENS_ROW_COUNT = 3


const HERO = '♆'
const ALIEN = '👽'
const LASER = '⤊'

const SKY = 'sky'
const EARTH = 'earth'


var gBoard

const gGame = {
    isOn: false,
    aliensCount: null,
    heroLives: null,
    laserPos:null,
}


//TODO: create cells with aliens
//TODO: create cells with hero


function onInit() {
    initGameParameters()
    gBoard = createBoard()
    createHero(gBoard)
    createAliens(gBoard)
    renderBoard(gBoard)
}

function initGameParameters() {
    gGame.aliensCount = 3// later 8*3
    gGame.heroLives = 3
    gGame.isOn = true
}



//////////////////////////////////////CREATE/////////////////////////////////////
// Create and returns the board with aliens on top, ground at bottom
// use the functions: createCell, createHero, createAliens
function createBoard() {
    var board = []
    for (var i = 0; i < BOARD_SIZE; i++) {
        board.push([])
        for (var j = 0; j < BOARD_SIZE; j++) {
            board[i][j] = createCell()
            if (i === BOARD_SIZE - 1) board[i][j].type = EARTH
            // if (i === 0) board[i][j].gameObject = ALIEN
        }
    }
    return board

}


////////////////////////////////////RENDER//////////////////////////////////////
// Render the board to an HTML table
function renderBoard(board) {
    const elBoard = document.querySelector('.board')
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            var cellContent = (board[i][j].gameObject) ? board[i][j].gameObject : ''
            var cellTypeClass = (board[i][j].type === SKY) ? SKY : EARTH

            strHTML += `\t<td 
            class="cell ${cellTypeClass}" 
            data-i=${i} data-j=${j}
            >
            ${cellContent}
            \n`

            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }
    // console.log('strHTML\n', strHTML)
    elBoard.innerHTML = strHTML
}





//////////////////////////////////UPDATE////////////////////////////////////////



//////////////////////////////////GET_STUFF////////////////////////////////////




