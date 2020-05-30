const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  players: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      username: {
        type: String
      },
      hand: [Object],
      bid: {
        type: Number,
        default: 0
      },
      score: {
        type: Number,
        default: 0
      },
      landlord: {
        type: Boolean,
        default: false
      }
    }
  ],
  previousPlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cardRank: {
    type: Number,
    default: -1
  },
  combination: {
    type: String,
    default: 'Any'
  },
  currentBid: {
    type: Number,
    default: 0
  },
  bidValue: {
    type: Number,
    default: 0
  },
  previousPass: {
    type: Boolean,
    default: false
  },
  numPass: {
    type: Number,
    default: 0
  },
  playerCount: {
    type: Number,
    default: 0
  },
  full: {
    type: Boolean,
    default: false
  },
  middle: [Object],
  //stage -1: lobby
  //stage 0: dealing
  //stage 1: bidding
  //stage 2: game
  //stage 3: reset
  //stage 4: end game
  stage: {
    type: Number,
    default: -1
  },
  turn: {
    type: Number,
    default: 0
  },
  numGames: {
    type: Number,
    default: 0
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
        value: 'Joker Red',
        house: 'Red'
      },
      {
        value: 'Joker Black',
        house: 'Black'
      }
    ]
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Room = mongoose.model('Room', RoomSchema);
