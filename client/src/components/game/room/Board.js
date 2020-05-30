import React, { Fragment, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { leaveRoom, loadRoom } from '../../../actions/game';
import { setAlert } from '../../../actions/alert';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';

//todo: determine what to show on each stage

let socket;
const Board = ({ game, auth, leaveRoom, location, loadRoom, setAlert }) => {
  const ENDPOINT = 'http://localhost:5000';
  //hand
  const [hand, setHand] = useState([]);
  //cards about to be played
  const [cards, setCards] = useState([]);
  //game turn
  const [gameTurn, setTurn] = useState(-1);
  //user's turn
  const [userTurn, setUserTurn] = useState(false);
  //user bid turn
  const [userBidTurn, setUserBidTurn] = useState(false);
  //current bid
  const [currentBid, setCurrentBid] = useState(-1);
  //middle
  const [middle, setMiddle] = useState([]);
  //players
  const [players, setPlayers] = useState([]);
  //card rank
  const [rank, setRank] = useState(-1);
  //stage
  const [stage, setStage] = useState(-1);
  //gameended
  const [gameOver, setGameOver] = useState(false);
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
      socket.on('Error', ({ error }) => {
        console.log(error);
        setAlert(error.msg, 'danger');
      });
      socket.on('Game Over', () => {
        console.log('game over');
        setGameOver(true);
      });
      socket.on('Game Restart', () => {
        console.log('game restart');
        setGameOver(false);
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
      setStage(game.room.stage);
      setUserBidTurn(game.room.turn === turn && game.room.stage === 1);
      setUserTurn(game.room.turn === turn && game.room.stage === 2);
      setStage(game.room.stage);
      setPlayers(game.room.players);
      setCurrentBid(game.room.currentBid);
      setMiddle(game.room.middle);
      setRank(game.room.cardRank);
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
  //bidding
  //passing turn
  const bid = e => {
    e.preventDefault();
    if (!userBidTurn) {
      return;
    }
    socket.emit('Bid', { bid: e.target.value });
  };
  //playing cards
  const playCards = e => {
    e.preventDefault();
    if (!userTurn) {
      setAlert('Not Your Turn', 'danger');
      return;
    }
    if (cards.length <= 0 || !cards) {
      setAlert('You Must Select Some Cards or Pass', 'danger');
      return;
    }
    socket.emit('Play Cards', cards);
    setCards([]);
  };
  //passing turn
  const pass = e => {
    e.preventDefault();
    if (!userTurn) {
      setAlert('Not Your Turn', 'danger');
      return;
    }
    //reset
    setCards([]);
    socket.emit('Pass');
  };

  const leave = e => {
    e.preventDefault();
    socket.emit('Leave');
    setExit(true);
  };

  return (
    <Fragment>
      Game room
      <button onClick={e => leave(e)}>Leave</button>
      <div>{gameOver ? <strong>Game Over</strong> : null}</div>
      <div>
        Users:
        {players.map((player, index) => (
          <li key={index}>
            {player.username} : bidding {player.bid} : Landlord :
            {player.landlord ? <span>Yes</span> : <span>No</span>} : Score :{' '}
            {player.score}
          </li>
        ))}
      </div>
      <div>Current Bid: {currentBid}</div>
      <div>Stage: {stage}</div>
      <div>
        Middle:
        {middle.map((card, index) => (
          <li key={index} value={index}>
            {card.value} {card.house}
          </li>
        ))}
      </div>
      <div>Rank: {rank}</div>
      <div>
        Cards:
        {cards.map((card, index) => (
          <li key={index} value={index}>
            {card.value} {card.house}
          </li>
        ))}
      </div>
      <div>Game Turn: {gameTurn}</div>
      {userTurn ? (
        <div>Your Turn to Play</div>
      ) : (
        <div>Not Your Turn to Play</div>
      )}
      {userBidTurn ? (
        <div>Your Turn to Bid</div>
      ) : (
        <div>Not Your Turn to Bid</div>
      )}
      <button onClick={e => bid(e)} value={0}>
        Pass
      </button>
      <button onClick={e => bid(e)} value={1}>
        1
      </button>
      <button onClick={e => bid(e)} value={2}>
        2
      </button>
      <button onClick={e => bid(e)} value={3}>
        3
      </button>
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
  { leaveRoom, loadRoom, setAlert }
)(Board);
