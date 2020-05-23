const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  player1: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    hand: {
      type: Array
    }
  },
  player2: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    hand: {
      type: Array
    }
  },
  player3: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    hand: {
      type: Array
    }
  },
  playerCount: {
    type: Number,
    default: 0
  },
  full: {
    type: Boolean,
    default: false
  },
  deck: {
    type: Array,
    default: [
      {
        value: 'A',
        house: 'H'
      },
      {
        value: '2',
        house: 'H'
      },
      {
        value: '3',
        house: 'H'
      },
      {
        value: '4',
        house: 'H'
      },
      {
        value: '5',
        house: 'H'
      },
      {
        value: '6',
        house: 'H'
      },
      {
        value: '7',
        house: 'H'
      },
      {
        value: '8',
        house: 'H'
      },
      {
        value: '9',
        house: 'H'
      },
      {
        value: '9',
        house: 'H'
      },
      {
        value: '10',
        house: 'H'
      },
      {
        value: 'J',
        house: 'H'
      },
      {
        value: 'Q',
        house: 'H'
      },
      {
        value: 'K',
        house: 'H'
      },
      {
        value: 'A',
        house: 'C'
      },
      {
        value: '2',
        house: 'C'
      },
      {
        value: '3',
        house: 'C'
      },
      {
        value: '4',
        house: 'C'
      },
      {
        value: '5',
        house: 'C'
      },
      {
        value: '6',
        house: 'C'
      },
      {
        value: '7',
        house: 'C'
      },
      {
        value: '8',
        house: 'C'
      },
      {
        value: '9',
        house: 'C'
      },
      {
        value: '9',
        house: 'C'
      },
      {
        value: '10',
        house: 'C'
      },
      {
        value: 'J',
        house: 'C'
      },
      {
        value: 'Q',
        house: 'C'
      },
      {
        value: 'K',
        house: 'C'
      },
      {
        value: 'A',
        house: 'S'
      },
      {
        value: '2',
        house: 'S'
      },
      {
        value: '3',
        house: 'S'
      },
      {
        value: '4',
        house: 'S'
      },
      {
        value: '5',
        house: 'S'
      },
      {
        value: '6',
        house: 'S'
      },
      {
        value: '7',
        house: 'S'
      },
      {
        value: '8',
        house: 'S'
      },
      {
        value: '9',
        house: 'S'
      },
      {
        value: '9',
        house: 'S'
      },
      {
        value: '10',
        house: 'S'
      },
      {
        value: 'J',
        house: 'S'
      },
      {
        value: 'Q',
        house: 'S'
      },
      {
        value: 'K',
        house: 'S'
      },
      {
        value: 'A',
        house: 'D'
      },
      {
        value: '2',
        house: 'D'
      },
      {
        value: '3',
        house: 'D'
      },
      {
        value: '4',
        house: 'D'
      },
      {
        value: '5',
        house: 'D'
      },
      {
        value: '6',
        house: 'D'
      },
      {
        value: '7',
        house: 'D'
      },
      {
        value: '8',
        house: 'D'
      },
      {
        value: '9',
        house: 'D'
      },
      {
        value: '9',
        house: 'D'
      },
      {
        value: '10',
        house: 'D'
      },
      {
        value: 'J',
        house: 'D'
      },
      {
        value: 'Q',
        house: 'D'
      },
      {
        value: 'K',
        house: 'D'
      },
      {
        value: 'Joker',
        house: 'Red'
      },
      {
        value: 'Joker',
        house: 'Black'
      }
    ]
  },
  pot: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Room = mongoose.model('Room', RoomSchema);
