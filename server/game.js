const users = [];
const ranking = [
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
  'A',
  '2',
  'Joker Black',
  'Joker Red'
];
//adds user to users array and returns the user in array
const addUser = ({ socketId, userId, room }) => {
  const userIndex = users.findIndex(user => user.userId === userId);
  //refresh will trigger join again so we want to make sure the data is updated
  if (userIndex !== -1) {
    users[userIndex].socketId = socketId;
    users[userIndex].room = room;
    return { user: users[userIndex] };
  }
  const user = { socketId, userId, room, countDown: null };
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
      value: 'Joker Red',
      house: 'Red'
    },
    {
      value: 'Joker Black',
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
//return combination and rank or error
const getCombinationAndRank = cards => {
  if (cards.length === 1) {
    return { combination: 'Single Card', rank: cards[0].value };
  }
  if (cards.length === 2) {
    if (cards[0].value === cards[1].value) {
      return { combination: 'Pair', rank: cards[0].value };
    }
    //special case since it is the largest rank
    if (
      (cards[0].value === 'Joker Red' && cards[1].value === 'Joker Black') ||
      (cards[1].value === 'Joker Red' && cards[0].value === 'Joker Black')
    ) {
      return { combination: 'Rocket' };
    }
    return { error: { msg: 'Not A Valid Combination' } };
  }
  if (cards.length === 3) {
    if (
      cards[0].value === cards[1].value &&
      cards[1].value === cards[2].value
    ) {
      return { combination: 'Triplet', rank: cards[0].value };
    }
    return { error: { msg: 'Not A Valid Combination' } };
  }
  if (cards.length === 4) {
    let frequency = {};
    for (let i = 0; i < 4; i++) {
      const val = cards[i].value;
      if (!frequency[val]) {
        frequency[val] = 1;
      } else {
        frequency[val] += 1;
      }
    }
    for (const value in frequency) {
      if (frequency[value] === 4) {
        return { combination: 'Bomb', rank: value };
      }
      if (frequency[value] === 3) {
        return { combination: 'Triplet Plus Single', rank: value };
      }
    }
    return { error: { msg: 'Not A Valid Combination' } };
  }
  if (cards.length === 5) {
    let frequency = {};
    for (let i = 0; i < cards.length; i++) {
      const val = cards[i].value;
      if (!frequency[val]) {
        frequency[val] = 1;
      } else {
        frequency[val] += 1;
      }
    }
    let numValues = 0;
    for (const value in frequency) {
      numValues += 1;
    }
    if (numValues === 2) {
      for (const value in frequency) {
        if (frequency[value] === 3) {
          return { combination: 'Triplet Plus Pair', rank: value };
        }
      }
      return { error: { msg: 'Not A Valid Combination' } };
    }
    if (numValues === 5) {
      let values = [];
      for (const value in frequency) {
        values.push(value);
      }
      values.sort((a, b) => (getRank(a) > getRank(b) ? 1 : -1));
      for (let i = 1; i < values.length; i++) {
        if (getRank(values[i]) - 1 !== getRank(values[i - 1])) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
      }
      if (
        values[values.length - 1] === '2' ||
        values[values.length - 1] === 'Joker Black' ||
        values[values.length - 1] === 'Joker Red'
      ) {
        return { error: { msg: '2s and Jokers are not allowed in straights' } };
      }
      return { combination: 'Straight Five', rank: values[0] };
    }
    return { error: { msg: 'Not A Valid Combination' } };
  }
  if (cards.length === 6) {
    let frequency = {};
    for (let i = 0; i < cards.length; i++) {
      const val = cards[i].value;
      if (!frequency[val]) {
        frequency[val] = 1;
      } else {
        frequency[val] += 1;
      }
    }
    let numValues = 0;
    for (const value in frequency) {
      numValues += 1;
    }
    if (numValues === 2) {
      let values = [];
      for (const value in frequency) {
        if (frequency[value] !== 3) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
        values.push(value);
      }
      values.sort((a, b) => (getRank(a) > getRank(b) ? 1 : -1));
      if (getRank(values[1]) - 1 !== getRank(values[0])) {
        return { error: { msg: 'Not A Valid Combination' } };
      }
      if (
        values[1] === '2' ||
        values[1] === 'Joker Black' ||
        values[1] === 'Joker Red'
      ) {
        return { error: { msg: '2s and Jokers are not allowed in straights' } };
      }
      return { combination: 'Triplet Straight Two', rank: values[0] };
    }
    if (numValues === 3) {
      let values = [];
      //check for four of a kind plus 2 singles
      for (const value in frequency) {
        if (frequency[value] === 4) {
          for (const val in frequency) {
            if (frequency[val] !== 1 && frequency[val] !== 4) {
              return { error: { msg: 'Not A Valid Combination' } };
            }
          }
          return {
            combination: 'Four of A Kind Plus Two Singles',
            rank: value
          };
        }
      }
      //check for straight pair
      for (const value in frequency) {
        if (frequency[value] !== 2) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
        values.push(value);
      }
      values.sort((a, b) => (getRank(a) > getRank(b) ? 1 : -1));
      for (let i = 1; i < values.length; i++) {
        if (getRank(values[i]) - 1 !== getRank(values[i - 1])) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
      }
      if (
        values[values.length - 1] === '2' ||
        values[values.length - 1] === 'Joker Black' ||
        values[values.length - 1] === 'Joker Red'
      ) {
        return { error: { msg: '2s and Jokers are not allowed in straights' } };
      }
      return { combination: 'Pair Straight Three', rank: values[0] };
    }
    //straight
    if (numValues === 6) {
      let values = [];
      for (const value in frequency) {
        values.push(value);
      }
      values.sort((a, b) => (getRank(a) > getRank(b) ? 1 : -1));
      for (let i = 1; i < values.length; i++) {
        if (getRank(values[i]) - 1 !== getRank(values[i - 1])) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
      }
      if (
        values[values.length - 1] === '2' ||
        values[values.length - 1] === 'Joker Black' ||
        values[values.length - 1] === 'Joker Red'
      ) {
        return { error: { msg: '2s and Jokers are not allowed in straights' } };
      }
      return { combination: 'Straight Six', rank: values[0] };
    }
    return { error: { msg: 'Not A Valid Combination' } };
  }
  if (cards.length === 7) {
    let frequency = {};
    for (let i = 0; i < cards.length; i++) {
      const val = cards[i].value;
      if (!frequency[val]) {
        frequency[val] = 1;
      } else {
        frequency[val] += 1;
      }
    }
    let numValues = 0;
    for (const value in frequency) {
      numValues += 1;
    }
    if (numValues === 7) {
      let values = [];
      for (const value in frequency) {
        values.push(value);
      }
      values.sort((a, b) => (getRank(a) > getRank(b) ? 1 : -1));
      for (let i = 1; i < values.length; i++) {
        if (getRank(values[i]) - 1 !== getRank(values[i - 1])) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
      }
      if (
        values[values.length - 1] === '2' ||
        values[values.length - 1] === 'Joker Black' ||
        values[values.length - 1] === 'Joker Red'
      ) {
        return { error: { msg: '2s and Jokers are not allowed in straights' } };
      }
      return { combination: 'Straight Seven', rank: values[0] };
    }
    return { error: { msg: 'Not A Valid Combination' } };
  }
  if (cards.length === 8) {
    let frequency = {};
    for (let i = 0; i < cards.length; i++) {
      const val = cards[i].value;
      if (!frequency[val]) {
        frequency[val] = 1;
      } else {
        frequency[val] += 1;
      }
    }
    let numValues = 0;
    for (const value in frequency) {
      numValues += 1;
    }
    if (numValues === 4) {
      let values = [];
      let isThreeOfAKind = false;
      for (const value in frequency) {
        if (frequency[value] === 3) {
          isThreeOfAKind = true;
          for (const val in frequency) {
            if (frequency[val] !== 3 && frequency[val] !== 1) {
              return { error: { msg: 'Not A Valid Combination' } };
            }
            if (frequency[val] === 3) {
              values.push(val);
            }
          }
          break;
        }
        if (frequency[value] === 2) {
          for (const val in frequency) {
            if (frequency[val] !== 2) {
              return { error: { msg: 'Not A Valid Combination' } };
            }
            values.push(val);
          }
          break;
        }
      }
      values.sort((a, b) => (getRank(a) > getRank(b) ? 1 : -1));
      for (let i = 1; i < values.length; i++) {
        if (getRank(values[i]) - 1 !== getRank(values[i - 1])) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
      }
      if (
        values[values.length - 1] === '2' ||
        values[values.length - 1] === 'Joker Black' ||
        values[values.length - 1] === 'Joker Red'
      ) {
        return { error: { msg: '2s and Jokers are not allowed in straights' } };
      }
      if (isThreeOfAKind) {
        return {
          combination: 'Triplet Straight Plus A Pair Two',
          rank: values[0]
        };
      }
      return { combination: 'Pair Straight Four', rank: values[0] };
    }
    if (numValues === 3) {
      for (const value in frequency) {
        if (frequency[value] === 4) {
          for (const val in frequency) {
            if (frequency[val] !== 2 && frequency[val] !== 4) {
              return { error: { msg: 'Not A Valid Combination' } };
            }
          }
          return { combination: 'Four of a Kind Plus Two Pairs', rank: value };
        }
      }
      return { error: { msg: 'Not A Valid Combination' } };
    }
    if (numValues === 8) {
      let values = [];
      for (const value in frequency) {
        values.push(value);
      }
      values.sort((a, b) => (getRank(a) > getRank(b) ? 1 : -1));
      for (let i = 1; i < values.length; i++) {
        if (getRank(values[i]) - 1 !== getRank(values[i - 1])) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
      }
      if (
        values[values.length - 1] === '2' ||
        values[values.length - 1] === 'Joker Black' ||
        values[values.length - 1] === 'Joker Red'
      ) {
        return { error: { msg: '2s and Jokers are not allowed in straights' } };
      }
      return { combination: 'Straight Eight', rank: values[0] };
    }
    return { error: { msg: 'Not A Valid Combination' } };
  }
  if (cards.length === 9) {
    let frequency = {};
    for (let i = 0; i < cards.length; i++) {
      const val = cards[i].value;
      if (!frequency[val]) {
        frequency[val] = 1;
      } else {
        frequency[val] += 1;
      }
    }
    let numValues = 0;
    for (const value in frequency) {
      numValues += 1;
    }
    if (numValues === 3) {
      let values = [];
      for (const value in frequency) {
        if (frequency[value] !== 3) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
        values.push(value);
      }
      values.sort((a, b) => (getRank(a) > getRank(b) ? 1 : -1));
      for (let i = 1; i < values.length; i++) {
        if (getRank(values[i]) - 1 !== getRank(values[i - 1])) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
      }
      if (
        values[values.length - 1] === '2' ||
        values[values.length - 1] === 'Joker Black' ||
        values[values.length - 1] === 'Joker Red'
      ) {
        return { error: { msg: '2s and Jokers are not allowed in straights' } };
      }
      return { combination: 'Triplet Straight Three', rank: values[0] };
    }
    if (numValues === 9) {
      let values = [];
      for (const value in frequency) {
        values.push(value);
      }
      values.sort((a, b) => (getRank(a) > getRank(b) ? 1 : -1));
      for (let i = 1; i < values.length; i++) {
        if (getRank(values[i]) - 1 !== getRank(values[i - 1])) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
      }
      if (
        values[values.length - 1] === '2' ||
        values[values.length - 1] === 'Joker Black' ||
        values[values.length - 1] === 'Joker Red'
      ) {
        return { error: { msg: '2s and Jokers are not allowed in straights' } };
      }
      return { combination: 'Straight Nine', rank: values[0] };
    }
    return { error: { msg: 'Not A Valid Combination' } };
  }
  if (cards.length === 10) {
    let frequency = {};
    for (let i = 0; i < cards.length; i++) {
      const val = cards[i].value;
      if (!frequency[val]) {
        frequency[val] = 1;
      } else {
        frequency[val] += 1;
      }
    }
    let numValues = 0;
    for (const value in frequency) {
      numValues += 1;
    }
    if (numValues === 4) {
      let values = [];
      for (const value in frequency) {
        if (frequency[value] === 3) {
          values.push(value);
        }
        if (frequency[value] !== 3 && frequency[value] !== 2) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
      }
      values.sort((a, b) => (getRank(a) > getRank(b) ? 1 : -1));
      for (let i = 1; i < values.length; i++) {
        if (getRank(values[i]) - 1 !== getRank(values[i - 1])) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
      }
      if (
        values[values.length - 1] === '2' ||
        values[values.length - 1] === 'Joker Black' ||
        values[values.length - 1] === 'Joker Red'
      ) {
        return { error: { msg: '2s and Jokers are not allowed in straights' } };
      }
      return {
        combination: 'Triplet Straight Plus Two Pairs Two',
        rank: values[0]
      };
    }
    if (numValues === 5) {
      let values = [];
      for (const value in frequency) {
        if (frequency[value] !== 2) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
        values.push(value);
      }
      values.sort((a, b) => (getRank(a) > getRank(b) ? 1 : -1));
      for (let i = 1; i < values.length; i++) {
        if (getRank(values[i]) - 1 !== getRank(values[i - 1])) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
      }
      if (
        values[values.length - 1] === '2' ||
        values[values.length - 1] === 'Joker Black' ||
        values[values.length - 1] === 'Joker Red'
      ) {
        return { error: { msg: '2s and Jokers are not allowed in straights' } };
      }
      return { combination: 'Pair Straight Five', rank: values[0] };
    }
    if (numValues === 10) {
      let values = [];
      for (const value in frequency) {
        values.push(value);
      }
      values.sort((a, b) => (getRank(a) > getRank(b) ? 1 : -1));
      for (let i = 1; i < values.length; i++) {
        if (getRank(values[i]) - 1 !== getRank(values[i - 1])) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
      }
      if (
        values[values.length - 1] === '2' ||
        values[values.length - 1] === 'Joker Black' ||
        values[values.length - 1] === 'Joker Red'
      ) {
        return { error: { msg: '2s and Jokers are not allowed in straights' } };
      }
      return { combination: 'Straight Ten', rank: values[0] };
    }
    return { error: { msg: 'Not A Valid Combination' } };
  }
  if (cards.length === 11) {
    let frequency = {};
    for (let i = 0; i < cards.length; i++) {
      const val = cards[i].value;
      if (!frequency[val]) {
        frequency[val] = 1;
      } else {
        frequency[val] += 1;
      }
    }
    let numValues = 0;
    for (const value in frequency) {
      numValues += 1;
    }
    if (numValues === 11) {
      let values = [];
      for (const value in frequency) {
        values.push(value);
      }
      values.sort((a, b) => (getRank(a) > getRank(b) ? 1 : -1));
      for (let i = 1; i < values.length; i++) {
        if (getRank(values[i]) - 1 !== getRank(values[i - 1])) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
      }
      if (
        values[values.length - 1] === '2' ||
        values[values.length - 1] === 'Joker Black' ||
        values[values.length - 1] === 'Joker Red'
      ) {
        return { error: { msg: '2s and Jokers are not allowed in straights' } };
      }
      return { combination: 'Straight Eleven', rank: values[0] };
    }
    return { error: { msg: 'Not A Valid Combination' } };
  }
  if (cards.length === 12) {
    let frequency = {};
    for (let i = 0; i < cards.length; i++) {
      const val = cards[i].value;
      if (!frequency[val]) {
        frequency[val] = 1;
      } else {
        frequency[val] += 1;
      }
    }
    let numValues = 0;
    for (const value in frequency) {
      numValues += 1;
    }
    if (numValues === 6) {
      let values = [];
      let isThreeOfAKind = false;
      for (const value in frequency) {
        if (frequency[value] === 3) {
          isThreeOfAKind = true;
          for (const val in frequency) {
            if (frequency[val] !== 3 && frequency[val] !== 1) {
              return { error: { msg: 'Not A Valid Combination' } };
            }
            if (frequency[val] === 3) {
              values.push(val);
            }
          }
          break;
        }
        if (frequency[value] === 2) {
          for (const val in frequency) {
            if (frequency[val] !== 2) {
              return { error: { msg: 'Not A Valid Combination' } };
            }
            values.push(val);
          }
          break;
        }
      }
      values.sort((a, b) => (getRank(a) > getRank(b) ? 1 : -1));
      for (let i = 1; i < values.length; i++) {
        if (getRank(values[i]) - 1 !== getRank(values[i - 1])) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
      }
      if (
        values[values.length - 1] === '2' ||
        values[values.length - 1] === 'Joker Black' ||
        values[values.length - 1] === 'Joker Red'
      ) {
        return { error: { msg: '2s and Jokers are not allowed in straights' } };
      }
      if (isThreeOfAKind) {
        return {
          combination: 'Triplet Straight Plus A Pair Three',
          rank: values[0]
        };
      }
      return { combination: 'Pair Straight Six', rank: values[0] };
    }
    if (numValues === 4) {
      let values = [];
      for (const value in frequency) {
        if (frequency[value] !== 3) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
        values.push(value);
      }
      values.sort((a, b) => (getRank(a) > getRank(b) ? 1 : -1));
      for (let i = 1; i < values.length; i++) {
        if (getRank(values[i]) - 1 !== getRank(values[i - 1])) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
      }
      if (
        values[values.length - 1] === '2' ||
        values[values.length - 1] === 'Joker Black' ||
        values[values.length - 1] === 'Joker Red'
      ) {
        return { error: { msg: '2s and Jokers are not allowed in straights' } };
      }
      return { combination: 'Triplet Straight Four', rank: values[0] };
    }
    if (numValues === 12) {
      let values = [];
      for (const value in frequency) {
        values.push(value);
      }
      values.sort((a, b) => (getRank(a) > getRank(b) ? 1 : -1));
      for (let i = 1; i < values.length; i++) {
        if (getRank(values[i]) - 1 !== getRank(values[i - 1])) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
      }
      if (
        values[values.length - 1] === '2' ||
        values[values.length - 1] === 'Joker Black' ||
        values[values.length - 1] === 'Joker Red'
      ) {
        return { error: { msg: '2s and Jokers are not allowed in straights' } };
      }
      return { combination: 'Straight Twelve', rank: values[0] };
    }
    return { error: { msg: 'Not A Valid Combination' } };
  }
  //13 is impossible because straight ends at 12 cards (3,4,5,6,7,8,9,10,J,Q,K,A)
  if (cards.length === 14) {
    let frequency = {};
    for (let i = 0; i < cards.length; i++) {
      const val = cards[i].value;
      if (!frequency[val]) {
        frequency[val] = 1;
      } else {
        frequency[val] += 1;
      }
    }
    let numValues = 0;
    for (const value in frequency) {
      numValues += 1;
    }
    if (numValues === 7) {
      let values = [];
      for (const value in frequency) {
        if (frequency[value] !== 2) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
        values.push(value);
      }
      values.sort((a, b) => (getRank(a) > getRank(b) ? 1 : -1));
      for (let i = 1; i < values.length; i++) {
        if (getRank(values[i]) - 1 !== getRank(values[i - 1])) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
      }
      if (
        values[values.length - 1] === '2' ||
        values[values.length - 1] === 'Joker Black' ||
        values[values.length - 1] === 'Joker Red'
      ) {
        return { error: { msg: '2s and Jokers are not allowed in straights' } };
      }
      return { combination: 'Pair Straight Seven', rank: values[0] };
    }
    return { error: { msg: 'Not A Valid Combination' } };
  }
  if (cards.length === 15) {
    let frequency = {};
    for (let i = 0; i < cards.length; i++) {
      const val = cards[i].value;
      if (!frequency[val]) {
        frequency[val] = 1;
      } else {
        frequency[val] += 1;
      }
    }
    let numValues = 0;
    for (const value in frequency) {
      numValues += 1;
    }
    if (numValues === 6) {
      let values = [];
      for (const value in frequency) {
        if (frequency[value] === 3) {
          values.push(value);
        }
        if (frequency[value] !== 3 && frequency[value] !== 2) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
      }
      values.sort((a, b) => (getRank(a) > getRank(b) ? 1 : -1));
      for (let i = 1; i < values.length; i++) {
        if (getRank(values[i]) - 1 !== getRank(values[i - 1])) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
      }
      if (
        values[values.length - 1] === '2' ||
        values[values.length - 1] === 'Joker Black' ||
        values[values.length - 1] === 'Joker Red'
      ) {
        return { error: { msg: '2s and Jokers are not allowed in straights' } };
      }
      return {
        combination: 'Triplet Straight Plus Two Pairs Three',
        rank: values[0]
      };
    }
    if (numValues === 5) {
      let values = [];
      for (const value in frequency) {
        if (frequency[value] !== 3) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
        values.push(value);
      }
      values.sort((a, b) => (getRank(a) > getRank(b) ? 1 : -1));
      for (let i = 1; i < values.length; i++) {
        if (getRank(values[i]) - 1 !== getRank(values[i - 1])) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
      }
      if (
        values[values.length - 1] === '2' ||
        values[values.length - 1] === 'Joker Black' ||
        values[values.length - 1] === 'Joker Red'
      ) {
        return { error: { msg: '2s and Jokers are not allowed in straights' } };
      }
      return { combination: 'Triplet Straight Five', rank: values[0] };
    }
    return { error: { msg: 'Not A Valid Combination' } };
  }
  if (cards.length === 16) {
    let frequency = {};
    for (let i = 0; i < cards.length; i++) {
      const val = cards[i].value;
      if (!frequency[val]) {
        frequency[val] = 1;
      } else {
        frequency[val] += 1;
      }
    }
    let numValues = 0;
    for (const value in frequency) {
      numValues += 1;
    }
    if (numValues === 8) {
      let values = [];
      let isThreeOfAKind = false;
      for (const value in frequency) {
        if (frequency[value] === 3) {
          isThreeOfAKind = true;
          for (const val in frequency) {
            if (frequency[val] !== 3 && frequency[val] !== 1) {
              return { error: { msg: 'Not A Valid Combination' } };
            }
            if (frequency[val] === 3) {
              values.push(val);
            }
          }
          break;
        }
        if (frequency[value] === 2) {
          for (const val in frequency) {
            if (frequency[val] !== 2) {
              return { error: { msg: 'Not A Valid Combination' } };
            }
            values.push(val);
          }
          break;
        }
      }
      values.sort((a, b) => (getRank(a) > getRank(b) ? 1 : -1));
      for (let i = 1; i < values.length; i++) {
        if (getRank(values[i]) - 1 !== getRank(values[i - 1])) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
      }
      if (
        values[values.length - 1] === '2' ||
        values[values.length - 1] === 'Joker Black' ||
        values[values.length - 1] === 'Joker Red'
      ) {
        return { error: { msg: '2s and Jokers are not allowed in straights' } };
      }
      if (isThreeOfAKind) {
        return {
          combination: 'Triplet Straight Plus A Pair Four',
          rank: values[0]
        };
      }
      return { combination: 'Pair Straight Eight', rank: values[0] };
    }
    return { error: { msg: 'Not A Valid Combination' } };
  }
  //17 impossible
  if (cards.length === 18) {
    let frequency = {};
    for (let i = 0; i < cards.length; i++) {
      const val = cards[i].value;
      if (!frequency[val]) {
        frequency[val] = 1;
      } else {
        frequency[val] += 1;
      }
    }
    let numValues = 0;
    for (const value in frequency) {
      numValues += 1;
    }
    if (numValues === 6) {
      let values = [];
      for (const value in frequency) {
        if (frequency[value] !== 3) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
        values.push(value);
      }
      values.sort((a, b) => (getRank(a) > getRank(b) ? 1 : -1));
      for (let i = 1; i < values.length; i++) {
        if (getRank(values[i]) - 1 !== getRank(values[i - 1])) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
      }
      if (
        values[values.length - 1] === '2' ||
        values[values.length - 1] === 'Joker Black' ||
        values[values.length - 1] === 'Joker Red'
      ) {
        return { error: { msg: '2s and Jokers are not allowed in straights' } };
      }
      return { combination: 'Triplet Straight Six', rank: values[0] };
    }
    if (numValues === 9) {
      let values = [];
      for (const value in frequency) {
        if (frequency[value] !== 2) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
        values.push(value);
      }
      values.sort((a, b) => (getRank(a) > getRank(b) ? 1 : -1));
      for (let i = 1; i < values.length; i++) {
        if (getRank(values[i]) - 1 !== getRank(values[i - 1])) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
      }
      if (
        values[values.length - 1] === '2' ||
        values[values.length - 1] === 'Joker Black' ||
        values[values.length - 1] === 'Joker Red'
      ) {
        return { error: { msg: '2s and Jokers are not allowed in straights' } };
      }
      return { combination: 'Pair Straight Nine', rank: values[0] };
    }
    return { error: { msg: 'Not A Valid Combination' } };
  }
  //19 impossible
  if (cards.length === 20) {
    let frequency = {};
    for (let i = 0; i < cards.length; i++) {
      const val = cards[i].value;
      if (!frequency[val]) {
        frequency[val] = 1;
      } else {
        frequency[val] += 1;
      }
    }
    let numValues = 0;
    for (const value in frequency) {
      numValues += 1;
    }
    if (numValues === 10) {
      let values = [];
      let isThreeOfAKind = false;
      for (const value in frequency) {
        if (frequency[value] === 3) {
          isThreeOfAKind = true;
          for (const val in frequency) {
            if (frequency[val] !== 3 && frequency[val] !== 1) {
              return { error: { msg: 'Not A Valid Combination' } };
            }
            if (frequency[val] === 3) {
              values.push(val);
            }
          }
          break;
        }
        if (frequency[value] === 2) {
          for (const val in frequency) {
            if (frequency[val] !== 2) {
              return { error: { msg: 'Not A Valid Combination' } };
            }
            values.push(val);
          }
          break;
        }
      }
      values.sort((a, b) => (getRank(a) > getRank(b) ? 1 : -1));
      for (let i = 1; i < values.length; i++) {
        if (getRank(values[i]) - 1 !== getRank(values[i - 1])) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
      }
      if (
        values[values.length - 1] === '2' ||
        values[values.length - 1] === 'Joker Black' ||
        values[values.length - 1] === 'Joker Red'
      ) {
        return { error: { msg: '2s and Jokers are not allowed in straights' } };
      }
      if (isThreeOfAKind) {
        return {
          combination: 'Triplet Straight Plus A Pair Five',
          rank: values[0]
        };
      }
      return { combination: 'Pair Straight Ten', rank: values[0] };
    }
    if (numValues === 8) {
      let values = [];
      for (const value in frequency) {
        if (frequency[value] === 3) {
          values.push(value);
        }
        if (frequency[value] !== 3 && frequency[value] !== 2) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
      }
      values.sort((a, b) => (getRank(a) > getRank(b) ? 1 : -1));
      for (let i = 1; i < values.length; i++) {
        if (getRank(values[i]) - 1 !== getRank(values[i - 1])) {
          return { error: { msg: 'Not A Valid Combination' } };
        }
      }
      if (
        values[values.length - 1] === '2' ||
        values[values.length - 1] === 'Joker Black' ||
        values[values.length - 1] === 'Joker Red'
      ) {
        return { error: { msg: '2s and Jokers are not allowed in straights' } };
      }
      return {
        combination: 'Triplet Straight Plus Two Pairs Four',
        rank: values[0]
      };
    }
    return { error: { msg: 'Not A Valid Combination' } };
  }
  return { error: { msg: 'Not A Valid Combination' } };
};

const getRank = value => {
  return ranking.findIndex(rank => value === rank);
};
//when player can play anything
const playAny = ({ mongoRoom, cards }) => {
  const obj = getCombinationAndRank(cards);
  const { combination, error } = obj;
  let { rank } = obj;
  if (error) {
    return { error };
  }
  if (rank) {
    rank = getRank(rank);
  }
  if (combination === 'Rocket') {
    mongoRoom.currentBid *= 2;
    mongoRoom.combination = combination;
    mongoRoom.middle = cards;
    mongoRoom.cardRank = 15;
    increaseTurn(mongoRoom);
    return { error: null };
  }
  if (combination === 'Bomb') {
    mongoRoom.currentBid *= 2;
  }
  mongoRoom.combination = combination;
  mongoRoom.middle = cards;
  mongoRoom.cardRank = rank;
  increaseTurn(mongoRoom);
  return { error: null };
};
//when player is not free to play whatever cards he wants
const playSpecific = ({ mongoRoom, cards }) => {
  const obj = getCombinationAndRank(cards);
  const { combination, error } = obj;
  let { rank } = obj;
  if (error) {
    return { error };
  }
  if (rank) {
    rank = getRank(rank);
  }
  if (combination === 'Rocket') {
    mongoRoom.currentBid *= 2;
    mongoRoom.combination = combination;
    mongoRoom.middle = cards;
    mongoRoom.cardRank = 15;
    increaseTurn(mongoRoom);
    return { error: null };
  }
  if (combination === 'Bomb') {
    if (mongoRoom.combination === combination) {
      if (rank <= mongoRoom.cardRank) {
        return { error: { msg: 'Invalid Play' } };
      }
    }
    mongoRoom.currentBid *= 2;
    mongoRoom.combination = combination;
    mongoRoom.middle = cards;
    mongoRoom.cardRank = rank;
    increaseTurn(mongoRoom);
    return { error: null };
  }
  if (!(combination === mongoRoom.combination && rank > mongoRoom.cardRank)) {
    return { error: { msg: 'Invalid Play' } };
  }
  mongoRoom.combination = combination;
  mongoRoom.middle = cards;
  mongoRoom.cardRank = rank;
  increaseTurn(mongoRoom);
  return { error: null };
};
//checks hand and removes cards played
const filterCards = ({ mongoRoom, userIndex, cards }) => {
  mongoRoom.players[userIndex].hand = mongoRoom.players[userIndex].hand.filter(
    card => {
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].house === card.house && cards[i].value === card.value) {
          return false;
        }
      }
      return true;
    }
  );
};

