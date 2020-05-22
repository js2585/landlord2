import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { joinNextRoom } from '../../actions/game';
import PropTypes from 'prop-types';

const Menu = ({ joinNextRoom }) => {
  const onClick = e => {
    e.preventDefault();
    joinNextRoom();
  };
  return (
    <Fragment>
      Menu Page
      <div>
        <button onClick={e => onClick(e)}>
          <Link to='/game/loading'>Join Random Game</Link>
        </button>
        <Link to={`/board?room=123`}>Go To Fake Room</Link>
      </div>
      <div>
        <button>
          <Link to='/'>Host Game</Link>
        </button>
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
