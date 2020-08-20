import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import LoginPage from './components/auth/login/login';
import SignUpPage from './components/auth/signup/signup';
import Welcome from './components/welcome/welcome';
import { AuthContext } from './shared/auth-context';
import AppBar from './components/Navigation/index';
import AddExpense from './components/welcome/add/AddExpense';
import './App.css';

//const LoginPage = React.lazy(()=>import('./components/auth/login/login'))

function App() {
  const [userToken, setUserToken] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  let routes;

  const loginHandler = () => {
    setIsLoggedIn(true);
    setUserToken(JSON.parse(localStorage.getItem('token')));
  };

  const logoutHandler = () => {
    setIsLoggedIn(false);
    setUserToken(localStorage.removeItem('token'));
  };

  useEffect(() => {
    setUserToken(JSON.parse(localStorage.getItem('token')));
  }, [userToken]);

  if (isLoggedIn && userToken) {
    routes = (
      <Switch>
        <Route exact path="/" component={Welcome} />
        <Route exact path="/expenses/new" component={AddExpense} />
        <Redirect to = '/' />
      </Switch>
    );
  } else if (!isLoggedIn || !!userToken) {
    routes = (<Switch>
      <Route exact path="/login" component={LoginPage} />
        <Route exact path="/sign-up" component={SignUpPage} />
        <Redirect to ='/login' /> 
    </Switch>)
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        token: userToken,
        login: loginHandler,
        logout: logoutHandler,
      }}
    >
      <AppBar />
      {routes}
    </AuthContext.Provider>
  );
}

export default App;
