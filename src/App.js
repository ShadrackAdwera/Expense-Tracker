import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import LoginPage from './components/auth/login/login'
import SignUpPage from './components/auth/signup/signup'
import Welcome from './components/welcome/welcome'
import { AuthContext } from './shared/auth-context'
import AppBar from './components/Navigation/index'
import './App.css';
import Error from './components/Error/Error';

//const LoginPage = React.lazy(()=>import('./components/auth/login/login'))

function App() {
  const [userToken, setUserToken] = useState()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const loginHandler = () => {
    setIsLoggedIn(true)
    setUserToken(JSON.parse(localStorage.getItem('token')))
  }

  const logoutHandler = () => {
    setIsLoggedIn(false)
    setUserToken(localStorage.removeItem('token'))
  }

  useEffect(()=>{
    setUserToken(JSON.parse(localStorage.getItem('token')))
  }, [userToken])
  return (
      <AuthContext.Provider value={{isLoggedIn: isLoggedIn, token: userToken ,login: loginHandler, logout: logoutHandler}}>
        <AppBar />
        <Switch>
        <Route exact path='/login' component={LoginPage}/>
        <Route exact path='/sign-up' component={SignUpPage} />
        {userToken && <Route exact path='/' component={Welcome} />}
        <Route exact path ='/error' component={Error} />
        {/* <Redirect to ='/login' /> */}
      </Switch>
      </AuthContext.Provider>
  );
}

export default App;
