import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Appnavbar from '../compunents/navbar';
import Table from 'react-bootstrap/Table';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import useAuth from '../utils/useAuth';
import useUserAuth from '../utils/useUserAuth';

const Tables = () => {
  useUserAuth();
  const [tables, setTables] = useState([]);
  const [status, setStatus] = useState({});
  const { resto_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTable();
  }, []); 

  const fetchTable = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/tableresto/${resto_id}`, {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      if (response.status === 200) {
        setTables(response.data);
        response.data.forEach(table => fetchStatus(table.table_id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStatus = async (table_id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/tablestatus/${resto_id}/${table_id}`, {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      if (response.status === 200) {
        setStatus(prevStatus => ({
          ...prevStatus,
          [table_id]: response.data
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBook = (table_id) => {
    try {
      navigate(`/table/${resto_id}/${table_id}`);
    } catch (error) {
      console.error('Table failed!', error);
    }
  };

  return (
    <div>
      <Appnavbar />
      <div style={{ padding: '2rem' }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>No.</th>
              <th>Nomor Meja</th>
              <th>Kapasitas</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table, index) => (
              <tr key={table.table_id}>
                <td>{index + 1}</td>
                <td>{table.nomor_meja}</td>
                <td>{table.kapasitas}</td>
                <td>{status[table.table_id] === 0 ? 'Available' : 'Unavailable'}</td>
                <td>
                  <Button
                    disabled={status[table.table_id] === 1}
                    variant="primary"
                    onClick={() => (handleBook(table.table_id))}>
                    Book Now
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Tables;
