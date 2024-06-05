import React, { useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });

  const [message, setMessage] = useState('');

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
      const response = await axios.post('http://127.0.0.1:5000/api/register', formData);
      if (response.status === 200) {
        console.log(response.data);
        setMessage('Signup successful!');
      } else {
        setMessage('Signup failed. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <Card border="primary" style={{ width: '25rem', margin: 'auto'}}>
        <Card.Header>Sign Up</Card.Header>
        <Card.Body>
          <Card.Title>Primary Card Title</Card.Title>
          <form onSubmit={handleSubmit}>
            <FloatingLabel controlId="name" label="Name" className="mb-3">
              <Form.Control 
                type="text" 
                placeholder="name" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </FloatingLabel>
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
            <FloatingLabel controlId="phone" label="Phone" className="mb-3">
              <Form.Control 
                type="phone" 
                placeholder="phone" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </FloatingLabel>
            <FloatingLabel controlId="address" label="Address" className="mb-3">
              <Form.Control 
                type="address" 
                placeholder="address" 
                name="address"
                value={formData.address}
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

export default Signup;
