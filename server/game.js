const users = [];

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

module.exports = { addUser };
