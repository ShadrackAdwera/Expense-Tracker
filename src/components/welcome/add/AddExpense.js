import React, { useState, useCallback, useEffect, useReducer } from 'react';
import { useHistory } from 'react-router-dom'
import {
  TextField,
  Grid,
  makeStyles,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
  Button,
  CircularProgress,
} from '@material-ui/core';
import Container from '../../UI/Wrapper/Container';
import { useHttp } from '../../../shared/http-hook';

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

const initialState = {
  name: '',
  description: '',
  price: '',
  category: '',
  file: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.value };
    case 'SET_DESCRIPTION':
      return { ...state, description: action.value };
    case 'SET_PRICE':
      return { ...state, price: action.value };
    case 'SET_CATEGORY':
      return { ...state, category: action.value };
    case 'SET_FILE':
      return {...state, file: action.value}
    default:
      return state;
  }
};

const AddExpense = () => {
  const classes = useStyles();
  const [categories, setCategories] = useState([]);
  const { sendRequest, isLoading } = useHttp();
  const [formState, dispatch] = useReducer(reducer, initialState);
  const history = useHistory()

  const fetchCategories = useCallback(async () => {
    const resData = await sendRequest(
      'http://localhost:5000/api/categories/all'
    );
    setCategories(
      resData.categories.map(({ id, name }) => ({ label: name, value: id }))
    );
  }, [sendRequest]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const tagExpense = async () => {
    const formData = new FormData()
    formData.append('name',formState.name)
    formData.append('description', formState.description)
    formData.append('price', formState.price)
    formData.append('category', formState.category)
    formData.append('receipt', formState.file)
    formData.append('user', JSON.parse(localStorage.getItem('userId')))
    try {
      const resData = await sendRequest('http://localhost:5000/api/expenses/new', 'POST',formData)
      if(resData.expense) {
        history.push('/')
      }
    } catch (error) {
      
    }
  }

  return (
    <Container className="centered">
      <h3>
        <strong>TAG EXPENSE</strong>
      </h3>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <TextField
            placeholder="Name"
            fullWidth
            value={formState.name}
            onChange={(e) =>
              dispatch({ type: 'SET_NAME', value: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            placeholder="Description"
            fullWidth
            value={formState.description}
            onChange={(e) =>
              dispatch({ type: 'SET_DESCRIPTION', value: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            placeholder="Price"
            fullWidth
            value={formState.price}
            onChange={(e) =>
              dispatch({ type: 'SET_PRICE', value: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="receipt"
            label="Upload Receipt"
            type="file"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={e=>dispatch({type: 'SET_FILE', value: e.target.value})}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
        <FormControl className={classes.formControl}>
        <InputLabel id="category-lable" required>Categories</InputLabel>
        <Select disabled = {isLoading}
          labelId="category-label-id"
          id="category"
          value={formState.category}
          onChange={e=> dispatch({type:'SET_CATEGORY', value: e.target.value})}    
    >
      {categories.map(item=>(
        <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
      ))}
    </Select>
      </FormControl>
        </Grid>
      </Grid>
      <br />
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Button variant="contained" color="primary" fullWidth onClick={tagExpense}>
              SUBMIT
            </Button>
          )}
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
