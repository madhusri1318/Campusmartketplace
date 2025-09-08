import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SideBar from '../components/SideBar';
import '../styles/ProductPage.css';

function ProductPage() {
  const { id } = useParams(); // Product ID from route
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reqMsg, setReqMsg] = useState('');
  const [reqBusy, setReqBusy] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ Fetch current user from token
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/verify', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        }
      } catch (err) {
        console.error('User verify failed', err);
      }
    };
    verifyUser();
  }, []);

  // ✅ Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleGoBack = () => navigate('/dashboard');

  const handleRequest = async () => {
    try {
      setReqBusy(true);
      setReqMsg('');
      const res = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ product_id: product.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send request');
      setReqMsg('✅ Request sent to the seller!');
    } catch (e) {
      setReqMsg(`❌ ${e.message}`);
    } finally {
      setReqBusy(false);
    }
  };

  if (loading)
    return (
      <div className="dashboard">
        <SideBar />
        <p>Loading product...</p>
      </div>
    );

  if (error)
    return (
      <div className="dashboard">
        <SideBar />
        <p>Error: {error}</p>
      </div>
    );

  const { title, image_url, price, category, condition, description } = product;

  const isOwner = currentUser && product.seller_id === currentUser.id;

  return (
    <div className="dashboard">
      <SideBar />
      <div className="prod-container">
        <div className="prod-card">
          <div className="prod-left">
            <div
              className="prod-image"
              style={{
                backgroundImage: `url(http://localhost:5000${image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="prod-price">₹{Number(price).toFixed(2)}</div>

            {/* ✅ Request button */}
            {!isOwner ? (
              <>
                <button
                  className="contact-button"
                  onClick={handleRequest}
                  disabled={reqBusy}
                >
                  {reqBusy ? 'Sending...' : 'Request to Buy'}
                </button>
                {reqMsg && <p style={{ marginTop: 8 }}>{reqMsg}</p>}
              </>
            ) : (
              <p style={{ marginTop: 8, fontWeight: 'bold', color: 'gray' }}>
                ⚠️ You cannot request your own product
              </p>
            )}
          </div>

          <div className="prod-right">
            <h2 className="prod-title">{title}</h2>
            <div className="prod-description">{description}</div>

            <div className="prod-meta">
              <div className="meta-row">
                <span className="meta-label">📚 Category:</span>
                <span className="meta-value">{category}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">🛠 Condition:</span>
                <span className="meta-value">{condition}</span>
              </div>
            </div>

            <div className="back-button-wrapper">
              <button className="back-button" onClick={handleGoBack}>
                ← Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
