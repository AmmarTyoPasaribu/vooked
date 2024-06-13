import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Appnavbar from '../compunents/navbar';

const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/login', formData);
      if (response.status === 200) {
        const token = response.data.token;
        
        localStorage.setItem('jwtToken', token);
        setMessage('Signin successful!');
        navigate('/');
      } else {
        setMessage('Signin failed. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <Appnavbar />
      <Card border="primary" style={{ width: '25rem', margin: 'auto' }}>
        <Card.Header>Sign In</Card.Header>
        <Card.Body>
          <Card.Title>Primary Card Title</Card.Title>
          <form onSubmit={handleSubmit}>
            <FloatingLabel controlId="email" label="Email" className="mb-3">
              <Form.Control 
                type="email" 
                placeholder="name@example.com" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FloatingLabel>
            <FloatingLabel controlId="password" label="Password">
              <Form.Control 
                type="password" 
                placeholder="Password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </FloatingLabel>
            <Button type="submit" variant="primary">Primary</Button>{' '}
            {message && <p>{message}</p>}
          </form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Signin;
