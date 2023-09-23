import { createGame, STATUS } from './game.js'
import { createUI } from  './ui.js'
import { createInputListener } from './input-listener.js'

const socket = io()

const game = createGame()

const inputListener = createInputListener()
const ui = createUI()

socket.on('connect_error', () => {
  ui.showGameFullfilledError()
})

socket.on('connect', () => {
  console.log(`>>> Player connected with id ${socket.id}`)
})

socket.on('disconnect', () => {
  console.log(`>>> Player disconnected`)
})

socket.on('setup', command => {
  game.setState(command.state)

  game.subscribe(() => {
    if (game.state.status === STATUS.GAME_OVER) {
      return ui.update(game.state, game.getPlayerById(socket.id), game.calculateWinner())
    }

    ui.update(game.state, game.getPlayerById(socket.id))
  })
  game.subscribe(command => {
    if (command.playerId === socket.id) {
      socket.emit(command.type, command)
    }
  })

  ui.update(game.state, game.getPlayerById(socket.id))

  inputListener.subscribe(command => {
    switch (command.type) {
      case 'add-turn':
        return game.addTurn({ ...command, playerId: socket.id })
      case 'play-again':
        return game.playAgain({ ...command, playerId: socket.id})
      case 'reset':
        return game.reset({ ...command, playerId: socket.id })
    }
  })
})

socket.on('add-player', command => game.addPlayer(command))

socket.on('remove-player', command => game.removePlayer(command))

socket.on('add-turn', command => game.addTurn(command))

socket.on('reset', command => game.reset(command))

socket.on('play-again', command => game.playAgain(command))

socket.onAny((command, ...args) => {
  console.log(`Receiving ${JSON.stringify(command)} -> ${JSON.stringify(args, '', 2)}`)
})

socket.onAnyOutgoing((command, ...args) => {
  console.log(`Emitting ${JSON.stringify(command)} -> ${JSON.stringify(args, '', 2)}`)
})