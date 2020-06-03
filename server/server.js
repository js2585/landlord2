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
const {
  addUser,
  getUsersInRoom,
  getUser,
  stage0,
  stage1,
  stage2,
  endGame
} = require('./game');

//todo: stage rendering
//todo: sort cards - done
//todo: stage 2 - done
//todo: stage 3 reset - done
//todo: stage 4 redirect - done
//todo: timeout (afk)
//todo: private games - done
//todo: different bid values - done
//todo: donating and begging
//todo: search for users
//todo: refactor

const MAX_USERS = 3;
//socket logic
let numConnections = 0;
io.on('connect', async socket => {
  numConnections += 1;
  console.log('User Connected');
  console.log(`Number of Connections ${numConnections}`);
  //joining
  socket.on('join', async ({ userId, room }) => {
    const { user } = addUser({ socketId: socket.id, userId, room });
    socket.join(user.room);
    //start game
    if (getUsersInRoom(user.room).length === MAX_USERS) {
      try {
        let mongoRoom = await Room.findById(user.room).populate('players.user');
        if (mongoRoom.stage === -1) {
          mongoRoom.stage += 1;
        }
        if (mongoRoom.stage === 0) {
          await stage0(mongoRoom);
        }
      } catch (err) {
        console.error(err.message);
      }
    }
    io.to(user.room).emit('Check DB');
  });
  //bidding
  socket.on('Bid', async ({ bid }) => {
    const user = getUser(socket.id);
    try {
      let mongoRoom = await Room.findById(user.room).populate('players.user');
      if (mongoRoom.stage === 1) {
        const { error } = await stage1({ mongoRoom, user, bid });
        if (error) {
          socket.emit('Error', { error });
        }
      }
    } catch (err) {
      console.error(err.message);
    }
    io.to(user.room).emit('Check DB');
  });
  //play cards
  socket.on('Play Cards', async cards => {
    const user = getUser(socket.id);
    try {
      let mongoRoom = await Room.findById(user.room).populate('players.user');
      const userIndex = mongoRoom.players.findIndex(player =>
        player.user._id.equals(user.userId)
      );
      if (mongoRoom.stage === 2) {
        const { error, gameOver } = await stage2({ mongoRoom, user, cards });
        if (error) {
          socket.emit('Error', { error });
        }
        if (gameOver) {
          io.to(user.room).emit('Check DB');
          io.to(user.room).emit('Game Over');
          setTimeout(async () => {
            endGame({ mongoRoom, userIndex });
            if (mongoRoom.stage === 0) {
              await stage0(mongoRoom);
              io.to(user.room).emit('Game Restart');
            } else {
              await mongoRoom.save();
              for (let i = 0; i < 3; i++) {
                let mongoUser = await User.findById(
                  mongoRoom.players[i].user._id
                );
                mongoUser.earning +=
                  mongoRoom.players[i].score * mongoRoom.bidValue;
                await mongoUser.save();
              }
              io.to(user.room).emit('Redirect');
            }
            io.to(user.room).emit('Check DB');
          }, 2000);
        }
      }
    } catch (err) {
      console.error(err.message);
    }
    io.to(user.room).emit('Check DB');
  });
  //pass turn
  socket.on('Pass', async () => {
    console.log('Turn Passed');
    const user = getUser(socket.id);
    try {
      let mongoRoom = await Room.findById(user.room);
      if (mongoRoom.stage === 2) {
        if (mongoRoom.previousPlayer == user.userId) {
          mongoRoom.previousPlayer = null;
          mongoRoom.combination = null;
          mongoRoom.cardRank = -1;
          mongoRoom.middle = [];
        }
        mongoRoom.turn += 1;
        mongoRoom.turn %= MAX_USERS;
        if (
          mongoRoom.previousPlayer &&
          mongoRoom.previousPlayer.equals(
            mongoRoom.players[mongoRoom.turn].user
          )
        ) {
          mongoRoom.middle = [];
        }
        await mongoRoom.save();
      }
    } catch (err) {
      console.error(err.message);
    }
    io.to(user.room).emit('Check DB');
  });

  socket.on('Leave', async () => {
    const user = getUser(socket.id);
    try {
      let mongoRoom = await Room.findById(user.room).populate('players.user');
      const userIndex = mongoRoom.players.findIndex(player =>
        player.user._id.equals(user.userId)
      );
      //leaving during game
      if (
        mongoRoom.numGames < 3 &&
        mongoRoom.stage !== 4 &&
        mongoRoom.stage !== -1
      ) {
        let mongoUser = await User.findById(user.userId);
        //update the leaving user
        if (mongoRoom.players[userIndex].score < 0) {
          mongoUser.earning +=
            mongoRoom.players[userIndex].score * mongoRoom.bidValue;
        }
        mongoUser.earning = Math.floor(mongoUser.earning * 0.96);
        await mongoUser.save();
        mongoRoom.players.splice(userIndex, 1);
        mongoRoom.playerCount -= 1;
        //update the other users
        for (let i = 0; i < 2; i++) {
          let mongoUser2 = await User.findById(mongoRoom.players[i].user._id);
          mongoUser2.earning += mongoRoom.players[i].score * mongoRoom.bidValue;
          await mongoUser2.save();
        }
        io.to(user.room).emit('Redirect'); //will redirect back to menu in 5 seconds
      }
      mongoRoom.stage = 4;
      mongoRoom.full = true;
      await mongoRoom.save();
    } catch (err) {
      console.error(err.message);
    }
    io.to(user.room).emit('Check DB');
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
