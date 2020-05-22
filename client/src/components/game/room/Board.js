import React, { Fragment, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { leaveRoom } from '../../../actions/game';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';

let socket;

const Board = ({ game, auth, leaveRoom, location }) => {
  const ENDPOINT = 'http://localhost:5000';
  //room info
  const [room, setRoom] = useState('');
  //determines redirect
  const [exit, setExit] = useState(false);
  useEffect(() => {
    const { room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setRoom(room);
    //When to redirect

    if (
      ((!game.inGame || room !== game.room._id) && !game.loading) ||
      !game.room
    ) {
      setExit(true);
    }
    return () => {
      leaveRoom();
      socket.disconnect();
    };
  }, [ENDPOINT, location.search]);

  if (exit) {
    return <Redirect to='/menu' />;
  }
  const onClick = e => {
    e.preventDefault();
    setExit(true);
  };
  return (
    <Fragment>
      Game room
      <button onClick={e => onClick(e)}>Leave</button>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
  game: state.game
});

export default connect(
  mapStateToProps,
  { leaveRoom }
)(Board);
