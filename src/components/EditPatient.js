import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditPatient() {
  const [patient, setPatient] = useState(null);
  const { id } = useParams();  // Get the patient id from the URL
  const navigate = useNavigate();
  const [message, setMessage] = useState(""); // State for success message

  useEffect(() => {
    // Fetch patient data based on the patient id from the URL
    axios.get(`http://localhost:5000/patients/${id}`)
      .then(response => {
        setPatient(response.data);  // Update state with the fetched patient data
      })
      .catch(error => {
        console.error("Error fetching patient data:", error);  // Log any error that occurs
      });
  }, [id]);  // Trigger re-fetch when id changes
  

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.put(`http://localhost:5000/patients/${id}`, patient, {
      headers: {
        'Content-Type': 'application/json',
        // Add any authentication tokens if necessary
      }
    })
    .then(() => { setMessage("✅ Patient data updated successfully!");  // Set success message
      setTimeout(() => {
        setMessage("");  // Clear message after few seconds
        navigate('/');   // Redirect after showing message
      }, 9000);})
    .catch(error => console.error("Error updating patient:", error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  if (!patient) return <div>Loading...</div>;

  return (
    <div>
      <h2>Edit Patient</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={patient.name} onChange={handleChange} required />
        
        <label>Age:</label>
        <input type="number" name="age" value={patient.age} onChange={handleChange} required />
        
        <label>Gender:</label>
        <select name="gender" value={patient.gender} onChange={handleChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        
        <label>Disease:</label>
        <input type="text" name="disease" value={patient.disease} onChange={handleChange} required />
        
        <label>Admission Date:</label>
        <input type="date" name="admission_date" value={patient.admission_date} onChange={handleChange} required />
        
        <label>Medical History (Comma Separated):</label>
        <input  type="text" 
                name="medical_history" 
                value={Array.isArray(patient.medical_history)?patient.medical_history.join(','):" "} 
                onChange={(e) => 
                  handleChange({ 
                    target: { 
                      name: 'medical_history', 
                      value: e.target.value.split(',') } })} />
        
        <button type="submit">Update Patient</button>
        {message && <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>}
      </form>
    </div>
  );
}

export default EditPatient;
