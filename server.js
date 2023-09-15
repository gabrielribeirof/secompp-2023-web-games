import express from 'express'
import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { createGame } from './public/game.js'

const app = express()
const server = new HTTPServer(app)
const io = new SocketIOServer(server)

app.use(express.static('public'))

const game = createGame()

game.registerObserver(command => {
  console.log('>>> Command:', JSON.stringify(command, null, 2))
})

game.registerObserver(command => {
  io.emit(command.type, command)
})

io.use((socket, next) => {
  if (!game.canReceiveMorePlayers()) {
    next(new Error('Game fullfilled'))

    console.error(`Connection refused ${socket.id}`)
  } else {
    next()
  }
})

io.on('connection', socket => {
  console.log(`>>> Player connected: ${socket.id}`)

  game.addPlayer({ playerId: socket.id })

  socket.emit('setup', { state: game.state })

  socket.on('disconnect', () => {
    game.removePlayer({ playerId: socket.id })
    console.log(`>>> Player disconnected: ${socket.id}`)
  })

  socket.on('add-turn', command => {
    game.addTurn(command)
  })

  socket.on('reset-game', command => {
    game.resetGame()
  })
})

server.listen(3000, () => console.log('Servidor ouvindo em http://localhost:3000'))