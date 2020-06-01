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
    setHost(!host);
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createGame = e => {
    e.preventDefault();
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
    <Fragment>
      Menu Page
      <div>
        <Link
          onClick={e => {
            if (user.earning < 500 * 18) {
              e.preventDefault();
              setAlert('You do not have enough money to play', 'danger');
              return;
            }
            joinNextRoom(500);
          }}
          to='/game/loading'
        >
          Join $500 Game
        </Link>
      </div>
      <div>
        <Link
          onClick={e => {
            if (user.earning < 2000 * 18) {
              e.preventDefault();
              setAlert('You do not have enough money to play', 'danger');
              return;
            }
            joinNextRoom(2000);
          }}
          to='/game/loading'
        >
          Join $2000 Game
        </Link>
      </div>
      <div>
        <Link
          onClick={e => {
            if (user.earning < 5000 * 18) {
              e.preventDefault();
              setAlert('You do not have enough money to play', 'danger');
              return;
            }
            joinNextRoom(5000);
          }}
          to='/game/loading'
        >
          Join $5000 Game
        </Link>
      </div>
      <div>
        <Link to='/' onClick={e => hostClick(e)}>
          Host Game
        </Link>
      </div>
      {host ? (
        <form onSubmit={e => createGame(e)}>
          <div>
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
            <input type='submit' value='Create Game' />
          </div>
        </form>
      ) : null}
    </Fragment>
  );
};

Menu.propTypes = {
  user: PropTypes.object.isRequired,
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
