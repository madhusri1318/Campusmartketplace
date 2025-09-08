// SideBar.jsx

import React, { useState } from 'react';
import '../styles/SideBar.css';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaHome, FaUser, FaShoppingBag, FaShoppingCart,
  FaEnvelope, FaBell, FaHeadset, FaSignOutAlt, FaBars
} from 'react-icons/fa';

function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { label: 'Home', icon: <FaHome />, path: '/dashboard' },
    { label: 'Profile', icon: <FaUser />, path: '/profile' },
    { label: 'Sell Items', icon: <FaShoppingBag />, path: '/sellitems' },
    { label: 'Cart', icon: <FaShoppingCart />, path: '/cart' },
    { label: 'Messages', icon: <FaEnvelope />, path: '/messages' },
    { label: 'Notifications', icon: <FaBell />, path: '/notifications' },
    { label: 'Support', icon: <FaHeadset />, path: '/support' },
  ];

  const handleLogout = () => {
    // TODO : handle actual logout function
     if (window.confirm('Are you sure you want to logout?')) {
      localStorage.clear();
      navigate('/');
     }
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-top">
        <div className="menu-header">
          {!collapsed && <h2>Main Menu</h2>}
          <FaBars className="toggle-btn" onClick={() => setCollapsed(!collapsed)} />
        </div>
        <ul className="sidebar-menu">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : ''}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {!collapsed && <span className="sidebar-label">{item.label}</span>}
            </li>
          ))}
        </ul>
        
      </div>
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <FaSignOutAlt className="sidebar-icon" />
          {!collapsed && 'Logout'}
        </button>
    </aside>
  );
}

export default SideBar;