import React, { useState } from "react";
import "../styles/auth.css";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login: setAuth } = useAuth();
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
    setFormData({ name: "", email: "", password: "" });
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};

    if (isRegistering) {
      if (!/^[A-Za-z\s]+$/.test(formData.name)) {
        newErrors.name = "Name must contain only letters and spaces.";
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must be at least 8 characters, with atleast an uppercase character, a lowercase character, a number, and a special character.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" })); // clear on input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const endpoint = isRegistering ? "register" : "login";
    setLoading(true);
    setSuccessMessage("");

    try {
      const res = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        return alert(data.message || "Something went wrong");
      }

      setTimeout(() => {
        setLoading(false);
        setShowSuccessScreen(true);

        if (isRegistering) {
          setSuccessMessage("✅ Registered successfully! Please log in.");
          setTimeout(() => {
            setShowSuccessScreen(false);
            toggleForm();
          }, 2500);
        } else {
          setAuth(data);
          setSuccessMessage("✅ Logged in successfully! Redirecting...");
          setTimeout(() => {
            navigate("/");
          }, 2500);
        }
      }, 1000);
    } catch (err) {
      alert("Server error");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {loading && (
        <div className="full-loader">
          <div className="loader-spinner"></div>
          <p>{isRegistering ? "Signing you up..." : "Logging you in..."}</p>
        </div>
      )}

      {showSuccessScreen && (
        <motion.div className="success-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="success-box">
            <p>{successMessage}</p>
          </div>
        </motion.div>
      )}

      {!loading && !showSuccessScreen && (
        <motion.div className="auth-box" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <h2>{isRegistering ? "Create Account" : "Welcome Back"}</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            {isRegistering && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && <p className="auth-msg error">{errors.name}</p>}
              </>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="auth-msg error">{errors.email}</p>}

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="password-input"
              />
              <button
                type="button"
                className="toggle-eye"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>
            {errors.password && <p className="auth-msg error">{errors.password}</p>}

            <p className="forgot-password">
              <Link className="forgot-password" to="/forgot-password">Forgot Password?</Link>
            </p>

            <button type="submit" className="btn-primary" disabled={loading}>
              {isRegistering ? "Register" : "Login"}
            </button>
          </form>

          <p onClick={toggleForm} className="switch-link">
            {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default LoginPage;
