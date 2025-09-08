// Dashboard.jsx

import React, { useEffect, useState } from 'react';
import '../styles/Dashboard.css';
import SideBar from '../components/SideBar';
import ProductCard from "../components/ProductCard";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // ✅ Fetch products
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  // ✅ Filtering
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product =>
        product.category === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  return (
    <div className="dashboard">
      <SideBar />
      <main className="main">
        {/* ✅ Search & Filter */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="What are you looking for..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>🔍</button>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Books">Books</option>
          </select>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
            }}
            style={{ marginLeft: '10px' }}
          >
            Clear Filters
          </button>
        </div>

        {/* ✅ Product Grid */}
        <div className="dashboard-container">
          <div className="product-grid">
            {filteredProducts.length === 0 ? (
              <p>No products found.</p>
            ) : (
              filteredProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  id={item.id}
                  name={item.title}
                  price={`₹${item.price}`}   // ✅ Correct interpolation
                  image={`http://localhost:5000${item.image_url}`} // ✅ Correct interpolation
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
