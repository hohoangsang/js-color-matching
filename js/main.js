import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import {
  getColorBackground,
  getColorElementList,
  getColorListElement,
  getInaciveElementList,
  getPlayAgainButton,
} from './selectors.js'
import {
  createTimer,
  getRandomColorPairs,
  hidePlayAgainButton,
  setBackgroundColor,
  setTimerText,
  showPlayAgainButton,
} from './utils.js'

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING

//handle timer for game play v2 - RECOMMEND - more optimize
let timer = createTimer({
  seconds: GAME_TIME,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish,
})

function handleTimerChange(seconds) {
  const fullSecond = `0${seconds}`.slice(-2)
  setTimerText(`${fullSecond}s`)
}

function handleTimerFinish() {
  setTimerText('Game Over!')
  gameStatus = GAME_STATUS.FINISHED
  showPlayAgainButton()
}

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

function initColorList() {
  const fullColorList = getRandomColorPairs(PAIRS_COUNT)
  const colorElementList = getColorElementList()
  if (!colorElementList) return

  colorElementList.forEach((colorElement, index) => {
    const overlayElement = colorElement.querySelector('.overlay')
    overlayElement.style.backgroundColor = fullColorList[index]
    colorElement.dataset.color = fullColorList[index]
  })
}

function checkMatchColor(arrLiElement) {
  if (!Array.isArray(arrLiElement) || arrLiElement.length !== 2) return
  const firstColor = arrLiElement[0].dataset.color
  const secondColor = arrLiElement[1].dataset.color
  const isMatch = firstColor === secondColor

  if (isMatch) {
    //handle change background color
    setBackgroundColor(firstColor)

    //check win
    const isWin = getInaciveElementList().length === 0
    if (isWin) {
      //handle show button replay
      showPlayAgainButton()
      //show YOU WIN
      setTimerText('YOU WIN!!')
      //clear timer
      timer.clear()
    }
    selections = []
    return
  }

  setTimeout(() => {
    arrLiElement[0].classList.remove('active')
    arrLiElement[1].classList.remove('active')

    //reset selections for next turn
    selections = []
  }, 500)
}

function handleResetGame() {
  //reset global vars
  selections = []
  gameStatus = GAME_STATUS.PLAYING

  //clear class of all li element
  const liList = getColorElementList()
  liList.forEach((li) => li.classList.remove('active'))

  //re-random color list
  initColorList()

  //reset style of play again button
  hidePlayAgainButton()

  //clear you win / timeoout text
  setTimerText('30s')

  //start new game
  startTimer()

  //reset background color
  setBackgroundColor('goldenrod')
}

function handleClickColor(liElement) {
  if (!liElement) return

  //check li element had been clicked or not
  const isClicked = liElement.classList.contains('active')
  if (isClicked || selections.length === 2 || gameStatus === GAME_STATUS.FINISHED) return

  liElement.classList.add('active')

  selections.push(liElement)

  if (selections.length === 2) {
    checkMatchColor(selections)
  }
}

function attachEventForColorList() {
  const ulElement = getColorListElement()
  if (!ulElement) return

  ulElement.addEventListener('click', (event) => {
    if (event.target.tagName !== 'LI') return
    handleClickColor(event.target)
  })
}

function attachEventForPlayAgainButton() {
  const playAgainButton = getPlayAgainButton()
  if (!playAgainButton) return

  playAgainButton.addEventListener('click', handleResetGame)
}

//handle timer for game play - v1 - not optimize
function attachTimerForGamePlay() {
  let startTime = GAME_TIME

  const intervalId = setInterval(() => {
    const fullTimer = `0${startTime}`.slice(-2)
    setTimerText(`${fullTimer}s`)
    startTime -= 1
    const inActiveElementList = getInaciveElementList()
    if (inActiveElementList.length === 0) {
      setTimerText('YOU WIN!!')
      gameStatus = GAME_STATUS.FINISHED
      clearInterval(intervalId)
    }
    if (startTime < 0) {
      setTimerText('Game Over!')
      gameStatus = GAME_STATUS.FINISHED
      showPlayAgainButton()
      clearInterval(intervalId)
    }
  }, 1000)
}

function startTimer() {
  return timer.start()
}

;(function () {
  initColorList()

  attachEventForColorList()

  attachEventForPlayAgainButton()

  // attachTimerForGamePlay()
  startTimer()
})()
