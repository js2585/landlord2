import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from './types';
import { setAlert } from './alert';
import { loadRoom } from './game';

export const loadUser = () => async dispatch => {
  try {
    const res = await axios.get('/api/auth');
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
    dispatch(loadRoom());
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

//register
export const register = ({ username, password }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify({ username, password });
  try {
    const res = await axios.post('/api/users', body, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    errors.forEach(error => {
      dispatch(setAlert(error.msg, 'danger'));
    });
    dispatch({
      type: REGISTER_FAIL
    });
  }
};

//login
export const login = ({ username, password }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify({ username, password });
  try {
    const res = await axios.post('/api/auth', body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    errors.forEach(error => {
      dispatch(setAlert(error.msg, 'danger'));
    });
    dispatch({ type: LOGIN_FAIL });
  }
};

//logout

export const logout = () => dispatch => {
  dispatch({
    type: LOGOUT
  });
};
