import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../../actions/auth';
import PropTypes from 'prop-types';

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const { username, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    login({ username, password });
  };
  //redirect if logged in
  if (isAuthenticated) {
    return <Redirect to='/menu' />;
  }
  return (
    <Fragment>
      <h1 className='large text-primary'>Log In</h1>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          Username:
          <input
            type='text'
            placeholder='Username'
            name='username'
            onChange={e => onChange(e)}
            value={username}
            required
          />
        </div>
        <div className='form-group'>
          Password:
          <input
            type='password'
            placeholder='Password'
            name='password'
            onChange={e => onChange(e)}
            value={password}
            required
          />
        </div>
        <div>
          <input className='btn btn-primary' type='submit' value='Login' />
        </div>
      </form>
      <p className='my-1'>
        Need an Account? <Link to='/register'>Register</Link>
      </p>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { login }
)(Login);