const resetGame = mongoRoom => {
  for (let i = 0; i < 3; i++) {
    mongoRoom.players[i].hand = [];
    mongoRoom.players[i].bid = 0;
    mongoRoom.players[i].landlord = false;
  }
  mongoRoom.previousPlayer = null;
  mongoRoom.cardRank = -1;
  mongoRoom.combination = 'Any';
  mongoRoom.currentBid = 0;
  mongoRoom.previousPass = false;
  mongoRoom.middle = [];
  mongoRoom.stage = 0;
  mongoRoom.numPass = 0;
  mongoRoom.turn = mongoRoom.numGames;
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
      value: 'Joker Red',
      house: 'Red'
    },
    {
      value: 'Joker Black',
      house: 'Black'
    }
  ];
};

//update score
//if games < 3 reset everything
//if games >= 3 end screen
const endGame = ({ mongoRoom, userIndex }) => {
  if (mongoRoom.players[userIndex].landlord) {
    for (let i = 0; i < 3; i++) {
      if (mongoRoom.players[i].landlord) {
        mongoRoom.players[i].score += 2 * mongoRoom.currentBid;
      } else {
        mongoRoom.players[i].score -= mongoRoom.currentBid;
      }
    }
  } else {
    for (let i = 0; i < 3; i++) {
      if (mongoRoom.players[i].landlord) {
        mongoRoom.players[i].score -= 2 * mongoRoom.currentBid;
      } else {
        mongoRoom.players[i].score += mongoRoom.currentBid;
      }
    }
  }
  mongoRoom.numGames += 1;
  if (mongoRoom.numGames >= 3) {
    mongoRoom.stage = 4;
    return;
  }
  resetGame(mongoRoom);
  return;
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
    mongoRoom.middle = [];
    mongoRoom.players[userIndex].landlord = true;
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
            ...mongoRoom.players[i].hand,
            ...mongoRoom.middle
          ];
          mongoRoom.middle = [];
          mongoRoom.players[i].landlord = true;
          mongoRoom.stage += 1;
          await mongoRoom.save();
          return { error: null };
        }
      }
    }
    //not 2 passes in a row but someone already bid
    if (mongoRoom.currentBid > 0) {
      mongoRoom.previousPass = true;
      increaseTurn(mongoRoom);
      await mongoRoom.save();
      return { error: null };
    }
    //nobody has bid
    mongoRoom.numPass += 1;
    //nobody has bid and user is last to bid
    if (mongoRoom.numPass >= 3) {
      reShuffle(mongoRoom);
      increaseTurn(mongoRoom);
      mongoRoom.numPass = 0;
      await mongoRoom.save();
      return { error: null };
    }
    //nobody has bid but user is not last to bid
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

