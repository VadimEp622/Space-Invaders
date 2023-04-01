'use strict'

///////////////////////////////////////////////////////CREATE////////////////////////////////////////////////
// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN}
function createCell(gameObject = null) {
    return {
        type: SKY,
        gameObject: gameObject
    }
}


//////////////////////////////////RENDER////////////////////////////////////////////////
// recieves classStr and item to render, and renders item
function renderItem(classStr, item) {
    var elClass = document.querySelector(`.${classStr}`)
    elClass.innerHTML = item
}


/////////////////////////////////////UPDATE->MODAL+DOM RENDER///////////////////////////
// position such as: {i: 2, j: 7}
function updateCell(pos, gameObject = null) {
    gBoard[pos.i][pos.j].gameObject = gameObject
    var elCell = getElCell(pos)
    elCell.innerHTML = gameObject || ''
}

function updateCellContentClass(pos, gameObjectClass,id='') {
    var elCell = getElCell(pos)
    if (elCell.classList.contains(`${gameObjectClass}`)) elCell.classList.remove(`${gameObjectClass}`)
    else elCell.classList.add(`${gameObjectClass}`)
}


// function updateCellAlienIdClass(pos, alienClass, id = '') {
//     var elCell = getElCell(pos)

// }


// function updateCellAlienColor(aliens, currAlienId) {
//     var posObject = { i: aliens[alienIdx].pos.i, j: aliens[alienIdx].pos.j }
//     var elCell = getElCell(posObject)
//     elCell.style.backgroundColor = aliens[alienIdx].color 
// }

// function removeCellAlienColor(pos) {
//     var elCell = getElCell(pos)
//     elCell.style.backgroundColor=''
// }

////////////////////////////////////TOGGLE///////////////////////////////////////////
// function toggleAlienClass(gameObject){
//     if (gameObject === ALIEN) {
//         elCell.classList.add(ALIEN_CLASS)
//     } else {
//         if (elCell.classList.includes(ALIEN_CLASS)) {
//             elCell.classList.remove(ALIEN_CLASS)
//         }
//     }
// }





//////////////////////////////////////GET STUFF/////////////////////////////////////
//get empty cells from board
//return array of indexes with [{i:i,j:j},{i:i,j:j},...] of empty cells
function getEmptyCellsPosArr(board) {
    var posArray = []
    for (var i = 0; i < 1; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].gameObject === null) posArray.push({ i: i, j: j })
        }
    }
    return posArray
}

//find an empty cell in board, and return its position like this {i,j}, or undefined(falsy)
function getRandomTopmostEmptyCellPos(board) {
    var emptyPosArray = getEmptyCellsPosArr(board)
    // console.log('emptyPosArray.length', emptyPosArray.length)
    if (emptyPosArray.length === 0) return null

    return emptyPosArray[getRandomIntInclusive(0, emptyPosArray.length - 1)]
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

//return num between min max, including both
function getRandomIntInclusive(min, max) {
    max = Math.floor(max)
    min = Math.ceil(min)
    return Math.floor(Math.random() * (max - min + 1) + min)
}


//get a Random Color format #000000
function getRandomColor() {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}