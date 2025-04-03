from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pymongo import MongoClient
from bson.objectid import ObjectId
from passlib.context import CryptContext
import jwt
import datetime
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")

app = FastAPI()

# MongoDB Connection
client = MongoClient("mongodb://localhost:27017")
db = client.healthcare
users_collection = db.users

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Create User
@app.post("/register")
async def register(username: str, password: str):
    hashed_password = pwd_context.hash(password)
    user = {"username": username, "password": hashed_password}
    users_collection.insert_one(user)
    return {"message": "User registered successfully"}

# Generate JWT Token
@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_collection.find_one({"username": form_data.username})
    if not user or not pwd_context.verify(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    token = jwt.encode({"sub": form_data.username, "exp": expiration}, SECRET_KEY, algorithm="HS256")

    return {"access_token": token, "token_type": "bearer"}

# Protected Route
@app.get("/users/me")
async def read_users_me(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        username = payload.get("sub")
        return {"username": username}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
