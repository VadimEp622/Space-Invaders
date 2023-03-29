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
function handleAlienHit(pos) { }
function shiftBoardRight(board, fromI, toI) { }
function shiftBoardLeft(board, fromI, toI) { }
function shiftBoardDown(board, fromI, toI) { }
// runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops
function moveAliens() { }



function killAlien(alienPos, alienIdx) {
    updateScore(10)
    gAliens.splice(alienIdx, 1)
    updateCell(alienPos, null)
}
