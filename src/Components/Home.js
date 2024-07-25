import React, { useState } from 'react';
import Navbar from './Navbar';
import Login from './Login';
import Signup from './Signup';
import '../App.css'

function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const togglePopup = () => setShowPopup(!showPopup);
  const switchForm = () => setShowSignup(!showSignup);

  return (
    <div className={`Home ${showPopup ? 'show-popup' : ''}`}>
      <header>
        <Navbar togglePopup={togglePopup} />
      </header>
      <div className="blur-bg-overlay" onClick={togglePopup}></div>
      <div className={`form-popup ${showSignup ? 'show-signup' : ''}`}>
        <button className="close-btn material-symbols-rounded" onClick={togglePopup}>close</button>
        {showSignup ? <Signup switchForm={switchForm} /> : <Login switchForm={switchForm} />}
      </div>
    </div>
  );
}

export default Home;
