import React, { useEffect, useState, useCallback, useContext } from 'react';
import MUIDataTable from 'mui-datatables';
import { useHttp } from '../../shared/http-hook';
import { AuthContext } from '../../shared/auth-context'

const Categories = () => {
  const columns = ['name', 'description', 'total'];
  const options = {
    filterType: 'checkbox',
  };

  const [categories, setCategories] = useState([]);
  const { sendRequest } = useHttp();
  const auth = useContext(AuthContext)
  const fetchCategories = useCallback(async () => {
    try {
      const resData = await sendRequest(
        `http://localhost:5000/api/categories/user/${auth.userId}`
      );
      setCategories(resData.categories);
    } catch (error) {}
  }, [sendRequest, auth.userId]);

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
