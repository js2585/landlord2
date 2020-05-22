const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../../models/User');
const Room = require('../../models/Room');

// @route   GET api/room
// @desc    Gets the list of rooms
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const rooms = await Room.find({ full: false });
    if (rooms.length <= 0 || !rooms) {
      const newRoom = new Room();
      await newRoom.save();
      return res.json([newRoom]);
    }
    res.json(rooms);
  } catch (err) {
    console.err(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
