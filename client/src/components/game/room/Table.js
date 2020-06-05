import React, { Fragment } from 'react';

const Table = ({
  roomData,
  hand,
  cards,
  middle,
  handClick,
  bid,
  pass,
  playCards
}) => {
  return (
    <div className='game-table'>
      <div className='game-middle'>Cards Go Here</div>
      {roomData.stage === 1 ? (
        <div className='game-buttons'>
          <button className='btn btn-dark' onClick={e => bid(e, 0)}>
            Pass
          </button>
          <button className='btn btn-primary' onClick={e => bid(e, 1)}>
            1
          </button>
          <button className='btn btn-primary' onClick={e => bid(e, 2)}>
            2
          </button>
          <button className='btn btn-primary' onClick={e => bid(e, 3)}>
            3
          </button>
        </div>
      ) : null}
      {roomData.stage === 2 ? (
        <div className='game-buttons'>
          <button className='btn btn-dark' onClick={e => pass(e)}>
            Pass
          </button>
          <button className='btn btn-primary' onClick={e => playCards(e)}>
            Play Cards
          </button>
        </div>
      ) : null}
      {roomData.stage === 3 || roomData.stage === 4 ? (
        <div className='game-buttons'>
          <button className='btn btn-dark btn-block'>Pass</button>
          <button className='btn btn-primary btn-block'>Play Cards</button>
        </div>
      ) : null}
      <div className='game-hand'></div>
    </div>
  );
};

export default Table;
