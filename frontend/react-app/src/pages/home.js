import React, { useState } from 'react';
import axios from 'axios';
import Appnavbar from '../compunents/navbar';
import useAuth from '../utils/useAuth';

const Home = () => {

    useAuth();

  const [formData, setFormData] = useState({
    email: '',
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
      const response = await axios.post('http://127.0.0.1:5000/api/login', formData);
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
      <Appnavbar />
    </div>
  );
};

export default Home;
