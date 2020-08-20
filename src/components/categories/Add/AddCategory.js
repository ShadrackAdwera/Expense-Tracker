import React, { useReducer } from 'react';
import { useHistory } from 'react-router-dom'
import { TextField, Button, Grid, CircularProgress } from '@material-ui/core';
import Container from '../../UI/Wrapper/Container';
import { useHttp } from '../../../shared/http-hook'

const initialState = {
  name: '',
  description: '',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.value };
    case 'SET_DESCRIPTION':
      return { ...state, description: action.value };
    default:
      return state;
  }
};

const AddCategory = () => {
  const [formState, dispatch] = useReducer(reducer, initialState);
  const { sendRequest, isLoading } = useHttp()
  const history = useHistory()

  const createCategory = async () => {
      const url = 'http://localhost:5000/api/categories/new'
      const categoryData = {
          name: formState.name,
          description: formState.description
      }
      try {
          await sendRequest(url, 'POST', JSON.stringify(categoryData), { 'Content-Type':'application/json' })
          history.push('/categories')
      } catch (error) {
          
      }
  }

  return (
    <Container className="centered">
      <h3>
        <strong>CREATE CATEGORY</strong>
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
        <br />
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            { isLoading? <CircularProgress /> :<Button variant="contained" color="primary" fullWidth onClick={createCategory}>
              SUBMIT
            </Button>}
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

export default AddCategory;
