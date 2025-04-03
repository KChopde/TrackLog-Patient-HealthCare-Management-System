from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your_secret_key'  
jwt = JWTManager(app)

# Login endpoint
@app.route('/token', methods=['POST'])
def login():
    username = request.form.get("username")
    password = request.form.get("password")

    # Replace this with real user authentication
    if username == "admin" and password == "password":
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)
    else:
        return jsonify({"msg": "Invalid credentials"}), 401

# Secure Patients API
@app.route('/patients', methods=['GET'])
@jwt_required()
def get_patients():
    return jsonify([
        {"_id": 1, "name": "John Doe", "age": 45, "disease": "Diabetes", "admission_date": "2024-01-10"},
        {"_id": 2, "name": "Jane Doe", "age": 30, "disease": "Asthma", "admission_date": "2023-12-15"}
    ])
