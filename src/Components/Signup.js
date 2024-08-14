import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/userSlice';

function Signup({ switchForm, togglePopup }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if email already exists
      const checkResponse = await axios.get(`http://127.0.0.1:8000/api/users/`);
      const existingUser = checkResponse.data.find(user => user.email === email);
      if (existingUser) {
        setError('Email already in use');
        return;
      }
      
      // Proceed with signup if email is unique
      const response = await axios.post('http://127.0.0.1:8000/api/users/', {
        username: name,
        email,
        password
      });
      
      if (response.status === 201) {
        const user = response.data;
        dispatch(setUser(user));
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Signup successful');
        togglePopup();
      }
    } catch (error) {
      setError('An error occurred');
      console.log(error);
    }
  };

  return (
    <div className="form-box signup">
      <div className="form-details">
        <h2>Create Account</h2>
        <p>To become a part of our community, please sign up using your personal information.</p>
      </div>
      <div className="form-content">
        <h2>SIGNUP</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
            <label>Enter your Name</label>
          </div>
          <div className="input-field">
            <input type="text" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Enter your email</label>
          </div>
          <div className="input-field">
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <label>Create password</label>
          </div>
          <div className="policy-text">
            <input type="checkbox" id="policy" />
            <label htmlFor="policy">
              I agree to the
              <a href="#" className="option">Terms & Conditions</a>
            </label>
          </div>
          <button type="submit">Sign Up</button>
          {error && <p className="error">{error}</p>}
        </form>
        <div className="bottom-link">
          Already have an account?
          <a href="#" onClick={switchForm} id="login-link">Login</a>
        </div>
      </div>
    </div>
  );
}

export default Signup;
