import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { joinNextRoom, leaveRoom, hostRoom } from '../../actions/game';
import { setAlert } from '../../actions/alert';
import PropTypes from 'prop-types';

const Menu = ({ joinNextRoom, leaveRoom, user, setAlert, hostRoom }) => {
  useEffect(() => {
    leaveRoom();
  }, []);

  const [host, setHost] = useState(false);
  const [formData, setFormData] = useState({ bidValue: '' });
  const [redirectToPrivateLoading, setRedirectToPrivateLoading] = useState(
    false
  );
  const { bidValue } = formData;
  const hostClick = e => {
    e.preventDefault();
    if (!user) {
      setAlert('You Must Be Logged In To Host Game', 'danger');
      return;
    }
    setHost(!host);
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const randomGameClick = (e, bid) => {
    if (!user) {
      e.preventDefault();
      setAlert('You Must Be Logged In To Play', 'danger');
      return;
    }
    if (bid === 2000 && user.earning < 20000) {
      e.preventDefault();
      setAlert('You must have at least $20,000 to play', 'danger');
      return;
    }
    if (bid === 5000 && user.earning < 45000) {
      e.preventDefault();
      setAlert('You must have at least $45,000 to play', 'danger');
      return;
    }
    if (bid === 10000 && user.earning < 100000) {
      e.preventDefault();
      setAlert('You must have at least $100,000 to play', 'danger');
      return;
    }
    joinNextRoom(bid);
  };

  const createGame = e => {
    e.preventDefault();
    if (isNaN(bidValue)) {
      setAlert('Bid Value Must Be a number', 'danger');
      return;
    }
    if (bidValue < 0) {
      setAlert('Bid Value must be greater than 0', 'danger');
      return;
    }
    if (user.earning < 7500) {
      setAlert('You do not have enough money to host a game', 'danger');
      return;
    }
    if (user.earning < bidValue) {
      setAlert('The bid value of your game is too high', 'danger');
      return;
    }
    hostRoom(bidValue);
    setRedirectToPrivateLoading(true);
  };
  if (redirectToPrivateLoading) {
    return <Redirect to='/game/private/loading' />;
  }
  return (
    <section className='menu'>
      <div className='menu-top'>
        <p className='lead'>
          Join a Random Public Game or Host Your Own Private Game
        </p>
      </div>
      <div className='menu-buttons'>
        <h3>Join Random Game - Free</h3>
        <Link
          onClick={e => {
            randomGameClick(e, 500);
          }}
          to='/game/loading'
          className='btn btn-primary max-width my'
        >
          Join $500 Game
        </Link>
        <Link
          onClick={e => {
            randomGameClick(e, 2000);
          }}
          to='/game/loading'
          className='btn btn-primary max-width my'
        >
          Join $2,000 Game
        </Link>
        <Link
          onClick={e => {
            randomGameClick(e, 5000);
          }}
          to='/game/loading'
          className='btn btn-primary max-width my'
        >
          Join $5,000 Game
        </Link>
        <Link
          onClick={e => {
            randomGameClick(e, 10000);
          }}
          to='/game/loading'
          className='btn btn-primary max-width my'
        >
          Join $10,000 Game
        </Link>
      </div>
      <div className='menu-buttons'>
        <h3>Host Game - $7,500</h3>
        <Link
          to='/'
          onClick={e => hostClick(e)}
          className='btn btn-dark max-width my'
        >
          Host Game
        </Link>
        {host ? (
          <form onSubmit={e => createGame(e)} className='form'>
            <div className='form-group'>
              <input
                type='text'
                placeholder='Bid Value'
                name='bidValue'
                onChange={e => onChange(e)}
                value={bidValue}
                required
              />
            </div>
            <div>
              <input
                className='btn btn-dark max-width'
                type='submit'
                value='Generate Game'
              />
            </div>
          </form>
        ) : null}
      </div>
      <div className='menu-buttons'>
        <div>
          <h3>Important Notes</h3>
          <ul>
            <li className='menu-item'>
              - Leaving a game once it has started will result in a 5% penalty
            </li>
            <li className='menu-item my'>
              - There will be a 60 second timeout before the game assumes you
              are AFK
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

Menu.propTypes = {
  user: PropTypes.object,
  joinNextRoom: PropTypes.func.isRequired,
  leaveRoom: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  hostRoom: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(
  mapStateToProps,
  { joinNextRoom, leaveRoom, setAlert, hostRoom }
)(Menu);
