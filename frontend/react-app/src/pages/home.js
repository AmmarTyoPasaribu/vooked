import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Appnavbar from '../compunents/navbar';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserName();
    fetchResto();
  }, []); 

  const fetchResto = async (e) => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/restaurant', {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      if (response.status === 200) {
        console.log(response.data);
        setRestaurants(response.data);
      } else {
        
      }
    } catch (error) {
      
    }
  };

  const fetchUserName = async (e) => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/user', {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });

      if (response.status === 200) {
        setUser(response.data.user.name);
      } else {
        
      }
    } catch (error) {
    }
  };

  const handleTable = (restaurant_id) => {
    try {
      navigate(`/tables/${restaurant_id}`);
    } catch (error) {
      console.error('Table failed!', error);
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
          <th>Phone Number</th>
          <th>Operating Hours</th>
          {
            user ? (
              <th>Actions</th>
            ) : null
          }
        </tr>
      </thead>
      <tbody>
        {restaurants.map((restaurant, index) => (
          <tr key={restaurant.restaurant_id}>
            <td>{index + 1}</td>
            <td>{restaurant.nama_restoran}</td>
            <td>{restaurant.alamat}</td>
            <td>{restaurant.nomor_telepon}</td>
            <td>{restaurant.jam_operasional}</td>
            {
              user ? (
                <td>
                  <button className="btn btn-primary" onClick={() => {handleTable(restaurant.restaurant_id)}}>See Tables</button>
                </td>
              ) : null
            }
          </tr>
        ))}
      </tbody>
    </Table>
      </div>
    </div>
  );
};

export default Home;
