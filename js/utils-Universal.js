'use strict'

//---------------------------------CREATE---------------------------------

/* sometimes createEmptyBoard is redundant */
//creates an empty (numOfRows x numOfCols) board
//returns the created board
function createBoard(numOfRows, numOfCols) {
    var board = []
    for (var i = 0; i < numOfRows; i++) {
        board.push([])
        for (var j = 0; j < numOfCols; j++) {
            board[i][j] = ''
        }
    }
    return board
}
//creates an empty square (length x length) board
//returns the created board
function createSquareBoard(length) {
    var board = []
    for (var i = 0; i < length; i++) {
        board.push([])
        for (var j = 0; j < length; j++) {
            board[i][j] = ''
        }
    }
    return board
}




//---------------------------------RENDER---------------------------------


// Render the board to an HTML table
function renderBoard(board) {
    const elBoard = document.querySelector('.board')
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            var cellClass = `cell-${i}-${j}`
            strHTML += `\t<td class="cell ${cellClass}" onclick="moveTo(${i},${j})">\n`
            // strHTML += `\t<td class="cell ${cellClass}" onmousedown="onCellClicked(event,this)">\n`

            // strHTML += `\t<td data-i="${i}" data-j="${j}" class="cell" onmousedown="onCellClicked(event,this)">\n`

            // var cellId = `cell-${i}-${j}`
            // strHTML += `\t<td id="${cellId}" class="cell" onmousedown="onCellClicked(event,this)">\n`
            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }
    // console.log('strHTML\n', strHTML)
    elBoard.innerHTML = strHTML
}
function renderBoard(mat, selector) {
    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {
            const cell = mat[i][j]
            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}



// Convert a position object {i:i, j:j} to a selector using Class and render a value in that element
function renderCell(pos, value) {
    var cellSelector = '.' + getClassName(pos)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}

// recieves classStr and item to render, and renders item
function renderItem(classStr, item) {
    var elClass = document.querySelector(`.${classStr}`)
    elClass.innerHTML = item
}


//---------------------------------ON-HTML---------------------------------

// In HTML looks like this:
// onclick="onCellClicked(this,${i},${j})"
function onCellClicked(elCell, cellI, cellJ) {
    // console.log('elCell', elCell)
    // console.log('cellI', cellI)
    // console.log('cellJ', cellJ)


    if (gBoard[cellI][cellJ] === LIFE) {
        // Model:
        gBoard[cellI][cellJ] = SUPER_LIFE
        // console.log(gBoard)

        // Dom:
        elCell.innerText = SUPER_LIFE

        // blowUpNegs(cellI, cellJ)
    }
}




//---------------------------------DO-ACTION---------------------------------

// Input example: blowUpNegs(1, 1)
function blowUpNegs(cellI, cellJ) {
    // console.log('cellI', cellI)
    // console.log('cellJ', cellJ)

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            if (i === cellI && j === cellJ) continue

            var currCell = gBoard[i][j]
            if (currCell === LIFE) {
                // console.log('i', i, 'j', j)
                // Model:
                gBoard[i][j] = ''
                // console.log(gBoard)
                // Dom:
                var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
                elCell.innerText = ''
                elCell.classList.remove('occupied')

            }
        }
    }
}


//copies mat (inorder to not interfere in main mat when doing cell by cell operations) 
function copyMat(mat) {
    var newMat = []
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = []
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j]
            // or
            // newMat[i][j] = { type: mat[i][j].type, gameElement: mat[i][j].gameElement } 
        }
    }
    return newMat
}
//shuffles int Num array
function shuffleNums(numsArray) {
    var nums = numsArray.slice()
    for (var i = 0; i < numsArray.length; i++) {
        var currRandom = getRandomIntInclusive(0, nums.length - 1)
        numsArray[i] = nums[currRandom]
        nums.splice(currRandom, 1)
    }
}





//---------------------------------COUNTER---------------------------------



//gets position as {i:i,j:j}, board, and the neighbor you must find
//returns amount of neighbors AROUND! the position
function getCountNeighbors(board, position) {
    var countNegs = 0
    var posIdxI = parseInt(position.i)
    var posIdxJ = parseInt(position.j)
    for (var i = posIdxI - 1; i <= posIdxI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = posIdxJ - 1; j <= posIdxJ + 1; j++) {
            if (i === posIdxI && j === posIdxJ) continue
            if (j < 0 || j >= board[0].length) continue
            // if (board[i][j].isBomb) countNegs++
        }
    }
    return countNegs
}
//counts amount of value in array
//return amount
function getCount(board) {
    var valueCounter = 0
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            // if (board[i][j].isClicked) valueCounter++
        }
    }
    return valueCounter
}




//---------------------------------FINDER---------------------------------


