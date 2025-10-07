import React, { useEffect, useState } from "react";
import "./Footer.css";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
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
            <form>
              <input type="email" placeholder="Enter Email" />
              <button type="submit">
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </form>
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
              <li>
                <Link to="/login-student">Login</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4>Services</h4>
            <ul className="footer-links">
              <li>
                <a href="/UserDashboard">Student Portal</a>
              </li>
              <li>
                <a href="/new-admission/form">Online Forms</a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <div className="contact-item">
                <i className="fa-brands fa-whatsapp"></i>
                <p>+92-300-2504457</p>
              </div>
              <div className="contact-item">
                <i className="fa-brands fa-whatsapp"></i>
                <p>+92-322-2116921</p>
              </div>
              <div className="contact-item">
                <i className="fa-solid fa-envelope"></i>
                <p>info@khuddam.edu</p>
              </div>
              <div className="contact-item">
                <i className="fa-solid fa-earth-americas"></i>
                <p>www.khuddam.edu</p>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="social-links">
              <a href="#" className="social-link youtube">
                <i className="fa-brands fa-youtube"></i>
              </a>
              <a href="#" className="social-link facebook">
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a href="#" className="social-link mail">
                <i className="fa-solid fa-envelope"></i>
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
