import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    password2: ''
  });

  const { username, password, password2 } = formData;
  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      register({ username, password });
    }
  };
  //redirect
  if (isAuthenticated) {
    return <Redirect to='/menu' />;
  }
  return (
    <Fragment>
      <form onSubmit={e => onSubmit(e)}>
        <div>
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
        <div>
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
          Confirm Password:
          <input
            type='password'
            placeholder='Password'
            name='password2'
            onChange={e => onChange(e)}
            value={password2}
            required
          />
        </div>
        <div>
          <input type='submit' value='Register' />
        </div>
      </form>
      <p>
        Have an Account? <Link to='/login'>Login</Link>
      </p>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { setAlert, register }
)(Register);
