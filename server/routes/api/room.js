const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../../models/User');
const Room = require('../../models/Room');

// @route   GET api/room
// @desc    Get user's room
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('room');
    res.json(user.room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route   GET api/room/join
// @desc    User joins room
// @access  Private
router.get('/join', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('room');
    const rooms = await Room.find({ full: false }).populate('players.user');
    let room;
    if (rooms.length <= 0 || !rooms) {
      room = new Room();
    } else {
      rooms.sort((a, b) => (a.playerCount > b.playerCount ? -1 : 1));
      room = rooms[0];
    }
    user.room = room._id;
    await user.save();
    if (room.players.length == room.playerCount) {
      room.players.push({ user: user._id });
      room.playerCount += 1;
    }
    if (room.playerCount >= 3) {
      room.full = true;
    }
    await room.save();
    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route   GET api/room/leave
// @desc    User leaves room
// @access  Private
router.get('/leave', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('room');
    const room = await Room.findById(user.room._id).populate('players.user');
    room.players.forEach((player, index) => {
      if (player.user._id.equals(user._id)) {
        room.players.splice(index, 1);
        room.playerCount -= 1;
      }
    });
    await room.save();
    user.room = null;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
