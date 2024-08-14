import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      try {
        // Fetch orders for the logged-in user
        const response = await axios.get(`http://127.0.0.1:8000/api/orders/?user=${user.id}`);
        setOrders(response.data || []); // Ensure orders is set to an array
      } catch (err) {
        setError('Failed to fetch orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4">
      <h2>Order History</h2>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>Total Price</th>
              <th>Created At</th>
              <th>Status</th>
              <th>Order Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{order.id}</td>
                <td>${order.total_price}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>{order.status}</td>
                <td>
                  <ul>
                    {(order.order_items || []).map(item => (
                      <li key={item.id}>
                        {item.product.name} - {item.quantity} @ ${item.price} each
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Order;
