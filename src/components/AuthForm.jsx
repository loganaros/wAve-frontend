import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthForm.css'

const AuthForm = ({ type }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: type === 'register' ? '' : undefined,
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = type === 'register' ? '/api/register' : '/api/login';
      const response = await axios.post(`https://wave-app-portfolio-project-bd63556f6378.herokuapp.com${endpoint}`, formData);
      setMessage(type === 'register' ? `User registered: ${response.data.user.username}` : `Welcome back, ${response.data.user.username}`);
      // Store the token in local storage for future requests
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      // Redirect to homepage after successful login or registration
      navigate('/');
    } catch (error) {
      if (error.response?.data?.errors) {
        setMessage(error.response.data.errors.map(err => err.msg).join(', '));
      } else {
        setMessage(error.response?.data?.error || `Error occurred: ${error}`);
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>{type === 'register' ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        {type === 'register' && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">{type === 'register' ? 'Register' : 'Login'}</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default AuthForm;
