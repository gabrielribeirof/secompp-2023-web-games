export const STATUS = {
  WAITING_PLAYERS: 'waiting-players',
  GAME_OVER: 'game-over',
  TIED: 'tied',
  READY: 'ready'
}

export function createGame() {
  const state = {
    players: {},
    currentPlayerSymbol: null,
    currentPlayerId: null,
    board: Array(9).fill(null),
    tieAmount: 0,
    status: STATUS.WAITING_PLAYERS
  }
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const observers = []
  
  function subscribe(observer) {
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

  function playersAmount() {
    return Object.keys(state.players).length
  }

  function getPlayerById(playerId) {
    return state.players[playerId]
  }

  function getPlayerBySymbol(symbol) {
    return Object.entries(state.players).find(([_, value]) => value.symbol === symbol)[0]
  }

  function canReceiveMorePlayers() {
    return playersAmount() === 2 ? false : true
  }

  function turnsAmount() {
    return state.board.filter(value => value !== null).length
  }

  function addPlayer(command) {
    if (playersAmount() === 2) return

    if (playersAmount() === 0) {
      state.players[command.playerId] = {
        symbol: 'X',
        points: 0
      }
    } else {
      state.players[command.playerId] = {
        symbol: 'O',
        points: 0
      }
      state.currentPlayerId = getPlayerBySymbol('X')
      state.currentPlayerSymbol = 'X'
      state.status = STATUS.READY
    }

    notifyAll({
      type: 'add-player',
      playerId: command.playerId
    })
  }

  function removePlayer(command) {
    delete state.players[command.playerId]

    state.board = Array(9).fill(null)
    state.currentPlayerId = null
    state.currentPlayerSymbol = null
    state.tieAmount = 0
    state.status = STATUS.WAITING_PLAYERS

    if (playersAmount() === 1) {
      const playerId = Object.keys(state.players)[0]

      state.players[playerId] = {
        symbol: 'X',
        points: 0
      }
    }

    notifyAll({
      type: 'remove-player',
      playerId: command.playerId
    })
  }

  function addTurn(command) {
    if (state.status !== STATUS.READY) return

    if (state.board[command.index] !== null) return

    if (getPlayerById(command.playerId).symbol !== state.currentPlayerSymbol) return

    state.board[command.index] = state.currentPlayerSymbol

    if (turnsAmount() >= 3) {
      const winner = calculateWinner()

      if (winner !== null) {
        state.currentPlayerId = null
        state.currentPlayerSymbol = null
        state.status = STATUS.GAME_OVER

        state.players[getPlayerBySymbol(winner)].points++

        notifyAll({
          type: 'add-turn',
          index: command.index,
          playerId: command.playerId
        })

        return
      }
    }

    if (turnsAmount() === 9 && isTied()) {
      state.currentPlayerId = null
      state.currentPlayerSymbol = null
      state.status = STATUS.TIED

      state.tieAmount++

      notifyAll({
        type: 'add-turn',
        index: command.index,
        playerId: command.playerId
      })

      return
    }
    
    state.currentPlayerSymbol = state.currentPlayerSymbol === 'X' ? 'O' : 'X'
    state.currentPlayerId = getPlayerBySymbol(state.currentPlayerSymbol)

    notifyAll({
      type: 'add-turn',
      index: command.index,
      playerId: command.playerId
    })
  }

  function isTied() {
    return state.board.every(cell => cell !== null);
  }

  function calculateWinner() {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;

      if (state.board[a] && state.board[a] === state.board[b] && state.board[a] === state.board[c]) {
        return state.board[a];
      }
    }

    return null;
  }

  function reset(command) {
    if (!(state.status === STATUS.GAME_OVER || state.status === STATUS.TIED)) return

    for (let player in state.players) {
      state.players[player].points = 0
    }

    Object.assign(state, {
      currentPlayerId: getPlayerBySymbol('X'),
      currentPlayerSymbol: 'X',
      board: Array(9).fill(null),
      tieAmount: 0,
      status: STATUS.READY
    })

    notifyAll(command)
  }

  function playAgain(command) {
    if (!(state.status === STATUS.GAME_OVER || state.status === STATUS.TIED)) return

    const nextSymbol = calculateWinner() === 'X' ? 'O' : 'X'

    Object.assign(state, {
      currentPlayerId: getPlayerBySymbol(nextSymbol),
      currentPlayerSymbol: nextSymbol,
      board: Array(9).fill(null),
      status: STATUS.READY
    })

    notifyAll(command)
  }

  return {
    state,
    setState,
    subscribe,
    getPlayerById,
    canReceiveMorePlayers,
    addPlayer,
    removePlayer,
    addTurn,
    isTied,
    calculateWinner,
    reset,
    playAgain
  }
}