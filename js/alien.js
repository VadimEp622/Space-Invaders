'use strict'

const ALIEN_SPEED = 500
var gIntervalAliens

// The following two variables represent the part of the matrix (some rows)
// that we should shift (left, right, and bottom)
// We need to update those when:
// (1) shifting down and (2) last alien was cleared from row

var gAliensTopRowIdx
var gAliensBottomRowIdx

var gIsAlienFreeze = true

var gAliens


function createAliens(board) {
    gAliensTopRowIdx = 1
    gAliensBottomRowIdx = gAliensTopRowIdx + ALIENS_ROW_COUNT - 1

    var aliens = []
    for (var i = gAliensTopRowIdx; i <= gAliensBottomRowIdx && i < board.length - 1; i++) {
        for (var j = 0; j < ALIENS_ROW_LENGTH && j < board[0].length; j++) {
            var currAlien = { pos: { i: i, j: j } }
            aliens.push(currAlien)
            gBoard[currAlien.pos.i][currAlien.pos.j].gameObject = ALIEN
        }
    }
    gAliens = aliens
    // console.log('gAliens', gAliens)
}

function handleAlienHit(pos) {
    cleanLaser()

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
    shiftAliens(board, fromI, toI)
    if (rightmostColIdx === board[0].length - 1) return 0// If reached edge
    return 1// If NOT reached edge
}
function shiftBoardLeft(board, fromI, toI) {
    var leftmostColIdx = board[0].length
    for (var i = 0; i < gAliens.length; i++) {
        gAliens[i].pos.j--
        if (leftmostColIdx > gAliens[i].pos.j) leftmostColIdx = gAliens[i].pos.j
    }
    shiftAliens(board, fromI, toI)
    if (leftmostColIdx === 0) return 0// If reached edge
    return -1// If NOT reached edge
}
function shiftBoardDown(board, fromI, toI) {
    var buttommostRowIdx = -1
    for (var i = 0; i < gAliens.length; i++) {
        gAliens[i].pos.i++
        if (buttommostRowIdx < gAliens[i].pos.i) buttommostRowIdx = gAliens[i].pos.i
        // console.log('gAliens[i].pos.i', gAliens[i].pos.i)
    }
    shiftAliens(board, fromI, toI)
    if (buttommostRowIdx === board.length - 2) gamerOver()// If reach EARTH
}

function shiftAliens(board, fromI, toI) {
    for (var i = fromI; i <= toI + 1; i++) {
        for (var j = 0; j < board[0].length; j++) {
            shiftAlien(board, i, j)
        }
    }
}
function shiftAlien(board, i, j) {
    var currAlienIdx = getAlienIdx({ i: i, j: j })
    if (currAlienIdx < 0) {
        if (board[i][j].gameObject === ALIEN) updateCell({ i: i, j: j })
    } else {
        if (board[i][j].gameObject === null) updateCell({ i: i, j: j }, ALIEN)
        else if (board[i][j].gameObject === LASER) {
            handleAlienHit(gGame.laserPos)
        }
    }
}


// runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops
function moveAliens() {
    var currDirection = 1// -1=left, 0=down, 1,=right
    var prevDirection

    gIntervalAliens = setInterval(() => {
        if (currDirection === 1) {
            currDirection = shiftBoardRight(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
            updateEdgemostAliensIdxes()
            prevDirection = -1
        } else if (currDirection === 0) {
            shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
            updateEdgemostAliensIdxes()
            currDirection = prevDirection
        } else if (currDirection === -1) {
            currDirection = shiftBoardLeft(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
            updateEdgemostAliensIdxes()
            prevDirection = 1
        }
    }, ALIEN_SPEED)

}


function freezeAliens() {
    gIsAlienFreeze = true
    var tempInterval = gIntervalAliens
    clearInterval(gIntervalAliens)
    //
    //
    gIntervalAliens = tempInterval
}


function updateEdgemostAliensIdxes() {
    updateTopmostAlienColIdx()
    updateBottommostAlienIdx()
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
