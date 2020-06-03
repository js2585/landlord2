import React, { Fragment, useEffect, useState } from 'react';
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
    if (user.earning < bid * 18) {
      e.preventDefault();
      setAlert('You do not have enough money to play', 'danger');
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
    if (user.earning < bidValue * 18) {
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
        <p>Join Random Game - Free</p>
        <Link
          onClick={e => {
            randomGameClick(e, 500);
          }}
          to='/game/loading'
          className='btn btn-primary btn-large my'
        >
          Join $500 Game
        </Link>
        <Link
          onClick={e => {
            randomGameClick(e, 2000);
          }}
          to='/game/loading'
          className='btn btn-primary btn-large my'
        >
          Join $2000 Game
        </Link>
        <Link
          onClick={e => {
            randomGameClick(e, 5000);
          }}
          to='/game/loading'
          className='btn btn-primary btn-large my'
        >
          Join $5000 Game
        </Link>
      </div>
      <div className='menu-buttons'>
        <p>Host Game - $7500</p>
        <Link
          to='/'
          onClick={e => hostClick(e)}
          className='btn btn-dark btn-large my'
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
                className='btn btn-dark btn-medium'
                type='submit'
                value='Generate Game'
              />
            </div>
          </form>
        ) : null}
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
