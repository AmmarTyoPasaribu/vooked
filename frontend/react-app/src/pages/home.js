import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Appnavbar from '../compunents/navbar';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import image1 from './1.jpeg';
import image2 from './2.jpeg';
import image3 from './3.jpeg';
import image4 from './4.jpeg';
import image5 from './11.png';
import { Navigate, useNavigate } from 'react-router-dom';
import '../distcss/home.css'; // Tambahkan ini di bagian atas file

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserName();
    fetchResto();
  }, []); 
  const images = [image1, image2, image3, image4];

  const fetchResto = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/restaurant', {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      if (response.status === 200) {
        setRestaurants(response.data);
      }
    } catch (error) {
      console.error('Fetch restaurants failed!', error);
    }
  };

  const fetchUserName = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/user', {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      if (response.status === 200) {
        setUser(response.data.user.name);
      }
    } catch (error) {
      console.error('Fetch user failed!', error);
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
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
        {restaurants.map((restaurant, index) => (
          <Card key={restaurant.restaurant_id} style={{ width: '18rem' }}>
            <Card.Img variant="top" src={images[index % images.length]} />
            <Card.Body>
              <Card.Title>{restaurant.nama_restoran}</Card.Title>
              <Card.Text>
                {restaurant.alamat}<br />
                {restaurant.nomor_telepon}<br />
                {restaurant.jam_operasional}
              </Card.Text>
              {user && (
                <Button variant="primary" onClick={() => {handleTable(restaurant.restaurant_id)}}>
                  See Tables
                </Button>
              )}
            </Card.Body>
          </Card>
        ))}
      </div>
      <footer style={{ position: 'fixed', bottom: '0', width: '100%' }}>
        <img src={image5} alt="Footer Image" style={{ width: '100%' }} />
      </footer>
    </div>
  );
};

export default Home;
