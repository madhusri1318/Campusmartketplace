// Profile.jsx

import React, { useEffect, useState } from "react";
import "../styles/Profile.css";
import SideBar from "../components/SideBar";

function Profile() {
  const [listingTab, setListingTab] = useState("all");
  const [activeTab, setActiveTab] = useState("accept"); // default to Accept Requests
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    year: "",
    gender: "",
  });

  // Requests & Orders Data
  const [myRequests, setMyRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [listings, setListings] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, [token]);

  // Fetch requests, orders, listings
  useEffect(() => {
    const fetchData = async () => {
      try {
        // My requests
        const reqRes = await fetch("http://localhost:5000/api/requests/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyRequests(await reqRes.json());

        // Received requests
        const recRes = await fetch(
          "http://localhost:5000/api/requests/received",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReceivedRequests(await recRes.json());

        // Orders
        const orderRes = await fetch("http://localhost:5000/api/orders/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(await orderRes.json());

        // Listings
        const listRes = await fetch("http://localhost:5000/api/products/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setListings(await listRes.json());
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [token]);

  // Handle profile field changes
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Save profile updates
  const handleSave = async () => {
    try {
      const { name, phone, year, gender } = profile;
      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone, year, gender }),
      });
      const data = await res.json();
      setProfile((prev) => ({
        ...prev,
        name: data.user?.name || name,
        phone: data.user?.phone || phone,
        year: data.user?.year || year,
        gender: data.user?.gender || gender,
      }));
      setEditMode(false);
      setMessage("✅ Profile saved successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
      setMessage("❌ Failed to save profile. Please try again.");
    }
  };

  // Accept / Reject request
  const handleRequestResponse = async (id, action) => {
    try {
      const status = action === "accept" ? "accepted" : "rejected";

      const res = await fetch(`http://localhost:5000/api/requests/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update request");

      setReceivedRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: data.status } : req))
      );
    } catch (err) {
      console.error("Error updating request:", err);
    }
  };

  return (
    <div className="dashboard">
      <SideBar />

      <main className="profile-main">
        {/* Profile Section */}
        <div className="profile-card">
          <div className="profile-header">
            <h2>👤 Profile Details</h2>
            <button
              className="edit-btn"
              onClick={() => {
                if (editMode) handleSave();
                else setEditMode(true);
              }}
            >
              {editMode ? "Save" : "Edit"}
            </button>
          </div>

          {message && <p className="save-message">{message}</p>}

          <div className="profile-info">
            <div className="profile-picture">
              {profile.gender?.toLowerCase() === "female"
                ? "👩"
                : profile.gender?.toLowerCase() === "male"
                ? "🧑"
                : "👤"}
            </div>

            <div className="profile-fields">
              {editMode ? (
                <>
                  <label>
                    Name:{" "}
                    <input name="name" value={profile.name} onChange={handleChange} />
                  </label>
                  <label>
                    Phone:{" "}
                    <input name="phone" value={profile.phone} onChange={handleChange} />
                  </label>
                  <label>Email: <input name="email" value={profile.email} disabled /></label>
                  <label>
                    Year of Study:{" "}
                    <input name="year" value={profile.year} onChange={handleChange} />
                  </label>
                  <label>
                    Gender:{" "}
                    <select name="gender" value={profile.gender} onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                </>
              ) : (
                <>
                  <p><strong>Name:</strong> {profile.name || "Not provided"}</p>
                  <p><strong>Phone:</strong> {profile.phone || "Not provided"}</p>
                  <p><strong>Email:</strong> {profile.email || "Not provided"}</p>
                  <p><strong>Year of Study:</strong> {profile.year || "Not provided"}</p>
                  <p><strong>Gender:</strong> {profile.gender || "Not provided"}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={activeTab === "accept" ? "tab active" : "tab"}
            onClick={() => setActiveTab("accept")}
          >
            Accept Requests
          </button>
          <button
            className={activeTab === "requests" ? "tab active" : "tab"}
            onClick={() => setActiveTab("requests")}
          >
            Requests
          </button>
          <button
            className={activeTab === "orders" ? "tab active" : "tab"}
            onClick={() => setActiveTab("orders")}
          >
            Past Orders
          </button>
          <button
            className={activeTab === "listings" ? "tab active" : "tab"}
            onClick={() => setActiveTab("listings")}
          >
            Your Listings
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Accept Requests */}
          {activeTab === "accept" && (
            <div>
              <h3>📋 Requests to Accept</h3>
              {receivedRequests.length === 0 ? (
                <p>No requests received.</p>
              ) : (
                receivedRequests.map((req) => (
                  <div key={req.id} className="request-card">
                    <p>
                      <strong>{req.buyer_name}</strong> wants{" "}
                      <em>{req.title}</em> (${req.price})
                    </p>
                    <p>Status: {req.status}</p>
                    {req.status === "pending" && (
                      <div>
                        <button onClick={() => handleRequestResponse(req.id, "accept")}>
                          ✅ Accept
                        </button>
                        <button onClick={() => handleRequestResponse(req.id, "reject")}>
                          ❌ Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* My Requests */}
          {activeTab === "requests" && (
            <div>
              <h3>📋 My Requests</h3>
              {myRequests.length === 0 ? (
                <p>No requests made.</p>
              ) : (
                myRequests.map((req) => (
                  <div key={req.id} className="request-card">
                    <p>
                      Requested <em>{req.title}</em> (${req.price})
                    </p>
                    <p>
                      Status: {req.status}{" "}
                      {req.status === "accepted" && (
                        <button
                          className="message-btn"
                          onClick={() =>
                            window.location.href = `/messages?seller=${req.seller_id}`
                          }
                        >
                          💬 Message
                        </button>
                      )}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Past Orders */}
          {activeTab === "orders" && (
            <div>
              <h3>📦 Past Orders</h3>
              {orders.length === 0 ? (
                <p>No past orders.</p>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <p>
                      Bought <em>{order.title}</em> for ${order.price}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Listings */}
          {activeTab === "listings" && (
            <div>
              <h3>📦 Your Listings</h3>
              <div className="listing-filters">
                <button
                  className={`listing-btn ${listingTab === "all" ? "active" : ""}`}
                  onClick={() => setListingTab("all")}
                >
                  All
                </button>
                <button
                  className={`listing-btn ${listingTab === "in-touch" ? "active" : ""}`}
                  onClick={() => setListingTab("in-touch")}
                >
                  In-touch
                </button>
                <button
                  className={`listing-btn ${listingTab === "sold" ? "active" : ""}`}
                  onClick={() => setListingTab("sold")}
                >
                  Sold
                </button>
              </div>

              <div className="listing-results">
                {listingTab === "all" &&
                  listings.map((p) => (
                    <div key={p.id} className="listing-card">
                      <p>
                        <strong>{p.title}</strong> (${p.price})
                      </p>
                    </div>
                  ))}
                {listingTab === "in-touch" && <p>🤝 Items requested by buyers.</p>}
                {listingTab === "sold" && <p>✅ Sold items and status.</p>}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Profile;
