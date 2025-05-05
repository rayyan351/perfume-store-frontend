import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart} from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "../styles/navbar.css";

const Navbar = () => {
  const { auth, logout } = useAuth();
  const { cartItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      logout();
      setLoggingOut(false);
      navigate("/login");
    }, 1000);
  };

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Perfumes", to: "/perfumes" },
    { label: "Contact", to: "/contact" },
    { label: "My Orders", to: "/orders" },
  ];

  return (
    <>
      <nav className="navbar">
      <motion.h1
      className="logo"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      >
      LuxScents
      </motion.h1>


        <div
       className={`hamburger ${menuOpen ? "open" : ""}`}
       onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
        </div>

        <ul className="nav-links desktop-nav">
          {navItems.map((item) => (
            <li key={item.to} className={location.pathname === item.to ? "active" : ""}>
              <Link to={item.to}>{item.label}</Link>
            </li>
          ))}
          <li>
            <Link to="/cart" className="cart-link">
              <FaShoppingCart />
              Cart
              {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
            </Link>
          </li>
          {auth ? (
            <>
              <li>
                <button onClick={handleLogout} disabled={loggingOut}>
                {loggingOut ? <>Logging out</> : "Logout"}
                </button>
              </li>
              <li><span>Welcome, {auth.user.name}</span></li>
            </>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}
        </ul>
      </nav>

      {menuOpen && (
        <>
          <ul className="mobile-nav">
            {navItems.map((item) => (
              <li key={item.to} className={location.pathname === item.to ? "active" : ""}>
                <Link to={item.to} onClick={() => setMenuOpen(false)}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link to="/cart" className="cart-link" onClick={() => setMenuOpen(false)}>
                <FaShoppingCart />
                Cart
                {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
              </Link>
            </li>
            {auth ? (
              <>
                <li>
                  <button onClick={handleLogout} disabled={loggingOut}>
                  {loggingOut ? <>Logging out</> : "Logout"}
                  </button>
                </li>
                <li><span>Welcome, {auth.user.name}</span></li>
              </>
            ) : (
              <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
            )}
          </ul>
          <div className="menu-overlay" onClick={() => setMenuOpen(false)} />
        </>
      )}
    </>
  );
};

export default Navbar;
