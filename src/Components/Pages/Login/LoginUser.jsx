import React from "react";
import { Link } from "react-router-dom";

function LoginUser() {
  return (
    <div>
      <h1>Login</h1>
      <form>
        <div>
          <label>Email:</label>
          <input type="email" />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" />
        </div>
        <button type="submit">Login</button>
      </form>
      <Link to="/home">Home</Link>
    </div>
  );
}

export default LoginUser;
