import React from 'react';
import { useState } from "react";
import './style.css';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AddPatient from './components/AddPatient';
import EditPatient from './components/EditPatient';
import MapReduceQuery from './components/MapReduceQuery';
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import PatientHistory from './components/PatientHistory';

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  return (
    <Router basename="/TrackLog-Patient-HealthCare-Management-System">
      <div className="App">
        <header className="App-header">
          <h1>TrackLog</h1><h2>Healthcare Patient Management System</h2>
             
        </header>

        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/" element={<PrivateRoute><Dashboard /> </PrivateRoute>}/>
          <Route path="/add" element={<PrivateRoute><AddPatient /></PrivateRoute>} />
          <Route path="/edit/:id" element={<PrivateRoute><EditPatient /></PrivateRoute>} />
          <Route path="/mapreduce" element={<PrivateRoute><MapReduceQuery /></PrivateRoute>} />
          <Route path="/patient/:id" element={<PatientHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
