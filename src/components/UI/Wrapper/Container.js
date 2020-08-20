import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CssBaseline from '@material-ui/core/CssBaseline';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    width: '50%',
    padding: '3%',
    margin: '0 auto',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  appBar: {
    position: 'relative',
  },
});

export default function SimpleCard(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <Card className={`${classes.root} ${props.className}`}>
        <CardContent>{props.children}</CardContent>
      </Card>
      <br/>
    </React.Fragment>
  );
}