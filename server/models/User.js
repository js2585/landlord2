const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  earning: {
    type: Number,
    default: 50000
  },
  opponents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model('User', UserSchema);
