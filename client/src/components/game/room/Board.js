import React, { Fragment, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { leaveRoom, loadRoom } from '../../../actions/game';
import { Redirect, Link } from 'react-router-dom';
import queryString from 'query-string';

let socket;
const Board = ({ game, auth, leaveRoom, location, loadRoom }) => {
  const ENDPOINT = 'http://localhost:5000';
  //hand
  const [hand, setHand] = useState([]);
  //cards about to be played
  const [cards, setCards] = useState([]);
  //game turn
  const [gameTurn, setTurn] = useState(-1);
  //user's turn
  const [userTurn, setUserTurn] = useState(false);
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
      socket.emit('join', { userId: user._id, room: user.room });
      socket.on('Check DB', () => {
        console.log('check db');
        loadRoom();
      });
    }
  }, [ENDPOINT, auth]);

  //Room stuff update whenever game changes
  useEffect(() => {
    const { room } = queryString.parse(location.search);
    setRoom(room);
    //When to redirect
    if ((!game.inGame || room !== game.room._id) && !game.loading) {
      setExit(true);
    }
    if (game.room) {
      const turn = game.room.players.findIndex(
        player => player.user === auth.user._id
      );
      setHand(game.room.players[turn].hand);
      setTurn(game.room.turn);
      setUserTurn(game.room.turn === turn);
      console.log(hand);
    }
  }, [location.search, game, auth]);

  //disconnect
  useEffect(() => {
    //cleanup on dismount
    return () => {
      leaveRoom();
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  if (exit) {
    return <Redirect to='/menu' />;
  }
  //if card is not in cards, it will go into cards. if it is, it will go out
  const handClick = e => {
    e.preventDefault();
    if (userTurn) {
      if (
        cards.find(
          card =>
            card.value === hand[e.target.value].value &&
            card.house === hand[e.target.value].house
        )
      ) {
        setCards(
          cards.filter(
            card =>
              card.value !== hand[e.target.value].value ||
              card.house !== hand[e.target.value].house
          )
        );
      } else {
        setCards([...cards, hand[e.target.value]]);
      }
    }
  };
  //playing cards
  const playCards = e => {
    e.preventDefault();
    if (!userTurn) {
      return;
    }
    if (cards.length <= 0 || !cards) {
      return;
    }
    socket.emit('Play Cards', cards);
  };
  //passing turn
  const pass = e => {
    e.preventDefault();
    if (!userTurn) {
      return;
    }
    socket.emit('Pass');
  };

  return (
    <Fragment>
      Game room
      <Link to='/menu'>Leave</Link>
      <div>
        Cards:
        {cards.map((card, index) => (
          <li key={index} value={index}>
            {card.value} {card.house}
          </li>
        ))}
      </div>
      <div>Game Turn: {gameTurn}</div>
      {userTurn ? <div>Your Turn</div> : <div>Not Your Turn</div>}
      <button onClick={e => playCards(e)}>Play Cards</button>
      <button onClick={e => pass(e)}>Pass</button>
      <div>
        Hand:
        {hand.map((card, index) => (
          <li key={index} value={index} onClick={e => handClick(e)}>
            {card.value} {card.house}
          </li>
        ))}
      </div>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
  game: state.game
});

export default connect(
  mapStateToProps,
  { leaveRoom, loadRoom }
)(Board);
