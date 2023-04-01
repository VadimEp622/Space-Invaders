'use strict'

const BOARD_SIZE = 14;
const ALIENS_ROW_LENGTH = 8
const ALIENS_ROW_COUNT = 3

const HERO = '♆'
const ALIEN = '👽'
const LASER = '⤊'
const BOMB = '💣'
const ROCK = '🥚'
const SUPER_LASER = '^'
const CANDY = '🍬'

const SKY = 'sky'
const EARTH = 'earth'

const SCORE_CLASS = 'score span'
const LIVES_CLASS = 'lives span'
const ALIEN_CLASS = 'alien'
const HERO_CLASS = 'hero'
const WIN_CLASS = 'you-win'
const LOSE_CLASS = 'you-lose'


var gBoard
const gGame = {
    isOn: false,
    aliensCount: null,
    heroLives: null,
    laserPos: null,
    rockPos: null,
    score: null,
    intervalCandy: null,
}


//TODO: Make Aliens Freeze Upon Laser Pos Overlapping Alien Pos
// after finishing the handleAlienHit() function, unfreeze Aliens
//TODO 2: is there a need for handleAlienHit() in both AlienShift() and shoot()? 



function onInit() {
    initGameParameters()
    gBoard = createBoard()
    renderItem(SCORE_CLASS, gGame.score)
    renderItem(LIVES_CLASS, gGame.heroLives)
    renderBoard(gBoard)

    moveAliens()
    makeAliensShoot()
    fillCandies()
    // document.querySelector(".you-win").hidden=false
    // document.querySelector(".you-lose").hidden=false
}

function initGameParameters() {
    gGame.aliensCount = ALIENS_ROW_LENGTH * ALIENS_ROW_COUNT
    gGame.heroLives = 3
    gGame.score = 0
    gGame.laserPos = null
    gIsAlienFreeze = false
    gGame.isOn = true
}


function fillCandies() {
    gGame.intervalCandy = setInterval(() => {
        var emptyPos = getRandomTopmostEmptyCellPos(gBoard)
        if (!emptyPos) return
        // console.log('emptyPos', emptyPos)
        updateCell(emptyPos, CANDY)
        setTimeout(() => {
            updateCell(emptyPos)
        }, 5000)
    }, 10000)
}



function restart() {
    if (!document.querySelector(`.${WIN_CLASS}`).hidden) document.querySelector(`.${WIN_CLASS}`).hidden = true
    if (!document.querySelector(`.${LOSE_CLASS}`).hidden) document.querySelector(`.${LOSE_CLASS}`).hidden = true
    gameEnd()
    gGame.score = 0
    updateScore(0)
    onInit()
}

function victory() {
    document.querySelector(`.${WIN_CLASS}`).hidden = false
    gameEnd()
}

function gameOver() {
    document.querySelector(`.${LOSE_CLASS}`).hidden = false
    gameEnd()
}


function gameEnd() {
    gGame.isOn = false
    clearInterval(gIntervalLaser)
    clearInterval(gIntervalAliens)
    clearInterval(gIntervalAliensShoot)
    clearInterval(gIntervalRock)
    clearInterval(gGame.intervalCandy)
    gIsAlienFreeze = true
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
        }
    }
    createHero(board)
    createAliens(board)
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
            var cellContentClass = ''
            if (board[i][j].gameObject === ALIEN) cellContentClass = ALIEN_CLASS
            else if (board[i][j].gameObject === HERO) cellContentClass = HERO_CLASS
            var cellTypeClass = (board[i][j].type === SKY) ? SKY : EARTH

            strHTML += `\t<td 
            class="cell ${cellTypeClass} ${cellContentClass}" 
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



//////////////////////////////////CHECK////////////////////////////////////
function checkVictory() {
    if (gGame.aliensCount === 0) victory()
}

function checkLoss() {
    if (gGame.heroLives === 0) gameOver()
}




