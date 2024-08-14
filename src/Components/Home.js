import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios"; // Import axios
import { setUser, clearUser, selectUser } from "../features/userSlice";
import Navbar from "./Navbar";
import Login from "./Login";
import Signup from "./Signup";
import Footer from "./Footer";
import Product from "./Product";
import "../App.css";

function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }

    // Fetch products data using axios
    axios.get("http://127.0.0.1:8000/api/products/")
    .then((response) => {
      setProducts(response.data);
    })
    .catch((error) => {
      if (error.response) {
        // Server responded with a status other than 200 range
        console.error("Server responded with error:", error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request
        console.error("Error setting up request:", error.message);
      }
    });
  
  }, [dispatch]);

  const togglePopup = () => setShowPopup(!showPopup);
  const switchForm = () => setShowSignup(!showSignup);

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem("user");
  };

  return (
    <>
      <Navbar
        togglePopup={togglePopup}
        user={user}
        handleLogout={handleLogout}
      />
      <main className={`Home ${showPopup ? "show-popup" : ""}`}>
        <div className="blur-bg-overlay" onClick={togglePopup}></div>
        <div className={`form-popup ${showSignup ? "show-signup" : ""}`}>
          <button
            className="close-btn material-symbols-rounded"
            onClick={togglePopup}
          >
            close
          </button>
          {showSignup ? (
            <Signup switchForm={switchForm} togglePopup={togglePopup} />
          ) : (
            <Login switchForm={switchForm} togglePopup={togglePopup} />
          )}
        </div>
        <section className="product-list">
          {products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Home;
