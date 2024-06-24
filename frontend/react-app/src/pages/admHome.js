import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Appnavbar from '../compunents/navbar';
import Table from 'react-bootstrap/Table';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import useAdminAuth from '../utils/useAdminAuth';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

const Admhome = () => {
  useAdminAuth();
  const [user, setUser] = useState(null);
  const [restoId, setRestoId] = useState(null);
  const [tables, setTables] = useState([]);
  const [status, setStatus] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [showEditTableModal, setShowEditTableModal] = useState(false);
  const [showEditMenuModal, setShowEditMenuModal] = useState(false);
  const [currentTableId, setCurrentTableId] = useState(null);
  const [currentMenuId, setCurrentMenuId] = useState(null);
  const [newTableData, setNewTableData] = useState({
    nomor_meja: '',
    kapasitas: ''
  });
  const [newMenuData, setNewMenuData] = useState({
    nama_menu: '',
    deskripsi: '',
    harga: ''
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
      fetchMenu(restoId);
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

  const fetchMenu = async (restoId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/menu`, {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        },
        params: { restaurant_id: restoId }
      });
      if (response.status === 200) {
        setMenuItems(response.data);
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

  const handleShowAddTableModal = () => setShowAddTableModal(true);
  const handleCloseAddTableModal = () => setShowAddTableModal(false);
  const handleShowAddMenuModal = () => setShowAddMenuModal(true);
  const handleCloseAddMenuModal = () => setShowAddMenuModal(false);
  const handleShowEditTableModal = (table) => {
    setCurrentTableId(table.table_id);
    setNewTableData({ nomor_meja: table.nomor_meja, kapasitas: table.kapasitas });
    setShowEditTableModal(true);
  };
  const handleShowEditMenuModal = (menu) => {
    setCurrentMenuId(menu.menu_id);
    setNewMenuData({ nama_menu: menu.nama_menu, deskripsi: menu.deskripsi, harga: menu.harga });
    setShowEditMenuModal(true);
  };
  const handleCloseEditTableModal = () => setShowEditTableModal(false);
  const handleCloseEditMenuModal = () => setShowEditMenuModal(false);

  const handleInputChange = (e, setData) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value
    }));
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
        fetchTable(restoId);
        handleCloseAddTableModal();
        setNewTableData({
          nomor_meja: '',
          kapasitas: ''
        });
      }
    } catch (error) {
      console.error('Failed to add table:', error);
    }
  };

  const handleAddMenu = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:5000/api/menu`, {
        restaurant_id: restoId,
        nama_menu: newMenuData.nama_menu,
        deskripsi: newMenuData.deskripsi,
        harga: parseFloat(newMenuData.harga)
      }, {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      if (response.status === 200) {
        fetchMenu(restoId);
        handleCloseAddMenuModal();
        setNewMenuData({
          nama_menu: '',
          deskripsi: '',
          harga: ''
        });
      }
    } catch (error) {
      console.error('Failed to add menu:', error);
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
        fetchTable(restoId);
        handleCloseEditTableModal();
      }
    } catch (error) {
      console.error('Failed to update table:', error);
    }
  };

  const handleUpdateMenu = async () => {
    try {
      const response = await axios.put(`http://127.0.0.1:5000/api/menu/${currentMenuId}`, {
        nama_menu: newMenuData.nama_menu,
        deskripsi: newMenuData.deskripsi,
        harga: parseFloat(newMenuData.harga)
      }, {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      if (response.status === 200) {
        fetchMenu(restoId);
        handleCloseEditMenuModal();
      }
    } catch (error) {
      console.error('Failed to update menu:', error);
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
        fetchTable(restoId);
      }
    } catch (error) {
      console.error('Failed to delete table:', error);
    }
  };

  const handleDeleteMenu = async (menuId) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:5000/api/menu/${menuId}`, {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      if (response.status === 200) {
        fetchMenu(restoId);
      }
    } catch (error) {
      console.error('Failed to delete menu:', error);
    }
  };

  return (
    <div>
      <Appnavbar />
      <div className="container mt-3">
        <h3>Admin Dashboard</h3>
        <Tabs defaultActiveKey="tables" id="uncontrolled-tab-example" className="mb-3">
          <Tab eventKey="tables" title="Tables">
            <Button variant="primary" onClick={handleShowAddTableModal} style={{ marginBottom: '1rem' }}>
              Add Table
            </Button>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Nomor Meja</th>
                  <th>Kapasitas</th>
                  <th>Status</th>
                  <th>Actions</th>
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
                        variant="success"
                        onClick={() => handleBook(table.table_id)}>
                        See Table
                      </Button>
                      <Button
                        style={{ marginRight: '0.5rem' }}
                        disabled={status[table.table_id] === 1}
                        variant="warning"
                        onClick={() => handleShowEditTableModal(table)}>
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
          </Tab>
          <Tab eventKey="menu" title="Menu">
            <Button variant="primary" onClick={handleShowAddMenuModal} style={{ marginBottom: '1rem' }}>
              Add Menu
            </Button>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Nama Menu</th>
                  <th>Deskripsi</th>
                  <th>Harga</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((menu, index) => (
                  <tr key={menu.menu_id}>
                    <td>{index + 1}</td>
                    <td>{menu.nama_menu}</td>
                    <td>{menu.deskripsi}</td>
                    <td>{menu.harga}</td>
                    <td>
                      <Button
                        style={{ marginRight: '0.5rem' }}
                        variant="warning"
                        onClick={() => handleShowEditMenuModal(menu)}>
                        Edit
                      </Button>
                      <Button
                        style={{ marginRight: '0.5rem' }}
                        variant="danger"
                        onClick={() => handleDeleteMenu(menu.menu_id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab>
        </Tabs>

        {/* Add Table Modal */}
        <Modal show={showAddTableModal} onHide={handleCloseAddTableModal}>
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
                  onChange={(e) => handleInputChange(e, setNewTableData)}
                />
              </Form.Group>
              <Form.Group controlId="formKapasitas">
                <Form.Label>Kapasitas</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter capacity"
                  name="kapasitas"
                  value={newTableData.kapasitas}
                  onChange={(e) => handleInputChange(e, setNewTableData)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddTableModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddTable}>
              Add Table
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Add Menu Modal */}
        <Modal show={showAddMenuModal} onHide={handleCloseAddMenuModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Menu</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formNamaMenu">
                <Form.Label>Nama Menu</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter menu name"
                  name="nama_menu"
                  value={newMenuData.nama_menu}
                  onChange={(e) => handleInputChange(e, setNewMenuData)}
                />
              </Form.Group>
              <Form.Group controlId="formDeskripsi">
                <Form.Label>Deskripsi</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter description"
                  name="deskripsi"
                  value={newMenuData.deskripsi}
                  onChange={(e) => handleInputChange(e, setNewMenuData)}
                />
              </Form.Group>
              <Form.Group controlId="formHarga">
                <Form.Label>Harga</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter price"
                  name="harga"
                  value={newMenuData.harga}
                  onChange={(e) => handleInputChange(e, setNewMenuData)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddMenuModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddMenu}>
              Add Menu
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Table Modal */}
        <Modal show={showEditTableModal} onHide={handleCloseEditTableModal}>
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
                  onChange={(e) => handleInputChange(e, setNewTableData)}
                />
              </Form.Group>
              <Form.Group controlId="formKapasitas">
                <Form.Label>Kapasitas</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter capacity"
                  name="kapasitas"
                  value={newTableData.kapasitas}
                  onChange={(e) => handleInputChange(e, setNewTableData)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditTableModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpdateTable}>
              Update Table
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Menu Modal */}
        <Modal show={showEditMenuModal} onHide={handleCloseEditMenuModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Menu</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formNamaMenu">
                <Form.Label>Nama Menu</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter menu name"
                  name="nama_menu"
                  value={newMenuData.nama_menu}
                  onChange={(e) => handleInputChange(e, setNewMenuData)}
                />
              </Form.Group>
              <Form.Group controlId="formDeskripsi">
                <Form.Label>Deskripsi</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter description"
                  name="deskripsi"
                  value={newMenuData.deskripsi}
                  onChange={(e) => handleInputChange(e, setNewMenuData)}
                />
              </Form.Group>
              <Form.Group controlId="formHarga">
                <Form.Label>Harga</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter price"
                  name="harga"
                  value={newMenuData.harga}
                  onChange={(e) => handleInputChange(e, setNewMenuData)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditMenuModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpdateMenu}>
              Update Menu
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Admhome;
