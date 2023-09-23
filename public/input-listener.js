export function createInputListener() {
  const observers = []
  const squares = document.querySelector('#board').children
  const play_again_button = document.querySelector('.play_again')
  const reset_button = document.querySelector('.reset')

  function subscribe(observerFunction) {
    observers.push(observerFunction)
  }

  function notifyAll(command) {
    for (const observerFunction of observers) {
      observerFunction(command)
    }
  }

  for (let i=0; i<9; i++) {
    squares.item(i).addEventListener('click', handleSquareClick)
  }
  play_again_button.addEventListener('click', handlePlayAgainClick)
  reset_button.addEventListener('click', handleResetButtonClick)

  function handleSquareClick(event) {
    notifyAll({
      type: 'add-turn',
      index: event.target.dataset.index-1,
    })
  }

  function handlePlayAgainClick() {
    notifyAll({ type: 'play-again' })
  }

  function handleResetButtonClick() {
    notifyAll({ type: 'reset' })
  }

  return {
    subscribe
  }
}