import React from 'react';
import axios from 'axios';
import './Product.css'; // Import any styles you want to apply

const addToCart = async (product) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    alert('You need to be logged in to add items to your cart.');
    return;
  }

  try {
    // Check if cart exists for the user
    const cartResponse = await axios.get(`http://127.0.0.1:8000/api/carts/?user=${user.id}`);
    let cartId;

    if (cartResponse.data.length > 0) {
      // Use existing cart ID
      cartId = cartResponse.data[0].id;
    } else {
      // Create a new cart for the user
      const newCartResponse = await axios.post('http://127.0.0.1:8000/api/carts/', { user: user.id });
      cartId = newCartResponse.data.id;
    }

    // Add product to CartItem
    const cartItemResponse = await axios.post('http://127.0.0.1:8000/api/cart-items/', {
      cart: cartId,
      product: product.id,
      quantity: 1
    });

    if (cartItemResponse.status === 201) {
      console.log('Product added to cart:', cartItemResponse.data);
      alert(`The ${product.name} is added to your cart`);
    } else {
      alert('Failed to add product to cart');
    }
  } catch (error) {
    console.error(error);
    alert(`Failed to add product to cart: ${error}`);
  }
}

const Product = ({ product }) => {
  const price = Number(product.price);

  return (
    <div className="product">
      <img src={product.image_url} alt={product.name} className="product-image" />
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${price.toFixed(2)}</p>
        <p className="product-description">{product.description}</p>
        <button className="product-button" onClick={() => addToCart(product)}>Add to Cart</button>
      </div>
    </div>
  );
}

export default Product;
