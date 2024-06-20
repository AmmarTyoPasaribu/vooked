import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Appnavbar from '../compunents/navbar';
import Table from 'react-bootstrap/Table';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import useAdminAuth from '../utils/useAdminAuth';

const Admhome = () => {
  useAdminAuth();
  const [user, setUser] = useState(null);
  const [restoId, setRestoId] = useState(null);
  const [tables, setTables] = useState([]);
  const [status, setStatus] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTableId, setCurrentTableId] = useState(null);
  const [newTableData, setNewTableData] = useState({
    nomor_meja: '',
    kapasitas: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []); 

  useEffect(() => {
    if (user) {
      fetchResto(user);
    }
  }, [user]);

  useEffect(() => {
    if (restoId) {
      fetchTable(restoId);
    }
  }, [restoId]);

  const fetchTable = async (restoId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/tableresto/${restoId}`, {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      if (response.status === 200) {
        setTables(response.data);
        response.data.forEach(table => fetchStatus(restoId, table.table_id));
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
        console.log("aaa" + response.data.user.user_id);
        setUser(response.data.user.user_id);
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
        console.log("bbb" + response.data.restaurant_id);
        setRestoId(response.data.restaurant_id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStatus = async (restoId, tableId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/tablestatus/${restoId}/${tableId}`, {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      if (response.status === 200) {
        setStatus(prevStatus => ({
          ...prevStatus,
          [tableId]: response.data == '0' ? 0 : 1
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBook = (tableId) => {
    try {
      navigate(`/table/${restoId}/${tableId}`);
    } catch (error) {
      console.error('Table failed!', error);
    }
  };

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowEditModal = (table) => {
    setCurrentTableId(table.table_id);
    setNewTableData({ nomor_meja: table.nomor_meja, kapasitas: table.kapasitas });
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => setShowEditModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTableData({
      ...newTableData,
      [name]: value
    });
  };

  const handleAddTable = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:5000/api/table`, {
        restaurant_id: restoId,
        nomor_meja: newTableData.nomor_meja,
        kapasitas: parseInt(newTableData.kapasitas)
      }, {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      if (response.status === 200) {
        fetchTable(restoId); // Refresh table list after adding new table
        handleCloseAddModal();
        setNewTableData({
          nomor_meja: '',
          kapasitas: ''
        });
      }
    } catch (error) {
      console.error('Failed to add table:', error);
    }
  };

  const handleUpdateTable = async () => {
    try {
      const response = await axios.put(`http://127.0.0.1:5000/api/table/${currentTableId}`, {
        nomor_meja: newTableData.nomor_meja,
        kapasitas: parseInt(newTableData.kapasitas)
      }, {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      if (response.status === 200) {
        fetchTable(restoId); // Refresh table list after updating the table
        handleCloseEditModal();
      }
    } catch (error) {
      console.error('Failed to update table:', error);
    }
  };

  const handleDeleteTable = async (tableId) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:5000/api/table/${tableId}`, {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      if (response.status === 200) {
        fetchTable(restoId); // Refresh table list after deleting the table
      }
    } catch (error) {
      console.error('Failed to delete table:', error);
    }
  };

  return (
    <div>
      <Appnavbar />
      <div style={{ padding: '2rem' }}>
        <Button variant="primary" onClick={handleShowAddModal} style={{ marginBottom: '1rem' }}>
          Add Table
        </Button>
        <Modal show={showAddModal} onHide={handleCloseAddModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Table</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formNomorMeja">
                <Form.Label>Nomor Meja</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter table number"
                  name="nomor_meja"
                  value={newTableData.nomor_meja}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formKapasitas">
                <Form.Label>Kapasitas</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter capacity"
                  name="kapasitas"
                  value={newTableData.kapasitas}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddTable}>
              Add Table
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showEditModal} onHide={handleCloseEditModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Table</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formNomorMeja">
                <Form.Label>Nomor Meja</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter table number"
                  name="nomor_meja"
                  value={newTableData.nomor_meja}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formKapasitas">
                <Form.Label>Kapasitas</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter capacity"
                  name="kapasitas"
                  value={newTableData.kapasitas}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpdateTable}>
              Update Table
            </Button>
          </Modal.Footer>
        </Modal>
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
                    style={{ marginRight: '0.5rem' }}
                    disabled={status[table.table_id] === 1}
                    variant="warning"
                    onClick={() => handleShowEditModal(table)}>
                    Edit
                  </Button>
                  <Button
                    style={{ marginRight: '0.5rem' }}
                    disabled={status[table.table_id] === 1}
                    variant="danger"
                    onClick={() => handleDeleteTable(table.table_id)}>
                    Delete
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

export default Admhome;
