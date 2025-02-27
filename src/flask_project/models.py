from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    disease = db.Column(db.String(100), nullable=False)
    admission_date = db.Column(db.String(10), nullable=False)
    medical_history = db.Column(db.String(500), nullable=True)

    def __repr__(self):
        return f'<Patient {self.name}>'
