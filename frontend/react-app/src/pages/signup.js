import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import "../distcss/signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    role: 'user'
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
      const response = await axios.post('http://127.0.0.1:5000/api/register', formData);
      if (response.status === 200) {
        console.log(response.data);
        setMessage('Signup successful!');
        navigate('/signin'); 
      } else {
        setMessage('Signup failed. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div>
    <div className="register-container" style={{ backgroundImage: `url(${require('../img/backgroundbook.png')})`, backgroundAttachment: 'fixed' }}>
      <div className="register-form cormorant-font">
        <h2>Create your Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="Enter your Full Name here" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="Enter your Email here" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter your Password here" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input 
              type="text" 
              placeholder="Enter your Phone Number here" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input 
              type="text" 
              placeholder="Enter your Address here" 
              name="address"
              value={formData.address}
              onChange={handleChange}
              required 
            />
          </div>
          <button type="submit" className="create-account-button">Create Account</button>
          {message && <p>{message}</p>}
        </form>
        <div className="login-link">
          <span>I Already Have An Account </span>
          <Link to="/signin">Login</Link>
        </div>
      </div>
    </div>
  </div>
);
};

export default Signup;
