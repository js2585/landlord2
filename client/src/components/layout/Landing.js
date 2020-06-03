import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <h1 className='large'>Beat The Landlord Multiplayer</h1>
          <p className='lead'>
            Play and host online multiplayer card games and increase your
            earnings
          </p>
          <div>
            <Link to='/register' className='btn btn-primary'>
              Register
            </Link>
            <Link to='/login' className='btn btn-light'>
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
