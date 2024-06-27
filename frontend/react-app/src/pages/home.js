import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Appnavbar from '../compunents/navbar';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import image1 from '../img/1.jpeg';
import image2 from '../img/2.jpeg';
import image3 from '../img/3.jpeg';
import image4 from '../img/4.jpeg';
import image5 from '../img/5.jpeg';
import image6 from '../img/6.jpeg';
import imagee from '../img/11.png';

import '../distcss/home.css';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [user, setUser] = useState(null);
  const [userReservations, setUserReservations] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkLoginStatus();
    fetchResto();
    fetchUserReservations();
  }, []);

  const images = [image1, image2, image3, image4, image5, image6];

  const checkLoginStatus = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/user', {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      if (response.status === 200) {
        setUser(response.data.user.name);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('User not logged in!', error);
      setIsLoggedIn(false);
    }
  };

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

  const fetchUserReservations = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/reservationslist', {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      if (response.status === 200) {
        setUserReservations(response.data);
      }
    } catch (error) {
      console.error('Fetch user reservations failed!', error);
    }
  };

  const handleTable = (restaurant) => {
    try {
      navigate(`/tables/${restaurant.restaurant_id}`, { state: { restaurant } });
    } catch (error) {
      console.error('Table navigation failed!', error);
    }
  };

  const deleteReservation = async (reservation_id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/reservation/${reservation_id}`, {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      fetchUserReservations(); // Refresh reservations after delete
    } catch (error) {
      console.error('Delete reservation failed!', error);
    }
  }; 

  return (
    <div>
      <Appnavbar />
      {isLoggedIn ? (
        <Tabs defaultActiveKey="restaurants" id="home-tabs" style={{ marginBottom: '30px' }}>
          <Tab eventKey="restaurants" title="Restaurants">
          <div>
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
                    {isLoggedIn && (
                    <Button variant="primary" onClick={() => handleTable(restaurant)}>
                    See Tables
                  </Button>
                    )}
                  </Card.Body>
                </Card>
              ))}
            </div>
            </div>
          </Tab>
          <Tab eventKey="reservations" title="Reservations">
            <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
              {userReservations.map((reservation) => (
                <Card key={reservation.reservation_id} style={{ width: '18rem' }}>
                  <Card.Body>
                    <Card.Title>Reservation ID: {reservation.restaurant_name}</Card.Title>
                    <Card.Text>
                      Restaurant ID: {reservation.restaurant_id}<br />
                      Table ID: {reservation.table_id}<br />
                      Date: {reservation.tanggal_reservasi}<br />
                      Time: {reservation.waktu_reservasi}<br />
                      Number of people: {reservation.jumlah_orang}
                    </Card.Text>
                    <Button variant="danger" onClick={() => deleteReservation(reservation.reservation_id)}>
                      Delete Reservation
                    </Button>
                  </Card.Body>
                </Card>
              ))}
            </div>
            </div>
          </Tab>
        </Tabs>
      ) : (
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
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
              <div style={{ marginTop: '20px' }}>
                <footer style={{ bottom: '0', width: '100%' }}>
                  <img src={imagee} alt="Footer" style={{ width: '100%' }} />
                </footer>
              </div>
   
    </div>
  );
};

export default Home;
