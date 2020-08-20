import React, { useEffect, useState, useCallback } from 'react';
import MUIDataTable from 'mui-datatables';
import { useHttp } from '../../shared/http-hook';

const Categories = () => {
  const columns = ['name', 'description', 'total'];
  const options = {
    filterType: 'checkbox',
  };

  const [categories, setCategories] = useState([]);
  const { sendRequest } = useHttp();
  const fetchCategories = useCallback(async () => {
    try {
      const resData = await sendRequest(
        'http://localhost:5000/api/categories/all'
      );
      setCategories(resData.categories);
    } catch (error) {}
  }, [sendRequest]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
      <div className='main-container'>
        <MUIDataTable
          title={'Categories'}
          data={categories}
          columns={columns}
          options={options}
        />
      </div>
  );
};

export default Categories;
