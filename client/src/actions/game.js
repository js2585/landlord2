import {
  JOIN_ROOM_SUCCESS,
  ROOM_ERROR,
  LEAVE_ROOM,
  ROOM_LOADED
} from './types';
import axios from 'axios';
import { loadUser } from './auth';

export const joinNextRoom = () => async dispatch => {
  try {
    const res = await axios.get('/api/room/join');
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
        type: ROOM_ERROR
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
    const res = await axios.get('/api/room/leave');
    dispatch({ type: LEAVE_ROOM });
    //load user because get request changes the user's room data
    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: ROOM_ERROR
    });
  }
};
