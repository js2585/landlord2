import {
  JOIN_ROOM_SUCCESS,
  ROOM_ERROR,
  LEAVE_ROOM,
  ROOM_LOADED,
  NO_ROOM_LOADED
} from '../actions/types';
const initialState = {
  room: null,
  inGame: null,
  loading: true
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case JOIN_ROOM_SUCCESS:
    case ROOM_LOADED:
      return {
        ...state,
        inGame: true,
        room: payload,
        loading: false
      };
    case ROOM_ERROR:
    case LEAVE_ROOM:
    case NO_ROOM_LOADED:
      return {
        ...state,
        room: null,
        loading: false,
        inGame: false
      };
    default:
      return state;
  }
}
