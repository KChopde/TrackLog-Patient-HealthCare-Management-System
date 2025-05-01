from flask import Blueprint, request, jsonify
import boto3
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

# Initialize DynamoDB
dynamodb = boto3.resource('dynamodb', region_name='us-east-2')
users_table = dynamodb.Table('Users')  # 'email' is primary key

@auth_bp.route('/register', methods=['POST'])
def registeruser():
    # Parsing the incoming request body to get the data
    data = request.get_json()

    email = data.get("email")        # e.g., "kanchan@example.com"
    password = data.get("password")

    if  not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    # Check if email already exists
    response = users_table.get_item(Key={'email': email})
    if 'Item' in response:
        return jsonify({"error": "Email already taken"}), 400

    hashed_password = generate_password_hash(password)

    try:
        # Store the user data in the DynamoDB table using put_item()
        users_table.put_item(Item={
            'email': email,
            'password': hashed_password
        })
    except Exception as e:
        return jsonify({"error": f"Error saving user: {str(e)}"}), 500

    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.route("/token", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("username")  # frontend sends email as 'username'
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    try:
        response = users_table.get_item(Key={'email': email})
        user = response.get('Item')
        

        if not user or not check_password_hash(user['password'], password):
            return jsonify({"error": "Invalid credentials"}), 401

        return jsonify({
            "access_token": "fake-jwt-token",
            "email": user.get("email", "")  # fallback to empty string if not found
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
