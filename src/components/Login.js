// components/Login.js
import React, { useState } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import api from './Api';

function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('auth/token', { username: email, password });  // Send email as 'username'
      
      const { access_token, email: userEmail } = res.data;  // Destructure email and token from the response
      if (access_token && userEmail) {
        // Store token and email in localStorage
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('email', userEmail);  // Store email instead of username
      }

      setToken(access_token);
      navigate('/');  // Navigate to the home page or dashboard
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
};
  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
        /><br/>
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={e => setPassword(e.target.value)}
        /><br/>
        <button type="submit">Login</button>
      </form>
      <p style={{textAlign:"center"}}>
        Don’t have an account? <Link to="/register" style={{padding:"20px"}}>Register here</Link>
      </p>
    </div>
  );
}

export default Login;
