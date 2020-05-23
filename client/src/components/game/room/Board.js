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
  useEffect(() => {
    const { room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setRoom(room);
    //When to redirect

    if (
      ((!game.inGame || room !== game.room._id) && !game.loading) ||
      (!game.room && !game.loading)
    ) {
      setExit(true);
    }
    return () => {
      // leaveRoom();
      socket.disconnect();
    };
  }, [ENDPOINT, location.search]);

  if (exit) {
    return <Redirect to='/menu' />;
  }
  const onClick = e => {
    e.preventDefault();
    leaveRoom();
    setExit(true);
  };
  return (
    <Fragment>
      Game room
      <Link to='/menu' onClick={e => onClick(e)}>
        Leave
      </Link>
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
