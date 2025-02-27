import React from 'react';
import './style.css';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AddPatient from './components/AddPatient';
import EditPatient from './components/EditPatient';
import MapReduceQuery from './components/MapReduceQuery';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Patient TrackLog</h1><h2>Healthcare Patient Management System</h2>
             
        </header>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddPatient />} />
          <Route path="/edit/:id" element={<EditPatient />} />
          <Route path="/mapreduce" element={<MapReduceQuery />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
