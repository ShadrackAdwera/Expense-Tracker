import React from 'react';
import {TextField,Button, Grid} from '@material-ui/core';
import Container from '../../UI/Wrapper/Container';

const AddExpense = () => {
  return (
    <Container className="centered">
      <h3>
        <strong>CREATE CATEGORY</strong>
      </h3>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <TextField placeholder="Name" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField placeholder="Description" fullWidth />
        </Grid>
      <br />
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Button variant="contained" color="primary" fullWidth>
            SUBMIT
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{
              backgroundColor: '#8B0000',
              color: 'white',
            }}
          >
            BACC
          </Button>
        </Grid>
      </Grid>
      </Grid>
    </Container>
  );
};

export default AddExpense;
