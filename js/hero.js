'use strict'

// const LASER_SPEED = 1//debug tool
const LASER_SPEED = 80
const SUPER_LASER_SPEED = 30

var gHero
var gIntervalLaser



////////////////////////////////////CREATE///////////////////////////////////
// creates the hero and place it on board
function createHero(board) {
    gHero = {
        pos: { i: 12, j: 5 },
        isShoot: false,
        isSuper: false,
        isBomb: false,
        superRemain: 3
    }
    board[gHero.pos.i][gHero.pos.j].gameObject = HERO
}



/////////////////////////////////MOVE\SHIFT/////////////////////////////////
// Move the hero right (1) or left (-1)
function moveHero(dir) {
    if (gHero.pos.j + dir < 0 || gHero.pos.j + dir >= gBoard[0].length) return// Hero stays within bounds

    var currPos = gHero.pos
    var nextPos = { i: gHero.pos.i, j: gHero.pos.j + dir }
    // console.log('posBefore', currPos)
    // console.log('posNow', nextPos)

    updateCell(currPos)
    updateCellContentClass(currPos, HERO_CLASS)

    gHero.pos = nextPos
    updateCell(nextPos, HERO)
    updateCellContentClass(nextPos, HERO_CLASS)
}



//////////////////////////////ON EVENT HANDLERS////////////////////////////
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
    } else if (keyboardKey === 'n') {
        gHero.isBomb = true
        shoot()
    } else if (keyboardKey === 'x') {
        if (gHero.superRemain === 0) return
        gHero.isSuper = true
        console.log('gHero.superRemain', gHero.superRemain)
        shoot()
    }
}



///////////////////////////////HANDLE SITUATIONS////////////////////////
function handleAlienHit(pos) {
    if (gHero.isBomb) {
        blowUpNegs(pos.i, pos.j)
    } else {
        killAlien(pos)
    }
    cleanLaser()
    checkVictory()
}



function handleCandyHit() {
    updateScore(50)
    gIsAlienFreeze = true
    setTimeout(() => { gIsAlienFreeze = false }, 5000)
}

//When alien's laser/rock(?) hits hero, call this function,
//then inside remove lives with gGame.heroLives--,
//and check loss with checkLoss() function.
function handleHeroHit() {
    gGame.heroLives--
    renderItem(LIVES_CLASS, gGame.heroLives)
    checkLoss()
}


function handleRockHit() {
    cleanLaser()
    cleanRock()
    clearInterval(gIntervalRock)
    clearInterval(gIntervalLaser)
}


////////////////////////////////OTHER//////////////////////////////////////



// Sets an interval for shutting (blinking) the laser up towards aliens
function shoot() {
    if (gHero.isShoot) return//prevents shooting when already shooting
    gHero.isShoot = true

    var currLaserSpeed = (gHero.isSuper) ? SUPER_LASER_SPEED : LASER_SPEED
    if (gHero.isSuper) gHero.superRemain--


    gGame.laserPos = { i: gHero.pos.i + 1, j: gHero.pos.j }
    var prevLaserPos = gGame.laserPos
    var currLaserPos = { i: prevLaserPos.i - 1, j: prevLaserPos.j }
    // console.log('prevLaserPos', prevLaserPos)
    // console.log('currLaserPos', currLaserPos)
    // console.log('gGame.laserPos', gGame.laserPos)
    // console.log('--------------------')

    gIntervalLaser = setInterval(() => {
        // gIsAlienFreeze = true
        if (gAliensAreMidMove) return

        prevLaserPos = { i: prevLaserPos.i - 1, j: prevLaserPos.j }
        currLaserPos = { i: currLaserPos.i - 1, j: currLaserPos.j }
        gGame.laserPos = currLaserPos
        
        // console.log('prevLaserPos', prevLaserPos)
        // console.log('currLaserPos', currLaserPos)
        // console.log('gGame.laserPos', gGame.laserPos)
        // console.log('--------------------')
        
        blinkLaser(prevLaserPos)
        blinkLaser(currLaserPos)

        

        var currLaseredAlienIdx = getAlienIdx(gGame.laserPos)
        if (gGame.laserPos.i < 0) {
            // When gGame.laserPos.i reaches -1, it traveled outside board,
            //cleans laser interval and resets global variables for next laser shot
            cleanLaser()
        } else if (currLaseredAlienIdx >= 0) {
            // if gGame.laserPos.i didn't reach -1, AND its laser pos matches with an aliens
            handleAlienHit(gGame.laserPos)
        } else if (
            gGame.rockPos &&
            gGame.laserPos.i === gGame.rockPos.i
            && gGame.laserPos.j === gGame.rockPos.j) {
            handleRockHit()
        }
        // debugger
        // gIsAlienFreeze = false
    }, currLaserSpeed)

    // console.log('gAliens.length', gAliens.length)
}

// renders a LASER at specific cell for short time and removes it
function blinkLaser(pos) {
    //if current blinked pos.i is -1 prevent updating and exit
    //Also, if pos.i matches with the hero's pos.i, also exit to prevent overwriting
    if (pos.i < 0 || pos.i === gBoard[0].length - 2) return

    if (gBoard[pos.i][pos.j].gameObject === LASER ||
        gBoard[pos.i][pos.j].gameObject === SUPER_LASER ||
        gBoard[pos.i][pos.j].gameObject === BOMB) {
        updateCell(pos)
    } else if (gBoard[pos.i][pos.j].gameObject === null) {
        if (gHero.isSuper) updateCell(pos, SUPER_LASER)
        else if (gHero.isBomb) updateCell(pos, BOMB)
        else updateCell(pos, LASER)

        // updateCell(pos, (gHero.isSuper) ? SUPER_LASER : LASER)
    } else if (gBoard[pos.i][pos.j].gameObject === CANDY) {
        if (gHero.isSuper) updateCell(pos, SUPER_LASER)
        else if (gHero.isBomb) updateCell(pos, BOMB)
        else updateCell(pos, LASER)
        // updateCell(pos, (gHero.isSuper) ? SUPER_LASER : LASER)
        handleCandyHit(pos)
    }else if (gBoard[pos.i][pos.j].gameObject === ROCK) {
        updateCell(pos)
        // handleRockHit()
    }

    // console.log('gBoard[pos.i][pos.j].gameObject', gBoard[pos.i][pos.j].gameObject)
}



function cleanLaser() {
    clearInterval(gIntervalLaser)
    gGame.laserPos = null
    gHero.isShoot = false
    gHero.isBomb = false
    gHero.isSuper = false
}