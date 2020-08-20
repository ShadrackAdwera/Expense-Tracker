import React, { useState } from 'react';
import {
  TextField,
  Grid,
  makeStyles,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
  Button,
} from '@material-ui/core';
import Container from '../../UI/Wrapper/Container';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const AddExpense = () => {
  const classes = useStyles();
  const [age, setAge] = useState('');
  const [open, setOpen] = useState(false);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <Container className="centered">
      <h3>
        <strong>ADD EXPENSE</strong>
      </h3>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <TextField placeholder="Name" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField placeholder="Description" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField placeholder="Price" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="date"
            label="Date"
            type="date"
            defaultValue={new Date()}
            fullWidth
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="receipt"
            label="Upload Receipt"
            type="file"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-controlled-open-select-label">Age</InputLabel>
            <Select
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              open={open}
              fullWidth
              onClose={handleClose}
              onOpen={handleOpen}
              value={age}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
        </Grid>
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
    </Container>
  );
};

export default AddExpense;
