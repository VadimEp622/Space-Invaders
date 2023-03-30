'use strict'

const LASER_SPEED = 80
// const LASER_SPEED = 1

const SUPER_LASER_SPEED = 30


var gHero

var gIntervalLaser

// creates the hero and place it on board
function createHero(board) {
    gHero = {
        pos: { i: 12, j: 5 },
        isShoot: false,
        isBomb: false,
        isSuper: false,
        superRemain: null
    }
    board[gHero.pos.i][gHero.pos.j].gameObject = HERO
}

// Handle game keys
function onKeyDown(eventKeyboard) {
    if (!gGame.isOn) return
    const keyboardKey = eventKeyboard.key
    console.log('keyboardKey', keyboardKey)

    if (keyboardKey === 'ArrowRight' || keyboardKey === 'ArrowLeft') {
        const direction = (keyboardKey === 'ArrowRight') ? 1 : -1// can only be left/right
        // console.log('direction', direction)
        moveHero(direction)
    } else if (keyboardKey === ' ') {
        shoot()
        // shoot2()

    } else if (keyboardKey === 'n') {
        shoot()
        gHero.isBomb = true
    } else if (keyboardKey === 'x') {
        if (gHero.superRemain === 0) return
        gHero.isSuper = true
        gHero.superRemain--
        console.log('gHero.superRemain', gHero.superRemain)
        shoot()
    }
}

// Move the hero right (1) or left (-1)
function moveHero(dir) {
    if (gHero.pos.j + dir < 0 || gHero.pos.j + dir >= gBoard[0].length) return// Hero stays within bounds

    var currPos = gHero.pos
    var nextPos = { i: gHero.pos.i, j: gHero.pos.j + dir }
    // console.log('posBefore', currPos)
    // console.log('posNow', nextPos)

    updateCell(currPos)

    gHero.pos = nextPos
    updateCell(nextPos, HERO)
}


// Sets an interval for shutting (blinking) the laser up towards aliens
function shoot() {
    if (gHero.isShoot) return
    gHero.isShoot = true
    var currLaserSpeed = (gHero.isSuper) ? SUPER_LASER_SPEED : LASER_SPEED

    gGame.laserPos = { i: gHero.pos.i, j: gHero.pos.j }



    gIntervalLaser = setInterval(() => {
        if (gAliensAreMidMove) return
        gIsAlienFreeze = true

        // console.log('gGame.laserPos before', gGame.laserPos)
        blinkLaser(gGame.laserPos)

        // blinkLaser2(gGame.laserPos)

        console.log('gGame.laserPos.i', gGame.laserPos.i)
        // console.log('gGame.laserPos after', gGame.laserPos)

        var currLaseredAlienIdx = getAlienIdx(gGame.laserPos)
        if (gGame.laserPos.i < 0) {
            cleanLaser()

        } else if (currLaseredAlienIdx >= 0) {
            handleAlienHit(gGame.laserPos)
        }

        gIsAlienFreeze = false
    }, currLaserSpeed)

    // console.log('gAliens.length', gAliens.length)
}
// renders a LASER at specific cell for short time and removes it
function blinkLaser(pos) {
    var currLaserPos = pos
    var nextLaserPos = { i: pos.i - 1, j: pos.j }

    //Current Laser Position
    // if (gHero.pos.i !== currLaserPos.i) updateCell(currLaserPos, null)
    if (gBoard[pos.i][pos.j].gameObject === LASER ||
        gBoard[pos.i][pos.j].gameObject === SUPER_LASER) {
        updateCell(currLaserPos)
    }
    // else if(gBoard[pos.i][pos.j].gameObject===ALIEN) updateCell(currLaserPos,ALIEN)


    //Next Laser Position
    gGame.laserPos = nextLaserPos
    if (nextLaserPos.i < 0) return//prevents updating a cell outside of board

    if (gHero.isSuper) updateCell(nextLaserPos, SUPER_LASER)
    else updateCell(nextLaserPos, LASER)
}


// Sets an interval for shutting (blinking) the laser up towards aliens
function shoot2() {
    if (gHero.isShoot) return
    gHero.isShoot = true

    gGame.laserPos = { i: gHero.pos.i - 1, j: gHero.pos.j }

    var currLaserPos = gGame.laserPos
    var nextLaserPos



    gIntervalLaser = setInterval(() => {
        if (gAliensAreMidMove) return
        gIsAlienFreeze = true

        currLaserPos = { i: --currLaserPos.i, j: currLaserPos.j }
        nextLaserPos = { i: --currLaserPos.i, j: currLaserPos.j }

        console.log('gGame.laserPos', gGame.laserPos)
        console.log('currLaserPos', currLaserPos)
        console.log('nextLaserPos', nextLaserPos)

        blinkLaser2(currLaserPos)
        blinkLaser2(nextLaserPos)


        var currLaseredAlienIdx = getAlienIdx(gGame.laserPos)
        if (gGame.laserPos.i < 0) {
            cleanLaser()

        } else if (currLaseredAlienIdx >= 0) {
            handleAlienHit(gGame.laserPos)
        }


        gIsAlienFreeze = false
    }, LASER_SPEED)

    // console.log('gAliens.length', gAliens.length)
}


// renders a LASER at specific cell for short time and removes it
function blinkLaser2(pos) {


    if (gBoard[pos.i][pos.j].gameObject === HERO) { }
    else if (gBoard[pos.i][pos.j].gameObject === LASER) {
        updateCell(pos)
    } else {
        updateCell(pos, LASER)
    }

}


function cleanLaser() {
    clearInterval(gIntervalLaser)
    gGame.laserPos = null
    gHero.isShoot = false
    gHero.isBomb = false
    gHero.isSuper = false
}