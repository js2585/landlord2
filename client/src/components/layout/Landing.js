import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <Fragment>
      <section className='landing'>
        <div className='dark-overlay'>
          <div className='landing-inner'>
            <h1 className='large'>Fight The Landlord Multiplayer</h1>
            <p className='lead'>
              Play and host online multiplayer card games and increase your
              earnings
            </p>
            <div>
              <Link to='/register' className='btn btn-primary m'>
                Register
              </Link>
              <Link to='/login' className='btn btn-light m'>
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className='about'>
        <h1 className='large my-1'>About</h1>
        <p className='lead'>
          Fight the Landlord, sometimes called Beat the Landlord or Dou Dizhu is
          a popular gambling game that originated in China's Hubei province (it
          looks like a lot of things originated there). Because of this, all of
          the other online multiplayer Fight the Landlord games are in Chinese.
          Well, that ends now as this site is the first english online
          multiplayer version of Fight the Landlord. I hope you enjoy.
        </p>
      </section>
      <section className='about'>
        <h1 className='large my-1'>Getting Started</h1>
        <p className='lead'>
          To play a game, <Link to='/register'>create an account</Link> and go
          to the <Link to='/menu'>menu</Link> page. Here, choose the type of
          game you want to play. If you are unfamiliar with Fight the Landlord,
          first read the <Link to='/rules'>rules</Link>. Everyone starts with
          $50,000 which can be wagered in games to make more money.
        </p>
      </section>
    </Fragment>
  );
};

export default Landing;
