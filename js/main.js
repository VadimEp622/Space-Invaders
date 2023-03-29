'use strict'

const BOARD_SIZE = 14;
const ALIENS_ROW_LENGTH = 8
const ALIENS_ROW_COUNT = 3

const HERO = '♆'
const ALIEN = '👽'
const LASER = '⤊'

const SKY = 'sky'
const EARTH = 'earth'


const SCORE_CLASS = 'score'


var gBoard

const gGame = {
    isOn: false,
    aliensCount: null,
    heroLives: null,
    laserPos: null,
    score: null,
}


//TODO: create cells with aliens
//TODO: create cells with hero


function onInit() {
    initGameParameters()
    gBoard = createBoard()
    createHero(gBoard)
    createAliens(gBoard)
    renderItem(SCORE_CLASS, gGame.score)
    renderBoard(gBoard)
}

function initGameParameters() {
    gGame.aliensCount = ALIENS_ROW_LENGTH * ALIENS_ROW_COUNT
    gGame.heroLives = 3
    gGame.score = 0
    gGame.laserPos = null
    gGame.isOn = true
}

function restart() {
    clearInterval(gIntervalLaser)
    clearInterval(gIntervalAliens)
    onInit()
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

function updateScore(value) {
    gGame.score += value
    renderItem(SCORE_CLASS, gGame.score)
}



//////////////////////////////////GET_STUFF////////////////////////////////////




