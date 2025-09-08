// productCard.jsx

import React from 'react';
import '../styles/ProductCard.css';
import { useNavigate } from 'react-router-dom';

function ProductCard({ id, name, price, image }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to add items to cart.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: id,
          quantity: 1,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Item added to cart!');
      } else {
        alert(data?.error || '❌ Failed to add item to cart.');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="product-card">
      <div className="product-header">
        <span className="available">Available</span>
      </div>

      <div className="product-body">
        <div className="product-image-wrapper">
          <img src={image} alt={name} className="product-image" />
        </div>
        <div className="product-name">{name}</div>
        <div className="product-price">{price}</div>
      </div>

      <div className="product-actions">
        <button onClick={handleViewDetails} className="details">See Details</button>
        <button onClick={handleAddToCart} className="add-cart">Add to Cart</button>
      </div>
    </div>
  );
}

export default ProductCard;