const stage2 = async ({ mongoRoom, user, cards }) => {
  const userIndex = mongoRoom.players.findIndex(player =>
    player.user._id.equals(user.userId)
  );
  //there exists a previous player that played something
  if (mongoRoom.previousPlayer) {
    if (user.userId == mongoRoom.previousPlayer) {
      const { error } = playAny({ mongoRoom, cards });
      if (error) {
        return { error };
      }
      filterCards({ mongoRoom, userIndex, cards });
      mongoRoom.previousPlayer = user.userId;
      if (mongoRoom.players[userIndex].hand.length <= 0) {
        mongoRoom.stage = 3;
        await mongoRoom.save();
        return { error: null, gameOver: true };
      }
      await mongoRoom.save();
      return { error: null };
    }
    const { error } = playSpecific({ mongoRoom, cards });
    if (error) {
      return { error };
    }
    filterCards({ mongoRoom, userIndex, cards });
    mongoRoom.previousPlayer = user.userId;
    if (mongoRoom.players[userIndex].hand.length <= 0) {
      mongoRoom.stage = 3;
      await mongoRoom.save();
      return { error: null, gameOver: true };
    }
    await mongoRoom.save();
    return { error: null };
  }
  //no previous player
  const { error } = playAny({ mongoRoom, cards });
  if (error) {
    return { error };
  }
  filterCards({ mongoRoom, userIndex, cards });
  mongoRoom.previousPlayer = user.userId;
  if (mongoRoom.players[userIndex].hand.length <= 0) {
    mongoRoom.stage = 3;
    await mongoRoom.save();
    return { error: null, gameOver: true };
  }
  await mongoRoom.save();
  return { error: null };
};

module.exports = {
  addUser,
  getUsersInRoom,
  getUser,
  shuffle,
  stage0,
  stage1,
  stage2,
  endGame
};
