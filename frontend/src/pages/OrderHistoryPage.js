import React, { useEffect, useState } from 'react';
import { orderAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debug, setDebug] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setDebug('');
        const { data } = await orderAPI.getMyOrders();
        setOrders(data);
        setDebug(JSON.stringify(data, null, 2));
      } catch (err) {
        setError('Could not fetch your orders');
        setDebug(err?.response ? JSON.stringify(err.response.data, null, 2) : String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading)
    return <div className="loading">Loading your orders...</div>;
  if (error) return <div className="error">{error}<pre className="debug-output">{debug}</pre></div>;

  return (
    <div className="order-history-page container">
      <h1 className="section-title">Order History</h1>
      {orders.length === 0 ? (
        <div className="no-orders">You have not placed any orders yet.<br/><b>DEBUG:</b><pre className="debug-output">{debug}</pre></div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-header">
                <span>Order #{order._id.slice(-8).toUpperCase()}</span>
                <span className="order-date">{new Date(order.createdAt).toLocaleString()}</span>
                <span className={`order-status ${order.isDelivered ? "delivered" : "pending"}`}>{order.isDelivered ? 'Delivered' : 'Pending'}</span>
              </div>
              <div className="order-products">
                {order.orderItems.map(item => (
                  <div className="order-product" key={item.product}>
                    <img src={item.image} alt={item.name} className="order-product-image" />
                    <div>
                      <div className="product-name">{item.name}</div>
                      <div className="product-qty">Qty: {item.qty}</div>
                      <div className="product-price">₹{item.price.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-total">
                <span>Total:</span> <b>₹{order.totalPrice.toFixed(2)}</b>
              </div>
              {/* Optionally, add a details button */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
