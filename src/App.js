import React from 'react';
import { useState ,useEffect} from "react";
import './style.css';
import './App.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AddPatient from './components/AddPatient';
import EditPatient from './components/EditPatient';
import MapReduceQuery from './components/MapReduceQuery';
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import PatientHistory from './components/PatientHistory';
import Register from './components/Register';

function App() {
  const [access_token, setToken] = useState(localStorage.getItem("access_token"));

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) setToken(storedToken);
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>TrackLog</h1><h2>Healthcare Patient Management System</h2>
             
        </header>
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />}/>
          <Route path="/register" element={<Register/>} />
          <Route path="/add" element={<PrivateRoute><AddPatient /></PrivateRoute>} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>}/>
          <Route path="/edit/:id" element={<PrivateRoute><EditPatient /></PrivateRoute>} />
          <Route path="/mapreduce" element={<PrivateRoute><MapReduceQuery /></PrivateRoute>} />
          <Route path="/patient/:id" element={<PrivateRoute><PatientHistory/></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;