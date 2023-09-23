import express from 'express'
import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { createGame } from './public/game.js'

const app = express()
const server = new HTTPServer(app)
const io = new SocketIOServer(server)

app.use(express.static('public'))

const game = createGame()

game.subscribe(command => {
  console.log('>>> Game command:', JSON.stringify(command, null, 2))
})

game.subscribe(command => {
  io.except(command.playerId).emit(command.type, command)
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

  socket.on('disconnect', () => game.removePlayer({ playerId: socket.id }))
  socket.on('add-turn', command => game.addTurn(command))
  socket.on('reset', command => game.reset(command))
  socket.on('play-again', command => game.playAgain(command))
})

server.listen(3000, () => console.log('Servidor ouvindo em http://localhost:3000'))

process.stdin.on('data', () => {
  console.log(JSON.stringify(game.state, '', 2))
})
