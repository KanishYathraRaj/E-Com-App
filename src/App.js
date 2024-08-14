import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import './App.css';
import Cart from './Components/Cart';
import Order from './Components/Order';
import AdminPage from './Components/AdminPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/order" element={<Order/>} />
          <Route path="/admin" element={<AdminPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
