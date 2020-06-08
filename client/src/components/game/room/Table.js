import React from 'react';

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
  const checkCards = (value, house) => {
    if (cards.find(card => card.value === value && card.house === house)) {
      return 'translateY(-10px)';
    }
    return 'none';
  };
  return (
    <div className='game-table'>
      <div className='game-middle'>
        {middle
          ? middle.map((card, index) => (
              <img
                alt={`${card.value} ${card.house}`}
                key={index}
                src={require(`../../../img/cards/${card.value}${card.house}.png`)}
                style={{
                  maxWidth: `${100 / middle.length}%`,
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain'
                }}
              />
            ))
          : null}
      </div>
      {roomData.stage === 1 ? (
        <div className='game-buttons'>
          <button
            className='btn btn-dark mx'
            onClick={e => {
              bid(e, 0);
            }}
          >
            Pass
          </button>
          {roomData.currentBid < 1 ? (
            <button
              className='btn btn-primary mx'
              onClick={e => {
                bid(e, 1);
              }}
            >
              1
            </button>
          ) : null}
          {roomData.currentBid < 2 ? (
            <button
              className='btn btn-primary mx'
              onClick={e => {
                bid(e, 2);
              }}
            >
              2
            </button>
          ) : null}
          {roomData.currentBid < 3 ? (
            <button
              className='btn btn-primary mx'
              onClick={e => {
                bid(e, 3);
              }}
            >
              3
            </button>
          ) : null}
        </div>
      ) : null}
      {roomData.stage === 2 ? (
        <div>
          <div className='game-buttons'>
            <button
              className='btn btn-dark mx'
              onClick={e => {
                pass(e);
              }}
            >
              Pass
            </button>
            {cards.length > 0 ? (
              <button
                className='btn btn-primary mx'
                onClick={e => {
                  playCards(e);
                }}
              >
                Play Cards
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
      {roomData.stage === 3 || roomData.stage === 4 ? (
        <div className='game-buttons'>
          <button className='btn btn-dark btn-block'>Pass</button>
          <button className='btn btn-primary btn-block'>Play Cards</button>
        </div>
      ) : null}
      <div className='game-hand'>
        {hand
          ? hand.map((card, index) => (
              <img
                alt={`${card.value} ${card.house}`}
                key={index}
                src={require(`../../../img/cards/${card.value}${card.house}.png`)}
                onClick={e => handClick(e, index)}
                style={{
                  maxWidth: `${100 / hand.length}%`,
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  transform: `${checkCards(card.value, card.house)}`
                }}
              />
            ))
          : null}
      </div>
    </div>
  );
};

export default Table;
