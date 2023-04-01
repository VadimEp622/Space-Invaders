'use strict'

const ALIEN_MOVE_SPEED = 1000
const ALIEN_SHOOT_COOLDOWN = 1000
const ROCK_SPEED = 160

var gIntervalAliens
var gIntervalAliensShoot
var gIntervalRock

// The following two variables represent the part of the matrix (some rows)
// that we should shift (left, right, and bottom)
// We need to update those when:
// (1) shifting down and (2) last alien was cleared from row

var gAliensTopRowIdx
var gAliensBottomRowIdx


var gAliens
// var gAlienIdx = 1

var gIsAlienFreeze = true
var gAliensAreMidMove = false

var gIsAlienFreeToShoot = true
var gIsAlienShoot = false



//TODO 1.5: color aliens randomly
//TODO 1.7: add alien class to dom classlist in alien pos for each alien, and use it to display random color





//////////////////////////////////CREATE///////////////////////////////////
function createAliens(board) {
    gAliensTopRowIdx = 1
    gAliensBottomRowIdx = gAliensTopRowIdx + ALIENS_ROW_COUNT - 1

    var aliens = []
    for (var i = gAliensTopRowIdx; i <= gAliensBottomRowIdx && i < board.length - 1; i++) {
        for (var j = 0; j < ALIENS_ROW_LENGTH && j < board[0].length; j++) {
            var currAlien = {
                // id: gAlienIdx++,
                pos: { i: i, j: j },
                // color: getRandomColor()
            }
            aliens.push(currAlien)
            board[currAlien.pos.i][currAlien.pos.j].gameObject = ALIEN
        }
    }
    gAliens = aliens
    // console.log('gAliens', gAliens)
}



/////////////////////////////////SHIFT\MOVE///////////////////////////////
// runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops
function moveAliens() {
    var currDirection = 1// -1=left, 0=down, 1,=right
    var prevDirection

    gIntervalAliens = setInterval(() => {
        // if (gIsAlienFreeze || gHero.isShoot) return// freezes aliens completely when shooting

        if (gIsAlienFreeze) return

        gAliensAreMidMove = true
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
        gAliensAreMidMove = false
    }, ALIEN_MOVE_SPEED)
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
    if (buttommostRowIdx === board.length - 2) gameOver()// If reach EARTH
}

function shiftAliens(board, fromI, toI) {
    for (var i = fromI; i <= toI + 1; i++) {
        for (var j = 0; j < board[0].length; j++) {
            shiftAlien(board, i, j)
        }
    }
}
function shiftAlien(board, i, j) {
    var currPosOnBoard = { i: i, j: j }
    var currAlienIdx = getAlienIdx(currPosOnBoard)
    // var currAlienId = getAlienId(currPosOnBoard)

    if (currAlienIdx < 0) {
        //if there aren't any aliens, in current func input i,j pos, in gAliens, meaning they are dead or moved,so
        //we updae modal and dom with null 
        if (board[i][j].gameObject === ALIEN) {
            updateCell(currPosOnBoard)
            updateCellContentClass(currPosOnBoard, ALIEN_CLASS)

            // removeCellAlienColor(currPosOnBoard)
        }
    } else {
        if (board[i][j].gameObject === null ||
            board[i][j].gameObject === LASER ||
            board[i][j].gameObject === SUPER_LASER ||
            board[i][j].gameObject === BOMB ||
            board[i][j].gameObject === HERO ||
            board[i][j].gameObject === ROCK) {
            //null-> alien that passed gAliens inclusion test, gets rendered in an empty cell
            //laser/super_laser/bomb-> If laser passes by the cell which is being run through for next alien pos
            //hero-> if aliens reachd earth, swallow the Hero that touches an alien
            //rock-> if rock pos and alien pos overlap
            updateCell(currPosOnBoard, ALIEN)
            updateCellContentClass(currPosOnBoard, ALIEN_CLASS)

            // updateCellAlienColor(gAliens, currAlienId)
        }
    }
}


///////////////////////////////HANDLE SITUATIONS////////////////////////




