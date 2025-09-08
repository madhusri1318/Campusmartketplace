// SellItems.jsx

import React, { useState, useRef } from 'react';
import SideBar from "../components/SideBar";
import '../styles/SellItems.css';

function SellItems() {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleImageChange = (file) => {
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleButtonClick = () => {
    inputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('condition', condition);
    formData.append('image', imageFile);

    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // ✅ Add token if protected route
        },
        body: formData,
      });

      if (res.ok) {
        const result = await res.json();
        alert("✅ Product uploaded successfully!");
        console.log(result);

        // Reset form
        setTitle('');
        setDescription('');
        setPrice('');
        setCategory('');
        setCondition('');
        setImageFile(null);
        setImagePreview(null);
      } else {
        alert("❌ Failed to upload product");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error uploading product");
    }
  };

  return (
    <div className="dashboard">
      <SideBar />
      <div className="main-content">
        <div className="form-wrapper">
          <h2 className="form-title">Sell Items Page</h2>
          <form className="sell-form" onSubmit={handleSubmit}>
            
            {/* Image Upload */}
            <div className="form-group">
              <label>Media</label>
              <div
                className={`drop-area ${dragActive ? 'active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <p>Drop image files to upload</p>
                <span>or</span>
                <button type="button" className="select-btn" onClick={handleButtonClick}>
                  Select Files
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={inputRef}
                  style={{ display: 'none' }}
                  onChange={(e) => handleImageChange(e.target.files[0])}
                />
                <p className="file-note">Only image files | Max size: 5MB</p>
              </div>
              {imagePreview && (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="preview" className="preview-image" />
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                  >
                    x
                  </button>
                </div>
              )}
            </div>

            {/* Title */}
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter the product title"
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the product"
                required
              ></textarea>
              <button type="button" className="ai-generate">
                ⭐ Generate using AI
              </button>
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Choose the product category</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Books">Books</option>
              </select>
            </div>

            {/* Price */}
            <div className="form-group">
              <label htmlFor="price">Pricing</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price in ₹"
                required
              />
            </div>

            {/* Condition */}
            <div className="form-group">
              <label>Condition</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="condition"
                    value="Used"
                    checked={condition === 'Used'}
                    onChange={() => setCondition('Used')}
                  /> Used
                </label>
                <label>
                  <input
                    type="radio"
                    name="condition"
                    value="Not Used"
                    checked={condition === 'Not Used'}
                    onChange={() => setCondition('Not Used')}
                  /> Not Used
                </label>
              </div>
            </div>

            <button type="submit" className="upload-button">Upload Product</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SellItems;
