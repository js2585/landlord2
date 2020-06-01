import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
const PrivateLoading = ({ game }) => {
  if (game.inGame && !game.loading) {
    return <Redirect to={`/board?room=${game.room._id}&privateRoom=true`} />;
  }
  return (
    <Fragment>
      Private Loading Page
      <div>Stuff Here</div>
    </Fragment>
  );
};

PrivateLoading.propTypes = {
  game: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  game: state.game
});

export default connect(mapStateToProps)(PrivateLoading);
