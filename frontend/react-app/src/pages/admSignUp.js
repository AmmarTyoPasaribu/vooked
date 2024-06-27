import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import "../distcss/admsignup.css";

const Admsignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    role: 'admin',
    jam_operasional: ''
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
      const registerResponse = await axios.post('http://127.0.0.1:5000/api/register', formData);
      console.log(registerResponse.data);
      if (registerResponse.status === 200) {
        console.log(registerResponse.data);
        setMessage('Signup and restaurant creation successful!');
        navigate('/admin/signin');
      } else {
        setMessage('Signup failed. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="sign-in" style={{ backgroundImage: `url(${require('../img/backgroundbook.png')})`}}>
      <div className="content cormorant-font" style={{ marginTop: '300px' }}>
        <div className="title">Register your Restaurant</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Restaurant Name</label>
            <input 
              type="text" 
              className="input" 
              placeholder="Enter your Restaurant Name here" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
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
          <div className="form-group">
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
          <div className="form-group">
            <label className="label">Phone Number</label>
            <input 
              type="text" 
              className="input" 
              placeholder="Enter your Phone Number here" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label className="label">Address</label>
            <input 
              type="text" 
              className="input" 
              placeholder="Enter your Address here" 
              name="address"
              value={formData.address}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label className="label">Operating Hours</label>
            <input 
              type="text" 
              className="input" 
              placeholder="Enter the Operating Hours here" 
              name="jam_operasional"
              value={formData.jam_operasional}
              onChange={handleChange}
              required 
            />
          </div>
          <button type="submit" className="login-button">Create Account</button>
          {message && <p>{message}</p>}
        </form>
        <div className="create-account">
          <span>I Already Have An Account </span>
          <Link to="/admin/signin" className="sign-up-link">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Admsignup;