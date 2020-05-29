const users = [];

//adds user to users array and returns the user in array
const addUser = ({ socketId, userId, room }) => {
  const userIndex = users.findIndex(user => user.userId === userId);
  //refresh will trigger join again so we want to make sure the data is updated
  if (userIndex !== -1) {
    users[userIndex].socketId = socketId;
    users[userIndex].room = room;
    return { user: users[userIndex] };
  }
  const user = { socketId, userId, room };
  users.push(user);
  return { user };
};

//returns user by socketId
const getUser = socketId => users.find(user => user.socketId === socketId);
//returns array of users in room
const getUsersInRoom = room => users.filter(user => user.room === room);
//returns room by socketId

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
const shuffle = a => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const increaseTurn = mongoRoom => {
  mongoRoom.turn += 1;
  mongoRoom.turn %= 3;
};

const reShuffle = mongoRoom => {
  mongoRoom.deck = [
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
      value: 'Joker',
      house: 'Red'
    },
    {
      value: 'Joker',
      house: 'Black'
    }
  ];
  mongoRoom.middle = [];
  mongoRoom.deck = shuffle(mongoRoom.deck);
  for (let i = 0; i < 3; i++) {
    mongoRoom.middle.push(mongoRoom.deck[i]);
  }
  mongoRoom.deck.splice(0, 3);
  mongoRoom.players.forEach((player, playerIndex) => {
    mongoRoom.players[playerIndex].hand = mongoRoom.deck.filter(
      (card, cardIndex) => cardIndex % 3 === playerIndex
    );
  });
  mongoRoom.deck = [];
};

const stage0 = async mongoRoom => {
  mongoRoom.deck = shuffle(mongoRoom.deck);
  for (let i = 0; i < 3; i++) {
    mongoRoom.middle.push(mongoRoom.deck[i]);
  }
  mongoRoom.deck.splice(0, 3);
  mongoRoom.players.forEach((player, playerIndex) => {
    mongoRoom.players[playerIndex].hand = mongoRoom.deck.filter(
      (card, cardIndex) => cardIndex % 3 === playerIndex
    );
  });
  mongoRoom.deck = [];
  mongoRoom.stage += 1;
  await mongoRoom.save();
};

const stage1 = async ({ mongoRoom, user, bid }) => {
  const userIndex = mongoRoom.players.findIndex(player =>
    player.user._id.equals(user.userId)
  );
  if (bid == 3) {
    mongoRoom.currentBid = 3;
    mongoRoom.players[userIndex].bid = 3;
    mongoRoom.turn = userIndex;
    mongoRoom.players[userIndex].hand = [
      ...mongoRoom.players[userIndex].hand,
      ...mongoRoom.middle
    ];
    mongoRoom.stage += 1;
    await mongoRoom.save();
    return { error: null };
  }
  if (bid == 0) {
    mongoRoom.players[userIndex].bid = 0;
    //two passes in a row
    if (mongoRoom.previousPass && mongoRoom.currentBid > 0) {
      for (let i = 0; i < 3; i++) {
        const player = mongoRoom.players[i];
        if (player.bid === mongoRoom.currentBid) {
          mongoRoom.turn = i;
          mongoRoom.players[i].hand = [
            ...mongoRoom.players[userIndex].hand,
            ...mongoRoom.middle
          ];
          mongoRoom.stage += 1;
          await mongoRoom.save();
          return { error: null };
        }
      }
    }
    if (mongoRoom.currentBid > 0) {
      mongoRoom.previousPass = true;
      increaseTurn(mongoRoom);
      await mongoRoom.save();
      return { error: null };
    }
    if (userIndex === 2) {
      reShuffle(mongoRoom);
      increaseTurn(mongoRoom);
      await mongoRoom.save();
      return { error: null };
    }
    increaseTurn(mongoRoom);
    await mongoRoom.save();
    return { error: null };
  }
  if (bid <= mongoRoom.currentBid) {
    console.error('Bid must be greater than current bid');
    return {
      error: {
        msg: 'Bid must be greater than current bid or passed'
      }
    };
  }
  //normal
  mongoRoom.currentBid = bid;
  mongoRoom.players[userIndex].bid = bid;
  increaseTurn(mongoRoom);
  await mongoRoom.save();
  return { error: null };
};

module.exports = { addUser, getUsersInRoom, getUser, shuffle, stage0, stage1 };
