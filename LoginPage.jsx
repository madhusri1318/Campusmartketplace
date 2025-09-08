import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const togglePassword = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
  e.preventDefault();

  // ✅ Clear previous session
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      console.log("Login successful:", data);

      // ✅ Save token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Redirect to dashboard
      navigate("/dashboard");
    } else {
      setErrorMessage(data.message || "Login failed");
    }
  } catch (err) {
    console.error("Login error:", err);
    setErrorMessage("Server error. Please try again later.");
  }
};


  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* Left Panel */}
        <div className="login-form-panel">
          <div className="welcome-message">
            <div className="welcome-title">
              <h1>Welcome Back</h1>
              <span className="heart-icon">❤</span>
            </div>
            <p>Sign in to your campus marketplace account</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div>
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="college email (should verify)"
              />
            </div>

            <div>
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="toggle-password"
                >
                  {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
            </div>

            <div className="remember-me">
              <input type="checkbox" />
              <label>Remember me</label>
            </div>

            {errorMessage && (
              <p className="error-message">{errorMessage}</p>
            )}

            <button type="submit" className="login-button">
              Login
            </button>
          </form>

          <div className="footer-links">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="link-text">Sign up</Link>
            </p>
            <Link to="#" className="forgot-password">Forgot your password?</Link>
          </div>
        </div>

        {/* Right Panel */}
        <div className="illustration-panel">
          <div className="illustration-box">
            <div className="illustration-placeholder"></div>
            <h2>Campus Marketplace</h2>
            <p>Buy, sell, and connect with your college community</p>
          </div>
        </div>
      </div>
    </div>
  );
}