///////////////////////////////KILL\REMOVE/////////////////////////////////
//Kills alien in current position, removes from gAliens, removes from board, and from DOM
//then updates kill score and count
function killAlien(pos) {
    updateScore(10)
    gGame.aliensCount--
    var currHitAlienIdx = getAlienIdx(pos)
    console.log('gAliens[currHitAlienIdx].pos', gAliens[currHitAlienIdx].pos)
    gAliens.splice(currHitAlienIdx, 1)
    updateCell(pos)
    updateCellContentClass(pos, ALIEN_CLASS)

}
// Input example: blowUpNegs(1, 1)
function blowUpNegs(cellI, cellJ) {
    // console.log('cellI', cellI)
    // console.log('cellJ', cellJ)

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue

            var currCell = gBoard[i][j].gameObject
            var currCellPos = { i: i, j: j }
            if (currCell === ALIEN || currCell === BOMB) {
                killAlien(currCellPos)
            }
            else if (currCell === ROCK) {
                updateCell(currCellPos, ROCK)
            }
        }
    }
}



///////////////////////////////////UPDATE//////////////////////////////////
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



///////////////////////////////////GET STUFF//////////////////////////////
function getAlienIdx(pos) {
    for (var i = 0; i < gAliens.length; i++) {
        if (gAliens[i].pos.i === pos.i && gAliens[i].pos.j === pos.j) return i
    }
    return -1
}

// function getAlienId(pos) {
//     for (var i = 0; i < gAliens.length; i++) {
//         if (gAliens[i].pos.i === pos.i && gAliens[i].pos.j === pos.j) return gAliens[i].id
//     }
//     return -1
// }



///////////////////////////////////OTHER//////////////////////////////////
function makeAliensShoot() {
    gIntervalAliensShoot = setInterval(() => {

        gIsAlienFreeToShoot = (getRandomIntInclusive(0, 1) === 1) ? true : false
        if (gIsAlienFreeToShoot && !gIsAlienShoot) {
            // console.log('gIsAlienShoot', gIsAlienShoot)

            console.log('alien now shoots')
            gGame.rockPos = gAliens[getRandomIntInclusive(0, gAliens.length - 1)].pos
            // console.log('gGame.rockPos', gGame.rockPos)

            alienShoot()
        }

    }, ALIEN_SHOOT_COOLDOWN)

}

function alienShoot() {
    gIsAlienShoot = true
    var prevRockPos = { i: gGame.rockPos.i - 1, j: gGame.rockPos.j }
    var currRockPos = { i: prevRockPos.i + 1, j: prevRockPos.j }

    gIntervalRock = setInterval(() => {

        prevRockPos = { i: prevRockPos.i + 1, j: prevRockPos.j }
        currRockPos = { i: currRockPos.i + 1, j: currRockPos.j }
        gGame.rockPos = currRockPos

        blinkRock(prevRockPos)
        blinkRock(currRockPos)

        if (gGame.rockPos.i === gBoard.length - 2 && gGame.rockPos.j === gHero.pos.j) {
            console.log('hero hit')
            handleHeroHit()
            cleanRock()
        } else if (gGame.rockPos.i === gBoard.length) {
            clearInterval(gIntervalRock)
            cleanRock()
        } else if (gGame.laserPos &&
            gGame.laserPos.i === gGame.rockPos.i &&
            gGame.laserPos.j === gGame.rockPos.j) {
            handleRockHit()
        }

    }, ROCK_SPEED)

}

function blinkRock(pos) {
    if (pos.i === gBoard.length) return
    // console.log('pos', pos)
    // console.log('gBoard[pos.i][pos.j].gameObject', gBoard[pos.i][pos.j].gameObject)


    if (gBoard[pos.i][pos.j].gameObject === HERO ||
        gBoard[pos.i][pos.j].gameObject === ALIEN) return
    else if (gBoard[pos.i][pos.j].gameObject === ROCK ||
        gBoard[pos.i][pos.j].gameObject === LASER ||
        gBoard[pos.i][pos.j].gameObject === SUPER_LASER ||
        gBoard[pos.i][pos.j].gameObject === BOMB) {
        updateCell(pos)
    } else if (gBoard[pos.i][pos.j].gameObject === null) {
        updateCell(pos, ROCK)
    }
}


function cleanRock() {
    clearInterval(gIntervalRock)
    gIsAlienShoot = false
    gGame.rockPos = null
}