// Takes random slot in array, removes it from array
//and returns the item from that slot.
function drawRandomSlotItem(arr) {
    var idx = getRandomIntInclusive(0, arr.length - 1)
    var item = arr[idx]
    arr.splice(idx, 1)
    return item
}

//get empty cells from board
//return array of indexes with [{i:i,j:j},{i:i,j:j},...] of empty cells
function getEmptyCellsPosArr(board) {
    var posArray = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            // if (!board[i][j].isBomb) posArray.push({ i: i, j: j })
        }
    }
    return posArray
}

//find an empty cell in board, and return its position like this {i,j}, or undefined(falsy)
function getRandomEmptyCellPos(board) {
    var emptyPosArray = getEmptyCellsPosArr(board)
    return emptyPosArray[getRandomIntInclusive(0, emptyPosArray.length - 1)]
}

//recieves row Index(idxI) and col Index(idxJ)
//finds index in ID inside table
//return Location Element
function getCellElFromId(idxI, idxJ) {
    var elId = document.getElementById(`cell-${idxI}-${idxJ}`)
    return elId
}

// Recieves cell pos {i:i,j:j}, finds first element in document with matching class,
//returns cell element
function getCellElFromClass(pos) {
    var cellSelector = '.' + getClassName(pos)
    var elCell = document.querySelector(cellSelector)
    return elCell
}

// recieves cell element, with id="cell-i-j", returns Pos object {i:i,j:j}
function getPosFromCellElId(elCell) {
    var cellPosStr = elCell.id
    var cellPosArr = cellPosStr.split('-')
    return { i: parseInt(cellPosArr[1]), j: parseInt(cellPosArr[2]) }
}

// Returns the class name "cell-i-j" for a specific cell from pos object {i:i,j:j}
function getClassName(pos) {
    var cellClass = 'cell-' + pos.i + '-' + pos.j;
    return cellClass
}


function getItemHTML(itemColor, itemName) {
    return `<span style="background-color:${itemColor}">${itemName}</span>`
}




//////////////////////////////////////////////////////////////////////////////////////////


// toggles between class item style 'visibile' and 'hidden'
function toggleItemVisibility(className) {
    var classSelector = '.' + className
    var elItem = document.querySelector(classSelector)
    if (elItem.style.visibility === 'hidden') elItem.style.visibility = 'visible'
    else elItem.style.visibility = 'hidden'
}

// set class item style 'visibile' or 'hidden'
function setItemVisibility(className, str = 'visible') {
    var classSelector = '.' + className
    var elItem = document.querySelector(classSelector)
    elItem.style.visibility = str
}

//return num between min max, including both
function getRandomIntInclusive(min, max) {
    max = Math.floor(max)
    min = Math.ceil(min)
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// recieves digit string, return it's word in string
function strDigitToWord(digitChar) {
    var numNameStr
    switch (digitChar) {
        case '0':
            numNameStr = 'Zero'
            break
        case '1':
            numNameStr = 'One'
            break
        case '2':
            numNameStr = 'Two'
            break
        case '3':
            numNameStr = 'Three'
            break
        case '4':
            numNameStr = 'Four'
            break
        case '5':
            numNameStr = 'Five'
            break
        case '6':
            numNameStr = 'Six'
            break
        case '7':
            numNameStr = 'Seven'
            break
        case '8':
            numNameStr = 'Eight'
            break
        case '9':
            numNameStr = 'Nine'
            break
    }
    return numNameStr
}

//input minutes and seconds text into span inside timer class 
function timer() {
    var timer = document.querySelector('.timer span')
    var start = Date.now()
    /******/
    gGame.timerInterval = setInterval(function () {
        var currTs = Date.now()
        var secs = parseInt((currTs - start) / 1000)
        var ms = (currTs - start) - secs * 1000
        ms = '000' + ms
        ms = ms.substring(ms.length - 2, ms.length)

        timer.innerText = `\t ${secs}:${ms}`
    }, 100)
}

function timer2() {
    var startT
    gGame.interval = setInterval(function () {
        if (gGame.isFirstClicked) {
            if (!gGame.isTimerOn) {
                startT = Date.now()
                gGame.isTimerOn = true
            }
            var currT = Date.now()
            var diff = currT - startT
            var seconds = (diff / 1000).toFixed(3)

            gGame.timer = seconds
            renderItem(GAME_TIME_CLASS, gGame.timer)
        }
    }, 1)
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

//using Keyboard Arrows, find the next position affected
//return it
function getNextLocation(eventKeyboard) {
    const nextPosition = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    // DONE: figure out nextLocation
    switch (eventKeyboard) {
        case 'ArrowUp':
            nextPosition.i--
            break;
        case 'ArrowRight':
            nextPosition.j++
            break;
        case 'ArrowDown':
            nextPosition.i++
            break;
        case 'ArrowLeft':
            nextPosition.j--
            break;
    }
    return nextPosition
}










//////////////////////////////////////////////////////////////////////////////////////////






