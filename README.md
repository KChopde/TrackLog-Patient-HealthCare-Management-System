**TrackLog** – Healthcare Patient Management System

---

It is a full-stack web application designed to manage patient health records and provide analytics on patient data. 
Built with React, Flask, and MongoDB, it supports secure user registration/login, full CRUD functionality for patient records, and simple aggregation pipeline analytics on disease prevalence.

---

## 🌟 Features

- 🔐 **User Authentication** – Register and login functionality
- 🗂️ **Patient CRUD Operations** – Add, update, view, and delete patient records including age, gender, and medical history
- 📊 **Analytics Dashboard** – View patient count based on disease, gender, and age group using aggregation pipeline logic.
- 🧪 **Dynamic Backend Routing** – Handles requests via Flask APIs, integrated with MongoDB Atlas.
- 🌐 **Environment Aware** – Automatically switches between local dev URL and production MongoDB Atlas deployment
- 🚀 **Deployed Frontend & Backend** – React frontend hosted via GitHub Pages, Flask backend deployed on Render

---

## 🛠 Tech Stack

- **Frontend**: React, Axios, CSS
- **Backend**: Flask, Flask-CORS
- **Database**: patient data( api/insert-random-data-> 100 records random ) -MongoDB Atlas, user registration - AWS DynamoDB
- **Deployment**: GitHub Pages (Frontend), Render (Backend)
  
 ---
 
📊 **Data Description**
| **Field**         | **Type**       | **Description**                                                                                                                                                                                                                                                                                                                                    |
| ----------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`            | String         | Full name of the patient                                                                                                                                                                                                                                                                                                                           |
| `age`             | Integer        | Age in years                                                                                                                                                                                                                                                                                                                                       |
| `gender`          | String         | Male / Female / Other                                                                                                                                                                                                                                                                                                                              |
| `disease`         | String         | Primary diagnosed disease, use these as for now supported are these e.g., `"Heart Disease"`, `"Hypertension"`, `"Asthma"`, `"COPD"`, `"Pneumonia"`, `"COVID-19"`, `"Alzheimer's Disease"`, `"Parkinson's Disease"`, `"Type 1 Diabetes"`, `"Type 2 Diabetes"`, `"Lung Cancer"`, `"Breast Cancer"`, `"Depression"`, `"Anxiety"`, `"Insomnia"`, `"Chronic Kidney Disease"`, `"Osteoarthritis"` |
| `admission_date`  | String / Date  | Date of admission                                                                                                                                                                                                                                                                                                    |
| `medical_history` | Array / String | List of past medical observations, e.g., *Patient has been diagnosed with {condition}. Symptoms include {symptom}. Currently taking {medication} for treatment.*                                                                                                                                                                                 |

Use this URL to view project:
[deployement url](https://kchopde.github.io/TrackLog-Patient-HealthCare-Management-System/)
(It take 15 sec time approx to load all records)

**Developed by Kanchan Chopde**
📧 kanchan.chopde@wayne.edu

