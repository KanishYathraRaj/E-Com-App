import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '../features/userSlice';

function Login({ switchForm, togglePopup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Fetch all users from the API
      const response = await axios.get('http://127.0.0.1:8000/api/users/');
      const users = response.data;

      // Find the user with matching email and password
      const user = users.find(user => user.email === email && user.password === password);

      if (user) {
        // User found, handle login success
        console.log('Login successful');
        dispatch(setUser(user)); // Set the user info in the global state
        localStorage.setItem('user', JSON.stringify(user)); // Save user info in local storage
        navigate('/'); // Redirect to home page
        togglePopup(); // Close the popup
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('An error occurred');
      console.error('Error fetching users:', error);
    }
  };

  return (
    <div className="form-box login">
      <div className="form-details">
        <h2>Welcome Back</h2>
        <p>Please log in using your personal information to stay connected with us.</p>
      </div>
      <div className="form-content">
        <h2>LOGIN</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
          </div>
          <div className="input-field">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
          </div>
          <a href="#" className="forgot-pass-link">Forgot password?</a>
          <button type="submit">Log In</button>
          {error && <p className="error">{error}</p>}
        </form>
        <div className="bottom-link">
          Don't have an account?
          <a href="#" onClick={switchForm} id="signup-link">Signup</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
