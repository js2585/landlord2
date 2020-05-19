const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  player1: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    hand: []
  },
  player2: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    hand: []
  },
  player3: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    hand: []
  },
  deck: [
    { A: 'H' },
    { '2': 'H' },
    { '3': 'H' },
    { '4': 'H' },
    { '5': 'H' },
    { '6': 'H' },
    { '7': 'H' },
    { '8': 'H' },
    { '9': 'H' },
    { '10': 'H' },
    { J: 'H' },
    { Q: 'H' },
    { K: 'H' },
    { A: 'S' },
    { '2': 'S' },
    { '3': 'S' },
    { '4': 'S' },
    { '5': 'S' },
    { '6': 'S' },
    { '7': 'S' },
    { '8': 'S' },
    { '9': 'S' },
    { '10': 'S' },
    { J: 'S' },
    { Q: 'S' },
    { K: 'S' },
    { A: 'C' },
    { '2': 'C' },
    { '3': 'C' },
    { '4': 'C' },
    { '5': 'C' },
    { '6': 'C' },
    { '7': 'C' },
    { '8': 'C' },
    { '9': 'C' },
    { '10': 'C' },
    { J: 'C' },
    { Q: 'C' },
    { K: 'C' },
    { A: 'D' },
    { '2': 'D' },
    { '3': 'D' },
    { '4': 'D' },
    { '5': 'D' },
    { '6': 'D' },
    { '7': 'D' },
    { '8': 'D' },
    { '9': 'D' },
    { '10': 'D' },
    { J: 'D' },
    { Q: 'D' },
    { K: 'D' }
  ],
  pot: [],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Room', RoomSchema);
