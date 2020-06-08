import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const Panel = ({ setExit, roomData }) => {
  const biddingData = (
    <Fragment>
      <h3>Bids</h3>
      <div>
        {roomData.players
          ? roomData.players.map((player, index) =>
              index === roomData.turn ? (
                <strong key={index}>{player.username}'s turn</strong>
              ) : null
            )
          : null}
      </div>
      <ul>
        {roomData.players
          ? roomData.players.map((player, index) => (
              <li key={index}>
                {player.username} : {player.bid}
              </li>
            ))
          : null}
      </ul>
    </Fragment>
  );

  const gameData = (
    <Fragment>
      <div>
        {roomData.players
          ? roomData.players.map((player, index) =>
              index === roomData.turn ? (
                <strong key={index}>{player.username}'s turn</strong>
              ) : null
            )
          : null}
      </div>
      <ul>
        {roomData.players
          ? roomData.players.map((player, index) => (
              <li key={index}>
                {player.landlord ? (
                  <span className='landlord'>
                    {player.username} : {player.hand.length} cards
                  </span>
                ) : (
                  <span>
                    {player.username} : {player.hand.length} cards
                  </span>
                )}
              </li>
            ))
          : null}
      </ul>
    </Fragment>
  );
  return (
    <div className='game-panel'>
      <h2 className='lead'>Bid Value: ${roomData.bidValue}</h2>
      <h3>Current Bid: {roomData.currentBid}</h3>
      <h3>Scoreboard:</h3>
      <ul>
        {roomData.players ? (
          <div>
            {roomData.players.map((player, index) => (
              <li key={index}>
                {player.username} : {player.score}
              </li>
            ))}
            {roomData.stage === -1 ? <i>Waiting for more players ...</i> : null}
          </div>
        ) : null}
      </ul>
      <hr />
      {roomData.stage === 1 ? biddingData : null}
      {roomData.stage === 2 ? gameData : null}
      <Link
        to='/menu'
        onClick={e => {
          e.preventDefault();
          setExit(true);
        }}
      >
        Leave
      </Link>
    </div>
  );
};

export default Panel;
