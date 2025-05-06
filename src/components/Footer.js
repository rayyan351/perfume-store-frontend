import React, { useState } from "react";
import "../styles/footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return setMessage("Please enter a valid email.");

    try {
      const res = await fetch("https://perfume-store-backend.onrender.com/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) return setMessage(data.message || "Something went wrong.");
      setMessage("🎉 Thank you for subscribing!");
      setEmail("");
    } catch (err) {
      setMessage("Server error. Try again later.");
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <h2 className="footer-logo">LuxScents</h2>
        <ul className="footer-links">
          <li><a href="/">Home</a></li>
          <li><a href="/perfumes">Perfumes</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
        <div className="footer-socials">
          <a href="/"><i className="fab fa-instagram"></i></a>
          <a href="/"><i className="fab fa-facebook-f"></i></a>
          <a href="/"><i className="fab fa-twitter"></i></a>
        </div>

        <form className="newsletter-form" onSubmit={handleSubscribe}>
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Subscribe</button>
        </form>
        {message && <p className="newsletter-msg">{message}</p>}
      </div>

      <p className="footer-copy">&copy; {new Date().getFullYear()} LuxScents. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
