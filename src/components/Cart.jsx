// Cart.jsx

import React, { useEffect, useState } from 'react';
import '../styles/Cart.css';
import SideBar from '../components/SideBar';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to view your cart.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setCartItems(data);
      } else {
        alert(data?.error || 'Failed to load cart items');
      }
    } catch (err) {
      console.error('Fetch cart error:', err);
      alert('Error loading cart');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setCartItems(cartItems.filter((item) => item.id !== id));
        alert('🗑 Item removed');
      } else {
        const data = await res.json();
        alert(data?.error || 'Delete failed');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Something went wrong');
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <div className="dashboard">
      <SideBar />
      <main className="cart-main">
        <h1 className="cart-title">🛒🛍✨ In your cart</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="cart-grid">
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div className="cart-card" key={item.id}>
                  <img
                    src={`http://localhost:5000${item.product.image}`}
                    alt={item.product.name}
                    className="cart-image"
                  />
                  <div className="cart-name">{item.product.name}</div>
                  <div className="cart-price">${item.product.price}</div>
                  <div className="cart-qty">Qty: {item.quantity}</div>
                  <button className="cart-button">Continue Buying ➤</button>
                  <button
                    className="cart-delete"
                    onClick={() => handleDelete(item.id)}
                  >
                    🗑 Delete from Cart
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;