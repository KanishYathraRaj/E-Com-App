import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        try {
          // Fetch the user's cart
          const cartResponse = await axios.get(`http://127.0.0.1:8000/api/carts/?user=${user.id}`);
          if (cartResponse.data.length > 0) {
            const cartId = cartResponse.data[0].id;
            
            // Fetch cart items
            const cartItemsResponse = await axios.get(`http://127.0.0.1:8000/api/cart-items/?cart=${cartId}`);
            
            // Extract product IDs from cart items
            const productIds = cartItemsResponse.data.map(item => item.product);

            if (productIds.length > 0) {
              // Fetch products details based on product IDs
              const productsResponse = await axios.get(`http://127.0.0.1:8000/api/products/?ids=${productIds.join(',')}`);
              setProducts(productsResponse.data);

              // Combine cart items with product details
              const updatedCartItems = cartItemsResponse.data.map(item => ({
                ...item,
                product: productsResponse.data.find(product => product.id === item.product)
              }));
              
              setCartItems(updatedCartItems);
              calculateTotal(updatedCartItems);
            }
          }
        } catch (error) {
          console.error('Error fetching cart:', error);
          alert('Failed to fetch cart data');
        }
      }
    };

    fetchCart();
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    setTotalAmount(total);
  };

  const updateQuantity = async (index, delta) => {
    const updatedCartItems = cartItems.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, quantity: item.quantity + delta };
        return updatedItem.quantity > 0 ? updatedItem : item;
      }
      return item;
    }).filter(item => item.quantity > 0);

    setCartItems(updatedCartItems);
    calculateTotal(updatedCartItems);

    const itemToUpdate = updatedCartItems[index];
    try {
      await axios.patch(`http://127.0.0.1:8000/api/cart-items/${itemToUpdate.id}/`, {
        quantity: itemToUpdate.quantity
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update item quantity');
    }
  };

  const deleteItem = async (index) => {
    const itemToDelete = cartItems[index];

    try {
      await axios.delete(`http://127.0.0.1:8000/api/cart-items/${itemToDelete.id}/`);
      const updatedCartItems = cartItems.filter((_, i) => i !== index);
      setCartItems(updatedCartItems);
      calculateTotal(updatedCartItems);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert(`Failed to delete item: ${error.message}`);
    }
  };

  const handleOrder = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();
  
    const user = JSON.parse(localStorage.getItem('user'));
  
    if (!user) {
      alert('User not logged in');
      return;
    }
  
    const orderData = {
      user: user.id,
      total_price: totalAmount,
    };
  
    try {
      // Create order
      const orderResponse = await axios.post('http://127.0.0.1:8000/api/orders/', orderData);
      if (orderResponse.status !== 201) {
        throw new Error(`Failed to create order: ${orderResponse.statusText}`);
      }
      const orderId = orderResponse.data.id;
  
      // Create order items
      const orderItemsData = cartItems.map(item => ({
        order: orderId,
        product: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));
  
      try {
        await Promise.all(orderItemsData.map(item => axios.post('http://127.0.0.1:8000/api/order-items/', item)));
      } catch (orderItemsError) {
        // Handle errors for order items creation
        console.error('Error creating order items:', orderItemsError);
        // Optionally, handle rollback or notify the user here
        throw new Error('Failed to create order items');
      }
  
      // Clear cart and show success message
      setOrderSuccess(true);
      setShowModal(false);
      setCartItems([]);
      setTotalAmount(0);
  
      // Empty the cart on the server
      const cartResponse = await axios.get(`http://127.0.0.1:8000/api/carts/?user=${user.id}`);
      if (cartResponse.data.length > 0) {
        const cartId = cartResponse.data[0].id;
  
        // Fetch all cart items
        const cartItemsResponse = await axios.get(`http://127.0.0.1:8000/api/cart-items/?cart=${cartId}`);
        const cartItemsList = cartItemsResponse.data;
  
        // Delete each item individually
        await Promise.all(cartItemsList.map(item => 
          axios.delete(`http://127.0.0.1:8000/api/cart-items/${item.id}/`)
        ));
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert(`Failed to place order: ${error.message}`);
    }
  };
  

  return (
    <div className="container mt-4">
      <h2>Shopping Cart</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td><img src={item.product.image_url} alt={item.product.name} style={{ width: '50px', height: '50px' }} /></td>
              <td>{item.product.name}</td>
              <td>
                <button className="btn btn-secondary btn-sm" onClick={() => updateQuantity(index, -1)}>-</button>
                <span className="mx-2">{item.quantity}</span>
                <button className="btn btn-secondary btn-sm" onClick={() => updateQuantity(index, 1)}>+</button>
              </td>
              <td>${item.product.price}</td>
              <td>${item.product.price * item.quantity}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => deleteItem(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Total Amount: ${totalAmount}</h3>
      <Button variant="primary" onClick={handleOrder}>Order</Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>UPI Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePaymentSubmit}>
            <Form.Group controlId="upiId">
              <Form.Label>UPI ID</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter UPI ID" 
                value={upiId} 
                onChange={(e) => setUpiId(e.target.value)} 
                required 
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Pay Now
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {orderSuccess && (
        <div className="alert alert-success mt-3" role="alert">
          Your order has been placed successfully!
        </div>
      )}
    </div>
  );
};

export default Cart;
