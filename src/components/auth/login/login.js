import React, { useState, useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useHttp } from '../../../shared/http-hook';
import { AuthContext } from '../../../shared/auth-context';
import './Login.css';
import { CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

const Login = () => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useContext(AuthContext);
  const { isLoading, sendRequest } = useHttp();
  const history = useHistory();

  const signIn = async (userEmail, userPassword) => {
    const credentials = {
      email: userEmail,
      password: userPassword,
    };
    const url = 'http://localhost:5000/api/users/login';
    try {
      const resData = await sendRequest(
        url,
        'POST',
        JSON.stringify(credentials),
        { 'Content-Type': 'application/json' }
      );
      if (resData.user) {
        const tokenExpiration = new Date(new Date() + 1000 *60*60)
        localStorage.setItem('userName', JSON.stringify(resData.user.name));
        localStorage.setItem('token', JSON.stringify(resData.user.token));
        localStorage.setItem('userId', JSON.stringify(resData.user.id));
        localStorage.setItem('expiration', JSON.stringify( tokenExpiration.toISOString() ));
        history.push('/');
        auth.login();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="centered">
      <form
        className={classes.root}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <h2>Login</h2>
        <br />
        <TextField
          id="user-email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <TextField
          id="user-password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            onClick={() => signIn(email, password)}
          >
            SUBMIT
          </Button>
        )}
        <br />
        <br />
        <NavLink to="/sign-up">No Account? Sign up Instead</NavLink>
      </form>
    </div>
  );
};

export default Login;
