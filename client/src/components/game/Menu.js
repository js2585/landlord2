import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { joinNextRoom } from '../../actions/game';
import PropTypes from 'prop-types';

const Menu = ({ joinNextRoom }) => {
  return (
    <Fragment>
      Menu Page
      <div>
        <Link onClick={e => joinNextRoom()} to='/game/loading'>
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
  { joinNextRoom }
)(Menu);
