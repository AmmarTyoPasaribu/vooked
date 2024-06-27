import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Logo from './logo';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Dropdown } from 'react-bootstrap';
import { PersonCircle } from 'react-bootstrap-icons';
import "../distcss/navbar.css";

const Appnavbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {

    fetchUserName();
  }, []); 

  const handleLogin = async () => {
    try {
      navigate('/signin');
    } catch (error) {
      console.error('Login failed!', error);
    }
  };

  const handleLogout = async () => {

    localStorage.removeItem('jwtToken');
    setUser(null);
    navigate('/');
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

  return (
    <div>
      <Navbar style={{ backgroundColor: "#292E36"}}>
        <Container>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-between">
            <Navbar.Brand href="/">
              <Logo />
            </Navbar.Brand>
            <Dropdown align="end" drop="start">
              <Dropdown.Toggle as="div" style={{ backgroundColor: 'grey', borderRadius: '50%', padding: '5px' }}>
                <PersonCircle size={30} color="white" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="custom-dropdown-menu">
                {user ? (
                  <>
                    <Dropdown.ItemText>{user}</Dropdown.ItemText>
                    <Dropdown.Item className="custom-dropdown-item logout-item" onClick={handleLogout}>Logout</Dropdown.Item>
                  </>
                ) : (
                  <Dropdown.Item className="custom-dropdown-item" onClick={handleLogin}>Login</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Appnavbar;
