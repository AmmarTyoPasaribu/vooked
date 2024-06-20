import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Logo from './logo';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
      <Navbar style={{ backgroundColor: 'orange', marginBottom: '15px' }}>
        <Container>
          <Navbar.Brand href="/">
            <Logo />
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-between">
            <Navbar.Text>
              <a href="/" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold', fontSize: '18px', padding: '10px', borderRadius: '5px' }}>Home</a>
            </Navbar.Text>
            <Navbar.Text style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold', fontSize: '18px', padding: '10px', borderRadius: '5px' }}>
              {user ? (
                <>
                  Signed in as : <a>{user}</a>
                  <button style={{ textDecoration: 'none', color: 'red', fontWeight: 'bold', fontSize: '18px', padding: '10px', borderRadius: '5px' }} onClick={handleLogout} className="btn btn-link">
                    Logout
                  </button>
                </>
              ) : (
                <a style={{ textDecoration: 'none', color: 'purple', fontWeight: 'bold', fontSize: '18px', padding: '10px', borderRadius: '5px' }} href="" onClick={handleLogin}>
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
