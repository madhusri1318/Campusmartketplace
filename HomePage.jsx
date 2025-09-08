import React, { useState } from 'react';
import '../styles/HomePage.css';
import { Link } from 'react-router-dom';
import axios from 'axios'; 

import logo from '../assets/logo.png';
import books from '../assets/books.png';
import laptop from '../assets/laptop.png';
import bag from '../assets/bag.png';

const HomePage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const res = await axios.post('http://localhost:5000/api/contact/send', formData);
      setStatus('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('Failed to send message. Please try again.');
    }
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="CampusMarket Logo" className="navbar-logo" />
          <span className="navbar-title">CampusMarket</span>
        </div>
        <div className="navbar-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact Us</a>
        </div>
        <Link to="/login" className="login-button">Login</Link>
      </nav>

      {/* Main Section */}
      <div className="homepage" id="home">
        <div className="homepage-content">
          <h1>Buy & Sell within <br /> Your Campus!</h1>
          <p>Save money. Build trust. Empower your campus community.</p>
          <Link to="/login" className="shop-now">Shop Now</Link>
        </div>

        <div className="info-box">
          <div className="icons">
            <img src={books} alt="Books" />
            <img src={laptop} alt="Laptop" />
            <img src={bag} alt="Bag" />
          </div>
          <h3>Students Helping Students</h3>
          <p>
            Find textbooks, electronics, and essentials from trusted peers on your campus.
          </p>
        </div>
      </div>

      {/* About Section */}
      <section className="about-section" id="about">
        <h2>About Us</h2>
        <p>
          CampusMarket is a student-focused platform that allows college students to buy, sell,
          and exchange essentials within their campus. We aim to create a trusted, hyperlocal
          environment where students can find books, electronics, and other supplies easily.
        </p>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact">
        <h2>Contact Us</h2>
        <p>If you have any questions, suggestions, or need support, feel free to reach out!</p>
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit">Send Message</button>
          {status && <p className="form-status">{status}</p>}
        </form>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-logo">🎓 CampusMarket</div>
        <p>&copy; {new Date().getFullYear()} CampusMarket. Empowering student communities, one transaction at a time.</p>
      </footer>
    </div>
  );
};

export default HomePage;
