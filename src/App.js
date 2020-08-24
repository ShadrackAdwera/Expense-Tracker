import React, { useState, useEffect, useCallback } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import LoginPage from './components/auth/login/login';
import SignUpPage from './components/auth/signup/signup';
import { AuthContext } from './shared/auth-context';
import AppBar from './components/Navigation/index';
import Welcome from './components/welcome/welcome';
import AddExpense from './components/welcome/add/AddExpense';
import Categories from './components/categories/Categories'
import AddCategories from './components/categories/Add/AddCategory' 
import './App.css';

//const LoginPage = React.lazy(()=>import('./components/auth/login/login'))

function App() {
  const [userToken, setUserToken] = useState();
  const [userId, setUserId] = useState()
  const [timeOut, setTimeOut] = useState()
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  let routes;

  const loginHandler = useCallback(() => {
    setIsLoggedIn(true);

  },[]);

  const logoutHandler = useCallback(() => {
    setIsLoggedIn(false);
    setUserToken(localStorage.removeItem('token'));
    setUserId(localStorage.removeItem('userId'))
    setTimeOut(localStorage.removeItem('expiration'))
  },[]);

  useEffect(() => {
    // setUserToken(JSON.parse(localStorage.getItem('token')));
    // setUserId(JSON.parse(localStorage.getItem('userId')))
    const token = JSON.parse(localStorage.getItem('token'))
    const userId = JSON.parse(localStorage.getItem('userId'))
    //const expiration = JSON.parse(localStorage.getItem('expiration'))
    if(userId && token) {
      loginHandler()
    }
  }, [loginHandler]);

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route exact path="/" component={Welcome} />
        <Route exact path="/expenses/new" component={AddExpense} />
        <Route exact path="/categories/new" component={AddCategories} />
        <Route exact path="/categories" component={Categories} />
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
        userId: userId,
        token: userToken,
        expiration: timeOut,
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
