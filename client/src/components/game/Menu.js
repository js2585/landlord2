import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { joinNextRoom, leaveRoom } from '../../actions/game';
import PropTypes from 'prop-types';

const Menu = ({ joinNextRoom, leaveRoom }) => {
  useEffect(() => {
    leaveRoom();
  }, []);

  return (
    <Fragment>
      Menu Page
      <div>
        <Link
          onClick={e => {
            joinNextRoom();
          }}
          to='/game/loading'
        >
          Join Random Game
        </Link>
      </div>
      <div>
        <Link to='/'>Host Game</Link>
      </div>
    </Fragment>
  );
};

Menu.propTypes = {
  joinNextRoom: PropTypes.func.isRequired
};

export default connect(
  null,
  { joinNextRoom, leaveRoom }
)(Menu);
