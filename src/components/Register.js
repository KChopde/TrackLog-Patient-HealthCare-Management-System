import React, { useState } from "react";
import api from "./Api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/auth/register', { email: email, password: password }, 
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage("✅ " + response.data.message);
      setTimeout(() => {
        setMessage("");
        navigate("/login");
      }, 3000);

    } catch (error) {
      console.error("❌ Registration Error:", error);

      if (error.response?.status === 400 && error.response.data?.error?.includes("taken")) {
        setMessage("❌ Username is already taken, please choose another one.");
      } else {
        setMessage("❌ Registration failed. Please try again later.");
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleRegister}>
        <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
