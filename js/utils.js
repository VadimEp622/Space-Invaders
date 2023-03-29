'use strict'




// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN}
function createCell(gameObject = null) {
    return {
        type: SKY,
        gameObject: gameObject
    }
}

// Convert a position object {i:i, j:j} to a selector using Class and render a value in that element
function renderCell(pos, value) {
    console.log('hi2')
    var elCell = getElCell(pos)
    elCell.innerHTML = value
}

// position such as: {i: 2, j: 7}
function updateCell(pos, gameObject = null) {
    gBoard[pos.i][pos.j].gameObject = gameObject
    var elCell = getElCell(pos)
    elCell.innerHTML = gameObject || ''
}


function getElCell(pos) {
    return document.querySelector(`[data-i='${pos.i}'][data-j='${pos.j}']`);
}

//using Keyboard Arrows, find the next position affected
//return it
function getNextLocation(keyboardKey) {
    // console.log('keyboardKey', keyboardKey)
    const nextPosition = {
        i: gHero.pos.i,
        j: gHero.pos.j
    }
    // console.log('gHero.pos.i', gHero.pos.i)
    // console.log('gHero.pos.j', gHero.pos.j)

    switch (keyboardKey) {
        case 'ArrowRight':
            nextPosition.j++
            break
        case 'ArrowLeft':
            nextPosition.j--
            break
    }
    // console.log('nextPosition.i', nextPosition.i)
    // console.log('nextPosition.j', nextPosition.j)
    return nextPosition
}