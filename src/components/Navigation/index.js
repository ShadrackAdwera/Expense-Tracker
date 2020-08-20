import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBarCollapse from "./AppBarCollapse";

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  navigation: {},
  toggleDrawer: {},
  appTitle: {}
};

function ButtonAppBar(props) {
  const { classes } = props;
  const [userName, setUserName] = useState()
    useEffect(()=>{
        setUserName(JSON.parse(localStorage.getItem('userName')))
    },[userName])
  return (
    <AppBar position="fixed" className={classes.navigation}>
      <Toolbar>
        <Typography
          variant="h6"
          color="inherit"
          className={classes.appTitle}
        >
          {userName}
        </Typography>
        <AppBarCollapse />
      </Toolbar>
    </AppBar>
  );
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ButtonAppBar);