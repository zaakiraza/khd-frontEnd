import React, { useEffect, useState } from "react";
import "./Footer.css";
import { Link, useLocation } from "react-router-dom";
import api from "../../../../utils/api";

const Footer = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace("#", ""));
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await api.post('/newsletter/subscribe', { email });
      
      if (response.status === 200 || response.status === 201) {
        setMessage("✅ " + response.data.message);
        setEmail("");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      const errorMessage = error.response?.data?.message || "Something went wrong. Please try again later.";
      setMessage("❌ " + errorMessage);
    } finally {
      setIsSubmitting(false);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage("");
      }, 5000);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Logo Section */}
          <div className="footer-section">
            <div className="footer-logo">
              <img src="/logo.png" alt="Khuddam Logo" className="logo-img" />
            </div>
            <h3>Subscribe to our newsletter</h3>
            <form onSubmit={handleNewsletterSubmit}>
              <input 
                type="email" 
                placeholder="Enter Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <i className="fa-solid fa-spinner fa-spin"></i>
                ) : (
                  <i className="fa-solid fa-arrow-right"></i>
                )}
              </button>
            </form>
            {message && (
              <div className={`newsletter-message ${message.startsWith('✅') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/#home">Home</Link>
              </li>
              <li>
                <Link to="/#about">About</Link>
              </li>
              <li>
                <Link to="/#testimonials">Testimonials</Link>
              </li>
              <li>
                <Link to="/#contact">Contact</Link>
              </li>
              <li>
                <Link to="/new-admission/form">Register</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4>Services</h4>
            <ul className="footer-links">
              <li>
                <Link to="/UserDashboard">Student Portal</Link>
              </li>
              <li>
                <Link to="/new-admission/form">Online Forms</Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <div className="contact-item">
                <i className="fa-brands fa-whatsapp"></i>
                <a href="tel:+923002504457">
                  <strong> +92-300-2504457</strong>
                </a>
              </div>
              <div className="contact-item">
                <i className="fa-brands fa-whatsapp"></i>
                <a href="tel:+923222116921">
                  <strong>+92-322-2116921</strong>
                </a>
              </div>
              <div className="contact-item">
                <i className="fa-solid fa-envelope"></i>
                <a href="mailto:info@khuddam.edu">
                  <strong>info@khuddam.edu</strong>
                </a>
              </div>
              <div className="contact-item">
                <i className="fa-solid fa-earth-americas"></i>
                <a href="http://www.khuddam.edu">
                  <strong>www.khuddam.edu</strong>
                </a>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="social-links">
              <a
                href="https://www.facebook.com/khuddamonline?mibextid=ZbWKwL"
                className="social-link facebook"
                target="_blank"
              >
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a href="mailto:info@khuddam.edu" className="social-link mail">
                <i className="fa-solid fa-envelope"></i>
              </a>
              <a
                href="https://www.youtube.com/@khuddamlearningonline"
                className="social-link youtube"
                target="_blank"
              >
                <i className="fa-brands fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>&copy; 2024 Khuddam Educational Institute. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
