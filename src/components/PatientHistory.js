import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import api from './Api';

function PatientHistory() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id && id.length === 24) {  // Ensure valid MongoDB ObjectId length
      api.get(`/patient/${id}`)
        .then(response => {
          setPatient(response.data);  // ✅ Set state with patient data
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching patient:", error);
          setError("Failed to fetch patient data.");
          setLoading(false);
        });
    } else {
      console.error("Invalid Patient ID:", id);
      setError("Invalid Patient ID.");
      setLoading(false);
    }
  }, [id]);

  if (loading) return <p>Loading patient history...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!patient) return <p>No patient data found.</p>;

  return (
    <div>
      <strong>Patient History: {patient.name}</strong>
      <p><strong>Age:</strong> {patient.age}</p>
      <p><strong>Disease:</strong> {patient.disease}</p>
      <p><strong>Admission Date:</strong> {new Date(patient.admission_date).toLocaleDateString()}</p>
      <p><strong>Medical History:</strong> 
    {Array.isArray(patient.medical_history) 
    ? patient.medical_history.join(", ")  // If array, join elements
    : patient.medical_history || "No additional history available"}
</p>

      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}

export default PatientHistory;
