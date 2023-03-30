'use strict'

const ALIEN_SPEED = 500
var gIntervalAliens

// The following two variables represent the part of the matrix (some rows)
// that we should shift (left, right, and bottom)
// We need to update those when:
// (1) shifting down and (2) last alien was cleared from row

var gAliensTopRowIdx
var gAliensBottomRowIdx

var gAliensLeftColIdx
var gAliensRightColIdx

var gIsAlienFreeze = true

var gAliens


function createAliens(board) {
    gAliensTopRowIdx = 1
    gAliensBottomRowIdx = gAliensTopRowIdx + ALIENS_ROW_COUNT - 1

    gAliensLeftColIdx = 0
    gAliensRightColIdx = ALIENS_ROW_LENGTH - 1

    var aliens = []
    for (var i = gAliensTopRowIdx; i <= gAliensBottomRowIdx && i < board.length - 1; i++) {
        for (var j = gAliensLeftColIdx; j <= gAliensRightColIdx && j < board[0].length; j++) {
            var currAlien = { pos: { i: i, j: j } }
            aliens.push(currAlien)
            gBoard[currAlien.pos.i][currAlien.pos.j].gameObject = ALIEN
        }
    }
    gAliens = aliens
    // console.log('gAliens', gAliens)
}

function handleAlienHit(pos) {
    updateScore(10)
    gGame.aliensCount--

    var currHitAlienIdx = getAlienIdx(pos)
    console.log('gAliens.length before', gAliens.length)
    gAliens.splice(currHitAlienIdx, 1)
    console.log('gAliens.length after', gAliens.length)
    updateCell(pos, null)
    checkVictory()
}



function shiftBoardRight(board, fromI, toI) {
    var rightmostColIdx = -1
    for (var i = 0; i < gAliens.length; i++) {
        gAliens[i].pos.j++
        if (rightmostColIdx < gAliens[i].pos.j) rightmostColIdx = gAliens[i].pos.j
    }
    console.log('rightmostColIdx', rightmostColIdx)

    for (var i = fromI; i <= toI; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currAlienIdx = getAlienIdx({ i: i, j: j })
            if (currAlienIdx < 0) {
                if (board[i][j].gameObject === ALIEN) updateCell({ i: i, j: j })
            } else {
                if (board[i][j].gameObject === null) updateCell({ i: i, j: j }, ALIEN)
                // else if(board[i][j].gameObject ===LASER){}
            }
        }
    }

    if (rightmostColIdx === board[0].length - 1) return false//If reached edge
    return true//If NOT reached edge
}
function shiftBoardLeft(board, fromI, toI) { }
function shiftBoardDown(board, fromI, toI) { }

// runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops
function moveAliens() {
    
    gIntervalAliens = setInterval(() => {
        var keepMoving = shiftBoardRight(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
        updateEdgemostAliensIdxes()
        if(!keepMoving) clearInterval(gIntervalAliens)
    }, ALIEN_SPEED)
}


function freezeAliens() {
    gIsAlienFreeze = true
    clearInterval(gIntervalAliens)
}


function updateEdgemostAliensIdxes() {
    // updateLeftmostAlienIdx()
    // updateRightmostAlienIdx()
    updateTopmostAlienColIdx()
    updateBottommostAlienIdx()
}

function updateLeftmostAlienIdx() {
    var leftmostIdx = gAliensLeftColIdx
    for (var i = 0; i < gAliens.length; i++) {
        if (gAliens[i].pos.j < leftmostIdx) leftmostIdx = gAliens[i].pos.j
    }
    gAliensLeftColIdx = leftmostIdx
}


function updateRightmostAlienIdx() {
    var rightmostIdx = gAliensTopRowIdx
    for (var i = 0; i < gAliens.length; i++) {
        if (gAliens[i].pos.j > rightmostIdx) rightmostIdx = gAliens[i].pos.j
    }
    gAliensTopRowIdx = rightmostIdx
}


function updateTopmostAlienColIdx() {
    var topmostIdx = gAliensTopRowIdx
    for (var i = 0; i < gAliens.length; i++) {
        if (gAliens[i].pos.i < topmostIdx) topmostIdx = gAliens[i].pos.i
    }
    gAliensTopRowIdx = topmostIdx
}
function updateBottommostAlienIdx() {
    var bottommostIdx = gAliensBottomRowIdx
    for (var i = 0; i < gAliens.length; i++) {
        if (gAliens[i].pos.i > bottommostIdx) bottommostIdx = gAliens[i].pos.i
    }
    gAliensBottomRowIdx = bottommostIdx
}


function getAlienIdx(pos) {
    for (var i = 0; i < gAliens.length; i++) {
        if (gAliens[i].pos.i === pos.i && gAliens[i].pos.j === pos.j) return i
    }
    return -1
}
