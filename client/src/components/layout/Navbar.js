import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';
import PropTypes from 'prop-types';

const Navbar = ({ logout, auth: { isAuthenticated, loading } }) => {
  const authLinks = (
    <ul>
      <li>
        <Link to='/menu'>Menu</Link>
      </li>
      <li>
        <Link to='/rules'>Rules</Link>
      </li>
      <li>
        <a onClick={logout} href='/'>
          <span>Logout</span>
        </a>
      </li>
    </ul>
  );
  const guestLinks = (
    <ul>
      <li>
        <Link to='/menu'>Menu</Link>
      </li>
      <li>
        <Link to='/rules'>Rules</Link>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );
  return (
    <nav>
      <h1>
        <Link to='/'>Beat the Landlord</Link>
      </h1>
      {!loading ? (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      ) : null}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logout }
)(Navbar);
