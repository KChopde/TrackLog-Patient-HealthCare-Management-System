import React, { useState } from 'react';
import axios from 'axios';
import api from './Api';


const MapReduceQueryForm = () => {
  // State to manage the input fields
  const [disease, setDisease] = useState('');
  const [age, setAge] = useState('');
  const [gender,setGender]=useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //Handle for gender change
  const handleGenderChange=(event)=>{
    setGender(event.target.value)
  }

  // Handler for disease change
  const handleDiseaseChange = (event) => {
    setDisease(event.target.value);
  };

  // Handler for year change
  const handleAgeChange = (event) => {
    setAge(event.target.value);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Send request to backend to execute map-reduce query
      const response = await api.get('/api/map-reduce-query',{params:{ disease, age, gender} });
      setResult(response.data);
    } catch (err) {
      setError('An error occurred while fetching the data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="map-reduce-query-form">
      <h2>Analytics for Healthcare Data</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="disease">Disease:</label>
          <select
            id="disease"
            value={disease}
            onChange={handleDiseaseChange}
            required
          >
            <option value="">Select a Disease</option>
            <option value="Heart Disease">Heart Disease</option>
            <option value="Hypertension">Hypertension</option>
            <option value="Asthma">Asthma</option>
            <option value="COPD (Chronic Obstructive Pulmonary Disease)">COPD (Chronic Obstructive Pulmonary Disease)</option>
            <option value="Pneumonia">Pneumonia</option>
            <option value="COVID-19">COVID-19</option>
            <option value="Alzheimer's Disease">Alzheimer's Disease</option>
            <option value="Parkinson's Disease">Parkinson's Disease</option>
            <option value="Type 1 Diabetes">Type 1 Diabetes</option>
            <option value="Type 2 Diabetes">Type 2 Diabetes</option>
            <option value="Lung Cancer">Lung Cancer</option>
            <option value="Breast Cancer">Breast Cancer</option>
            <option value="Depression">Depression</option>
            <option value="Anxiety">Anxiety</option>
            <option value="Insomnia">Insomnia</option>
            <option value="Chronic Kidney Disease">Chronic Kidney Disease</option>
            <option value="Osteoarthritis">Osteoarthritis</option>
            
      

            {/* Add more diseases as needed */}
          </select>
        </div>

        <div className="form-group">
        <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={handleAgeChange}
            required
            min="1"  // Optional: Ensure age is positive
          />

        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender:</label>
          <select id="gender" value={gender} onChange={handleGenderChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>

      {/* Display results or error */}
        {error && <p className="error">{error}</p>}
  {result && (
    <div className="result">
      <h3>Patient Count for "{disease}" by Gender:</h3>
      <table className="result-table">
        <thead>
          <tr>
            <th>Disease</th>
            <th>Gender</th>
            <th>Patient Count</th>
          </tr>
        </thead>
        <tbody>
          {result.map((entry, index) => (
            <tr key={index}>
              <td>{entry.disease}</td>
              <td>{entry.gender}</td>
              <td>{entry.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}  

    </div>
  );
};

export default MapReduceQueryForm;
