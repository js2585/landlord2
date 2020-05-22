import React, { Fragment, useEffect } from 'react';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layout/Alert';
import Menu from './components/game/Menu';
import Rules from './components/game/Rules';
import Board from './components/game/room/Board';
import Loading from './components/game/Loading';
import PrivateRoute from './components/routing/PrivateRoute';

//redux
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';
import { Provider } from 'react-redux';
import store from './store';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  useEffect(() => {
    setAuthToken(localStorage.getItem('token'));
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Fragment>
        <Router>
          <Fragment>
            <Navbar />
            <Alert />
            <Switch>
              <Route exact path='/' component={Landing} />
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/menu' component={Menu} />
              <Route exact path='/rules' component={Rules} />
              <PrivateRoute exact path='/game/loading' component={Loading} />
              <PrivateRoute path='/board' component={Board} />
            </Switch>
          </Fragment>
        </Router>
      </Fragment>
    </Provider>
  );
}

export default App;
