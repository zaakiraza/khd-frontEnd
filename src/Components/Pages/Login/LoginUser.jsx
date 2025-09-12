import { useState } from "react";
import { Link } from "react-router-dom";
import "./LoginUser.css";

function LoginUser() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("form submitted");
  };

  return (
    <div className="box">
      <div className="content-login">
        <h1>User Login</h1>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginUser;
