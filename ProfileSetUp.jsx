import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    year: "",
    gender: "",
  });
  const [message, setMessage] = useState("");

  // ✅ Fetch existing profile details if available
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setFormData({
            name: response.data.name || "",
            phone: response.data.phone || "",
            year: response.data.year || "",
            gender: response.data.gender || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error.response?.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.put("http://localhost:5000/api/users/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setMessage("Profile saved successfully!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      if (error.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      setMessage("Failed to save profile.");
    }
  };

  return (
    <div className="profile-main">
      <div className="profile-card">
        <h2 style={{ color: "#2F4156", marginBottom: "20px" }}>Set up your Profile</h2>

        {message && (
          <div
            style={{
              marginBottom: "10px",
              color: message.includes("success") ? "green" : "red",
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-fields">
          <label htmlFor="name">Full Name</label>
          <input type="text" name="name" value={formData.name} required onChange={handleChange} />

          <label htmlFor="phone">Phone Number</label>
          <input type="text" name="phone" value={formData.phone} required onChange={handleChange} />

          <label htmlFor="year">Year of Study</label>
          <input type="text" name="year" value={formData.year} required onChange={handleChange} />

          <label htmlFor="gender">Gender</label>
          <select name="gender" value={formData.gender} required onChange={handleChange}>
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button type="submit" className="edit-btn">Save Profile</button>
            <button type="button" onClick={handleSkip} className="edit-btn" style={{ backgroundColor: "#bbb" }}>
              Skip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
