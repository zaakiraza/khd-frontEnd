import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
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
    <nav className={"Navbar" + (scrolled ? " scrolled" : "")}>
      <div className="logo">
        <img src="/logo.png" alt="Logo" />
      </div>
      <ul className="navItems">
        <li>
          <button>Urdu</button>
        </li>
        <li>
          <button>English</button>
        </li>
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
    </nav>
  );
}

export default Navbar;
