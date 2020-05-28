const express = require('express');
const connectDB = require('./config/db');
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const Room = require('./models/Room');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const { addUser, getUsersInRoom, getUser, shuffle, stage0 } = require('./game');

const MAX_USERS = 2;
//socket logic
let numConnections = 0;
io.on('connect', async socket => {
  numConnections += 1;
  console.log('User Connected');
  console.log(`Number of Connections ${numConnections}`);
  socket.on('join', async ({ userId, room }) => {
    const { user } = addUser({ socketId: socket.id, userId, room });
    socket.join(user.room);
    //start game
    if (getUsersInRoom(user.room).length === MAX_USERS) {
      try {
        let mongoRoom = await Room.findById(user.room);
        if (mongoRoom.stage === 0) {
          stage0(mongoRoom);
        }
      } catch (err) {
        console.error(err.message);
      }
    }
    io.to(user.room).emit('Check DB');
  });

  socket.on('Play Cards', async cards => {
    console.log(cards);
  });

  socket.on('Pass', async () => {
    console.log('Turn Passed');
    try {
      const user = getUser(socket.id);
      console.log(user);
      let mongoRoom = await Room.findById(user.room);
      mongoRoom.turn += 1;
      mongoRoom.turn %= MAX_USERS;
      await mongoRoom.save();
      io.to(user.room).emit('Check DB');
    } catch (err) {
      console.error(err.message);
    }
  });

  socket.on('disconnect', () => {
    numConnections -= 1;
    console.log('User Disconnected');
  });
});
//connect db
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

//Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/room', require('./routes/api/room'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
