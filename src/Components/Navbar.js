import React, { useState } from 'react';

function Navbar({ togglePopup }) {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <nav className="navbar">
      <span className="hamburger-btn material-symbols-rounded" onClick={toggleMenu}>menu</span>
      <a href="#" className="logo">
        <img src="images/logo.jpg" alt="logo" />
        <h2>CodingNepal</h2>
      </a>
      <ul className={`links ${showMenu ? 'show-menu' : ''}`}>
        <span className="close-btn material-symbols-rounded" onClick={toggleMenu}>close</span>
        <li><a href="#">Home</a></li>
        <li><a href="#">Portfolio</a></li>
        <li><a href="#">Courses</a></li>
        <li><a href="#">About us</a></li>
        <li><a href="#">Contact us</a></li>
      </ul>
      <button className="login-btn" onClick={togglePopup}>LOG IN</button>
    </nav>
  );
}

export default Navbar;
