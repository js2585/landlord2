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

module.exports = { addUser, getUsersInRoom, getUser, shuffle, stage0 };
