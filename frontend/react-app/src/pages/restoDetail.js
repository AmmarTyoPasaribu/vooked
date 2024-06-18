import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Appnavbar from '../compunents/navbar';
import Table from 'react-bootstrap/Table';
import { useParams } from 'react-router-dom';

const Tables = () => {
  const [tables, setTables] = useState([]);
  const {resto_id} = useParams();

  useEffect(() => {

    fetchTable();
  }); 

  const fetchTable = async (e) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/tableresto/${resto_id}`, {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      if (response.status === 200) {
        console.log(response.data);
        setTables(response.data);
      } else {
        
      }
    } catch (error) {
      
    }
  };
  
  return (
    <div>
      <Appnavbar />

      <div style={{ padding:'2rem' }}>
      <Table striped bordered hover>
      <thead>
        <tr> 
          <th>No. </th>
          <th>Name</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        {tables.map((table, index) => (
          <tr key={table.table_id}>
            <td>{index + 1}</td>
            <td>{table.nomor_meja}</td>
            <td>{table.kapasitas}</td>
          </tr>
        ))}
      </tbody>
    </Table>
      </div>
    </div>
  );
};

export default Tables;
