import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/token", new URLSearchParams({
        username,
        password
      }), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });

      setToken(response.data.access_token);
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("username", username);  // Save username in localStorage
      navigate("/"); //redirect to dashboard page after login  
    } catch (error) {
      setError("Invalid credentials");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
