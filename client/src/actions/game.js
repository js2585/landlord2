import { JOIN_ROOM_SUCCESS, ROOM_ERROR, LEAVE_ROOM } from './types';
import axios from 'axios';

export const joinNextRoom = () => async dispatch => {
  try {
    const res = await axios.get('/api/room');
    const rooms = res.data;
    if (rooms.length <= 0 || !rooms) {
      console.log('Need to create rooms');
    } else {
      rooms.sort((a, b) => (a.playerCount > b.playerCount ? -1 : 1));
      const room = rooms[0];
      dispatch({ type: JOIN_ROOM_SUCCESS, payload: room });
    }
  } catch (err) {
    dispatch({ type: ROOM_ERROR });
  }
};

export const leaveRoom = () => async dispatch => {
  dispatch({ type: LEAVE_ROOM });
};
