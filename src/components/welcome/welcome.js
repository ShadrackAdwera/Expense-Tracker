import React, { useEffect, useState, useCallback } from 'react';
import MUIDataTable from 'mui-datatables';
import { useHttp } from '../../shared/http-hook';
import './welcome.css';

const Welcome = () => {
  const columns = ['name', 'description', 'price', 'date', 'category'];
  const options = {
    filterType: 'checkbox',
  };

  const [expenses, setExpenses] = useState([]);
  const { sendRequest } = useHttp();
  const fetchExpenses = useCallback(async () => {
    try {
      const resData = await sendRequest(
        'http://localhost:5000/api/expenses/all'
      );
      setExpenses(resData.expenses);
    } catch (error) {}
  }, [sendRequest]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return (
      <div className="centered">
        <MUIDataTable
          title={'Expenses'}
          data={expenses}
          columns={columns}
          options={options}
        />
      </div>
  );
};

export default Welcome;
