import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import useAuth from '../utils/useAuth';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { format, addDays } from 'date-fns';
import Appnavbar from '../compunents/navbar';

const Tab = () => {
  useAuth();
  const [table, setTable] = useState({});
  const [formData, setFormData] = useState({
    jumlah_orang: '',
    tanggal_reservasi: format(new Date(), 'yyyy-MM-dd'),
    waktu_reservasi: '12:00:00',
    restaurant_id: '',
    table_id: '',
  });
  const [maxPengunjung, setMaxPengunjung] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const { resto_id, table_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.jumlah_orang === '' || Number(formData.jumlah_orang) <= 0 || Number(formData.jumlah_orang) > maxPengunjung) {
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }, [formData, maxPengunjung]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/table/${resto_id}/${table_id}`, {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      if (response.status === 200) {
        setTable(response.data);
        setMaxPengunjung(response.data.kapasitas);
        setFormData(prev => ({
          ...prev,
          restaurant_id: resto_id,
          table_id: table_id,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/reservation', formData, {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      if (response.status === 200) {
        console.log(response.data);
        navigate(`/tables/${resto_id}`);
      } else {
        console.error('Failed to book table');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'jumlah_orang' && (value === '' || (Number(value) > 0 && Number(value) <= maxPengunjung))) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    } else if (name !== 'jumlah_orang') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const renderDateOptions = () => {
    const today = new Date();
    const dateOptions = [];
    for (let i = 0; i <= 7; i++) {
      const date = addDays(today, i);
      const formattedDate = format(date, 'yyyy-MM-dd');
      dateOptions.push(
        <option key={formattedDate} value={formattedDate}>
          {format(date, 'EEEE, dd MMMM yyyy')}
        </option>
      );
    }
    return dateOptions;
  };

  return (
    <div>
      <Appnavbar />
      <div style={{ padding: '2rem' }}>
        <Form onSubmit={handleBook}>
          <Table striped bordered hover>
            <tbody>
              <tr>
                <td>Nomor meja</td>
                <td>{table.nomor_meja}</td>
              </tr>
              <tr>
                <td>Kapasitas</td>
                <td>{table.kapasitas}</td>
              </tr>
              <tr>
                <td>Jumlah Pengunjung</td>
                <td>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      placeholder="Jumlah Pengunjung"
                      aria-label="Jumlah Pengunjung"
                      aria-describedby="jumlah-pengunjung"
                      name="jumlah_orang"
                      value={formData.jumlah_orang}
                      onChange={handleChange}
                      onKeyDown={(e) => {
                        if (!/[0-9\b]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      min="1"
                      max={table.kapasitas}
                    />
                    <InputGroup.Text id="jumlah-pengunjung">/{table.kapasitas}</InputGroup.Text>
                  </InputGroup>
                </td>
              </tr>
              <tr>
                <td>Tanggal</td>
                <td>
                  <Form.Control
                    as="select"
                    name="tanggal_reservasi"
                    value={formData.tanggal_reservasi}
                    onChange={handleChange}
                  >
                    {renderDateOptions()}
                  </Form.Control>
                </td>
              </tr>
              <tr>
                <td>Waktu</td>
                <td>
                  <Form.Control
                    type="time"
                    name="waktu_reservasi"
                    value={formData.waktu_reservasi}
                    onChange={handleChange}
                  />
                </td>
              </tr>
            </tbody>
          </Table>
          <Button type="submit" variant="primary" disabled={isButtonDisabled}>
            Book Table
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Tab;
