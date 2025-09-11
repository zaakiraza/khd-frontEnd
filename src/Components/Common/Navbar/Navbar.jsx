import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="Navbar">
      <div className="logo">
        <img src="/logo.png" alt="Logo" />
      </div>
      <ul className="navItems">
        <li>
          <button>English</button>
        </li>
        <li>
          <button>Urdu</button>
        </li>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/testimonials">Testimonials</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>
          <Link to="/new-admission/form">Register</Link>
        </li>
        <li>
          <Link to="/login-student">Login</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
