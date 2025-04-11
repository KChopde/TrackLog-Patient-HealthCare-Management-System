import React, { useState } from 'react';
import axios from 'axios';
import api from './Api';


const MapReduceQueryForm = () => {
  // State to manage the input fields
  const [disease, setDisease] = useState('');
  const [year, setYear] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handler for disease change
  const handleDiseaseChange = (event) => {
    setDisease(event.target.value);
  };

  // Handler for year change
  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Send request to backend to execute map-reduce query
      const response = await api.post('/api/map-reduce-query',{ disease, year });
      setResult(response.data);
    } catch (err) {
      setError('An error occurred while fetching the data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="map-reduce-query-form">
      <h2>Map-Reduce Query for Healthcare Data</h2>
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
            <option value="Diabetes">Diabetes</option>
            <option value="Cancer">Cancer</option>
            <option value="Heart Disease">Heart Disease</option>
            <option value="Asthma">Asthma</option>
            <option value="Diabetes">Diabetes</option>
            <option value="Hypertension">Hypertension</option>
            <option value="Stroke">Stroke</option>
            <option value="Chronic Kidney Disease">Chronic Kidney Disease</option>
            <option value="Alzheimer's Disease">Alzheimer's Disease</option>
            <option value="Parkinson's Disease">Parkinson's Disease</option>
            <option value="Tuberculosis">Tuberculosis</option>
            <option value="Pneumonia">Pneumonia</option>
            <option value="HIV/AIDS">HIV/AIDS</option>
            <option value="Arthritis">Arthritis</option>
            <option value="Liver Disease">Liver Disease</option>
            <option value="COPD (Chronic Obstructive Pulmonary Disease)">COPD (Chronic Obstructive Pulmonary Disease)</option>
            <option value="Epilepsy">Epilepsy</option>
            <option value="Influenza">Influenza</option>
            <option value="COVID-19">COVID-19</option>
            <option value="Mental Health Disorders">Mental Health Disorders</option>
            <option value="Anxiety">Anxiety</option>

            {/* Add more diseases as needed */}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="year">Year:</label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={handleYearChange}
            required
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>

      {/* Display results or error */}
      {error && <p className="error">{error}</p>}
      {result && (
        <div className="result">
          <h3>Query Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default MapReduceQueryForm;
