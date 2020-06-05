const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
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
// @route   GET api/room/join/:bid
// @desc    User joins room
// @access  Private
router.get('/join/:bidValue', auth, async (req, res) => {
  try {
    const bidValue = req.params.bidValue;
    const user = await User.findById(req.user.id).populate('room');
    const rooms = await Room.find({
      full: false,
      bidValue,
      private: false
    }).populate('players.user');
    let room;
    if (rooms.length <= 0 || !rooms) {
      room = new Room({ bidValue });
    } else {
      rooms.sort((a, b) => (a.playerCount > b.playerCount ? -1 : 1));
      room = rooms[0];
    }
    user.room = room._id;
    await user.save();
    if (room.players.length == room.playerCount) {
      room.players.push({ user: user._id, username: user.username });
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
    const user = await User.findById(req.user.id);
    user.room = null;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/room/
// @desc    create room with a certain bid value
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('bidValue', 'Bid Value is Required')
        .not()
        .isEmpty(),
      check('bidValue', 'Bid Value Must Be a Number').isNumeric()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { bidValue } = req.body;
    try {
      let room = new Room({ bidValue, private: true });
      let user = await User.findById(req.user.id);
      user.earning -= 7500;
      await user.save();
      await room.save();
      res.json(room);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/room/join/private/:id
// @desc    join room with a certain id
// @access  Private
router.get('/join/private/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(req.user.id).populate('room');
    const room = await Room.findById(id).populate('players.user');
    if (room.full) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Game is already full' }] });
    }
    if (user.earning < 0) {
      return res
        .status(400)
        .json({ error: [{ msg: "You don't have enough money to play" }] });
    }
    user.room = room._id;
    await user.save();
    if (room.players.length == room.playerCount) {
      room.players.push({ user: user._id, username: user.username });
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

module.exports = router;
