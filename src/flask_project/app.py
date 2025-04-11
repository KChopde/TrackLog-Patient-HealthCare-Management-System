from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson import ObjectId  # To convert ObjectId to string for JSON serialization
from flask_cors import CORS
from faker import Faker
import random
from bson import ObjectId, errors
import os

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])
#CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
 # Enable CORS for frontend-backend communication

PORT = int(os.environ.get("PORT", 5000))  # Render injects PORT env var
app.run(host="0.0.0.0", port=PORT, debug=True)

# MongoDB connection URI (localhost or MongoDB Atlas)
app.config["MONGO_URI"] = "mongodb://localhost:27017/healthcare_db"

mongo = PyMongo(app)
fake = Faker()

# Collection reference
patients_collection = mongo.db.patients

# List of medical conditions, diagnoses, and symptoms
conditions = [
    "hypertension", "diabetes", "asthma", "COPD", "pneumonia", "heart disease", 
    "stroke", "cancer", "obesity", "chronic kidney disease", "depression", "anxiety"
]

symptoms = [
    "shortness of breath", "fatigue", "chronic cough", "chest pain", "headaches",
    "dizziness", "nausea", "vomiting", "loss of appetite", "weight loss", "insomnia",
    "joint pain", "sweating", "swelling in legs", "high blood pressure"
]

medications = [
    "insulin", "beta-blockers", "antihypertensives", "diuretics", "statins", "antidepressants",
    "inhalers", "pain relievers", "antibiotics", "blood thinners", "chemotherapy"
]

users = {
    "admin": "password"
}

def generate_medical_history():
    history = []
    num_conditions = random.randint(1, 3)  # Randomly pick 1-3 conditions
    
    for _ in range(num_conditions):
        condition = random.choice(conditions)
        symptom = random.choice(symptoms)
        medication = random.choice(medications)
        
        # Creating a sentence for the patient's medical history
        history.append(f"Patient has been diagnosed with {condition}. Symptoms include {symptom}. "
                       f"Currently taking {medication} for treatment.")
    
    # Join all medical history sentences into a single string
    return " ".join(history)

