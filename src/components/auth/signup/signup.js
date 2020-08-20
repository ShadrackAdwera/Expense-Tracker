import React, { useState } from 'react'
import { useHistory, NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useHttp } from '../../../shared/http-hook';
import '../login/Login.css'
import { CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  }));

const SignUp = () => {
    const classes = useStyles()
    const [username, setUserName] = useState('') 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { sendRequest, isLoading } = useHttp()
    const history = useHistory()

    const createAccount = async (name, userEmail, userPassword) => {
        const userCredentials = {
            name: name,
            email: userEmail,
            password: userPassword
        }
        const url = 'http://localhost:5000/api/users/sign-up'
        try {
          const resData = await sendRequest(url, 'POST', JSON.stringify(userCredentials), { 'Content-Type':'application/json' })
        if(resData) {
          localStorage.setItem('userName',JSON.stringify(resData.user.name))
          localStorage.setItem('token', JSON.stringify(resData.user.token))
          history.push('/login')
        }
        } catch (error) {
         console.log(error) 
        }
    }


    return <div className='centered'>
        <h2>Sign Up</h2>
        <form className={classes.root} onSubmit={(e)=>{e.preventDefault()}}>
        <TextField id="user-name" label="User Name" type='username' value={username} onChange={e=>setUserName(e.target.value)}/>
        <br/>
      <TextField id="user-email" label="Email" type='email' value={email} onChange={e=>setEmail(e.target.value)}/>
      <br/>
      <TextField id='user-password' label='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
      <br/>
      {isLoading? <CircularProgress /> : <Button variant="contained" color="primary" type='submit' onClick={()=>createAccount(username, email,password)}>SUBMIT</Button>}
      <br/>
      <br/>
      <NavLink to='/'>Go to log in</NavLink>
    </form>
    </div>
}

export default SignUp