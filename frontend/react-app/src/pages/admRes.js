import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Appnavbar from '../compunents/navbar';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import useAdminAuth from '../utils/useAdminAuth';

const Admres = () => {
  useAdminAuth();
  const [user, setUser] = useState(null);
  const [restoId, setRestoId] = useState(null);
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchResto(user.user_id);
    }
  }, [user]);

  useEffect(() => {
    if (restoId) {
      fetchReservations(restoId);
    }
  }, [restoId]);

  const fetchReservations = async (restoId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/reservations/${restoId}`, {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      if (response.status === 200) {
        setReservations(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/user', {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      if (response.status === 200) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchResto = async (userId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/restaurant/${userId}`, {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      if (response.status === 200) {
        setRestoId(response.data.restaurant_id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:5000/api/reservation/${reservationId}`, {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      if (response.status === 200) {
        fetchReservations(restoId); // Refresh reservation list after cancelling
      }
    } catch (error) {
      console.error('Failed to cancel reservation:', error);
    }
  };

  return (
    <div>
      <Appnavbar />
      <div style={{ padding: '2rem' }}>
        <h2>Reservations</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>No.</th>
              <th>Table No.</th>
              <th>Date</th>
              <th>Time</th>
              <th>Guests</th>
              <th>Customer Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation, index) => (
              <tr key={reservation.reservation_id}>
                <td>{index + 1}</td>
                <td>{reservation.table_id}</td>
                <td>{new Date(reservation.tanggal_reservasi).toLocaleDateString()}</td>
                <td>{reservation.waktu_reservasi}</td>
                <td>{reservation.jumlah_orang}</td>
                <td>{reservation.customer_name}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleCancelReservation(reservation.reservation_id)}>
                    Cancel
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

export default Admres;
