import React, { useEffect, useState, useCallback } from 'react';
import MUIDataTable from 'mui-datatables';
import { useHttp } from '../../shared/http-hook';

const Welcome = () => {
  const columns = ['name', 'description', 'price', 'date', 'category'];
  const options = {
    filterType: 'checkbox',
  };

  const [expenses, setExpenses] = useState([]);
  const [userName, setUserName] = useState()
    useEffect(()=>{
        setUserName(JSON.parse(localStorage.getItem('userName')))
    },[userName])
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
      <React.Fragment>
    <div className="main-container">
        <MUIDataTable
          title={`${userName}'s Expenses`}
          data={expenses}
          columns={columns}
          options={options}
        />
    </div>
      </React.Fragment>
  );
};

export default Welcome;
