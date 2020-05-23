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
    const rooms = await Room.find({ full: false });
    if (rooms.length <= 0 || !rooms) {
      const newRoom = new Room();
      await newRoom.save();
      user.room = newRoom;
      await user.save();
      return res.json(newRoom);
    }
    rooms.sort((a, b) => (a.playerCount > b.playerCount ? -1 : 1));
    const room = rooms[0];
    user.room = room;
    await user.save();
    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route   POST api/users/joinroom
// @desc    Update user's room
// @access  Private
// router.post('/joinroom', auth, async (req, res) => {
//   const { roomId } = req.body;
//   try {
//     const user = await User.findById(req.user.id);
//     const room = await Room.findById(roomId)
//       .populate(player1.user)
//       .populate(player2.user)
//       .populate(player3.user);
//     user.room = room;
//     if (!room.player1.user) {
//       user.save();
//       room.player1.user = user;
//       await room.save();
//       res.json(user);
//     } else if (!room.player2.user) {
//       user.save();
//       room.player2.user = user;
//       await room.save();
//       res.json(user);
//     } else if (!room.player3.user) {
//       user.save();
//       room.player3.user = user;
//       await room.save();
//       res.json(user);
//     } else {
//       return res.status(400).json({ msg: 'Room Full' });
//     }
//   } catch (err) {
//     console.error(err.message);
//     if (err instanceof mongoose.Error.CastError) {
//       return res.status(400).json({ msg: 'Room or User not found' });
//     }
//     res.status(500).send('Server Error');
//   }
// });

module.exports = router;
