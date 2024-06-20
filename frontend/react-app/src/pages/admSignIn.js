import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import "../distcss/signin.css";

const AdmsignIn = () => {
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
      console.log(response.data);
      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem('jwtToken', token);
        setMessage('Signin successful!');
        navigate('/admin/home');
      } else {
        setMessage('Signin failed. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="sign-in">
      <div className="content">
        <div className="title">Login</div>
        <form onSubmit={handleSubmit}>
          <div className="email-input">
            <label className="label">Email</label>
            <input 
              type="email" 
              className="input" 
              placeholder="Enter your Email here" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="password-input">
            <label className="label">Password</label>
            <input 
              type="password" 
              className="input" 
              placeholder="Enter your Password here" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
          {message && <p>{message}</p>}
        </form>
        <div className="create-account">
          <span>Create An Account </span>
          <Link to="/signup" className="sign-up-link">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default AdmsignIn;
