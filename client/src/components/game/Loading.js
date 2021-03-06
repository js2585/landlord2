import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
const Loading = ({ game }) => {
  if (game.inGame && !game.loading) {
    return <Redirect to={`/board?room=${game.room._id}`} />;
  }
  return (
    <Fragment>
      Loading Page
      <div>Stuff Here</div>
    </Fragment>
  );
};

Loading.propTypes = {
  game: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  game: state.game
});

export default connect(mapStateToProps)(Loading);
