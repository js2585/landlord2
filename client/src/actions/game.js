import {
  JOIN_ROOM_SUCCESS,
  ROOM_ERROR,
  LEAVE_ROOM,
  ROOM_LOADED,
  NO_ROOM_LOADED
} from './types';
import axios from 'axios';
import { loadUser } from './auth';
import { setAlert } from './alert';

export const joinNextRoom = bidValue => async dispatch => {
  console.log(bidValue);
  try {
    const res = await axios.get(`/api/room/join/${bidValue}`);
    const room = res.data;
    dispatch({ type: JOIN_ROOM_SUCCESS, payload: room });
    //load user because get request changes the user's room data
    dispatch(loadUser());
  } catch (err) {
    dispatch({ type: ROOM_ERROR });
  }
};

export const loadRoom = () => async dispatch => {
  try {
    const res = await axios.get('/api/room');
    if (!res.data) {
      dispatch({
        type: NO_ROOM_LOADED
      });
    } else {
      dispatch({
        type: ROOM_LOADED,
        payload: res.data
      });
    }
  } catch (err) {
    dispatch({
      type: ROOM_ERROR
    });
  }
};

export const leaveRoom = () => async dispatch => {
  try {
    await axios.get('/api/room/leave');
    dispatch({ type: LEAVE_ROOM });
    //load user because get request changes the user's room data
    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: ROOM_ERROR
    });
  }
};

export const hostRoom = bidValue => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify({ bidValue });
  try {
    const res = await axios.post('/api/room', body, config);
    const room = res.data;
    console.log('Hosting');
    dispatch(joinRoom(room._id));
  } catch (err) {
    const errors = err.response.data.errors;
    errors.forEach(error => {
      dispatch(setAlert(error.msg, 'danger'));
    });
    dispatch({
      type: ROOM_ERROR
    });
  }
};

export const joinRoom = roomId => async dispatch => {
  try {
    const res = await axios.get(`/api/room/join/private/${roomId}`);
    const room = res.data;
    console.log('Joining');
    dispatch({ type: JOIN_ROOM_SUCCESS, payload: room });
    //load user because get request changes the user's room data
    dispatch(loadUser());
  } catch (err) {
    dispatch({ type: ROOM_ERROR });
  }
};
