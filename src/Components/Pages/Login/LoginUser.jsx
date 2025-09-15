import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginUser.css";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const BASEURL = import.meta.env.VITE_BASEURL;
  const logo = "/logo.png";

  const formHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!email || !password) {
      setMessage("All fields are required");
      setIsSubmitting(false);
      return;
    }
    try {
      const api = await axios.post(`${BASEURL}/auth/login`, {
        email,
        password,
      });
      setMessage(api.data.message);
      console.log(api.data.message);
      if (api.data.status) {
        localStorage.setItem("token", api.data.data);
        navigate("/UserDashboard");
      }

      setMessage(api.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="main">
      <div className="form_box">
        <div className="logo">
          <img src={logo} alt="" />
          <h1>Khuddam User Login</h1>
        </div>
        <form className="form_user" onSubmit={formHandler}>
          <input
            type="email"
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* <button className="btnLogin">Login</button> */}
          <input
            className="btnLogin"
            type="submit"
            value={isSubmitting ? "Login..." : "Login"}
            disabled={isSubmitting}
            style={isSubmitting ? { opacity: 0.7, cursor: "not-allowed" } : {}}
          />
        </form>
        <Link className="lst_anker" to={"/"}>
          Back To Home
        </Link>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Login;
