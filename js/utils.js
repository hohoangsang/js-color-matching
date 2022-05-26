import { getColorBackground, getPlayAgainButton, getTimerElement } from './selectors.js'

function shuffleArr(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return []

  for (let i = arr.length - 1; i > 1; i--) {
    const j = Math.floor(Math.random() * i)

    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
}

export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor

  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink']
  const colorList = []

  for (let i = 0; i < count; i++) {
    const color = window.randomColor({
      luminosity: 'dark',
      hue: hueList[i % hueList.length],
    })
    colorList.push(color)
  }

  const fullColorList = [...colorList, ...colorList]
  shuffleArr(fullColorList)
  return fullColorList
}

export function showPlayAgainButton() {
  const playAgainButton = getPlayAgainButton()
  if (playAgainButton) playAgainButton.classList.add('show')
}

export function hidePlayAgainButton() {
  const playAgainButton = getPlayAgainButton()
  if (playAgainButton) playAgainButton.classList.remove('show')
}

export function setTimerText(text) {
  const timerElement = getTimerElement()
  if (timerElement) timerElement.textContent = text
}

//handle timer for game play v2 - RECOMMEND - more optimize
export function createTimer({ seconds, onChange, onFinish }) {
  let intervalId = null

  function start() {
    clear()
    let currentSeconds = seconds

    intervalId = setInterval(() => {
      // if (onChange) onChange(currentSeconds)
      onChange?.(currentSeconds)
      currentSeconds--

      if (currentSeconds < 0) {
        clear()
        onFinish()
      }
    }, 1000)
  }

  function clear() {
    clearInterval(intervalId)
  }
  return {
    start,
    clear,
  }
}

export function setBackgroundColor(color) {
  if (!color) return
  const backgroundElement = getColorBackground()
  if (!backgroundElement) return
  backgroundElement.style.backgroundColor = color
}
