import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddPatient() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [disease, setDisease] = useState('');
  const [admissionDate, setAdmissionDate] = useState('');
  const [medicalHistory, setMedicalHistory] = useState([]); // Start with an array

  
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate age
    if (age <= 0 || age > 120) {
      alert("Please enter a valid age.");
      return;
    }
    
    // Create new patient object
    const newPatient = {
      name,
      age,
      gender,
      disease,
      admission_date: admissionDate,
      medical_history: medicalHistory,
    };

    // Send data to backend via POST
    axios.post('http://localhost:5000/patients', newPatient, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(() => {
      navigate('/'); // Redirect to the main dashboard after adding the patient
    })
    .catch((error) => {
      console.error("There was an error adding the patient:", error);
      alert("Failed to add patient. Please try again.");
    });
  };

// Handle medical history input change
const handleMedicalHistoryChange = (e) => {
  const value = e.target.value;
  
  // Directly update the value (no splitting or formatting here yet)
  setMedicalHistory(value); // Keep it as a simple string
};

  return (
    <div>
      <h2>Add New Patient</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input 
          type="text" 
          id="name"
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          placeholder="Enter patient's name"
        />
        
        <label htmlFor="age">Age:</label>
        <input 
          type="number" 
          id="age"
          value={age} 
          onChange={(e) => setAge(e.target.value)} 
          required 
          placeholder="Enter age" 
          min="0" max="120"
        />
        
        <label htmlFor="gender">Gender:</label>
        <select 
          id="gender" 
          value={gender} 
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        
        <label htmlFor="disease">Disease:</label>
        <input 
          type="text" 
          id="disease"
          value={disease} 
          onChange={(e) => setDisease(e.target.value)} 
          required 
          placeholder="Enter disease name"
        />
        
        <label htmlFor="admissionDate">Admission Date:</label>
        <input 
          type="date" 
          id="admissionDate"
          value={admissionDate} 
          onChange={(e) => setAdmissionDate(e.target.value)} 
          required 
        />
        
        <label htmlFor="medicalHistory">Medical History (Comma Separated):</label>
        <input 
          type="text" 
          id="medicalHistory"
          value={medicalHistory}
          onChange={handleMedicalHistoryChange} // Update array as user types
          placeholder="Enter medical history, e.g., diabetes, hypertension"
        />
        
        <button type="submit">Add Patient</button>
      </form>
    </div>
  );
}

export default AddPatient;
