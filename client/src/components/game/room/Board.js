import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { leaveRoom, loadRoom, joinRoom } from '../../../actions/game';
import { setAlert } from '../../../actions/alert';
import { Redirect } from 'react-router-dom';
import Panel from './Panel';
import Table from './Table';
import queryString from 'query-string';

//todo: determine what to show on each stage

let socket;
const ranking = [
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
  'A',
  '2',
  'Joker Black',
  'Joker Red'
];
const Board = ({
  game,
  auth,
  leaveRoom,
  location,
  loadRoom,
  setAlert,
  joinRoom
}) => {
  const ENDPOINT = 'http://localhost:5000';
  //hand
  const [hand, setHand] = useState([]);
  //cards about to be played
  const [cards, setCards] = useState([]);
  //user's turn
  const [userTurn, setUserTurn] = useState(false);
  //user bid turn
  const [userBidTurn, setUserBidTurn] = useState(false);
  //middle
  const [middle, setMiddle] = useState([]);
  //room data
  const [roomData, setRoomData] = useState({});
  //determines redirect
  const [exit, setExit] = useState(false);
  //User stuff
  const { user } = auth;

  //socket stuff
  useEffect(() => {
    let redirect;
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
      socket.on('Redirect', () => {
        console.log('redirecting');
        redirect = setTimeout(() => {
          setExit(true);
        }, 5000);
      });
      return () => {
        clearTimeout(redirect);
      };
    }
  }, [ENDPOINT, auth]);

  //Room stuff update whenever game changes
  useEffect(() => {
    const { room, privateRoom } = queryString.parse(location.search);
    //if room is private then it's ok to not have game or roomid
    if (privateRoom) {
      if ((!game.inGame || room !== game.room._id) && !game.loading) {
        joinRoom(room);
        return;
      }
    }
    if ((!game.inGame || room !== game.room._id) && !game.loading) {
      setExit(true);
      return;
    }
    if (game.room) {
      const turn = game.room.players.findIndex(
        player => player.user === auth.user._id
      );
      setHand(
        game.room.players[turn].hand.sort((a, b) =>
          ranking.findIndex(rank => a.value === rank) >
          ranking.findIndex(rank => b.value === rank)
            ? 1
            : -1
        )
      );
      setUserBidTurn(game.room.turn === turn && game.room.stage === 1);
      setUserTurn(game.room.turn === turn && game.room.stage === 2);
      setMiddle(
        game.room.middle.sort((a, b) =>
          ranking.findIndex(rank => a.value === rank) >
          ranking.findIndex(rank => b.value === rank)
            ? 1
            : -1
        )
      );
      setRoomData(game.room);
    }
  }, [location.search, game, auth]);

  //disconnect
  useEffect(() => {
    //cleanup on dismount
    return () => {
      leaveRoom();
      if (socket) {
        socket.emit('Leave');
        socket.disconnect();
      }
    };
  }, []);

  if (exit) {
    return <Redirect to='/menu' />;
  }
  //if card is not in cards, it will go into cards. if it is, it will go out
  const handClick = (e, index) => {
    e.preventDefault();
    if (userTurn) {
      if (
        cards.find(
          card =>
            card.value === hand[index].value && card.house === hand[index].house
        )
      ) {
        setCards(
          cards.filter(
            card =>
              card.value !== hand[index].value ||
              card.house !== hand[index].house
          )
        );
      } else {
        setCards([...cards, hand[index]]);
      }
    }
  };
  //bidding
  //passing turn
  const bid = (e, value) => {
    e.preventDefault();
    if (!userBidTurn) {
      setAlert('Not Your Turn To Bid', 'danger');
      return;
    }
    socket.emit('Bid', { bid: value });
  };
  //playing cards
  const playCards = e => {
    e.preventDefault();
    if (!userTurn) {
      setAlert('Not Your Turn To Play', 'danger');
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

  return (
    <div className='game'>
      <Panel setExit={setExit} roomData={roomData} />
      <Table
        roomData={roomData}
        hand={hand}
        cards={cards}
        middle={middle}
        handClick={handClick}
        bid={bid}
        pass={pass}
        playCards={playCards}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
  game: state.game
});

export default connect(
  mapStateToProps,
  { leaveRoom, loadRoom, setAlert, joinRoom }
)(Board);
