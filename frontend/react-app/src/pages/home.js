import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Appnavbar from '../compunents/navbar';
import Table from 'react-bootstrap/Table';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {

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
          </tr>
        ))}
      </tbody>
    </Table>
      </div>
    </div>
  );
};

export default Home;
