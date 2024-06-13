import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Logo from './logo';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
            <Logo />
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              {user ? (
                <>
                  Signed in as: <a href="#login">{user}</a>
                  <button onClick={handleLogout} className="btn btn-link">
                    Logout
                  </button>
                </>
              ) : (
                <a href="#login" onClick={handleLogin}>
                  Login
                </a>
              )}
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Appnavbar;
