import React, { Fragment, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { leaveRoom } from '../../../actions/game';
import { Redirect, Link } from 'react-router-dom';
import queryString from 'query-string';

let socket;

const Board = ({ game, auth, leaveRoom, location }) => {
  const ENDPOINT = 'http://localhost:5000';
  //room info
  const [room, setRoom] = useState('');
  //determines redirect
  const [exit, setExit] = useState(false);
  //User stuff
  const { user } = auth;

  //socket stuff
  useEffect(() => {
    if (user && user.room) {
      socket = io(ENDPOINT);
      socket.emit('join', { userId: user._id, room });
    }
  }, [ENDPOINT, auth]);

  //Room stuff
  useEffect(() => {
    const { room } = queryString.parse(location.search);
    setRoom(room);
    //When to redirect
    if ((!game.inGame || room !== game.room._id) && !game.loading) {
      setExit(true);
    }
  }, [location.search, game]);

  //disconnect
  useEffect(() => {
    //cleanup on dismount
    return () => {
      leaveRoom();
      socket.disconnect();
    };
  }, []);

  if (exit) {
    return <Redirect to='/menu' />;
  }

  return (
    <Fragment>
      Game room
      <Link to='/menu'>Leave</Link>
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
