import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate} from 'react-router-dom';
import api from './Api';

function Dashboard() {
  const [email, SetEmail] = useState("");
  const [patients, setPatients] = useState([]);
  const [diseaseFilter, setDiseaseFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [availableDiseases, setAvailableDiseases] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]); // State for filtered patients
  const [deletedPatient, setDeletedPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredPatients.length / recordsPerPage);

  // Define categories and their diseases
  const diseaseCategories = {
    Cardiovascular: ["Heart Disease", "Hypertension"],
    Respiratory: ["Asthma", "COPD", "Pneumonia", "COVID-19"],
    Neurological: ["Alzheimer's Disease", "Parkinson's Disease"],
    Diabetes: ["Type 1 Diabetes", "Type 2 Diabetes"],
    Cancer: ["Lung Cancer", "Breast Cancer"],
    MentalHealth: ["Depression", "Anxiety","Insomnia"],
    Kidney: ["Chronic Kidney Disease"],
    Musculoskeletal: ["Osteoarthritis"]
  };
  const navigate = useNavigate();
  // Fetch patient data from the backend
  useEffect(() => {
    api.get('/patients', {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(response => setPatients(response.data))
      .catch(error => console.log(error));
  }, []);

  // Handle category change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setDiseaseFilter("");  // Reset disease filter when category changes
  };

  // Update available diseases when category changes
  useEffect(() => {
    if (selectedCategory) {
      setAvailableDiseases(diseaseCategories[selectedCategory] || []);
    } else {
      setAvailableDiseases([]);  // Reset diseases when no category is selected
    }
  }, [selectedCategory]);

  //get username from local storage
  useEffect(() => {
    const savedUsername = localStorage.getItem("email");
    if (savedUsername) SetEmail(savedUsername);
  }, []);

  const fetchPatients = () => {
    api.get("/patients")
      .then(response => setPatients(response.data))
      .catch(error => console.error("Error fetching patients:", error));
  };
  useEffect(() => {
    applyFilters(); // Reapply filters when patients change
  }, [patients]);
  
  const deletePatient = async (id) => {
    try {
      const patientToDelete = patients.find((patient) => patient._id === id);
  
      await api.delete(`patients/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
  
      setDeletedPatient(patientToDelete);
      setTimeout(() => setDeletedPatient(null), 5000);
  
      setPatients((prevPatients) => prevPatients.filter(patient => patient._id !== id));
      setFilteredPatients((prevFiltered) => prevFiltered.filter(patient => patient._id !== id));
  
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  // Handle filter changes
  const handleDiseaseFilterChange = (e) => setDiseaseFilter(e.target.value);
  const handleAgeFilterChange = (e) => setAgeFilter(e.target.value);

  //locally filtering logic
  const applyFilters = () => {
    const newFilteredPatients = patients.filter(patient => {
      const matchesDisease = diseaseFilter ? patient.disease === diseaseFilter : true;
      const matchesAge = ageFilter ? patient.age = ageFilter : true;
      return matchesDisease && matchesAge;
    });
    setFilteredPatients(newFilteredPatients);  // Set filtered patients
  };

    // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from storage
    navigate("/login"); // Redirect to login page
  };
  
 
  return (
    <div>
      <h1>Patient Dashboard</h1>
      <div style={{ padding: "1rem" }}>
      <div style={{ textAlign: "left", fontSize: "1.2rem", fontWeight: "bold" }}>
      <p style={{textAlign:"left"}}>Welcome, {email+"!" || "Guest"}</p>
      </div>
      </div>   
      {/* Filters */}
      <div class="categorydiv">
        {/* Category Dropdown */}
        <label>
          Disease Category:
          <select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">Select Category</option>
            {Object.keys(diseaseCategories).map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </label>

        {/* Disease Dropdown */}
        <label>
          Disease:
          {/* <select value={diseaseFilter} onChange={handleDiseaseFilterChange} disabled={!selectedCategory}>
            <option value="">All Diseases</option>
            {availableDiseases.map((disease, index) => (
              <option key={index} value={disease}>{disease}</option>
            ))}
          </select> */}
          <select value={diseaseFilter} onChange={handleDiseaseFilterChange} disabled={!selectedCategory}>
           <option value="">Select Disease</option>
            {selectedCategory &&
            diseaseCategories[selectedCategory].map((disease, index) => (
              <option key={index} value={disease}>{disease}</option>
              ))
             }
          </select>

        </label>

        {/* Age Filter */}
        <label>
          Age:
          <input 
            type="number" 
            value={ageFilter} 
            onChange={handleAgeFilterChange} 
            placeholder="Age"
          />
        </label>
      </div>        
   
      {/* Display Button */}
      <button onClick={applyFilters}>Display/Filter</button>
  
      {/* Logout Button */}
      <button onClick={handleLogout} style={{ position:'absolute' ,float: "right", margin: "10px",top:"20px",right:"20px" }}>Logout</button>
            
      {/* Add New Patient Button */}
      <Link to="/add"><button>Add New Patient</button></Link>
      {deletedPatient && (
                <div style={{ color: "red", fontWeight: "bold", textAlign:'center'}}>
                    🗑️ Patient <strong>{deletedPatient.name}</strong> was deleted.
                </div>
                  )}
         <button onClick={() => navigate('/mapreduce')} style={{right:"90px"}}>
        View Analytics
      </button>

      {/* Patient List Table */}
      <table class="displaytabulardata">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Disease</th>
            <th>Admission Date</th>
            <th>Medical History</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPatients.map(patient => (
            <tr key={patient._id}>
              <td>{patient.name}</td>
              <td>{patient.age}</td>
              <td>{patient.disease}</td>
              <td>{new Date(patient.admission_date).toLocaleDateString('en-US')}</td>
              <td>
              <Link to={`/patient/${patient._id}`}>
                <button>View History</button>
              </Link>
              </td>
              <td>
                <Link to={`/edit/${patient._id}`}>
                  <button>Edit</button>
                </Link>
                <button onClick={() => deletePatient(patient._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* <div style={{ marginTop: "20px" }}>
  {Array.from({ length: totalPages }, (_, index) => (
    <button
      key={index}
      onClick={() => setCurrentPage(index + 1)}
      disabled={currentPage === index + 1}
      style={{
        margin: "0 5px",
        padding: "5px 10px",
        backgroundColor: currentPage === index + 1 ? "#007bff" : "#f0f0f0",
        color: currentPage === index + 1 ? "#fff" : "#000",
        border: "none",
        borderRadius: "4px"
      }}
    >
      {index + 1}
    </button>
  ))}
</div> */}
<div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
  {/* Prev Button */}
  <button
    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    style={{ margin: "0 5px" }}
  >
    « Prev
  </button>

  {/* Page 1 */}
  <button
    onClick={() => setCurrentPage(1)}
    disabled={currentPage === 1}
    style={{ margin: "0 5px" }}
  >
    1
  </button>

  {/* Page 2 & 3 (if needed) */}
  {currentPage > 1 && currentPage < totalPages - 1 && (
    <>
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        style={{ margin: "0 5px" }}
      >
        {currentPage - 1}
      </button>
      <button
        disabled
        style={{
          margin: "0 5px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px"
        }}
      >
        {currentPage}
      </button>
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        style={{ margin: "0 5px" }}
      >
        {currentPage + 1}
      </button>
    </>
  )}

  {/* Ellipsis if far from last */}
  {currentPage < totalPages - 2 && <span style={{ margin: "0 5px" }}>...</span>}

  {/* Last Page */}
  {totalPages > 1 && (
    <button
      onClick={() => setCurrentPage(totalPages)}
      disabled={currentPage === totalPages}
      style={{ margin: "0 5px" }}
    >
      {totalPages}
    </button>
  )}

  {/* Next Button */}
  <button
    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
    style={{ margin: "0 5px" }}
  >
    Next »
  </button>
</div>


    </div>
  );
}

export default Dashboard;