# Generate random data and insert into MongoDB
@app.route('/api/insert-random-data', methods=['GET'])
def insert_random_data():
    try:
        # Create random patient data
        random_patients = []
        diseases = ["Heart Disease","Hypertension","Asthma", "COPD", "Pneumonia", "COVID-19","Alzheimer's Disease", 
                    "Parkinson's Disease","Type 1 Diabetes", "Type 2 Diabetes","Lung Cancer", "Breast Cancer",
                    "Depression", "Anxiety","Insomnia","Chronic Kidney Disease","Osteoarthritis"]
        for _ in range(10):  # Insert 10 random patients
            patient = {
                "name": fake.name(),
                "age": random.randint(20, 90),
                "gender": random.choice(["Male", "Female","Other"]),
                "disease": random.choice(diseases),
                "admission_date": fake.date_this_decade().strftime('%Y-%m-%d'),
                "medical_history": generate_medical_history()
            }
            random_patients.append(patient)

        # Insert data into MongoDB
        patients_collection = mongo.db.patients
        result = patients_collection.insert_many(random_patients)

        # Return success message
        return jsonify({
            "message": f"Successfully inserted {len(result.inserted_ids)} random patients"
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Helper function to convert ObjectId to string
def patient_data(patient):
    return {
        '_id': str(patient['_id']),
        'name': patient['name'],
        'age': patient['age'],
        'gender': patient['gender'],
        'disease': patient['disease'],
        'admission_date': patient['admission_date'],
        "medicalHistory": patient.get("medicalHistory", "No history available")
    }

# Helper function to fetch a patient by id
@app.route("/patient/<id>", methods=["GET"])
def get_patient_by_id(id):
    try:
        if not ObjectId.is_valid(id):  # Validate the ObjectId format
            return jsonify({"error": "Invalid Patient ID"}), 400
        
        patient = patients_collection.find_one({"_id": ObjectId(id)})
        
        return jsonify({
            "name": patient.get("name"),
            "age": patient.get("age"),
            "disease": patient.get("disease"),
            "admission_date": patient.get("admission_date"),
            "medical_history": patient.get("medical_history", "No additional history available")  # Ensure key exists
        })
    
    except errors.InvalidId:
        return jsonify({"error": "Invalid ObjectId format"}), 400
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Fetch all patients
@app.route('/patients', methods=['GET'])
def get_patients():
    patients = patients_collection.find()
    return jsonify([patient_data(patient) for patient in patients])

#edit data for patient
@app.route('/patients/<id>', methods=['GET'])
def get_patient(id):
    try:
        patient = patients_collection.find_one({"_id": ObjectId(id)})  # Fetch the patient using the updated function
        if patient:
            return jsonify(patient)
        else:
            return jsonify({'message': 'Patient not found'}), 404
    except Exception as e:
        return jsonify({'message': f'Error fetching patient: {str(e)}'}), 500
    except errors.InvalidId:
        return jsonify({"error": "Invalid ObjectId format"}), 400


# Add a new patient
@app.route('/patients', methods=['POST'])
def add_patient():
    data = request.get_json()
    
    print("Received data:", data)  # Log the received data
    
    new_patient = {
        'name': data['name'],
        'age': data['age'],
        'gender': data['gender'],
        'disease': data['disease'],
        'admission_date': data['admission_date'],
        'medical_history': data.get('medical_history', [])
    }
    
    required_fields = ['name', 'age', 'gender', 'disease', 'admission_date']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    result = patients_collection.insert_one(new_patient)
    return jsonify({'message': 'Patient added successfully', 'patient_id': str(result.inserted_id)}), 201


# Delete a patient
@app.route('/patients/<id>', methods=['DELETE'])
def delete_patient(id):
    result = patients_collection.delete_one({'_id': ObjectId(id)})
    if result.deleted_count == 0:
        return jsonify({'message': 'Patient not found'}), 404
    return jsonify({'message': 'Patient deleted successfully'})

@app.route('/patients/<id>', methods=['PUT'])  # Make sure id is treated as a string in the URL
def update_patient(id):
    data = request.get_json()
    updated_patient = {
        'name': data['name'],
        'age': data['age'],
        'gender': data['gender'],
        'disease': data['disease'],
        'admission_date': data['admission_date'],
        'medical_history': data['medical_history']
    }
    
    # Convert the id to ObjectId before using it for MongoDB query
    try:
        result = patients_collection.update_one({'_id': ObjectId(id)}, {'$set': updated_patient})
        if result.matched_count == 0:
            return jsonify({'message': 'Patient not found'}), 404
        return jsonify({'message': 'Patient updated successfully'})
    except Exception as e:
        return jsonify({'message': f'Error updating patient: {str(e)}'}), 500
    
@app.route('/api/map-reduce-query', methods=['POST'])
def map_reduce_query():
    try:
        data = request.json
        disease = data.get("disease")
        year = data.get("year")

        if not disease or not year:
            return jsonify({"error": "Disease and year are required"}), 400

        # Convert year to integer
        year = int(year)

        # Aggregation pipeline to replace MapReduce
        pipeline = [
            {
                "$addFields": {
                    "admissionYear": {"$toInt": {"$substr": ["$admission_date", 0, 4]}}
                }
            },
            {
                "$match": {
                    "disease": disease,
                    "admissionYear": year
                }
            },
            {
                "$group": {
                    "_id": "$disease",
                    "count": {"$sum": 1}
                }
            }
        ]

        result = list(patients_collection.aggregate(pipeline))

        output = {doc["_id"]: doc["count"] for doc in result}

        return jsonify(output)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
 

@app.route("/token", methods=["POST"])
def login():
    username = request.form.get("username")
    password = request.form.get("password")

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400  # Bad Request

    if username in users and users[username] == password:
        return jsonify({"access_token": "fake-jwt-token"}), 200

    return jsonify({"error": "Invalid credentials"}), 401  # Unauthorized


if __name__ == '__main__':
    app.run(debug=True)
