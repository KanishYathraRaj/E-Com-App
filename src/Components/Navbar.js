import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar({ togglePopup, user, handleLogout }) {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => setShowMenu(!showMenu);

  const path = "https://img.freepik.com/premium-vector/profile-completeness-ui-element-template_106317-35744.jpg";
  const path1 = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDjdcY0f3f7ShYgQ30crNpdOIWoqzH7VeivfJXmypwHjL3lbtPJ6p2Vfdbk4_Ai4sqI1c&usqp=CAU";

  return (
    <nav className="navbar">
      <span className="hamburger-btn material-symbols-rounded" onClick={toggleMenu}>menu</span>
      <a href="#" className="logo">
        <img src={path1} alt="logo" />
        <h2>TaiStore</h2>
      </a>
      <ul className={`links ${showMenu ? 'show-menu' : ''}`}>
        <span className="close-btn material-symbols-rounded" onClick={toggleMenu}>close</span>
        <li><a href="#">Home</a></li>
        <li><a href="#">Products</a></li>
        <li><a href="#"><Link to="/cart">Cart</Link></a></li>
        <li><a href="#">Wishlist</a></li>
        <li><a href="#"><Link to="/order">Orders</Link></a></li>
        <li><a href="#">About Us</a></li>
      </ul>
      {user ? (
        <div className="user-info">
          <img src={path} alt="Profile" className="profile-logo" />
          <span>{user.username}</span>
          <button className="logout-btn" onClick={handleLogout} style={{ fontSize: '0.8em' }}>Logout</button>
        </div>
      ) : (
        <button className="login-btn" onClick={togglePopup}>LOG IN</button>
      )}
    </nav>
  );
}

export default Navbar;
