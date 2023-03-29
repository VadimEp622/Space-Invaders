'use strict'

const LASER_SPEED = 80

var gHero //= { pos: { i: 12, j: 5 }, isShoot: false }

var gIntervalLaser

// creates the hero and place it on board
function createHero(board) {
    gHero = { pos: { i: 12, j: 5 }, isShoot: false }
    board[gHero.pos.i][gHero.pos.j].gameObject = HERO
    // renderCell(gHero.pos, HERO)
}

// Handle game keys
function onKeyDown(eventKeyboard) {
    // console.log('eventKeyboard', eventKeyboard)
    const keyboardKey = eventKeyboard.key
    console.log('keyboardKey', keyboardKey)

    if (keyboardKey === 'ArrowRight' || keyboardKey === 'ArrowLeft') {
        const direction = (keyboardKey === 'ArrowRight') ? 1 : -1// can only be left/right
        // console.log('direction', direction)

        moveHero(direction)

    }
    else if (keyboardKey === ' ') {
        console.log('hi')
        shoot()
    }




    // gHero.pos = nextPos
    // gBoard[nextPos.i][nextPos.j].gameObject=HERO
    // renderCell(nextPos, HERO)
}

// Move the hero right (1) or left (-1)
function moveHero(dir) {
    if (gHero.pos.j + dir < 0 || gHero.pos.j + dir >= gBoard[0].length) return// Hero stays within bounds

    var currPos = gHero.pos
    var nextPos = { i: gHero.pos.i, j: gHero.pos.j + dir }
    // console.log('posBefore', currPos)
    // console.log('posNow', nextPos)

    updateCell(currPos, null)

    gHero.pos = nextPos
    updateCell(nextPos, HERO)
}


// Sets an interval for shutting (blinking) the laser up towards aliens
function shoot() {
    if (gHero.isShoot) return
    gHero.isShoot = true

    gGame.laserPos = { i: gHero.pos.i, j: gHero.pos.j }

    gIntervalLaser = setInterval(() => {
        // console.log('gGame.laserPos before', gGame.laserPos)
        blinkLaser(gGame.laserPos)
        // console.log('gGame.laserPos after', gGame.laserPos)

        var currLaseredAlienIdx = getAlienIdx(gGame.laserPos)

        if (gGame.laserPos.i < 0) {
            cleanLaser()
        } else if (currLaseredAlienIdx) {
            killAlien(gGame.laserPos, currLaseredAlienIdx)
            cleanLaser()
        }

    }, LASER_SPEED)


    // console.log('gAliens.length', gAliens.length)
}
// renders a LASER at specific cell for short time and removes it
function blinkLaser(pos) {
    var currLaserPos = pos
    var nextLaserPos = { i: pos.i - 1, j: pos.j }

    if (gHero.pos.i !== currLaserPos.i) updateCell(currLaserPos, null)

    gGame.laserPos = nextLaserPos
    if (nextLaserPos.i < 0) return//prevents updating a cell outside of board
    updateCell(nextLaserPos, LASER)
}


function cleanLaser(){
    clearInterval(gIntervalLaser)
    gGame.laserPos = null
    gHero.isShoot = false
}