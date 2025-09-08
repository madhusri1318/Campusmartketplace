import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignUpPage.css';
import signupIllustration from '../assets/signup-illustration.jpg';

export default function SignUpPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreed: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.includes('@vitapstudent.ac.in')) {
      alert('Please use your college email address.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Save JWT token to localStorage
        localStorage.setItem('token', data.token);

        alert('Sign up successful!');
        navigate('/ProfileSetUp'); // ✅ Redirect to profile setup
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error signing up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        {/* Left Panel */}
        <div className="signup-left">
          <img src={signupIllustration} alt="College illustration" />
          <h2>Join Your College Community</h2>
          <p>
            Connect with students, share resources, and build lasting friendships
            in your academic journey.
          </p>
        </div>

        {/* Right Panel */}
        <div className="signup-right">
          <form className="signup-form" onSubmit={handleSubmit}>
            <h1>Sign Up</h1>
            <p>Create your account to get started</p>

            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Should match your college email ID"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="password">Create Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="agreed"
                name="agreed"
                checked={formData.agreed}
                onChange={handleChange}
              />
              <a href="/terms">Terms & Conditions</a>
            </div>

            <button type="submit" disabled={!formData.agreed || loading}>
              {loading ? 'Signing up...' : 'Join Us →'}
            </button>

            <p className="signin-link">
              Already have an account?{' '}
              <span onClick={() => navigate('/login')}>Sign In</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
