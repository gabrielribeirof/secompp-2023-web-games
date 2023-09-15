const STATUS = {
  WAITING_PLAYERS: 'waiting-players',
  READY: 'ready'
}

export function createGame() {
  const state = {
    players: {},
    board: [],
    status: STATUS.WAITING_PLAYERS
  }

  const observers = []
  
  function registerObserver(observer) {
    observers.push(observer)
  }

  function notifyAll(command) {
    for (const observer of observers) {
      observer(command)
    }
  }

  function setState(newState) {
    Object.assign(state, newState)
  }

  function canReceiveMorePlayers() {
    return Object.keys(state.players).length === 2 ? false : true
  }

  function addPlayer(command) {
    if (Object.keys(state.players).length === 2) return

    if (Object.keys(state.players).length === 0) {
      state.players[command.playerId] = {
        symbol: 'O',
        points: 0
      }

      return
    }

    state.players[command.playerId] = {
      symbol: 'X',
      points: 0
    }
    state.status = STATUS.READY

    notifyAll({
      type: 'add-player',
      playerId: command.playerId
    })
  }

  function removePlayer(command) {
    delete state.players[command.playerId]
    state.board = []
    state.status = STATUS.WAITING_PLAYERS

    notifyAll({
      type: 'remove-player',
      playerId: command.playerId
    })
  }

  function addTurn(command) {
    state.board[command.index] = state.players[command.playerId].symbol

    notifyAll({
      type: 'add-turn',
      playerId: command.playerId
    })
  }

  function resetGame() {
    state.board = []
    state.status = STATUS.WAITING_PLAYERS

    notifyAll({
      type: 'reset-game'
    })
  }

  return {
    state,
    setState,
    registerObserver,
    canReceiveMorePlayers,
    addPlayer,
    removePlayer,
    addTurn,
    resetGame
  }
}