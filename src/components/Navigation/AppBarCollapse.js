import React, { useContext, useState, useEffect } from "react";
import { useHistory } from 'react-router-dom'
import { Button, MenuItem } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import ButtonAppBarCollapse from "./ButtonAppBarCollapse";
import { AuthContext } from '../../shared/auth-context'

const styles = theme => ({
  root: {
    position: "absolute",
    right: 0
  },
  buttonBar: {
    [theme.breakpoints.down("xs")]: {
      display: "none"
    },
    margin: "10px",
    paddingLeft: "16px",
    right: 0,
    position: "relative",
    width: "100%",
    background: "transparent"
  }
});

const AppBarCollapse = props => {

  const auth = useContext(AuthContext)
  const history = useHistory()
  const [userName, setUserName] = useState()

  useEffect(()=>{
    setUserName(JSON.parse(localStorage.getItem('userName')))
},[userName])
const handleLogout = () => {
    localStorage.removeItem('userName')
    auth.logout()
    history.push('/')
}

  return <div className={props.classes.root}>
    <ButtonAppBarCollapse>
      {auth.isLoggedIn &&<MenuItem onClick={()=>history.push('/')}>EXPENSES</MenuItem>}
      {auth.isLoggedIn && <MenuItem>ADD CATEGORY</MenuItem>}
      {auth.isLoggedIn &&<MenuItem onClick={()=>history.push('/users/expense/new')}>ADD EXPENSE</MenuItem>}
      {!auth.isLoggedIn? <MenuItem onClick={()=>history.push('/login')}>LOGIN</MenuItem>: <MenuItem onClick={handleLogout}>LOGOUT</MenuItem>}
      {!auth.isLoggedIn &&<MenuItem onClick={()=>history.push('/sign-up')}>SIGN UP</MenuItem>}
    </ButtonAppBarCollapse>
    <div className={props.classes.buttonBar} id="appbar-collapse">
      {auth.isLoggedIn &&<Button color="inherit" onClick={()=>history.push('/')}>EXPENSES</Button>}
      {auth.isLoggedIn &&<Button color="inherit">ADD CATEGORY</Button>}
      {auth.isLoggedIn &&<Button color="inherit" onClick={()=>history.push('/users/product/new')}>ADD EXPENSE</Button>}
      {!auth.isLoggedIn?<Button color="inherit" onClick={()=>history.push('/login')}>LOGIN</Button> : <Button color="inherit" onClick={handleLogout}>LOGOUT</Button>}
      {!auth.isLoggedIn &&<Button color="inherit" onClick={()=>history.push('/sign-up')}>SIGN UP</Button>}
    </div>
  </div>
};

export default withStyles(styles)(AppBarCollapse);