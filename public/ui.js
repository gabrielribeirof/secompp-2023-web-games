import { STATUS } from './game.js'

export function createUI() {
  let localPlayer = null

  const squares = document.querySelector('#board').children
  const panelContainer = document.querySelector('#panel')
  const playerIndicator = document.querySelector('#indicator')
  const controlButtonsContainer = document.querySelector('.btn_container')

  function setLocalPlayer(player) {
    localPlayer = player
  }

  function update(state, winner) {
    updateBoard(state.board)
    updateIndicator(state, winner)
    updatePanel(state)
  }

  function updateBoard(board) {
    for (let i=0; i<9; i++) {
      const square = squares.item(i)

      if (board[i] === null) {
        square.classList.remove('marked');
        square.textContent = '';

        continue
      }

      square.classList.add('marked');
      square.textContent = board[i];
    }
  }

  function updateIndicator(state, winner) {
    if (state.status === STATUS.WAITING_PLAYERS) {
      hideControlButtons()
      playerIndicator.textContent = 'Aguardando outro jogador'
      return
    }
    
    if (state.status === STATUS.GAME_OVER) {
      if (localPlayer.symbol === winner) {
        playerIndicator.textContent = `${winner}, você ganhou!!!`
      } else {
        playerIndicator.textContent = `O seu adversário ${winner} ganhou`
      }

      showControlButtons()

      return
    }

    if (state.status === STATUS.READY) {
      hideControlButtons()
      if (localPlayer.symbol === state.currentPlayerSymbol) {
        playerIndicator.textContent = `Player ${state.currentPlayerSymbol} é sua vez`
      } else {
        playerIndicator.textContent = 'É a vez do seu adversário'
      }
    }

    if (state.status === STATUS.TIED) {
      playerIndicator.textContent = 'Deu velha'
      showControlButtons()
    }
  }

  function updatePanel(state) {
    const xPanelPoints = panelContainer.getElementsByClassName('points')[0]
    const tiePanelPoints = panelContainer.getElementsByClassName('points')[1]
    const oPanelPoints = panelContainer.getElementsByClassName('points')[2]

    const x = Object.entries(state.players).find(([_, value]) => value.symbol === 'X')
    const o = Object.entries(state.players).find(([_, value]) => value.symbol === 'O')

    xPanelPoints.textContent = x ? x[1].points : 0
    oPanelPoints.textContent = o ? o[1].points : 0
    tiePanelPoints.textContent = state.tieAmount
  }

  function showControlButtons() {
    controlButtonsContainer.classList.add('show')
  }

  function hideControlButtons() {
    controlButtonsContainer.classList.remove('show')
  }

  function showGameFullfilledError() {
    playerIndicator.textContent = 'O jogo está cheio'
  }

  return {
    setLocalPlayer,
    showGameFullfilledError,
    update
  }
}