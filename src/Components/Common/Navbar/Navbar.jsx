import React, { useEffect, useState } from "react";
import { Link, useLocation} from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <nav className={"Navbar" + (scrolled ? " scrolled" : "")}>
      <div className="logo">
        <img src="/logo.png" alt="Logo" />
      </div>
      
      <button 
        className="menu-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <ul className={`navItems ${mobileMenuOpen ? 'active' : ''}`}>
        <li>
          <Link to="/#home" onClick={() => setMobileMenuOpen(false)}>Home</Link>
        </li>
        <li>
          <Link to="/#about" onClick={() => setMobileMenuOpen(false)}>About</Link>
        </li>
        <li>
          <Link to="/#testimonials" onClick={() => setMobileMenuOpen(false)}>Testimonials</Link>
        </li>
        <li>
          <Link to="/#contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
        </li>
        <li>
          <Link to="/new-admission/form" onClick={() => setMobileMenuOpen(false)}>Register</Link>
        </li>
        <li>
          <Link to="/login-student" onClick={() => setMobileMenuOpen(false)}>Login</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
