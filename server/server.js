const express = require('express');
const connectDB = require('./config/db');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//socket logic

//connect db
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

//Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

const PORT = process.env.PORT || 6000;

server.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});